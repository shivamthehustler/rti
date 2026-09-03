import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { checkRateLimit } from "@/lib/rateLimit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PINCODE_REGEX = /^\d{6}$/;

function sanitize(val, maxLen = 255) {
  if (typeof val !== "string") return "";
  return val.trim().slice(0, maxLen);
}

export async function POST(request) {
  // 1. Rate Limiting Check (10 requests/minute per IP)
  const rateLimit = checkRateLimit(request, { limit: 10, windowMs: 60 * 1000, prefix: "rti-submit" });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many submission attempts. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(rateLimit.reset) } }
    );
  }

  try {
    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
    }

    const ministry_department = sanitize(body.ministry_department, 200);
    const public_authority = sanitize(body.public_authority, 200);
    const digilocker = Boolean(body.digilocker);
    const name = sanitize(body.name, 120);
    const gender = sanitize(body.gender, 20);
    const address = sanitize(body.address, 500);
    const pin_code = sanitize(body.pin_code, 10);
    const email = sanitize(body.email, 120);
    const rti_text = typeof body.rti_text === "string" ? body.rti_text.trim().slice(0, 4000) : "";

    const is_bpl = Boolean(body.is_bpl);
    const bpl_card_number = is_bpl ? sanitize(body.bpl_card_number, 60) : null;
    // Prevent path traversal in filename
    const rawFilename = is_bpl ? sanitize(body.bpl_card_filename, 100) : null;
    const bpl_card_filename = rawFilename ? rawFilename.replace(/[^a-zA-Z0-9._-]/g, "_") : null;
    const year_of_issue = is_bpl ? sanitize(body.year_of_issue, 10) : null;
    const issuing_authority = is_bpl ? sanitize(body.issuing_authority, 150) : null;

    // --------------------------------------------------
    // Required fields validation
    // --------------------------------------------------

    if (!ministry_department) {
      return NextResponse.json(
        { success: false, error: "Ministry/department is required" },
        { status: 400 }
      );
    }

    if (!public_authority) {
      return NextResponse.json(
        { success: false, error: "Public authority is required" },
        { status: 400 }
      );
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required" },
        { status: 400 }
      );
    }

    if (!rti_text || rti_text.length < 10) {
      return NextResponse.json(
        { success: false, error: "RTI text must contain at least 10 characters" },
        { status: 400 }
      );
    }

    const finalName = digilocker ? "<fetch_from_digilocker>" : name;
    const finalGender = digilocker ? "<fetch_from_digilocker>" : gender;
    const finalAddress = digilocker ? "<fetch_from_digilocker>" : address;
    const finalPinCode = digilocker ? "<fetch_from_digilocker>" : pin_code;

    // Personal details validation when DigiLocker is not used
    if (!digilocker) {
      if (!name) {
        return NextResponse.json(
          { success: false, error: "Name is required" },
          { status: 400 }
        );
      }

      if (!gender) {
        return NextResponse.json(
          { success: false, error: "Gender is required" },
          { status: 400 }
        );
      }

      if (!address) {
        return NextResponse.json(
          { success: false, error: "Address is required" },
          { status: 400 }
        );
      }

      if (!pin_code || !PINCODE_REGEX.test(pin_code)) {
        return NextResponse.json(
          { success: false, error: "A valid 6-digit pin code is required" },
          { status: 400 }
        );
      }
    }

    // --------------------------------------------------
    // BPL validation
    // --------------------------------------------------

    if (is_bpl) {
      if (!bpl_card_number) {
        return NextResponse.json(
          { success: false, error: "BPL card number is required" },
          { status: 400 }
        );
      }

      if (!bpl_card_filename) {
        return NextResponse.json(
          { success: false, error: "BPL card file is required" },
          { status: 400 }
        );
      }

      if (!year_of_issue) {
        return NextResponse.json(
          { success: false, error: "BPL card year of issue is required" },
          { status: 400 }
        );
      }

      if (!issuing_authority) {
        return NextResponse.json(
          { success: false, error: "BPL card issuing authority is required" },
          { status: 400 }
        );
      }
    }

    // --------------------------------------------------
    // Parameterized Insertion
    // --------------------------------------------------

    const query = `
      INSERT INTO rti_requests (
        ministry_department,
        public_authority,
        digilocker,

        name,
        gender,
        address,
        pin_code,
        
        is_bpl,
        bpl_card_number,
        bpl_card_filename,
        year_of_issue,
        issuing_authority,
        
        email,
        rti_text
      )
      VALUES (
        $1, $2, $3,
        $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13,
        $14
      )
      RETURNING id, request_number, created_at;
    `;

    const values = [
      ministry_department,
      public_authority,
      digilocker,

      finalName,
      finalGender,
      finalAddress,
      finalPinCode,
      
      is_bpl,
      bpl_card_number,
      bpl_card_filename,
      year_of_issue,
      issuing_authority,
      
      email,
      rti_text,
    ];

    const result = await pool.query(query, values);

    return NextResponse.json(
      {
        success: true,
        message: "RTI request created successfully",
        request: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("RTI API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create RTI request. Please check input parameters.",
      },
      { status: 500 }
    );
  }
}