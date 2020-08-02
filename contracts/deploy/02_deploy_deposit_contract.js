module.exports = async ({getNamedAccounts, deployments, network}) => {
  const {deployer} = await getNamedAccounts();
  const {deploy} = deployments;
  const dev = !network.live;
  let days;
  dev ? (days = 0) : (days = 24 * 60 * 60);

  await deploy("Deposit", {from: deployer, proxy: dev && "postUpgrade", args: [7 * days]});

  return !dev;
};
