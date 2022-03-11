const {parseUnits} = require("ethers/utils");
const {deployProxy} = require("@openzeppelin/truffle-upgrades");
const ACRToken = artifacts.require("ACRToken");

const DECIMALS = 18;
const TOTAL_SUPPLY = 10000000;
const TOKEN_NAME = "ACR Token";
const TOKEN_SYMBOL = "ACR";

module.exports = async function (deployer) {
  await deployProxy(ACRToken, [TOKEN_NAME, TOKEN_SYMBOL, parseUnits(TOTAL_SUPPLY.toString(), DECIMALS)], {
    deployer,
    initializer: "initialize"
  });
  console.log("ACRToken deployed to:", ACRToken.address);
};
