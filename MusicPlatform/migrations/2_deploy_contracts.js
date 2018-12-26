var Musician = artifacts.require('./Musician.sol')

module.exports = function (deployer) {
  deployer.deploy(Musician)
}
