import sgMail from "@sendgrid/mail";
import "dotenv/config";

import { emailHTML } from "./email.js";
sgMail.setApiKey(process.env.REACT_APP_EMAIL_VERIFICATION_KEY);

export const sendVerificationEmail = (token, userEmail, username) => {
  const msg = {
    to: userEmail,
    from: "welcome-to-recome@posteo.de",
    subject: "You signed up at recoMe",
    text: "please verify your email",
    html: emailHTML(token, username),
  };

  (async () => {
    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  })();
};
