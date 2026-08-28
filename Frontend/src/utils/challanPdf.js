import { jsPDF } from 'jspdf';

const LOCATIONS = {
  'Over Speeding': 'Silk Board Junction, Bengaluru',
  'Signal Jumping': 'Marathahalli Bridge, Bengaluru',
  'No Parking': 'MG Road, Bengaluru',
  'Wrong Parking': 'Koramangala 4th Block, Bengaluru',
  'No Helmet': 'Indiranagar 100ft Road, Bengaluru',
  'Triple Riding': 'Whitefield Main Road, Bengaluru',
};

/**
 * Generates and downloads a styled Challan PDF.
 * @param {object} challan - ChallanSummaryDto from API
 */
export function downloadChallanPdf(challan) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();

  // â”€â”€ Header gradient band â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  doc.setFillColor(15, 82, 186);
  doc.rect(0, 0, W, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('PARIVAHAN SEWA', 15, 16);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Ministry of Road Transport & Highways, Government of India', 15, 23);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('TRAFFIC CHALLAN NOTICE', 15, 34);

  // Challan number (top right)
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const challanNum = `CH-${String(challan.id).padStart(8, '0')}`;
  doc.text(challanNum, W - 15, 20, { align: 'right' });
  doc.text(`Date: ${formatDate(challan.challanDate)}`, W - 15, 26, { align: 'right' });

  // â”€â”€ Status watermark â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const statusColor = challan.status === 'PAID' ? [16, 185, 129] :
    challan.status === 'DISPUTED' ? [139, 92, 246] : [239, 68, 68];
  doc.setTextColor(...statusColor);
  doc.setFontSize(52);
  doc.setFont('helvetica', 'bold');
  doc.setGState(new doc.GState({ opacity: 0.08 }));
  doc.text(challan.status, W / 2, 150, { align: 'center', angle: 35 });
  doc.setGState(new doc.GState({ opacity: 1 }));

  // â”€â”€ Section: Vehicle Info â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  let y = 54;
  sectionHeader(doc, 'VEHICLE INFORMATION', y); y += 8;
  row(doc, 'Registration Number', challan.registrationNumber, y); y += 7;
  row(doc, 'Vehicle', challan.vehicleModel || 'â€”', y); y += 7;
  row(doc, 'Nickname', challan.vehicleNickname || 'â€”', y); y += 12;

  // â”€â”€ Section: Offence Details â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  sectionHeader(doc, 'OFFENCE DETAILS', y); y += 8;
  row(doc, 'Violation', challan.offence, y); y += 7;
  row(doc, 'Location', challan.location || LOCATIONS[challan.offence] || 'Bengaluru, Karnataka', y); y += 7;
  row(doc, 'Date of Offence', formatDate(challan.challanDate), y); y += 7;
  row(doc, 'Due Date', formatDate(challan.dueDate), y); y += 12;

  // â”€â”€ Section: Payment Info â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  sectionHeader(doc, 'PAYMENT INFORMATION', y); y += 8;

  // Amount box
  doc.setFillColor(239, 246, 255);
  doc.roundedRect(15, y - 2, W - 30, 14, 3, 3, 'F');
  doc.setTextColor(15, 82, 186);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Fine Amount', 20, y + 6);
  doc.setFontSize(14);
  doc.text(`\u20B9 ${Number(challan.amount).toLocaleString('en-IN')}`, W - 20, y + 6, { align: 'right' });
  y += 18;

  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  row(doc, 'Status', challan.status, y); y += 7;
  if (challan.status === 'PAID') {
    row(doc, 'Paid On', formatDate(challan.paymentDate), y); y += 7;
    row(doc, 'Transaction ID', challan.transactionId || 'â€”', y); y += 7;
  }
  y += 8;

  // â”€â”€ How to Pay section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (challan.status !== 'PAID') {
    sectionHeader(doc, 'HOW TO PAY', y); y += 8;
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const steps = [
      '1. Login to Parivahan Sewa portal (parivahan.gov.in)',
      '2. Go to "Challans" section',
      '3. Enter your vehicle registration number',
      '4. Pay online using UPI / Net Banking / Credit/Debit Card',
    ];
    steps.forEach((step) => {
      doc.text(step, 20, y);
      y += 6;
    });
    y += 6;
  }

  // â”€â”€ Footer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  doc.setFillColor(245, 247, 250);
  doc.rect(0, 270, W, 27, 'F');
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('This is a computer-generated challan. For queries, contact your nearest RTO or call 1800-11-5656.', W / 2, 278, { align: 'center' });
  doc.text('\u00A9 Parivahan Sewa â€” Ministry of Road Transport & Highways, Government of India', W / 2, 284, { align: 'center' });
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`, W / 2, 290, { align: 'center' });

  doc.save(`Challan_${challanNum}.pdf`);
}

/**
 * Generates and downloads a Payment Receipt PDF.
 * @param {object} receipt - PaymentReceiptDto from API
 */
export function downloadReceiptPdf(receipt) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, W, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT RECEIPT', 15, 18);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Parivahan Sewa â€” Ministry of Road Transport & Highways', 15, 27);
  doc.text('PAID', W - 15, 20, { align: 'right' });

  // Receipt details
  let y = 55;
  sectionHeader(doc, 'RECEIPT DETAILS', y); y += 8;
  row(doc, 'Receipt Number', receipt.receiptNumber, y); y += 7;
  row(doc, 'Transaction ID', receipt.transactionId, y); y += 7;
  row(doc, 'Payment Date', formatDate(receipt.paymentDate), y); y += 7;
  row(doc, 'Payment Mode', receipt.paymentMode || 'Online', y); y += 12;

  sectionHeader(doc, 'CHALLAN DETAILS', y); y += 8;
  row(doc, 'Registration Number', receipt.registrationNumber, y); y += 7;
  row(doc, 'Offence', receipt.offence, y); y += 12;

  // Amount
  doc.setFillColor(236, 253, 245);
  doc.roundedRect(15, y - 2, W - 30, 16, 3, 3, 'F');
  doc.setTextColor(5, 150, 105);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Amount Paid', 22, y + 8);
  doc.setFontSize(16);
  doc.text(`\u20B9 ${Number(receipt.amountPaid).toLocaleString('en-IN')}`, W - 22, y + 8, { align: 'right' });
  y += 24;

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(receipt.message || 'Payment successful. Your challan has been cleared.', W / 2, y, { align: 'center' });

  // Footer
  doc.setFillColor(245, 247, 250);
  doc.rect(0, 270, W, 27, 'F');
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(8);
  doc.text('This is a computer-generated receipt. Keep this for your records.', W / 2, 278, { align: 'center' });
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`, W / 2, 284, { align: 'center' });

  doc.save(`Receipt_${receipt.receiptNumber}.pdf`);
}

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function sectionHeader(doc, text, y) {
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 82, 186);
  doc.text(text, 15, y);
  doc.setDrawColor(15, 82, 186);
  doc.setLineWidth(0.3);
  doc.line(15, y + 2, doc.internal.pageSize.getWidth() - 15, y + 2);
  doc.setTextColor(50, 50, 50);
}

function row(doc, label, value, y) {
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text(label, 20, y);
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.text(String(value ?? 'â€”'), 90, y);
  doc.setFont('helvetica', 'normal');
}

function formatDate(d) {
  if (!d) return 'â€”';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}
