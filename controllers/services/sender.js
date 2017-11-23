const popsicle = require('popsicle')

// constants from .env
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
const SPARKPOST_API_KEY = process.env.SPARKPOST_API_KEY

// status code
const CODE_SUCCESS = 1
const CODE_FAIL = 0
const CODE_ERROR = 600

const URL_SENDGRID = 'https://api.sendgrid.com/v3/mail/send'
const URL_SPARKPOST = 'https://api.sparkpost.com/api/v1/transmissions'

var errorCode = {
  sendgrid: 0,
  sparkpost: 0
}

var send = (mail, callback) => {
  // send by SendGrid first
  sendBySendGrid(mail, (res) => {
    // check code
    if (handleCode(res) === CODE_FAIL) {
      // code is failed, try to send by sparkpost
      sendBySparkpost(mail, (res) => {
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

function sendBySendGrid(mail, callback) {
  let recipients = []

  mail.receivers.email.split(';').forEach((email) => {
    recipients.push({
      email
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
          to: recipients
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

function sendBySparkpost(mail, callback) {
  let recipients = []

  mail.receivers.email.split(';').forEach((email) => {
    recipients.push({
      address: email
    })
  })

  // SPARKPOST
  popsicle.request({
      method: 'POST',
      url: URL_SPARKPOST,
      headers: {
        'Content-Type': 'application/json',
        Authorization: SPARKPOST_API_KEY
      },
      body: {
        options: {
          sandbox: true
        },
        content: {
          from: mail.sender.email,
          subject: mail.content.subject,
          text: mail.content.body
        },
        recipients
      }
    })
    .use(popsicle.plugins.parse('json'))
    .then((res) => {
      console.log('*** SPARKPOST: ', res.status, " - ", res.body)
      errorCode.sparkpost = res.status
      callback(res.status)
      return
    }).catch((err) => {
      errorCode.sparkpost = CODE_ERROR
      console.log('*** Error SPARKPOST: ', err)
      callback(400)
    })
}

module.exports = {
  errorCode,
  send
}