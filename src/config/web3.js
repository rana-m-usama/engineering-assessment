const { Web3 } = require('web3');
const abi = require('../contract/abi.json');

const { RPC_URL, TOKEN_CONTRACT } = process.env;

if (!RPC_URL) {
    throw new Error('RPC_URL is not set. See .env.example');
}
if (!TOKEN_CONTRACT) {
    throw new Error('TOKEN_CONTRACT is not set. See .env.example');
}

const web3 = new Web3(RPC_URL);
const tokenContract = new web3.eth.Contract(abi, TOKEN_CONTRACT);

module.exports = { web3, tokenContract };
