# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

## Getting Started
```
npm install
```
## Testing

To test code:
1: Open a command prompt or shell terminal after install node.js.
2: Enter a node session, also known as REPL (Read-Evaluate-Print-Loop).
```
node
```
3: Copy and paste your code into your node session
4: Instantiate blockchain with blockchain variable
```
let blockchain = new Blockchain();
```
5: Generate 10 blocks using a for loop
```
for (var i = 0; i <= 10; i++) {
  blockchain.addBlock(new Block("test data "+i));
}
```
6: Validate blockchain
```
blockchain.validateChain();
```
7: Validate blockchain. The chain should now fail with blocks 2,4, and 7.
```
blockchain.validateChain();
```
