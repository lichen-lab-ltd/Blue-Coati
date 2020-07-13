const {expect} = require("chai-setup");
const {ethers, deployments} = require("@nomiclabs/buidler");

describe("Deposit", function () {
  it("should work", async function () {
    await deployments.fixture();
    const depositContract = await ethers.getContract("Deposit");
    expect(depositContract.address).to.be.a("string");
  });
});
