export default {
  send: (recipient, message) => {
    const mg = mailgun({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAIL_DOMAIN,
    });

    const msg = {
      from: '"Errormaster"', // sender address
      to: recipient, // list of receivers
      subject: 'failed to update', // Subject line
      text: message
    };
    // just hope it arrives, not really much we can do as this is response to an error
    mg.messages().send(msg)
  }
}