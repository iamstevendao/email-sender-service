(function (angular) {
  'use strict'
  var App = angular.module('emailSender', [])

  App.controller('mailController', function MailController($http) {
    // mail's properties
    this.sender = {
      name: '',
      email: ''
    }
    this.receiver = {
      name: '',
      email: ''
    }
    this.content = {
      subject: '',
      body: ' '
    }
    // response from server
    this.response = ''

    // send email
    this.send = () => {
      // initialize request
      let request = {
        sender: this.sender,
        receiver: this.receiver,
        content: this.content
      }
      // send a POST request
      $http.post('/', request)
        .then((res) => {
          // store response in this.response to show in the modal
          this.response = res.data
          $('#resIcon').addClass('glyphicon glyphicon-ok')
          $('#resModal').modal('show')
          this.resetData()
        }, (err) => {
          // error occurs
          this.response = 'Failed to send email'
          $('#resIcon').addClass('glyphicon glyphicon-remove')
          $('#resModal').modal('show')
          console.log('---> error: ', err)
        })
    }

    this.resetData = () => {
      this.sender = {
        name: '',
        email: ''
      }
      this.receiver = {
        name: '',
        email: ''
      }
      this.content = {
        subject: '',
        body: ' '
      }
    }
  })
})(window.angular)