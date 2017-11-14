const popsicle = require('popsicle')
const url = require('url')

// GET
exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  })
}

// post
exports.send = (req, res) => {
  console.log('request body: ', req.body)
  //sendgrid
  popsicle.request({
    method: 'POST',
    url: 'https://api.sendgrid.com/v3/mail/send',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + process.env.SENDGRID_API_KEY
    },
    body: {
      personalizations: [{
        to: [{
          email: 'fukifaku@gmail.com',
          name: 'Fukie'
        }]
      }],
      from: {
        email: 'kkk@gmail.com',
        name: 'kkk'
      },
      subject: 'Hello world!',
      content: [{
        type: 'text/html',
        value: '<html><p>Hello world from SENDGRID</p></html>'
      }]
    }
  })
    .use(popsicle.plugins.parse('json'))
    .then(function (res) {
      console.log(res.status) // => 200
      console.log(res.body) //=> { ... }
    })
  // const urlx = 'https://api:' + process.env.MAILGUN_API_KEY + '@api.mailgun.net/v3/sandbox8d9bb1b281d548949e4909b20993bd72.mailgun.org/messages'
  // // mailgun
  // popsicle.request({
  //     method: 'POST',
  //     url: urlx,
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     body: {
  //       from: 'kien@gmail.com',
  //       to: 'FK <fukifaku@gmail.com>',
  //       subject: 'Hello world!',
  //       text: 'Hello world from MAILGUN'
  //     }
  //   })
  //   .then(function (res) {
  //     console.log('*** status MAILGUN: ', res.status) // => 200
  //     console.log('*** body MAILGUN: ', res.body) //=> { ... }
  //   }).catch((err) => {
  //     console.log(err)
  //     res.end()
  //   })
  res.render('home', {
    title: 'Home'
  })
}