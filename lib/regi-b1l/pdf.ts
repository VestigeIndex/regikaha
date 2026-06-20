import type { B1LDictionary } from "./i18n";
import type { B1LData, B1LLocale, Quote } from "./types";
import { quoteTotals } from "./types";

function safeFileName(value: string): string {
  return value.replace(/[^a-z0-9_-]+/gi, "-").replace(/-+/g, "-");
}

export async function downloadQuotePdf(quote: Quote, data: B1LData, locale: B1LLocale, t: B1LDictionary): Promise<void> {
  const [{ jsPDF }, QRCode] = await Promise.all([import("jspdf"), import("qrcode")]);
  const client = data.clients.find((entry) => entry.id === quote.clientId);
  const project = data.projects.find((entry) => entry.id === quote.projectId);
  const totals = quoteTotals(quote);
  const verification = `RB1L-${quote.number}-${quote.updatedAt}`;
  const qr = await QRCode.toDataURL(`https://regikaha.com/regi-b1l?verify=${encodeURIComponent(verification)}`, { width: 220, margin: 1 });
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const money = new Intl.NumberFormat(locale, { style: "currency", currency: data.settings.currency });
  const pageWidth = pdf.internal.pageSize.getWidth();

  pdf.setFillColor(8, 67, 51);
  pdf.rect(0, 0, pageWidth, 33, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("Regi B1L", 16, 15);
  pdf.setFontSize(9);
  pdf.text(data.settings.companyName, 16, 23);
  pdf.setTextColor(19, 35, 28);
  pdf.setFontSize(16);
  pdf.text(`${t["doc.quote"]} ${quote.number}`, 16, 47);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text(`${t["quotes.client"]}: ${client?.name ?? "-"}`, 16, 56);
  pdf.text(`${t["quotes.project"]}: ${project?.title ?? "-"}`, 16, 62);
  pdf.text(`${t["quotes.validUntil"]}: ${quote.validUntil}`, 16, 68);
  pdf.text(`${data.settings.taxId} · ${data.settings.email} · ${data.settings.phone}`, 16, 76);

  let y = 90;
  pdf.setFillColor(232, 242, 237);
  pdf.rect(16, y - 6, pageWidth - 32, 9, "F");
  pdf.setFont("helvetica", "bold");
  pdf.text(t["quotes.item"], 19, y);
  pdf.text(t["quotes.quantity"], 113, y);
  pdf.text(t["quotes.unitPrice"], 140, y);
  pdf.text(t["common.amount"], 176, y, { align: "right" });
  pdf.setFont("helvetica", "normal");
  y += 10;
  for (const item of quote.items) {
    const lines = pdf.splitTextToSize(item.description, 85) as string[];
    pdf.text(lines, 19, y);
    pdf.text(String(item.quantity), 116, y);
    pdf.text(money.format(item.unitPrice), 140, y);
    pdf.text(money.format(item.quantity * item.unitPrice), 192, y, { align: "right" });
    y += Math.max(8, lines.length * 5);
  }
  y += 4;
  pdf.line(116, y, 192, y);
  y += 7;
  const totalRows: Array<[string, number]> = [[t["quotes.subtotal"], totals.subtotal], [t["quotes.discount"], -totals.discount], [t["quotes.tax"], totals.tax], [t["quotes.total"], totals.total]];
  for (const [label, amount] of totalRows) {
    pdf.setFont("helvetica", label === t["quotes.total"] ? "bold" : "normal");
    pdf.text(label, 140, y);
    pdf.text(money.format(amount), 192, y, { align: "right" });
    y += 7;
  }
  if (quote.notes) {
    y += 5;
    pdf.setFont("helvetica", "bold");
    pdf.text(t["quotes.conditions"], 16, y);
    pdf.setFont("helvetica", "normal");
    y += 6;
    pdf.text(pdf.splitTextToSize(quote.notes, 125), 16, y);
  }

  if (quote.signature?.dataUrl) {
    pdf.setFont("helvetica", "bold");
    pdf.text(t["quotes.signature"], 16, 231);
    pdf.addImage(quote.signature.dataUrl, "PNG", 16, 235, 52, 24);
    pdf.setFont("helvetica", "normal");
    pdf.text(`${quote.signature.signer} · ${new Date(quote.signature.signedAt).toLocaleString(locale)}`, 16, 264);
  }
  pdf.addImage(qr, "PNG", 164, 236, 28, 28);
  pdf.setFontSize(7);
  pdf.setTextColor(77, 94, 87);
  pdf.text(`${t["documents.verification"]}: ${verification}`, 16, 282);
  pdf.text(t["quotes.signatureNotice"], 16, 287);
  pdf.save(`${safeFileName(quote.number)}.pdf`);
}
