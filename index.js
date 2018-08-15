// import block and blockchain object
let Block = require("./block").block
let Blockchain = require("./blockchain").blockchain

// create blockchain
let blockchain = new Blockchain();

const bodyParser = require('body-parser');
const express = require('express')
const app = express()
app.use(bodyParser.json());

app.get('/block/:height', (req, res) => {
  let height = req.params.height;
  blockchain.getBlock(height).then((value) => {
    res.send(value)
  })
})

app.post('/block', (req, res) => {
  let data = req.body;
  let newBlock = new Block(data.body);
  blockchain.addBlock(newBlock).then(()=>{
    blockchain.getBlockHeight().then((value) => {
      blockchain.getBlock(value).then((value) => {
        res.send(value)
      })
    })
  });
})

app.listen(8000, () => console.log('app listening on:localhost:8000...\nblockchain is running...'))
