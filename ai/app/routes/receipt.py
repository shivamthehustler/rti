import logging
from fastapi import APIRouter, Response, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from app.services.pdf_generator import generate_rti_receipt_pdf

logger = logging.getLogger(__name__)

router = APIRouter()

class ReceiptRequestPayload(BaseModel):
    regNo: Optional[str] = Field(default="DOPT/R/2026/569651", max_length=100)
    dateStr: Optional[str] = Field(default="26 Aug 2026, 03:51 PM", max_length=100)
    targetDateStr: Optional[str] = Field(default="25 Sep 2026", max_length=100)
    name: Optional[str] = Field(default="Shivam Kumar", max_length=150)
    email: Optional[str] = Field(default="shivam.kumar@email.com", max_length=150)
    mobile: Optional[str] = Field(default="+91 98765 43210", max_length=50)
    address: Optional[str] = Field(default="123, Green Park, New Delhi - 110016", max_length=400)
    txnId: Optional[str] = Field(default="TXN51234567890", max_length=100)
    ministry: Optional[str] = Field(default="Ministry of Personnel, Public Grievances & Pensions", max_length=200)
    publicAuthority: Optional[str] = Field(default="Department of Personnel & Training", max_length=200)
    subject: Optional[str] = Field(default="Road repair budget in Ward 12", max_length=300)
    queryText: Optional[str] = Field(default="Requesting the detailed budget allocation, expenditure, and vendor details for road repair work in Ward 12 for the financial year 2025-26.", max_length=4000)
    amount: Optional[str] = Field(default="₹10.00", max_length=30)
    paymentMode: Optional[str] = Field(default="Online Payment (UPI)", max_length=100)

@router.post("/generate-receipt-pdf")
def create_receipt_pdf(payload: ReceiptRequestPayload):
    try:
        data = payload.dict()
        pdf_bytes = generate_rti_receipt_pdf(data)
        
        safe_reg = "".join(c for c in data.get('regNo', 'DOPT') if c.isalnum() or c in ('_', '-'))
        filename = f"RTI_Receipt_{safe_reg}.pdf"
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"'
            }
        )
    except Exception as e:
        logger.error(f"Error generating PDF: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate receipt PDF")
