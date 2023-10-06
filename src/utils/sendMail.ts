import nodemailer from 'nodemailer'

import * as handlebars from "handlebars"

export default async function sendMail(
  to: string,
  name: string,
  image: string,
  url: string,
  subject: string,
  template: string
) {
  const {
    SMTP_EMAIL,
    SMTP_HOST,
    SMTP_PASSWORD,
    SMTP_PORT
  } = process.env;
  console.log(process.env)

  console.log(SMTP_PORT)
  console.log(SMTP_EMAIL)
  console.log(SMTP_HOST)
  console.log(SMTP_PASSWORD)

  let transporter = await nodemailer.createTransport({
    port: Number(SMTP_PORT),
    host: SMTP_HOST,
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD
    }
  })

  const data = handlebars.compile(template);
  const replacements = {
    name: name,
    email_link: url,
    image: image
  }

  const html = data(replacements);
  await new Promise((resolve, reject) => {
    transporter.verify((error: any, success: any) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("server is listening...")
        resolve(success);
      }
    })
  })

  const options = {
    from: SMTP_EMAIL,
    to,
    subject,
    html
  }

  await new Promise((resolve, reject) => {
    transporter.sendMail(options, (err: any, info: any) => {
      if (err) {
        console.log(err);
        reject(err)
      } else {
        console.log(info)
        resolve(info)
      }
    })
  })
}
