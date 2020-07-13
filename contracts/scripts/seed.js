const {getNamedAccounts, ethers} = require("@nomiclabs/buidler");

async function main() {
  const {others} = await getNamedAccounts();
  for (let i = 0; i < 4; i++) {
    const depositContract = await ethers.getContract("Deposit", others[i]);
    await depositContract.deposit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
