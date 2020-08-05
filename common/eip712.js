const {signTypedMessage} = require("eth-sig-util");
const {arrayify} = require("@ethersproject/bytes");

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

  sign(privateKey, message) {
    const sanitizedMessage = {...message};
    for (const field of Object.keys(sanitizedMessage)) {
      const value = sanitizedMessage[field];
      if (value && value._isBigNumber) {
        sanitizedMessage[field] = value.toString();
      }
    }
    const msgParams = {
      data: {
        ...this.eip712Struct,
        message: sanitizedMessage,
      },
    };
    // console.log(JSON.stringify(msgParams, null, "  "));
    return signTypedMessage(arrayify(privateKey), msgParams);
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
      {name: "name", type: "string"},
      // {name: 'chainId', type: 'uint256'},
    ],
    Bet: [
      {name: "documentId", type: "bytes32"},
      {name: "id", type: "uint256"},
      {name: "parentId", type: "uint256"},
      // {name: 'isValid', type: 'bool'},
      {name: "isValid", type: "string"}, // TODO fix Metamask
      {name: "timestamp", type: "uint64"},
    ],
  },
  domain: {
    name: "Judgement",
    // chainId,
  },
  primaryType: "Bet",
};
const betSigner = new EIP712Signer(eip712Struct);

module.exports = {
  EIP712Signer,
  betSigner,
};
