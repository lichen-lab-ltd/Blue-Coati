const {betSigner} = require("common/eip712");
const {ethers, deployments, getNamedAccounts} = require("@nomiclabs/buidler");
const {Wallet} = require("@ethersproject/wallet");
const {BigNumber} = require("@ethersproject/bignumber");

async function createCurator(wallet) {
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    Deposit: await ethers.getContract("Deposit", wallet),
    Judgement: await ethers.getContract("Judgement", wallet),
    signBet({documentId, counter, parentId, isValid}) {
      const id = BigNumber.from(wallet.address).mul(BigNumber.from(2).pow(96)).add(counter);
      const timestamp = Math.floor(Date.now() / 1000);
      const message = {
        id,
        documentId,
        parentId,
        timestamp,
        isValid: isValid ? "true" : "false",
      };
      const signature = betSigner.sign(wallet.privateKey, message);
      return {...message, signature};
    },
  };
}

const exampleDocumentId = "0x0000000000000000000000000000000000000000000000000000000000000001";
const judgementFixture = deployments.createFixture(async () => {
  const {others, judge} = await getNamedAccounts();
  await deployments.fixture();

  const curators = [];
  for (const other of others.slice(0, 3)) {
    const wallet = Wallet.createRandom().connect(ethers.provider);
    await deployments.rawTx({from: other, to: wallet.address, value: "1000000000000000000"});
    const curator = await createCurator(wallet);
    curators.push(curator);
    await curator.Deposit.deposit({value: "50000000000000000"});
  }

  const users = [];
  for (const other of others.slice(3)) {
    users.push({
      address: other,
      Deposit: await ethers.getContract("Deposit", other),
      Judgement: await ethers.getContract("Judgement", other),
    });
  }

  return {
    documentId: exampleDocumentId,
    curators,
    judge: {
      address: judge,
      Judgement: await ethers.getContract("Judgement", judge),
    },
    users,
  };
});

module.exports = {
  judgementFixture,
};
