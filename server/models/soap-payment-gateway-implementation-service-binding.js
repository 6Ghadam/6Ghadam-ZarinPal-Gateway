'use strict';
var server = require('../../server/server');

module.exports = function (PaymentGatewayImplementationServicePaymentGatewayImplementationServiceBinding) {

  var soapDataSource = server.datasources.ZPSoapDS;
  var PaymentGatewayImplementationServicePaymentGatewayImplementationServiceBinding;

  soapDataSource.once('connected', function () {
    // Create the model
    PaymentGatewayImplementationServicePaymentGatewayImplementationServiceBinding = soapDataSource.createModel('PaymentGatewayImplementationServicePaymentGatewayImplementationServiceBinding', {});
  });


  /**
   * PaymentRequest
   * @param {PaymentRequest} PaymentRequest PaymentRequest
   * @callback {Function} callback Callback function
   * @returns {any} callback containing error or result. Result is the response/soap body in JSON form.
   */
  PaymentGatewayImplementationServicePaymentGatewayImplementationServiceBinding.PaymentRequest = function (PaymentRequest, callback) {
    PaymentGatewayImplementationServicePaymentGatewayImplementationServiceBinding.PaymentRequest(PaymentRequest, function (err, response) {
      var transaction = server.models.zptransaction
      var data = {
        "MerchantID": PaymentRequest.MerchantID,
        "Amount": PaymentRequest.Amount,
        "Description": JSON.parse(PaymentRequest.Description),
        "Email": PaymentRequest.Email,
        "Mobile": PaymentRequest.Mobile,
        "CallbackURL": PaymentRequest.CallbackURL,
        "Status": response.Status,
        "Authority": response.Authority
      }
      transaction.create(data, function (err, result) {
        if (err)
          return callback(err, null)
        var result = response;
        callback(err, result);
      })
    });
  }

  /**
   * PaymentRequestWithExtra
   * @param {PaymentRequestWithExtra} PaymentRequestWithExtra PaymentRequestWithExtra
   * @callback {Function} callback Callback function
   * @returns {any} callback containing error or result. Result is the response/soap body in JSON form.
   */
  PaymentGatewayImplementationServicePaymentGatewayImplementationServiceBinding.PaymentRequestWithExtra = function (PaymentRequestWithExtra, callback) {
    PaymentGatewayImplementationServicePaymentGatewayImplementationServiceBinding.PaymentRequestWithExtra(PaymentRequestWithExtra, function (err, response) {
      var result = response;
      callback(err, result);
    });
  }

  /**
   * PaymentVerification
   * @param {PaymentVerification} PaymentVerification PaymentVerification
   * @callback {Function} callback Callback function
   * @returns {any} callback containing error or result. Result is the response/soap body in JSON form.
   */
  PaymentGatewayImplementationServicePaymentGatewayImplementationServiceBinding.PaymentVerification = function (PaymentVerification, callback) {
    PaymentGatewayImplementationServicePaymentGatewayImplementationServiceBinding.PaymentVerification(PaymentVerification, function (err, response) {
      if (Number(response.Status) == 101)
        return callback(null, response)
      var transaction = server.models.zptransaction
      transaction.find({'where':{'Authority': PaymentVerification.Authority}}, function (err, transactionInst) {
        if (err)
          return callback(err, null)
        var data = {
          "VerificationStatus": response.Status.toString(),
          "RefID": response.RefID.toString()
        }
        if (transactionInst[0].RefID !== '0')
          return callback(err, null)
        transactionInst[0].updateAttributes(data, function (err, result) {
          if (err)
            return callback(err, null)
          var request = require('request')
          function requestToBackend(url, verb, payload, cb) {
            var options = {
              method: verb,
              url: url,
              preambleCRLF: true,
              postambleCRLF: true,
              headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
              },
              body: JSON.stringify(payload)
            }
            request(options, function (error, response, body) {
              console.log(err)
              console.log(body)
              if (error || response.statusCode >= 400)
                return cb(error, null)
              console.log(response)
              return cb(null, JSON.parse(body))
            })
          }
          var conf = require('../config.json')
          var url = conf.coreURL.dev
          if (process.env === 'production')
            url = conf.coreURL.prod
          var status = 'Successful'
          if (Number(response.Status) <= 0) 
            status = 'Failed'
          var data = {
            "time": Math.floor((new Date).getTime()),
            "price": PaymentVerification.Amount,
            "status": status,
            "receiptInfo": result,
            "clientId": result.Description.clientId,
            "packageId": result.Description.packageId
          }
          requestToBackend(url, "POST", data, function (err, result) {
            if (err)
              return callback(err, null)
            return callback(null, response)
          })
        })
      })
    });
  }

  /**
   * PaymentVerificationWithExtra
   * @param {PaymentVerificationWithExtra} PaymentVerificationWithExtra PaymentVerificationWithExtra
   * @callback {Function} callback Callback function
   * @returns {any} callback containing error or result. Result is the response/soap body in JSON form.
   */
  PaymentGatewayImplementationServicePaymentGatewayImplementationServiceBinding.PaymentVerificationWithExtra = function (PaymentVerificationWithExtra, callback) {
    PaymentGatewayImplementationServicePaymentGatewayImplementationServiceBinding.PaymentVerificationWithExtra(PaymentVerificationWithExtra, function (err, response) {
      var result = response;
      callback(err, result);
    });
  }

  /**
   * GetUnverifiedTransactions
   * @param {GetUnverifiedTransactions} GetUnverifiedTransactions GetUnverifiedTransactions
   * @callback {Function} callback Callback function
   * @returns {any} callback containing error or result. Result is the response/soap body in JSON form.
   */
  PaymentGatewayImplementationServicePaymentGatewayImplementationServiceBinding.GetUnverifiedTransactions = function (GetUnverifiedTransactions, callback) {
    PaymentGatewayImplementationServicePaymentGatewayImplementationServiceBinding.GetUnverifiedTransactions(GetUnverifiedTransactions, function (err, response) {
      var result = response;
      callback(err, result);
    });
  }

  /**
   * RefreshAuthority
   * @param {RefreshAuthority} RefreshAuthority RefreshAuthority
   * @callback {Function} callback Callback function
   * @returns {any} callback containing error or result. Result is the response/soap body in JSON form.
   */
  PaymentGatewayImplementationServicePaymentGatewayImplementationServiceBinding.RefreshAuthority = function (RefreshAuthority, callback) {
    PaymentGatewayImplementationServicePaymentGatewayImplementationServiceBinding.RefreshAuthority(RefreshAuthority, function (err, response) {
      var result = response;
      callback(err, result);
    });
  }

  // Map to REST/HTTP

  PaymentGatewayImplementationServicePaymentGatewayImplementationServiceBinding.remoteMethod('PaymentRequest', {
    isStatic: true,
    produces: [{
        produces: 'application/json'
      },
      {
        produces: 'application/xml'
      }
    ],
    accepts: [{
      arg: 'PaymentRequest',
      type: 'PaymentRequest',
      description: 'PaymentRequest',
      required: true,
      http: {
        source: 'body'
      }
    }],
    returns: [{
      arg: 'data',
      type: 'PaymentRequestResponse',
      description: 'PaymentRequestResponse',
      root: true
    }],
    http: {
      verb: 'post',
      path: '/PaymentRequest'
    },
    description: 'PaymentRequest'
  });

  PaymentGatewayImplementationServicePaymentGatewayImplementationServiceBinding.remoteMethod('PaymentRequestWithExtra', {
    isStatic: true,
    produces: [{
        produces: 'application/json'
      },
      {
        produces: 'application/xml'
      }
    ],
    accepts: [{
      arg: 'PaymentRequestWithExtra',
      type: 'PaymentRequestWithExtra',
      description: 'PaymentRequestWithExtra',
      required: true,
      http: {
        source: 'body'
      }
    }],
    returns: [{
      arg: 'data',
      type: 'PaymentRequestWithExtraResponse',
      description: 'PaymentRequestWithExtraResponse',
      root: true
    }],
    http: {
      verb: 'post',
      path: '/PaymentRequestWithExtra'
    },
    description: 'PaymentRequestWithExtra'
  });

  PaymentGatewayImplementationServicePaymentGatewayImplementationServiceBinding.remoteMethod('PaymentVerification', {
    isStatic: true,
    produces: [{
        produces: 'application/json'
      },
      {
        produces: 'application/xml'
      }
    ],
    accepts: [{
      arg: 'PaymentVerification',
      type: 'PaymentVerification',
      description: 'PaymentVerification',
      required: true,
      http: {
        source: 'body'
      }
    }],
    returns: [{
      arg: 'data',
      type: 'PaymentVerificationResponse',
      description: 'PaymentVerificationResponse',
      root: true
    }],
    http: {
      verb: 'post',
      path: '/PaymentVerification'
    },
    description: 'PaymentVerification'
  });

  PaymentGatewayImplementationServicePaymentGatewayImplementationServiceBinding.remoteMethod('PaymentVerificationWithExtra', {
    isStatic: true,
    produces: [{
        produces: 'application/json'
      },
      {
        produces: 'application/xml'
      }
    ],
    accepts: [{
      arg: 'PaymentVerificationWithExtra',
      type: 'PaymentVerificationWithExtra',
      description: 'PaymentVerificationWithExtra',
      required: true,
      http: {
        source: 'body'
      }
    }],
    returns: [{
      arg: 'data',
      type: 'PaymentVerificationWithExtraResponse',
      description: 'PaymentVerificationWithExtraResponse',
      root: true
    }],
    http: {
      verb: 'post',
      path: '/PaymentVerificationWithExtra'
    },
    description: 'PaymentVerificationWithExtra'
  });

  PaymentGatewayImplementationServicePaymentGatewayImplementationServiceBinding.remoteMethod('GetUnverifiedTransactions', {
    isStatic: true,
    produces: [{
        produces: 'application/json'
      },
      {
        produces: 'application/xml'
      }
    ],
    accepts: [{
      arg: 'GetUnverifiedTransactions',
      type: 'GetUnverifiedTransactions',
      description: 'GetUnverifiedTransactions',
      required: true,
      http: {
        source: 'body'
      }
    }],
    returns: [{
      arg: 'data',
      type: 'GetUnverifiedTransactionsResponse',
      description: 'GetUnverifiedTransactionsResponse',
      root: true
    }],
    http: {
      verb: 'post',
      path: '/GetUnverifiedTransactions'
    },
    description: 'GetUnverifiedTransactions'
  });

  PaymentGatewayImplementationServicePaymentGatewayImplementationServiceBinding.remoteMethod('RefreshAuthority', {
    isStatic: true,
    produces: [{
        produces: 'application/json'
      },
      {
        produces: 'application/xml'
      }
    ],
    accepts: [{
      arg: 'RefreshAuthority',
      type: 'RefreshAuthority',
      description: 'RefreshAuthority',
      required: true,
      http: {
        source: 'body'
      }
    }],
    returns: [{
      arg: 'data',
      type: 'RefreshAuthorityResponse',
      description: 'RefreshAuthorityResponse',
      root: true
    }],
    http: {
      verb: 'post',
      path: '/RefreshAuthority'
    },
    description: 'RefreshAuthority'
  });

}
