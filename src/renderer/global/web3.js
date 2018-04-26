import Web3 from 'web3'
let web3;

if (typeof web3 !== 'undefined') {
    console.log("已经有了一个 ")
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers  
  console.log("自定义一个8545,需要",
  ' geth --syncmode "fast" --rpc --rpccorsdomain "http://localhost:9080" --rpcapi personal,web3,eth,net   ')
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  // web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:3000"));

}
console.log('Global',web3);

// var coinbase = web3.eth.getCoinbase() .then(console.log);

export default web3 