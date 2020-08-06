// import {TypedDataUtils,} from 'eth-sig-util'; // Fails to import // else we could use "common/eip712"

class EIP712Signer {
  constructor(struct) {
    this.eip712Struct = struct;
    const {types, domain, primaryType} = struct;
    (this.types = types), (this.domain = domain);
    this.primaryType = primaryType;
  }

  hash(message) {
    // return (
    //   '0x' +
    //   TypedDataUtils.sign({
    //     types: this.types,
    //     domain: this.domain,
    //     primaryType: this.primaryType,
    //     message,
    //   }).toString('hex')
    // );
  }

  construct(message) {
    return JSON.stringify({
      ...this.eip712Struct,
      message,
    });
  }

  recover(message) {}
}

const eip712Struct = {
  types: {
    EIP712Domain: [
      {name: 'name', type: 'string'},
      // {name: 'chainId', type: 'uint256'},
    ],
    Bet: [
      {name: 'documentId', type: 'bytes32'},
      {name: 'id', type: 'uint256'},
      {name: 'parentId', type: 'uint256'},
      // {name: 'isValid', type: 'bool'},
      {name: 'isValid', type: 'string'}, // TODO fix Metamask
      {name: 'timestamp', type: 'uint64'},
    ],
  },
  domain: {
    name: 'Judgement',
    // chainId,
  },
  primaryType: 'Bet',
};
const betSigner = new EIP712Signer(eip712Struct);

module.exports = {
  EIP712Signer,
  betSigner,
};
