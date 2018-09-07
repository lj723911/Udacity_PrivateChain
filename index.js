// import block and blockchain object
let Block = require("./block").block
let Blockchain = require("./blockchain").blockchain

// create blockchain
let blockchain = new Blockchain();

const bodyParser = require('body-parser');
const bitcoin = require("bitcoinjs-lib");
const bitcoinMessage = require("bitcoinjs-message");
const express = require('express')
const app = express()
app.use(bodyParser.json());

// convert hex & String
// let strTohex = function (str) {
//   let hex = "";
//   for (let i = 0; i < str.length; i++) {
//     hex += "" + str.charCodeAt(i).toString(16);
//   }
//   return hex;
// }
//
// let hexTostring = function(hex){
//   let string = "";
//   for (let i = 0; i < hex.length; i += 2) {
//     string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
//   }
//   return string;
// }

// story requests in app locals
app.locals.validateReq = {};
app.locals.validateAddress = {};

let { validateReq } = app.locals;

// count--
let count = function(obj) {
  let countDown = function(){
    Object.keys(obj).forEach(key => {  // 返回一个所有元素为字符串的数组
      obj[key][0]--;
      if(obj[key][0] == 0) {
        delete obj[key]; // 删除对象属性
      }
    });
  }
  setInterval(countDown, 1000);
}
// auto run count
count(validateReq);

// routers
app.post('/requestValidation',(req,res) => {
   let { validateReq } = req.app.locals;
   let { address } = req.body;
   let timeStamp =  new Date().getTime().toString().slice(0,-3);
   let message = `${address}:${timeStamp}:starRegistry`;
   let validationWindow = 300;

   validateReq[address] = [validationWindow, timeStamp]

   res.send({
     "address":address,
     "requestTimeStamp":timeStamp,
     "message":message,
     "validationWindow":validationWindow
   })

})

app.post('/message-signature/validate', (req, res) => {
  let { validateReq, validateAddress } = req.app.locals;
  let { address, signature } = req.body;

  if(validateReq[address]) {
    let timeStamp = validateReq[address][1];
    let message = `${address}:${timeStamp}:starRegistry`;
    let validationWindow = validateReq[address][0];

    let registerStar = bitcoinMessage.verify(message, address, signature);
    let messageSignature;

    if(registerStar){
      messageSignature = 'valid';
      validateAddress[address] = true;
    } else {
      messageSignature = 'invalid'
    }

    res.send({
      "registerStar": registerStar,
      "status": {
         "address": address,
         "requestTimeStamp": timeStamp,
         "message": message,
         "validationWindow": validationWindow,
         "messageSignature": messageSignature
        }
    })
  } else {
    res.send( `Address ${address} not found`)
  }
})

app.post('/block', (req, res) => {
  let { address, star } = req.body;
  let { validateAddress } = req.app.locals;

  if (validateAddress[address]) {
    let { ra, dec } = star;
    let story = Buffer(star.story).toString('hex'); //strTohex(star.story)
    let body = {
      address,
      star:{ra, dec, story}
    }

    let newBlock = new Block(body)
    blockchain.addBlock(newBlock).then(()=>{
      blockchain.getBlockHeight().then((value) => {
        blockchain.getBlock(value).then((value) => {
          res.send(value)
        })
      })
    })
  } else {
    res.send(`Address ${address} not found in validated addresses`)
  }
})

app.get('/block/:height', (req, res) => {
  let { height } = req.params;
  blockchain.getBlock(height).then((value) => {
    if(value.body.star){
      value.body.star.storyDecoded = Buffer(value.body.star.story, 'hex').toString(); //hexTostring(value.body.star.story)
      res.send(value)
    } else {
      res.send(value)
    }
  }).catch(err => res.send(`The current block height is less than ${height}`))
})

app.get('/stars/:param', (req, res) => {
  let { param } = req.params;
  switch (param.substr(0,4)) {
    case 'hash':
      let hash = param.substr(5, param.length);
      blockchain.getBlockByHash(hash).then((value) => {
        if(value.body.star){
          value.body.star.storyDecoded = hexTostring(value.body.star.story);
          res.send(value)
        } else {
          res.send(value)
        }
      }).catch(err => {res.send( `hash ${hash} not found in blockchain` )})
      break;
    case 'addr':
      let address = param.substr(8, param.length);
      blockchain.getBlocksByAddress(address).then((value) => {
        if (value.length == 0) throw new Error('none') // 如果返回值为空，则抛出错误
        value.forEach(item => {
          item.body.star.storyDecoded = hexTostring(item.body.star.story);
        })
        res.send(value);
      }).catch(err => {res.send( `${address} has no stars in blockchain` )})
      break;
  }
})

app.listen(8000, () => console.log('app listening on:localhost:8000...\nblockchain is running...'))
