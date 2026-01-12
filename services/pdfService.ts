import { jsPDF } from 'jspdf';
import { UkscItem, Bill } from '../types';

export const generateBillPDF = (uksc: UkscItem, bill: Bill) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("Electricity Bill Receipt", 20, 25);

  // Body
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(12);
  let y = 60;

  const addLine = (label: string, value: string) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, 80, y);
    y += 10;
  };

  addLine("UKSC Number", uksc.ukscNumber);
  addLine("Property Label", uksc.label);
  y += 5;
  doc.setDrawColor(200);
  doc.line(20, y, 190, y);
  y += 15;

  addLine("Tenant Name", uksc.tenant.name || "N/A");
  addLine("Flat/Plot No", uksc.tenant.address || "N/A");
  addLine("Phone", uksc.tenant.phone || "N/A");
  y += 15;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Bill Summary", 20, y);
  y += 10;
  doc.setFontSize(12);
  
  addLine("Billing Date", bill.date);
  addLine("Due Date", bill.dueDate);
  addLine("Units Consumed", `${bill.units} kWh`);
  addLine("Status", bill.status);
  
  y += 10;
  doc.setFontSize(18);
  doc.setTextColor(37, 99, 235);
  doc.text(`Total Amount: ₹${bill.amount}/-`, 20, y);

  doc.save(`Bill_${uksc.ukscNumber}_${bill.date}.pdf`);
};