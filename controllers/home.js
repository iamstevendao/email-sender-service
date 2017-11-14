const popsicle = require('popsicle')

var mail = {}

const SUCCESS = 1
const FAIL = 0

const URL_SENDGRID = 'https://api.sendgrid.com/v3/mail/send'
// GET
exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  })
}

// post
exports.send = (req, res) => {
  mail = req.body
  if (!mail) {
    res.status(400)
    res.end('Mail is invalid')
  }

  send((code) => {
    if (code === FAIL) {
      res.status(400)
      res.end('Failed to send email')
    }
    res.status(200)
    res.end('Successfully send email')
  })
}

function send (callback) {
  sendBySendGrid((res) => {
    // check code
    if (handleCode(res) === FAIL) {
      // code is failed, try to send by mailgun
      sendByMailgun((res) => {
        // check code
        if (handleCode(res) === FAIL)
        // return fail
        { callback(FAIL) } else
          // otherwise return success
          callback(SUCCESS)
      })
    } else
      callback(SUCCESS)
  })
}

function handleCode (code) {
  if (code > 300) { return FAIL }
  return SUCCESS
}

function sendBySendGrid (callback) {
  popsicle.request({
    method: 'POST',
    url: URL_SENDGRID,
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + process.env.SENDGRID_API_KEY
    },
    body: {
      personalizations: [{
        to: [{
          email: mail.receiver.email,
          name: mail.receiver.name
        }]
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
      callback(res.status)
      return
    })
    .catch((err) => {
      console.log('*** Error SendGrid: ', err)
      callback(400)
    })
}

function sendByMailgun (callback) {
  const url = 'https://api:' + process.env.MAILGUN_API_KEY + '@api.mailgun.net/v3/' + process.env.MAILGUN_DOMAIN_NAME + '/messages'
  // mailgun
  popsicle.request({
    method: 'POST',
    url: url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: {
      from: mail.sender.name + ' <' + mail.sender.email + '>',
      to: mail.receiver.name + ' <' + mail.receiver.email + '>',
      subject: mail.content.subject,
      text: mail.content.body
    }
  })
    .then((res) => {
      console.log('*** MAILGUN: ', res.status)
      callback(res.status)
      return
    }).catch((err) => {
      console.log('*** Error Mailgun: ', err)
      callback(400)
    })
}
