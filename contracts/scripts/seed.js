const {getNamedAccounts, ethers} = require("@nomiclabs/buidler");
const {BigNumber} = require("ethers");

async function main() {
  const {others} = await getNamedAccounts();
  for (let i = 0; i < 4; i++) {
    const depositContract = await ethers.getContract("Deposit", others[i]);
    await depositContract.deposit({value: BigNumber.from("50000000000000000")});
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
