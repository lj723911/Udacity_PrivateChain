/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/
// let database = require('./levelSandbox')
const SHA256 = require('crypto-js/sha256');

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);


/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
  constructor(){
		// this.chain = the height of latest block
    this.top = null;
		this.db = chainDB;
    this.addBlock(new Block("First block in the chain - Genesis block"));
  }

  // Add new block
  addBlock(newBlock){
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);

    if(this.top != null){
			this.top += 1;
			// Block height
			newBlock.height = this.top;
			    // previous block hash
			this.getBlock(newBlock.height - 1).then(function(value){
				newBlock.previousBlockHash = value.hash;
				// Block hash with SHA256 using newBlock and converting to a string
				newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
				// Adding block object to chain
				db.put(newBlock.height, JSON.stringify(newBlock), function(err){
					if (err) return console.log('Block ' + key + ' submission failed', err);
				})
			})
    } else {
			// Genesis block
			newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
			db.put(newBlock.height, JSON.stringify(newBlock), function(err){
				if (err) return console.log('Block ' + key + ' submission failed', err);
			})
			this.top = 0;
		}
  }

  // Get block height
  getBlockHeight(){
    return this.top;
  }

  // get block
  getBlock(blockHeight){
	  return	db.get(blockHeight).then(function(value){
			console.log('Block #' + blockHeight + ':\n' + value + '\n')
			let obj = JSON.parse(value)
			return obj
		}).catch(function(err){
			console.log('Not found!', err);
		})
  }

  // validate block
  validateBlock(blockHeight){
		return db.get(blockHeight).then(function(value){
			let block = JSON.parse(value);
			let blockHash = block.hash;
			// remove block hash to test block integrity
	    block.hash = '';
	    // generate block hash
	    let validBlockHash = SHA256(JSON.stringify(block)).toString();
	    // Compare
	    if (blockHash === validBlockHash) {
				return true
	    } else {
	      console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
	      return  false
	    }
		})
  }

 // Validate blockchain
  validateChain(){
		let errorLog = [];

    for (var i = this.top; i >= 0; i--) {
			// validate block
		  this.validateBlock(i).then(function(value){
				if(!value) errorLog.push(i)
			})

      // compare blocks hash link
			this.getBlock(i).then(function(block){
				let previousHash = block.previousBlockHash;
				let n = block.height - 1;
				if( n >= 0 ) {
					db.get(n, function(err, value){
						let preBlock = JSON.parse(value)
						let blockHash = preBlock.hash
						if(blockHash !== previousHash) {
							 errorLog.push(i);
						}
						if ( n == 0 ) {
							if(errorLog.length>0){
								console.log('Block errors = ' + errorLog.length);
								console.log('Blocks: '+ errorLog);
							}else {
								console.log('No errors detected');
							}
						}
					})
				}
      })
    }
	}
}

let blockchain = new Blockchain();
blockchain.addBlock(new Block());
blockchain.addBlock(new Block());
blockchain.addBlock(new Block());
blockchain.addBlock(new Block());
