const {getNamedAccounts, ethers} = require("@nomiclabs/buidler");

const names = [
  "Hetrorlig Oakenbrow",
  "Dermerlug Brewcloak",
  "Nalol Blackbraids",
  "Webir Goldenback",
  "Dholdrec Chaosgrip",
  "Siggog Strongjaw",
  "Krostol Snowtank",
  "Rumit Dragonarmour",
  "Nemnad Thunderbrow",
  "Gagham Grimbelly",
];
async function main() {
  const {others} = await getNamedAccounts();
  for (let i = 0; i < 4; i++) {
    const blueCoatiContract = await ethers.getContract("BlueCoati", others[i]);
    await blueCoatiContract.setName(names[i]);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
