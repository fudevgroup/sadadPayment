var CryptoJS = require("crypto-js");
var request = require('request');

exports.sadadPayment = function ({TerminalId,MerchantId,MerchantKey,Amount,OrderId,ReturnUrl}) {
    const dataBytes = Buffer.from(`${TerminalId};${OrderId};${Amount}`).toString()
    var iv = CryptoJS.lib.WordArray.create([0,0]);
    const signDataByte = CryptoJS.TripleDES.encrypt(dataBytes,CryptoJS.enc.Base64.parse(MerchantKey),{
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
      iv
    })
    const SignData = CryptoJS.enc.Base64.stringify(signDataByte.ciphertext);
    return new Promise(function (resolve,reject) {
        request.post({
            headers: {
                'content-type': 'application/json'
            },
            url: 'https://sadad.shaparak.ir/api/v0/Request/PaymentRequest',
            body: JSON.stringify({
                TerminalId,
                MerchantId,
                Amount,
                SignData,
                ReturnUrl,
                LocalDateTime: new Date(),
                OrderId,
            })
        }, function (error, response, body) {
            resolve(JSON.parse(body))
        });
    })
}