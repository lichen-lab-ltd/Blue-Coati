const {expect} = require("chai-setup");
const {judgementFixture} = require("./fixtures");
const waitFor = (p) => p.then((t) => t.wait());

describe("Judgement", function () {
  it("can judge", async function () {
    const {judge, documentId} = await judgementFixture();
    const receipt = await waitFor(judge.Judgement.castJudgement(documentId, false));
    expect(receipt.events[0].event).to.equal("JudgementCasted");
  });

  it("curator betting on other can get reward", async function () {
    const {judge, curators, documentId} = await judgementFixture();

    // TODO bettree
    const winningBet = await curators[0].signBet({
      documentId,
      counter: 0,
      parentId: "0",
      isValid: false,
    });
    const losingBet = await curators[1].signBet({
      documentId,
      counter: 0,
      parentId: winningBet.id,
      isValid: true,
    });

    await waitFor(judge.Judgement.castJudgement(documentId, false));

    await waitFor(
      curators[1].Judgement.recordLosingBet(
        documentId,
        losingBet.id,
        losingBet.timestamp,
        losingBet.signature,
        winningBet.id,
        winningBet.timestamp,
        winningBet.parentId,
        winningBet.signature
      )
    );
  });
});
