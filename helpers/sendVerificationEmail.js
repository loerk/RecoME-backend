import sgMail from "@sendgrid/mail";
import config from "config";
import { emailHTML } from "./email.js";
sgMail.setApiKey(config.get("email_verification.api_key"));

export const sendVerificationEmail = (token, userEmail, username) => {
  console.log("start sending");
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
  console.log("end sending");
};
