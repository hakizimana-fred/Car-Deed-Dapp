const CarDeed = artifacts.require("CarDeed");

module.exports = function (deployer) {
  deployer.deploy(CarDeed);
};
