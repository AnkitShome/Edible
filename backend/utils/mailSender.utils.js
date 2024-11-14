import nodemailer from "nodemailer"

const mailSender = async (email, title, body) => {
   try {
      let transporter = nodemailer.createTransport({
         host: process.env.MAIL_HOST,
         auth: {
            pass: process.env.MAIL_PASS,
            user: process.env.MAIL_USER
         }
      })

      let info = await transporter.sendMail({
         from: `"EDIBLE" <${process.env.MAIL_USER}>`,
         to: email,
         subject: title,
         html: body
      })

      console.log("Email sent successfully \n", info.response)
      return info

   } catch (error) {
      console.log(error.message)
   }
}

export { mailSender }