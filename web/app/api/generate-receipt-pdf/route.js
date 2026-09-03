import { NextResponse } from 'next/server';
import { execFile } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import util from 'util';
import { checkRateLimit } from '@/lib/rateLimit';

const execFilePromise = util.promisify(execFile);

// Sanitize string input to prevent oversized payloads
function sanitizeString(str, maxLen = 300) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLen);
}

export async function POST(request) {
  // 1. Rate Limiting Check
  const rateLimit = checkRateLimit(request, { limit: 15, windowMs: 60 * 1000, prefix: 'pdf-gen' });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.reset) } }
    );
  }

  try {
    const rawPayload = await request.json();
    if (!rawPayload || typeof rawPayload !== 'object') {
      return NextResponse.json({ error: 'Invalid payload format' }, { status: 400 });
    }

    // 2. Input Sanitization & Bounds
    const payload = {
      regNo: sanitizeString(rawPayload.regNo, 60) || 'DOPT/R/2026/569651',
      dateStr: sanitizeString(rawPayload.dateStr, 50) || new Date().toLocaleString('en-IN'),
      targetDateStr: sanitizeString(rawPayload.targetDateStr, 50) || '30 Days',
      name: sanitizeString(rawPayload.name, 100) || 'Applicant',
      email: sanitizeString(rawPayload.email, 100),
      mobile: sanitizeString(rawPayload.mobile, 30),
      address: sanitizeString(rawPayload.address, 300),
      txnId: sanitizeString(rawPayload.txnId, 50) || 'TXN00000000',
      ministry: sanitizeString(rawPayload.ministry, 150),
      publicAuthority: sanitizeString(rawPayload.publicAuthority, 150),
      subject: sanitizeString(rawPayload.subject, 200),
      queryText: sanitizeString(rawPayload.queryText, 3000),
      amount: sanitizeString(rawPayload.amount, 20) || '₹10.00',
      paymentMode: sanitizeString(rawPayload.paymentMode, 50) || 'Online Payment'
    };

    const safeRegNo = payload.regNo.replace(/[^a-zA-Z0-9_-]/g, '_');
    const downloadFilename = `RTI_Receipt_${safeRegNo}.pdf`;

    // 3. Try FastAPI microservice first
    try {
      const fastApiRes = await fetch('http://localhost:8000/generate-receipt-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (fastApiRes.ok) {
        const arrayBuffer = await fastApiRes.arrayBuffer();
        const pdfBuffer = Buffer.from(arrayBuffer);
        return new NextResponse(pdfBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${downloadFilename}"`,
            'Content-Length': pdfBuffer.length.toString(),
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        });
      }
    } catch (e) {
      // Fallback to local python script via safe execFile
    }

    // 4. Safe Python Subprocess Execution via Temp File and argument vectors
    const tmpDir = os.tmpdir();
    const randSuffix = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const payloadPath = path.join(tmpDir, `rti_payload_${randSuffix}.json`);
    const outputPath = path.join(tmpDir, `rti_receipt_${randSuffix}.pdf`);

    fs.writeFileSync(payloadPath, JSON.stringify(payload), { mode: 0o600 });

    const possibleAiDirs = [
      path.resolve(process.cwd(), '../ai'),
      path.resolve(process.cwd(), 'ai'),
      path.resolve(process.cwd(), '../../ai')
    ];
    let aiDir = possibleAiDirs.find(d => fs.existsSync(d)) || possibleAiDirs[0];

    const pythonScriptCode = [
      'import sys, json',
      `sys.path.insert(0, sys.argv[1])`,
      'from app.services.pdf_generator import generate_rti_receipt_pdf',
      'data = json.load(open(sys.argv[2], "r"))',
      'open(sys.argv[3], "wb").write(generate_rti_receipt_pdf(data))'
    ].join('; ');

    const pythonCmds = ['python3', '/usr/local/bin/python3', '/opt/homebrew/bin/python3', '/usr/bin/python3', 'python'];
    let generatedSuccess = false;

    for (const pyBin of pythonCmds) {
      try {
        await execFilePromise(pyBin, ['-c', pythonScriptCode, aiDir, payloadPath, outputPath], {
          cwd: aiDir,
          env: { ...process.env, PATH: `/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin:${process.env.PATH || ''}`, PYTHONPATH: aiDir },
          timeout: 10000 // 10s timeout
        });
        if (fs.existsSync(outputPath)) {
          generatedSuccess = true;
          break;
        }
      } catch (pyErr) {
        // Continue to next candidate binary
      }
    }

    if (generatedSuccess && fs.existsSync(outputPath)) {
      const pdfBuffer = fs.readFileSync(outputPath);

      // Cleanup temp files safely
      try { fs.unlinkSync(payloadPath); } catch (_) {}
      try { fs.unlinkSync(outputPath); } catch (_) {}

      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${downloadFilename}"`,
          'Content-Length': pdfBuffer.length.toString(),
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }

    // Cleanup on failure
    try { if (fs.existsSync(payloadPath)) fs.unlinkSync(payloadPath); } catch (_) {}
    try { if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath); } catch (_) {}

    return NextResponse.json({ error: 'Failed to generate receipt PDF' }, { status: 500 });
  } catch (err) {
    console.error('PDF Generation API error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred during document generation' }, { status: 500 });
  }
}
