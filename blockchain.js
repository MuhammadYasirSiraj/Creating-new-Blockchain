const sha256 = require('sha256');

function Blockchain() {
    this.chain = [];
    this.pendingTransctions = [];
    this.createNewBlock(1, 'dummy', 'dummyy');
}

Blockchain.prototype.createNewBlock = function(nonce, prevBlockHash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timeStamp: Date.now(),
        transactions: this.pendingTransctions,
        nonce: nonce,
        prevBlockHash: prevBlockHash,
        hash: hash
    };

    this.pendingTransctions = [];
    this.chain.push(newBlock);

    return newBlock;

}

Blockchain.prototype.getLastBlock = function() {
    return this.chain[this.chain.length - 1];
}

Blockchain.prototype.createNewTransaction = function(amount, sender, reciever){
    const newTransactions = {
        amount: amount,
        sender: sender,
        reciever: reciever
    };

    this.pendingTransctions.push(newTransactions);
    return this.getLastBlock()['index'] + 1;
}

Blockchain.prototype.hashBlock = function (prevBlockHash, currentBlockData, nonce){
    const dataAsString = prevBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash;
}

Blockchain.prototype.proofOfWork = function (prevBlockHash, currentBlockData){
    let nonce = 0;
    let hash = this.hashBlock(prevBlockHash, currentBlockData, nonce);

    while (hash.substring(0,4) !== 'abcd'){
    nonce++;
    hash = this.hashBlock(prevBlockHash, currentBlockData, nonce);
    console.log(hash);
    }
    return nonce;
}

module.exports = Blockchain;