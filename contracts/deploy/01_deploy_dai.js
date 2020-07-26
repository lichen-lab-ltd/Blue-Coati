module.exports = async ({getNamedAccounts, deployments}) => {
  const {daiMinter} = await getNamedAccounts();
  const {deploy} = deployments;

  const daiContract = await deployments.getOrNull("Dai");
  if (!daiContract) {
    await deploy("Dai", {
      from: daiMinter,
      contract: "DAIWithInitialBalance",
      args: ["10000000000000000000000000", "10000000000000000000"],
    });
  }

  return true;
};
