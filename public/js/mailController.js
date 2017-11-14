(function (angular) {
  'use strict'
  var App = angular.module('emailSender', [])
  const CODE_SUCCESS = 1
  const CODE_FAIL = 0

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
          // also replaces all the '\n' characters to break
          this.response = res.data
          showModal(getCode(res.status))
          this.resetData()
        }, (err) => {
          // error occurs
          this.response = err.data
          showModal(CODE_FAIL)
          console.log('---> error: ', err)
        })
    }

    function showModal(status) {
      if (status) {
        $('#resIcon').addClass('glyphicon glyphicon-ok')
      } else {
        $('#resIcon').addClass('glyphicon glyphicon-remove')
      }
      $('#resModal').modal('show')
    }

    function getCode(status) {
      switch (status) {
        case 200:
          return CODE_SUCCESS
        case 400:
          return CODE_FAIL
      }
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