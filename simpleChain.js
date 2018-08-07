/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

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
		this.database = chainDB;
		let keyNum = 0;
		db.createReadStream()
		  .on('data', function (data) {
				if (data.key != 'height') keyNum ++;
		  })
		  .on('error', function (err) {
		    console.log('Unable to read data stream!', err)
		  })
		  .on('close', function () {
				if (keyNum === 0){
					console.log('no block exists')
					// creat genesis block
					let time = new Date().getTime().toString().slice(0,-3);
					let newBlock = new Block("First block in the chain - Genesis block");
					newBlock.height = 0;
					newBlock.time = time;
					newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
					db.put(newBlock.height, JSON.stringify(newBlock), function(err){
						if (err) return console.log('Block ' + key + ' submission failed', err);
					})
					// set height in DB
  				db.put('height', newBlock.height, function(err){
						if (err) return console.log('Block ' + key + ' submission failed', err);
					})
				} else {
					console.log(keyNum + ' [block] already exist!')
				}
		  })
  }

  // Add new block
  addBlock(newBlock){
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);

		db.get('height', function(err, value){
			newBlock.height = parseInt(value) + 1;
			db.get(newBlock.height - 1, function(err,value){
				let obj = JSON.parse(value)
				// previous block hash
				newBlock.previousBlockHash = obj.hash
				// Block hash with SHA256 using newBlock and converting to a string
				newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
				// Adding block object to chain
				db.put(newBlock.height, JSON.stringify(newBlock), function(err){
					if (err) return console.log('Block ' + key + ' submission failed', err);
				})
				db.put('height', newBlock.height, function(err){
					if (err) return console.log('Block ' + key + ' submission failed', err);
				})
			})
		})
  }

  // Get block height
  getBlockHeight(){
		return db.get('height').then(function(value){
			console.log('current Block height is: ', value)
			return value
		}).catch(function(err){
			console.log('Not found!', err);
		})
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
		}).catch(function(err){
			console.log('Not found!', err);
		})
  }

  // Validate blockchain
	validateChain(){
		let errorLog = [];
		let _this = this;
		this.getBlockHeight().then(function(value){
			for (var i = 0; i <= value; i++) {
				_this.getBlock(i).then(function(block){
					// validate block
					let h = block.height
					_this.validateBlock(h).then(function(val){
						if(!val) errorLog.push(h)
					})

					// compare blocks hash link
          let hash = block.hash;
					let n = block.height + 1;
					if( n <= value ) {
						db.get(n, function(err, val){
							let nextBlock = JSON.parse(val)
							let preHash = nextBlock.previousBlockHash
							if(hash !== preHash) {
								 errorLog.push(n-1);
							}
							if(n == value) {
								if(errorLog.length>0){
									console.log('\n-------Errors Detected!-------\n')
									console.log('Block errors = ' + errorLog.length);
									console.log('Blocks: '+ errorLog);
								} else {
									console.log('No errors detected');
								}
						  }
						})
					}
				})
			}
		})
	}

	// this method is for text error, once changed it would never be fixed
	changeData(key){
		db.get(key, function(err, value){
				let obj = JSON.parse(value);
				// previous block hash
				obj.time = new Date().getTime().toString().slice(0,-3);
				// Block hash with SHA256 using newBlock and converting to a string
				obj.hash = SHA256(JSON.stringify(obj)).toString();
				// Adding block object to chain
				db.put(key, JSON.stringify(obj), function(err){
					if (err) return console.log('Block ' + key + ' submission failed', err);
				})
			})
	}
}

let blockchain = new Blockchain();
// blockchain.addBlock(new Block());
// blockchain.addBlock(new Block());
// blockchain.addBlock(new Block());
// blockchain.addBlock(new Block());
