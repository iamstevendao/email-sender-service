(function (angular) {
  'use strict'
  var App = angular.module('emailSender', [])

  App.controller('mailController', function MailController ($http) {
    this.sender = { name: '', email: '' }
    this.receiver = { name: '', email: '' }
    this.content = { subject: '', body: ' ' }
    this.response = ''
    this.send = () => {
      let request = { sender: this.sender, receiver: this.receiver, content: this.content }
      console.log('****request', request)
      $http.post('/', request)
        .then((res) => {
          console.log('---> response: ', res)
          this.response = 'Successfully sent email!'
          $('#resModal').modal('show')
          this.resetData()
        }, (err) => {
          this.response = 'Failed to send email!'
          console.log('---> error: ', err)
        })
    }

    this.resetData = () => {
      this.sender = { name: '', email: '' }
      this.receiver = { name: '', email: '' }
      this.content = { subject: '', body: ' ' }
    }
  })
})(window.angular)
