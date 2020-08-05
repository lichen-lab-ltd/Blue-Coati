import {
  DepositReceived,
  WithdrawalRequested,
  DepositWithdrew,
} from "../generated/Deposit/DepositContract";
import {JudgementCasted} from "../generated/Judgement/JudgementContract";
import {UserDeposit, Judgement} from "../generated/schema";
import {log, BigInt} from "@graphprotocol/graph-ts";

let zeroAddress = "0x0000000000000000000000000000000000000000";

export function handleDepositReceived(event: DepositReceived): void {
  let id = event.params.from.toHex();
  let entity = UserDeposit.load(id);
  if (!entity) {
    entity = new UserDeposit(id);
  }
  entity.amount = event.params.totalAmount;
  entity.withdrawalTime = BigInt.fromI32(0); // reset withdrawal timer
  entity.save();
}

export function handleWithdrawalRequested(event: WithdrawalRequested): void {
  let id = event.params.user.toHex();
  let entity = UserDeposit.load(id);
  if (!entity) {
    entity = new UserDeposit(id);
  }
  entity.withdrawalTime = event.params.time;
  entity.save();
}

export function handleWithdrewDeposit(event: DepositWithdrew): void {
  let id = event.params.to.toHex();
  let entity = UserDeposit.load(id);
  if (!entity) {
    entity = new UserDeposit(id);
  }
  entity.amount = event.params.totalAmount;
  entity.withdrawalTime = BigInt.fromI32(0);
  entity.save();
}

export function handleJudgementCasted(event: JudgementCasted): void {
  let id = event.params.documentId.toHex();
  let entity = Judgement.load(id);
  if (!entity) {
    entity = new Judgement(id);
  }
  entity.accepted = event.params.accepted;
  entity.timestamp = event.block.timestamp;
  entity.save();
}
