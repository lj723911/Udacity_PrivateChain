# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

## Getting Started
```
npm install
```
**Start server**

```
node index.js
```

## HTTP API

**Get block by height**

```
curl http://localhost:8000/block/{Height}
```

**Create block**

```
curl -X "POST" "http://localhost:8000/block" -H 'Content-Type: application/json' -d $'{"body":"block body contents"}'
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
