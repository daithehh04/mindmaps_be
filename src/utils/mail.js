"use strict"
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "daithehh04@gmail.com",
    pass: "kxfw zbgw cmne ulol",
  },
})

const sendMail = async (to, subject, message) => {
  const info = await transporter.sendMail({
    from: '"Dai The 👻" <daithehh04@gmail.com>', // sender address
    to,
    subject, // Subject line
    html: `<div>Link xác nhận: ${message}</div>
      <i>Note that the link is only valid within 15 minutes from when you receive this email!</i>
    `, // html body
  })
  return info
}
module.exports = sendMail
