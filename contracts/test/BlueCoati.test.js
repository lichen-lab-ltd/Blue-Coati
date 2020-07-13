const {expect} = require("chai-setup");
const {ethers, deployments} = require("@nomiclabs/buidler");

describe("BlueCoati", function () {
  it("should work", async function () {
    await deployments.fixture();
    const blueCoatiContract = await ethers.getContract("BlueCoati");
    expect(blueCoatiContract.address).to.be.a("string");
  });

  it("should fails", async function () {
    await deployments.fixture();
    const blueCoatiContract = await ethers.getContract("BlueCoati");
    expect(blueCoatiContract.fails("testing")).to.be.revertedWith("fails");
  });

  it("should return 2 as id", async function () {
    await deployments.fixture();
    const blueCoatiContract = await ethers.getContract("BlueCoati");
    expect(await blueCoatiContract.getId()).to.equal(2);
  });
});
