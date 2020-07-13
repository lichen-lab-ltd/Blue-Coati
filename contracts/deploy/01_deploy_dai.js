module.exports = async ({getChainId, getNamedAccounts, deployments}) => {
  const {daiMinter} = await getNamedAccounts();
  const {deploy} = deployments;

  const chainId = await getChainId();

  const daiContract = await deployments.getOrNull("Dai");
  if (!daiContract) {
    await deploy("Dai", {from: daiMinter, args: [chainId]});
  }

  return true;
};
