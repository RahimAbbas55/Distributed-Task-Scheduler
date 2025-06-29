module.exports = async function generatePDF(payload) {
  const { invoice_id, customer, total } = payload;

  console.log(`📄 Generating PDF for invoice: ${invoice_id}`);
  await new Promise(res => setTimeout(res, 1200));

  if (Math.random() < 0.15) {
    throw new Error('PDF generation error');
  }

  console.log(`✅ PDF generated for ${customer}, total: $${total}`);
};
