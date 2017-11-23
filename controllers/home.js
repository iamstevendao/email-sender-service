const sender = require('./services/sender.js')

// GET
exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  })
}

// POST
exports.send = (req, res) => {
  // store the request body in mail
  let mail = req.body
  // if mail is null return fail
  if (!mail) {
    res.status(400)
    res.end('Mail is invalid')
  }
  // send email
  sender.send(mail, (code) => {
    if (!code) {
      // if false returns 400, and errorcodes
      res.status(400)
      res.end(`Failed to send email!\nErrorCode: SendGrid[${sender.errorCode.sendgrid}], Sparkpost[${sender.errorCode.sparkpost}]\nPlease contact mail services for more infomation!`)
    }
    res.status(200)
    res.end('Successfully sent email')
  })
}
