module.exports = async ({getNamedAccounts, deployments, network}) => {
  const {deployer, judge} = await getNamedAccounts();
  const {deploy} = deployments;
  const dev = !network.live;

  const depositContract = await deployments.get("Deposit");

  await deploy("Judgement", {from: deployer, proxy: dev && "postUpgrade", args: [judge, depositContract.address]});

  return !dev;
};
