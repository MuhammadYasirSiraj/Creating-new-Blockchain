const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {v4: uuidv4} = require('uuid');
const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();
const nodeAddress = uuidv4().split('-').join('');
const port = process.argv[2];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/blockchain', function (req, res) {
    res.send(bitcoin)
});

app.post('/transaction', function (req, res) {
    const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.reciever);
    res.json(blockIndex);
});

app.get('/mine', function (req, res) {
    const lastBlock = bitcoin.getLastBlock();
    const prevBlockHash = lastBlock['hash'];

    const currentBlockData = {
        transaction: bitcoin.pendingTransctions,
        index: lastBlock['index'] + 1
    };
    const nonce = bitcoin.proofOfWork(prevBlockHash, currentBlockData);

    const blockhash = bitcoin.hashBlock(prevBlockHash, currentBlockData, nonce);
    
    const newBlock = bitcoin.createNewBlock(nonce, prevBlockHash, blockhash);

    bitcoin.createNewTransaction(10, '000000', nodeAddress);

    res.json({
        note: 'Block mine successfully',
        block: newBlock
    });
});

app.get('/wallet', function (req, res) {
    res.sendFile(__dirname + '/index.html')
});

app.post('/wallet', function (req, res) {
    const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.senderAddress, req.body.recipientAddress);
    res.json(blockIndex + 'The transaction added');
});

app.listen(port, function(){
    console.log('Server is running on ' + port);
});