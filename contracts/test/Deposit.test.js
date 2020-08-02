const {expect} = require("chai-setup");
const {ethers, deployments, getNamedAccounts} = require("@nomiclabs/buidler");

describe("Deposit", function () {
  it("should deploy", async function () {
    await deployments.fixture();
    const depositContract = await ethers.getContract("Deposit");
    expect(depositContract.address).to.be.a("string");
  });

  it("should let deposit", async function () {
    const {others} = await getNamedAccounts();
    await deployments.fixture();
    const depositContract = await ethers.getContract("Deposit", others[1]);
    await depositContract.deposit({value: 10});
    let deposit = await depositContract.deposits(others[1]);
    expect(deposit[0]).to.equal(10);
  });

  it("should let withdraw request", async function () {
    const {others} = await getNamedAccounts();
    await deployments.fixture();
    const depositContract = await ethers.getContract("Deposit", others[1]);
    await depositContract.withdrawRequest();
    let deposit = await depositContract.deposits(others[1]);
    expect(deposit[1]).to.have.lengthOf.above(4);
  });

  it("should let withdraw deposit after unlocking", async function () {
    const {others} = await getNamedAccounts();
    await deployments.fixture();
    const depositContract = await ethers.getContract("Deposit", others[1]);
    await depositContract.deposit({value: 10});
    await depositContract.withdrawRequest();
    await depositContract.withdrawDeposit();
    let deposit = await depositContract.deposits(others[1]);
    expect(deposit[0]).to.equal(0);
  });
});
