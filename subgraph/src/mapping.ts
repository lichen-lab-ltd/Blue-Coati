import {
  DepositReceived,
  DepositContract,
} from "../generated/Deposit/DepositContract";
import {UserDeposit} from "../generated/schema";
import {log} from "@graphprotocol/graph-ts";

let zeroAddress = "0x0000000000000000000000000000000000000000";

export function handleDepositReceived(event: DepositReceived): void {
  let id = event.params.from.toHex();
  let entity = UserDeposit.load(id);
  if (!entity) {
    entity = new UserDeposit(id);
  }
  entity.amount = event.params.amount;
  entity.save();
}
