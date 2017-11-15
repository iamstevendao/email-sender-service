const popsicle = require('popsicle')

// constants from .env
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

// status code
const CODE_SUCCESS = 1
const CODE_FAIL = 0
const CODE_ERROR = 600

const URL_SENDGRID = 'https://api.sendgrid.com/v3/mail/send'
const URL_MAILGUN = `https://api:${MAILGUN_API_KEY}@api.mailgun.net/v3/${MAILGUN_DOMAIN}/message`

var mail = {}
var errorCode = {
  sendgrid: 0,
  mailgun: 0
}

// GET
exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  })
}

// POST
exports.send = (req, res) => {
  // store the request body in mail
  mail = req.body
  // if mail is null return fail
  if (!mail) {
    res.status(400)
    res.end('Mail is invalid')
  }
  // send email
  send((code) => {
    if (!code) {
      // if false returns 400, and errorcodes
      res.status(400)
      res.end(`Failed to send email!\nErrorCode: SendGrid[${errorCode.sendgrid}], MailGun[${errorCode.mailgun}]\nPlease contact mail services for more infomation!`)
    }
    res.status(200)
    res.end('Successfully sent email')
  })
}

function send(callback) {
  // send by SendGrid first
  sendBySendGrid((res) => {
    // check code
    if (handleCode(res) === CODE_FAIL) {
      // code is failed, try to send by mailgun
      sendByMailgun((res) => {
        // check code
        if (handleCode(res) === CODE_FAIL)
        // return fail
        {
          callback(CODE_FAIL)
        } else
        // otherwise return success
        {
          callback(CODE_SUCCESS)
        }
      })
    } else {
      callback(CODE_SUCCESS)
    }
  })
}

function handleCode(code) {
  // decide to return FAIL or TRUE based on the returned status
  if (code > 300) {
    return CODE_FAIL
  }
  return CODE_SUCCESS
}

function sendBySendGrid(callback) {
  let recipents = []

  mail.receivers.email.split(';').forEach((email) => {
    recipents.push({
      email: email,
      name: ''
    })
  })
  // send a mail by a hand-rolled HTTP request
  popsicle.request({
      method: 'POST',
      url: URL_SENDGRID,
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + SENDGRID_API_KEY
      },
      body: {
        personalizations: [{
          to: recipents
        }],
        from: {
          email: mail.sender.email,
          name: mail.sender.name
        },
        subject: mail.content.subject,
        content: [{
          type: 'text/html',
          value: mail.content.body
        }]
      }
    })
    .use(popsicle.plugins.parse('json'))
    .then((res) => {
      console.log('*** SENDGRID: ', res.status)
      errorCode.sendgrid = res.status
      callback(res.status)
      return
    })
    .catch((err) => {
      errorCode.sendgrid = CODE_ERROR
      console.log('*** Error SendGrid: ', err)
      callback(400)
    })
}

function sendByMailgun(callback) {
  let recipents = mail.receivers.email.replace(';', ',')
  // mailgun
  popsicle.request({
      method: 'POST',
      url: URL_MAILGUN,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: {
        from: mail.sender.name + ' <' + mail.sender.email + '>',
        to: recipents,
        subject: mail.content.subject,
        text: mail.content.body
      }
    })
    .then((res) => {
      console.log('*** MAILGUN: ', res.status, " - ", res.body)
      errorCode.mailgun = res.status
      callback(res.status)
      return
    }).catch((err) => {
      errorCode.mailgun = CODE_ERROR
      console.log('*** Error Mailgun: ', err)
      callback(400)
    })
}