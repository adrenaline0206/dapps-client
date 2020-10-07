const RoomFactory = artifacts.require('RoomFactory');

module.exports = function (_deployer) {
  _deployer.deploy(RoomFactory);
};

