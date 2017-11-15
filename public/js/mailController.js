'use strict'
var App = angular.module('emailSender', [])
const CODE_SUCCESS = 1
const CODE_FAIL = 0

App.controller('mailController', function MailController($http, $scope) {
    // mail's properties
    this.sender = {
      name: '',
      email: ''
    }
    this.receivers = {
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
        receivers: this.receivers,
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
      this.receivers = {
        name: '',
        email: ''
      }
      this.content = {
        subject: '',
        body: ' '
      }
    }
  })
  .directive('multipleEmails', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ctrl) {
        ctrl.$parsers.unshift(function (viewValue) {
          var emails = viewValue.split(',')
          // define single email validator here
          var re = /\S+@\S+\.\S+/

          // angular.foreach(emails, function() {
          var validityArr = emails.map(function (str) {
            return re.test(str.trim())
          }); // sample return is [true, true, true, false, false, false]
          console.log('Ctrl: ', ctrl)
          console.log(emails, validityArr)
          var atLeastOneInvalid = false
          angular.forEach(validityArr, function (value) {
            if (value === false)
              atLeastOneInvalid = true
          });
          if (!atLeastOneInvalid) {
            // ^ all I need is to call the angular email checker here, I think.
            ctrl.$setValidity('multipleEmails', true)
            return viewValue
          } else {
            ctrl.$setValidity('multipleEmails', false)
            return undefined
          }
          // })
        })
      }
    }
  })