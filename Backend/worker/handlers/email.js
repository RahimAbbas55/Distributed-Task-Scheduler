module.exports = async function sendEmail(payload) {
  const { to, subject, message } = payload;

  console.log(`📧 Sending email to ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);

  // Simulate email delay
  await new Promise(res => setTimeout(res, 1000));

  // Simulate random failure
  if (Math.random() < 0.1) {
    throw new Error('Simulated email failure');
  }

  console.log(`✅ Email sent to ${to}`);
};
