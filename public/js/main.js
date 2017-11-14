(function (angular) {
  'use strict'
  var App = angular.module('emailSender', [])

  App.controller('mailController', function MailController ($http) {
    this.sender = { name: '', email: '' }
    this.receiver = { name: '', email: '' }
    this.content = { subject: '', body: ' ' }
    this.send = function () {
      let request = { sender: this.sender, receiver: this.receiver, content: this.content }
      console.log('****request', request)
      $http.post('/', request)
        .success((data) => {
          console.log(data)
        })
        .error((data) => {
          console.log('Error: ' + data)
        })
    }
  })
})(window.angular)
