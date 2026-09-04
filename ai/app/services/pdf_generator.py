import io
import os
import qrcode
from PIL import Image as PILImage
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

def generate_rti_receipt_pdf(data: dict) -> bytes:
    """
    Programmatically generates a pixel-exact, single A4 page PDF RTI Receipt matching the reference design.
    """
    buffer = io.BytesIO()
    
    reg_no = data.get('regNo', 'DOPT/R/2026/835608')

    # A4 Page dimensions: 595.27 x 841.89 points
    # Using 28pt horizontal margins and 22pt vertical margins for strict 1-page fit
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=28,
        rightMargin=28,
        topMargin=22,
        bottomMargin=18,
        title=f"RTI Receipt - {reg_no}",
        author="Government of India - RTI Portal"
    )

    story = []
    styles = getSampleStyleSheet()

    # Compact Typography & Styles
    style_normal = ParagraphStyle('NormalText', parent=styles['Normal'], fontSize=8.5, leading=11, textColor=colors.HexColor('#334155'))
    style_bold_label = ParagraphStyle('BoldLabel', parent=styles['Normal'], fontSize=8, leading=10.5, fontName='Helvetica-Bold', textColor=colors.HexColor('#334155'))
    style_value = ParagraphStyle('ValueText', parent=styles['Normal'], fontSize=8, leading=10.5, textColor=colors.HexColor('#0F172A'))
    
    style_reg_label = ParagraphStyle('RegLabel', parent=styles['Normal'], fontSize=7.5, leading=9, fontName='Helvetica-Bold', alignment=TA_CENTER, textColor=colors.HexColor('#64748B'))
    style_reg_val = ParagraphStyle('RegValue', parent=styles['Normal'], fontSize=19, leading=22, fontName='Helvetica-Bold', alignment=TA_CENTER, textColor=colors.HexColor('#10B981'))

    style_sub_label = ParagraphStyle('SubLabel', parent=styles['Normal'], fontSize=7, leading=8.5, fontName='Helvetica-Bold', alignment=TA_CENTER, textColor=colors.HexColor('#64748B'))
    style_sub_val = ParagraphStyle('SubValue', parent=styles['Normal'], fontSize=8.5, leading=11, fontName='Helvetica-Bold', alignment=TA_CENTER, textColor=colors.HexColor('#1E293B'))

    style_header_title = ParagraphStyle('H1', parent=styles['Normal'], fontSize=15, leading=18, fontName='Helvetica-Bold', alignment=TA_CENTER, textColor=colors.HexColor('#0B1C3F'))
    style_header_sub = ParagraphStyle('HSub', parent=styles['Normal'], fontSize=8.5, leading=11, alignment=TA_CENTER, textColor=colors.HexColor('#64748B'))

    style_section_title = ParagraphStyle('SecTitle', parent=styles['Normal'], fontSize=9.5, leading=12, fontName='Helvetica-Bold', textColor=colors.HexColor('#0B1C3F'))

    # Extract Payload Data
    reg_no = data.get('regNo', 'DOPT/R/2026/835608')
    date_str = data.get('dateStr', '27 Aug 2026, 10:38 PM')
    target_date_str = data.get('targetDateStr', '26 Sept 2026')
    applicant_name = data.get('name', 'Shivam Kumar')
    email = data.get('email', 'citizen.rti@gov.in')
    mobile = data.get('mobile', '+91 9876543210')
    address = data.get('address', '123, Green Park, New Delhi - 110016 - 110016')
    txn_id = data.get('txnId', 'TXN24112511523')
    public_authority = data.get('publicAuthority', 'University Grants Commission (UGC)')
    subject = data.get('subject', 'To, The Public Information Officer (PIO) / Nodal O...')
    query_text = data.get('queryText', 'To, The Public Information Officer (PIO) / Nodal Officer, University Grants Commission (UGC), Ministry of Education, Government of India. Subject: Request for Information under Section 6(1) of the Right to Information Act, 2005. Sir/Madam, I hereby request you to provide the f...')
    amount = data.get('amount', '₹10.00').replace('₹', 'Rs. ')
    payment_mode = data.get('paymentMode', 'Online Payment (UPI)')

    # Truncate query text slightly if extremely long to guarantee strict 1-page fit
    if len(query_text) > 310:
        query_text = query_text[:307] + "..."

    # 1. TOP HEADER ROW (Emblem + Government Title + Green Submitted Badge)
    possible_logo_paths = [
        os.path.join(os.path.dirname(__file__), '../../../web/public/logo.png'),
        os.path.join(os.path.dirname(__file__), '../../web/public/logo.png'),
        os.path.join(os.path.dirname(__file__), '../web/public/logo.png'),
        os.path.abspath('web/public/logo.png'),
        os.path.abspath('public/logo.png')
    ]
    logo_path = next((p for p in possible_logo_paths if os.path.exists(p)), None)
    logo_img = None
    if logo_path:
        logo_img = Image(logo_path, width=28, height=42)

    title_para = Paragraph("<b><font size=8.5 color='#0B1C3F'>Government of India</font></b><br/><b><font size=11 color='#0B1C3F'>RTI Information Access Portal</font></b><br/><font size=6.5 color='#64748B'>An Initiative under the Right to Information Act, 2005</font>", style_normal)
    
    badge_para = Paragraph("<font color='#0D8A44'><b>Request Submitted</b></font>", ParagraphStyle('Badge', alignment=TA_CENTER, fontSize=7.5, leading=9))

    badge_table = Table(
        [[badge_para]],
        colWidths=[105],
        rowHeights=[20]
    )
    badge_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#ECFDF5')),
        ('BOX', (0,0), (-1,-1), 0.6, colors.HexColor('#A7F3D0')),
        ('ROUNDEDCORNERS', [8, 8, 8, 8]),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))

    header_table_data = [
        [logo_img if logo_img else "", title_para, badge_table]
    ]
    header_table = Table(header_table_data, colWidths=[38, 395, 106])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (2,0), (2,0), 'RIGHT'),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 10))

    # 2. TITLE & SUBTITLE
    story.append(Paragraph("RTI Request Receipt", style_header_title))
    story.append(Spacer(1, 2))
    story.append(Paragraph("Your RTI application has been successfully submitted.", style_header_sub))
    story.append(Spacer(1, 10))

    # 3. REGISTRATION NUMBER CARD
    sub_col1 = Paragraph("REQUEST DATE & TIME<br/><b>" + date_str + "</b>", style_sub_label)
    sub_col2 = Paragraph("AMOUNT PAID<br/><b>" + amount + "</b>", style_sub_label)
    sub_col3 = Paragraph("PAYMENT MODE<br/><b>" + payment_mode + "</b>", style_sub_label)

    reg_card_data = [
        [Paragraph("REGISTRATION NUMBER", style_reg_label)],
        [Paragraph(reg_no, style_reg_val)],
        [Spacer(1, 3)],
        [HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#F1F5F9'), spaceAfter=4, spaceBefore=2)],
        [Table([[sub_col1, sub_col2, sub_col3]], colWidths=[175, 175, 175])]
    ]
    reg_card_table = Table(reg_card_data, colWidths=[539])
    reg_card_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FAFAFA')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
        ('ROUNDEDCORNERS', [8, 8, 8, 8]),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(reg_card_table)
    story.append(Spacer(1, 8))

    # 4. APPLICANT DETAILS CARD
    app_details_data = [
        [Paragraph("Applicant Details", style_section_title), ""],
        [Paragraph("Name of Applicant", style_bold_label), Paragraph(applicant_name, style_value)],
        [Paragraph("Email Address", style_bold_label), Paragraph(email, style_value)],
        [Paragraph("Mobile Number", style_bold_label), Paragraph(mobile, style_value)],
        [Paragraph("Postal Address", style_bold_label), Paragraph(address, style_value)],
        [Paragraph("Payment Transaction ID", style_bold_label), Paragraph(txn_id, style_value)],
    ]
    app_details_table = Table(app_details_data, colWidths=[145, 394])
    app_details_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FFFFFF')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
        ('LINEBELOW', (0,0), (-1,0), 0.5, colors.HexColor('#F1F5F9')),
        ('LINEBELOW', (0,1), (-1,-2), 0.5, colors.HexColor('#F8FAFC')),
        ('ROUNDEDCORNERS', [8, 8, 8, 8]),
        ('TOPPADDING', (0,0), (-1,-1), 4.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4.5),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(app_details_table)
    story.append(Spacer(1, 8))

    # 5. REQUEST DETAILS CARD
    status_badge_para = Paragraph("<font color='#0D8A44'><b>Submitted</b></font>", ParagraphStyle('SBadge', alignment=TA_CENTER, fontSize=7.5, leading=9))
    status_badge_table = Table([[status_badge_para]], colWidths=[65], rowHeights=[16])
    status_badge_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#ECFDF5')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#A7F3D0')),
        ('ROUNDEDCORNERS', [5, 5, 5, 5]),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))

    req_details_data = [
        [Paragraph("Request Details", style_section_title), ""],
        [Paragraph("Public Authority", style_bold_label), Paragraph(public_authority, style_value)],
        [Paragraph("Request Subject", style_bold_label), Paragraph(subject, style_value)],
        [Paragraph("Request Description", style_bold_label), Paragraph(query_text, style_value)],
        [Paragraph("Status", style_bold_label), status_badge_table],
    ]
    req_details_table = Table(req_details_data, colWidths=[145, 394])
    req_details_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FFFFFF')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
        ('LINEBELOW', (0,0), (-1,0), 0.5, colors.HexColor('#F1F5F9')),
        ('LINEBELOW', (0,1), (-1,-2), 0.5, colors.HexColor('#F8FAFC')),
        ('ROUNDEDCORNERS', [8, 8, 8, 8]),
        ('TOPPADDING', (0,0), (-1,-1), 4.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4.5),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(req_details_table)
    story.append(Spacer(1, 8))

    # 6. WHAT HAPPENS NEXT? HORIZONTAL CARD
    step1_p = Paragraph("<font color='#0D8A44'><b>✓ Request Submitted</b></font><br/><font size=7 color='#64748B'>Your application has been successfully submitted.<br/>" + date_str + "</font>", style_normal)
    step2_p = Paragraph("<font color='#2563EB'><b>■ Request Under Process</b></font><br/><font size=7 color='#64748B'>The PIO officer will review your request.<br/>Within 30 days</font>", style_normal)
    step3_p = Paragraph("<font color='#2563EB'><b>✉ You Will Receive a Response</b></font><br/><font size=7 color='#64748B'>The response will be sent to your email.<br/>On or before " + target_date_str + "</font>", style_normal)

    next_card_data = [
        [Paragraph("What Happens Next?", style_section_title), "", ""],
        [step1_p, step2_p, step3_p]
    ]
    next_card_table = Table(next_card_data, colWidths=[179, 179, 179])
    next_card_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FAFAFA')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
        ('LINEBELOW', (0,0), (-1,0), 0.5, colors.HexColor('#F1F5F9')),
        ('ROUNDEDCORNERS', [8, 8, 8, 8]),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(next_card_table)
    story.append(Spacer(1, 10))

    # 7. FOOTER & REAL SCANNABLE QR CODE
    qr_url = f"https://rti.gov.in/verify?reg={reg_no}"
    qr = qrcode.QRCode(version=1, box_size=4, border=1)
    qr.add_data(qr_url)
    qr.make(fit=True)
    qr_img_pil = qr.make_image(fill_color="black", back_color="white")
    
    qr_img_io = io.BytesIO()
    qr_img_pil.save(qr_img_io, format='PNG')
    qr_img_io.seek(0)
    qr_reportlab_img = Image(qr_img_io, width=42, height=42)

    footer_left = Paragraph("<b>Thank you for exercising your right to information.</b><br/><font size=7 color='#64748B'>This is a system generated receipt and does not require a signature.</font>", style_normal)
    qr_text = Paragraph("<b>Scan to verify request</b><br/><font size=7 color='#2563EB'><u>rti.gov.in/verify</u></font>", style_normal)

    qr_box_data = [[qr_reportlab_img, qr_text]]
    qr_box_table = Table(qr_box_data, colWidths=[46, 110])
    qr_box_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('ROUNDEDCORNERS', [6, 6, 6, 6]),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))

    footer_table_data = [[footer_left, qr_box_table]]
    footer_table = Table(footer_table_data, colWidths=[355, 184])
    footer_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (1,0), (1,0), 'RIGHT'),
    ]))
    story.append(footer_table)

    # Build PDF Document
    doc.build(story)
    
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
