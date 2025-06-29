const emailHandler = require('./email');
const imageHandler = require('./imageResize');
const pdfHandler = require('./pdf');

module.exports = async function handleJob(job) {
  switch (job.type) {
    case 'email_notification':
      return emailHandler(job.payload);

    case 'resize_image':
      return imageHandler(job.payload);

    case 'generate_pdf':
      return pdfHandler(job.payload);

    default:
      throw new Error(`No handler for job type: ${job.type}`);
  }
};
