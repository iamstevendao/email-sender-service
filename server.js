const express = require('express')
const path = require('path')
const logger = require('morgan')
const compression = require('compression')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('express-flash')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const dotenv = require('dotenv')

// Load environment variables from .env file
dotenv.load()

// Controllers
const homeController = require('./controllers/home')

const app = express()
var urls

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.set('port', process.env.PORT || 3000)
app.use(compression())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(expressValidator())
app.use(methodOverride('_method'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))
app.use(flash())
app.use(express.static(path.join(__dirname, 'public')))

// home
app.route('/')
  .get(homeController.index)
  .post(homeController.send)

// Production error handler
if (app.get('env') === 'production') {
  app.use((err, req, res, next) => {
    console.error(err.stack)
    res.sendStatus(err.status || 500)
  })
}

// 404
app.use((req, res, next) => {
  res.render('404')
})

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'))
})

module.exports = app