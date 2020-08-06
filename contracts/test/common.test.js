const {expect} = require("chai-setup");

const {betSigner} = require("common/eip712");

describe("Common", function () {
  it("test signing message", async function () {
    const message = {
      documentId: "0x41c65c24171e7939fb2515cb98f30a97c479bdb97734c6c5cb75e7c928f47ad2",
      id: "68655998179850300865326221092846554062776980563617867119125035186743711516779",
      parentId: "0",
      isValid: "true",
      timestamp: 1596663679,
    };

    const privateKey = "0xe255352b355094d954493c759c512ff67144845a1f0c4b9dbb70dc9c759a7e46";
    const signature = betSigner.sign(privateKey, message);

    const expectedSignature =
      "0xf08f0847eedd3c46a41aa43e15516e1df54c38dabe3ec422995213312c47458f3f97b41bdb63a36d2d1002004e68be4e801ab0aa47b67c7e6e03c31b33cb29571b";
    expect(signature).to.equal(expectedSignature);
  });
});
