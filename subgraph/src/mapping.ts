import {
  DepositReceived,
  WithdrawalRequested,
  DepositContract,
} from "../generated/Deposit/DepositContract";
import {UserDeposit} from "../generated/schema";
import {log, BigInt} from "@graphprotocol/graph-ts";

let zeroAddress = "0x0000000000000000000000000000000000000000";

export function handleDepositReceived(event: DepositReceived): void {
  let id = event.params.from.toHex();
  let entity = UserDeposit.load(id);
  if (!entity) {
    entity = new UserDeposit(id);
  }
  entity.amount = event.params.amount;
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
