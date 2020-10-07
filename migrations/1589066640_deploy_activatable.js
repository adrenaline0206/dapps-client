const Activatable = artifacts.require('Activatable');

module.exports = function (_deployer) {
  _deployer.deploy(Activatable);
};
