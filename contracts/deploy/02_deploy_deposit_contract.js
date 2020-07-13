module.exports = async ({getNamedAccounts, deployments, network}) => {
  const {deployer} = await getNamedAccounts();
  const {deploy} = deployments;
  const dev = !network.live;

  const daiContract = await deployments.get("Dai");

  await deploy("Deposit", {from: deployer, proxy: dev && "postUpgrade", args: [daiContract.address]});

  return !dev;
};
