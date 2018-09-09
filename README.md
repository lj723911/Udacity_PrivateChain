# Private Blockchain Notary Service

Using Node.js/Express.js, this API interact with private blockchain to build Star Registry that allows users to claim ownership of their favorite star in the night sky.

## Getting Started
```
npm install
```
**Start server**

```
node index.js
```

## HTTP API

**To send a signature message request:**
```
curl -X "POST" "http://localhost:8000/requestValidation" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ"
}'
```
**To validate your Blockchain ID**
```
curl -X "POST" "http://localhost:8000/message-signature/validate" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
  "signature": "H6ZrGrF0Y4rMGBMRT2+hHWGbThTIyhBS0dNKQRov9Yg6GgXcHxtO9GJN4nwD2yNXpnXHTWU9i+qdw5vpsooryLU="
}'
```
**Create block**

```
curl -X "POST" "http://localhost:8000/block" -H 'Content-Type: application/json' -d $'{"body":"block body contents"}'
```

**To register a star**
```
curl -X "POST" "http://localhost:8000/block" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
  "star": {
    "dec": "-26° 29' 24.9",
    "ra": "16h 29m 1.0s",
    "story": "Found star using https://www.google.com/sky/"
  }
}'
```

**Get a star by height**

```
curl http://localhost:8000/block/{Height}
```

**Get a star by block hash**
```
curl "http://localhost:8000/stars/hash/a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f"
```
**Get stars by wallet address**
```
curl "http://localhost:8000/stars/address/142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ"
```

## Methods

**1: addBlock()**

Method add a new block into blockchain

```
blockchain.addBlock()
```
**2: getBlockHeight()**

Method get current block heigth

```
blockchain.getBlockHeight()
```
**3: getBlock()**

Method get block by block height

```
blockchain.getBlock({HEIGHT})
```
**4: validateBlock()**

Method validate a block by block heigth

```
blockchain.validateBlock({HEIGHT});
```
**5: validateChain()**

Method validate blockchain

```
blockchain.validateChain();
```
**6: getBlockByHash**
Method get block by block Hash
```
blockchain.getBlockByHash({Hash})
```
**7: getBlocksByAddress**
Method get block by wallet address
```
blockchain.getBlocksByAddress({address})
```
