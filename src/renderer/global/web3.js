import Web3 from 'web3'
let web3;

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers  
  console.log("Need",
    'geth --syncmode "fast" --rpc --rpccorsdomain "http://localhost:9080" --rpcapi personal,web3,eth,net')
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}
export default web3 