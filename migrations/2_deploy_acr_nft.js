const ACR = artifacts.require("ACR");

module.exports = async (deployer) => {
  await deployer.deploy(ACR, {gas: 1000000});
  console.log("ACR NFT deployed to:", ACR.address);
};
