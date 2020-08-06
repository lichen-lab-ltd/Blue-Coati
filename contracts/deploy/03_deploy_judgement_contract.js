const {BigNumber} = require("@ethersproject/bignumber");
module.exports = async ({getNamedAccounts, deployments, network}) => {
  const {deployer, judge} = await getNamedAccounts();
  const {deploy} = deployments;

  const days = 24 * 60 * 60;
  const cents = BigNumber.from("100000000000000"); //  TODO when dai cents : BigNumber.from("10000000000000000");

  const depositContract = await deployments.get("Deposit");

  await deploy("Judgement", {
    from: deployer,
    proxy: "postUpgrade",
    args: [judge, depositContract.address, 7 * days, cents.mul(10)],
    log: true,
  });
};
