var Transaction = artifacts.require('TransactionContract.sol');

module.exports = function(deployer){
  deployer.deploy(Transaction);
}