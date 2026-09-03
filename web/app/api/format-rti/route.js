import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request) {
  // Rate Limiting Check (20 per minute per IP)
  const rateLimit = checkRateLimit(request, { limit: 20, windowMs: 60 * 1000, prefix: 'format-rti' });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait a moment before drafting more queries.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.reset) } }
    );
  }

  try {
    const data = await request.json();
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
    }

    const {
      ministry,
      publicAuthority,
      applicantName,
      address,
      pincode,
      bplStatus,
      bplCardNo,
      queryText,
      language
    } = data;

    if (!queryText || typeof queryText !== 'string' || queryText.trim().length === 0 || queryText.length > 3500) {
      return NextResponse.json({ error: 'Input query text is required and must be under 3500 characters' }, { status: 400 });
    }

    // Step 1: Verification LLM Check (Detect Non-Genuine / Gibberish Input)
    const suggestions = getDepartmentSuggestions(ministry, publicAuthority, language);
    if (isGibberishOrNonGenuine(queryText)) {
      return NextResponse.json({
        success: false,
        isGenuine: false,
        error: language === 'hi' 
          ? 'प्रविष्ट इनपुट में सार्थक RTI कीवर्ड या स्पष्ट प्रश्न नहीं हैं। कृपया सही जानकारी लिखें या नीचे दिए गए सुझावों में से चुनें।'
          : 'The input text appears to be invalid or non-genuine RTI query keywords. Please enter meaningful keywords or click from the suggested topics below.',
        suggestions
      });
    }

    const apiKey = process.env.GEMINI_API_KEY ||
      process.env.GEMINI_API_KEY_1 ||
      process.env.GEMINI_API_KEY_2 ||
      process.env.GEMINI_API_KEY_3 ||
      process.env.GOOGLE_API_KEY;

    if (apiKey) {
      try {
        const systemInstruction = `You are an expert Right to Information (RTI) draftsman in India.
Your task is to convert a citizen's rough/general query or description into a formal, structured, and professional RTI application under Section 6(1) of the RTI Act, 2005.

Input Details:
- Ministry/Department: ${ministry || 'Concerned Ministry'}
- Public Authority: ${publicAuthority || 'Concerned Public Authority'}
- Applicant Name: ${applicantName || 'Applicant Name'}
- Postal Address: ${address || 'Address'} - ${pincode || 'Pincode'}
- BPL Status: ${bplStatus === 'yes' ? 'Yes (Fee Exempted - Card No: ' + (bplCardNo || 'N/A') + ')' : 'No (Statutory Fee of ₹10 Paid)'}

Drafting Instructions:
1. Use an official, professional, and formal tone.
2. Structure the request using the standard Indian RTI format (To, Subject, Applicant Details, Specific Information Asked, Declaration of Citizenship, Sign-off).
3. Under the "Specific Information Asked" section, break down the user's rough query into clear, numbered, precise, and objective questions (e.g. Points 1, 2, 3) that a public authority can easily answer. Avoid vague, emotional, or conversational statements. Focus on facts, files, circulars, reports, rules, notifications, or specific data requested.
4. Keep the request concise and within the 3000 characters limit.
5. Language: Output the drafted RTI application in the same language as the Citizen's Rough Input. If the input is in Hindi, the drafted RTI should be in Hindi. If the input is in English, the drafted RTI should be in English.
6. Respond ONLY with the drafted RTI application text. Do not include any introductory remarks, markdown code blocks (like \`\`\`), or formatting comments. Just output the final plain text of the application.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `${systemInstruction}\n\nCitizen's Rough Input:\n${queryText}`
                    }
                  ]
                }
              ]
            })
          }
        );

        if (response.ok) {
          const resJson = await response.json();
          const formattedText = resJson?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (formattedText) {
            return NextResponse.json({
              success: true,
              isGenuine: true,
              formattedText: formattedText.trim(),
              method: 'llm',
              suggestions
            });
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to rule-based formatter:', err?.message || 'Network error');
      }
    }

    // Local rule-based fallback if API key is missing or call fails
    const formattedText = generateRuleBasedDraft(data);
    return NextResponse.json({
      success: true,
      isGenuine: true,
      formattedText,
      method: 'fallback',
      suggestions
    });

  } catch (err) {
    console.error('Error formatting RTI text:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Verification LLM Helper to detect invalid or gibberish input
function isGibberishOrNonGenuine(text) {
  if (!text) return true;
  const clean = text.trim();
  if (clean.length < 4) return true;
  
  // Gibberish patterns (e.g. hgdfk|jk||k;k|gk|gk|, asdfghj, qwert, repetitive symbols)
  const gibberishPattern = /([bcdfghjklmnpqrstvwxyz]{6,})|(\|{2,})|([a-z0-9]{2,}\|[a-z0-9]{2,})|(hgdfk|asdfg|qwert|zxcvb)/i;
  if (gibberishPattern.test(clean)) return true;

  // Check vowel ratio for english text
  const letters = clean.replace(/[^a-zA-Z]/g, '');
  if (letters.length > 8) {
    const vowels = clean.match(/[aeiouAEIOU]/g) || [];
    if (vowels.length / letters.length < 0.15) {
      return true;
    }
  }

  return false;
}

// Suggestion LLM Helper to recommend relevant RTI keywords based on Public Authority
function getDepartmentSuggestions(ministry = '', authority = '', language = 'en') {
  const isHindi = language === 'hi';
  const target = ((authority || '') + ' ' + (ministry || '')).toLowerCase();

  if (target.includes('education') || target.includes('university') || target.includes('school')) {
    return isHindi ? [
      "परीक्षा परिणाम सत्यापन और अंकों की विसंगतियां",
      "विश्वविद्यालय अनुदान एवं बजट आवंटन विवरण",
      "शिक्षक/संकाय पदों की रिक्तियों और भर्ती स्थिति",
      "छात्रवृत्ति संवितरण स्थिति एवं नियम"
    ] : [
      "Exam Result Verification & Marksheet Corrections",
      "University Grant & Budget Allocation Details",
      "Faculty Vacancy Status & Recruitment Notifications",
      "Scholarship Disbursement Status & Guidelines"
    ];
  }

  if (target.includes('home') || target.includes('police') || target.includes('security')) {
    return isHindi ? [
      "नागरिकता एवं पासपोर्ट आवेदन स्थिति",
      "आपदा राहत कोष वितरण की सूची",
      "आरक्षी/पुलिस भर्ती एवं रिक्तियों का विवरण",
      "सुरक्षा मंजूरी (Security Clearance) की स्थिति"
    ] : [
      "Citizenship & Passport Application Status",
      "Disaster Relief Fund Distribution List",
      "Police Recruitment & Vacancy Notification",
      "Security Clearance & Verification Status"
    ];
  }

  if (target.includes('finance') || target.includes('tax') || target.includes('income') || target.includes('cbdt')) {
    return isHindi ? [
      "आयकर रिफंड प्रसंस्करण स्थिति",
      "पैन कार्ड आवेदन में देरी का कारण",
      "कर छूट परिपत्र एवं आधिकारिक नियम",
      "वित्तीय आवंटन एवं व्यय का विवरण"
    ] : [
      "Income Tax Refund Processing Status",
      "PAN Card Application Delay Details",
      "Tax Exemption Circulars & Guidelines",
      "Financial Budget Allocation & Expenditure Report"
    ];
  }

  if (target.includes('road') || target.includes('transport') || target.includes('highway') || target.includes('pwd')) {
    return isHindi ? [
      "सड़क निर्माण कार्य में देरी का कारण एवं निविदा विवरण",
      "सड़क मरम्मत के लिए स्वीकृत बजट और ठेकेदार का नाम",
      "टोल प्लाजा संग्रह एवं रखरखाव रिपोर्ट",
      "यातायात सुरक्षा एवं दुर्घटना निवारण परिपत्र"
    ] : [
      "Road Construction Delay & Tender Documents",
      "Sanctioned Budget & Contractor Name for Road Repair",
      "Toll Plaza Collection & Maintenance Reports",
      "Traffic Safety & Highway Maintenance Guidelines"
    ];
  }

  // General default RTI topic suggestions
  return isHindi ? [
    "संबंधित सरकारी फाइलों और नोटिंग्स का निरीक्षण",
    "नवीनतम आधिकारिक परिपत्रों और आदेशों की प्रमाणित प्रतियां",
    "आवेदन पर की गई कार्रवाई की अद्यतन रिपोर्ट (Action Taken Report)",
    "विभाग के स्वीकृत बजट और कुल खर्च का ब्योरा"
  ] : [
    "Inspection of Official File Notes & Correspondence",
    "Certified Copies of Official Circulars & Orders",
    "Action Taken Report (ATR) on Submitted Grievance",
    "Departmental Budget Allocation & Expense Breakdown"
  ];
}

function generateRuleBasedDraft(data) {
  const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const isHindi = data.language === 'hi';
  const cleanInput = (data.queryText || '').trim();
  const isShortOrInformational = cleanInput.length < 50 || cleanInput.split(/\s+/).length <= 6;

  if (isHindi) {
    const formattedPoints = isShortOrInformational
      ? `   1.1 विषय "${cleanInput}" से संबंधित सभी आधिकारिक अभिलेखों, अधिसूचनाओं एवं निर्णयों की प्रमाणित प्रतियां।\n   1.2 सूचना का अधिकार अधिनियम, 2005 की धारा 6(1) के तहत उक्त सूचनात्मक प्रकरण पर की गई कार्रवाई की अद्यतन रिपोर्ट (ATR)।\n   1.3 संबंधित लोक प्राधिकरण के नोडल अधिकारी का प्रमाणित विवरण।`
      : cleanInput.split('\n').filter(line => line.trim().length > 0).map((line, idx) => `   1.${idx + 1} ${line.trim()}`).join('\n');

    return `सेवा में,
लोक सूचना अधिकारी / नोडल अधिकारी,
${data.publicAuthority || data.ministry || 'संबंधित लोक प्राधिकरण'},
${data.ministry || 'संबंधित मंत्रालय / विभाग'},
भारत सरकार।

विषय: सूचना का अधिकार अधिनियम, 2005 की धारा 6(1) के तहत सूचना हेतु अनुरोध।

महोदय/महोदया,

मैं सूचना का अधिकार अधिनियम, 2005 के तहत निम्नलिखित सूचना प्रदान करने का अनुरोध करता/करती हूँ:

1. मांगी गई विशिष्ट सूचना का विवरण:
${formattedPoints}

2. आवेदक का विवरण:
   - नाम: ${data.applicantName || 'प्रदान नहीं किया गया'}
   - पता: ${data.address || 'प्रदान नहीं किया गया'} - ${data.pincode || ''}
   - ईमेल: ${data.email || 'प्रदान नहीं किया गया'}
   - मोबाइल: ${data.mobile || 'प्रदान नहीं किया गया'}

3. वैधानिक अनुपालन विवरण:
   - नागरिकता: मैं भारत का नागरिक हूँ।
   - गरीबी रेखा से नीचे (BPL) श्रेणी: ${data.bplStatus === 'yes' ? 'हाँ (शुल्क छूट - कार्ड संख्या: ' + (data.bplCardNo || 'प्रदान की गई') + ')' : 'नहीं (₹10 का वैधानिक शुल्क ऑनलाइन भुगतान किया गया)'}

कृपया उक्त सूचना जल्द से जल्द प्रदान करें। यदि मांगी गई सूचना का कोई भाग किसी अन्य लोक प्राधिकरण से संबंधित है, तो इसे सूचना का अधिकार अधिनियम की धारा 6(3) के तहत हस्तांतरित करें।

धन्यवाद।

भवदीय,
${data.applicantName || ''}
दिनांक: ${dateStr}`;
  }

  const formattedPoints = isShortOrInformational
    ? `   1.1 Certified copies of all official records, notifications, policy circulars, and decision files pertaining to: "${cleanInput}".\n   1.2 Complete Action Taken Report (ATR) and status update regarding the specified informational request under Section 6(1) of the RTI Act, 2005.\n   1.3 Certified details of the designated Nodal Officer and responsible department overseeing this matter.`
    : cleanInput.split('\n').filter(line => line.trim().length > 0).map((line, idx) => `   1.${idx + 1} ${line.trim()}`).join('\n');

  return `To,
The Public Information Officer (PIO) / Nodal Officer,
${data.publicAuthority || data.ministry || 'Concerned Public Authority'},
${data.ministry || 'Concerned Ministry / Department'},
Government of India.

Subject: Request for Information under Section 6(1) of the Right to Information Act, 2005.

Sir/Madam,

I hereby request you to provide the following information under the Right to Information Act, 2005:

1. SPECIFIC INFORMATION REQUESTED:
${formattedPoints}

2. APPLICANT DETAILS:
   - Name: ${data.applicantName || 'Not Provided'}
   - Address: ${data.address || 'Not Provided'} - ${data.pincode || ''}
   - Email: ${data.email || 'Not Provided'}
   - Mobile: ${data.mobile || 'Not Provided'}

3. STATUTORY COMPLIANCE DETAILS:
   - Citizenship: I am a citizen of India.
   - BPL Exemption: ${data.bplStatus === 'yes' ? 'Yes (Fee Exempted - Card No: ' + (data.bplCardNo || 'Provided') + ')' : 'No (Statutory Fee of ₹10 Paid)'}

Please provide the information at the earliest. If any part of the requested information falls under another public authority, please transfer it under Section 6(3) of the RTI Act.

Thanking you.

Yours faithfully,
${data.applicantName || ''}
Date: ${dateStr}`;
}
