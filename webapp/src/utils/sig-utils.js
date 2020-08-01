// Copied from eth-sig-util : TODO conver to use ethers.js
const TYPED_MESSAGE_SCHEMA = {
  type: 'object',
  properties: {
    types: {
      type: 'object',
      additionalProperties: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {type: 'string'},
            type: {type: 'string'},
          },
          required: ['name', 'type'],
        },
      },
    },
    primaryType: {type: 'string'},
    domain: {type: 'object'},
    message: {type: 'object'},
  },
  required: ['types', 'primaryType', 'domain', 'message'],
};

const TypedDataUtils = {
  encodeData(primaryType, data, types, useV4 = true) {
    const encodedTypes = ['bytes32'];
    const encodedValues = [this.hashType(primaryType, types)];

    if (useV4) {
      const encodeField = (name, type, value) => {
        if (types[type] !== undefined) {
          // eslint-disable-next-line no-eq-null
          return [
            'bytes32',
            value == null
              ? '0x0000000000000000000000000000000000000000000000000000000000000000'
              : ethUtil.sha3(this.encodeData(type, value, types, useV4)),
          ];
        }

        if (value === undefined) {
          throw new Error(`missing value for field ${name} of type ${type}`);
        }

        if (type === 'bytes') {
          return ['bytes32', ethUtil.sha3(value)];
        }

        if (type === 'string') {
          // convert string to buffer - prevents ethUtil from interpreting strings like '0xabcd' as hex
          if (typeof value === 'string') {
            value = Buffer.from(value, 'utf8');
          }
          return ['bytes32', ethUtil.sha3(value)];
        }

        if (type.lastIndexOf(']') === type.length - 1) {
          const parsedType = type.slice(0, type.lastIndexOf('['));
          const typeValuePairs = value.map((item) =>
            encodeField(name, parsedType, item)
          );
          return [
            'bytes32',
            ethUtil.sha3(
              ethAbi.rawEncode(
                typeValuePairs.map(([t]) => t),
                typeValuePairs.map(([, v]) => v)
              )
            ),
          ];
        }

        return [type, value];
      };

      for (const field of types[primaryType]) {
        const [type, value] = encodeField(
          field.name,
          field.type,
          data[field.name]
        );
        encodedTypes.push(type);
        encodedValues.push(value);
      }
    } else {
      for (const field of types[primaryType]) {
        let value = data[field.name];
        if (value !== undefined) {
          if (field.type === 'bytes') {
            encodedTypes.push('bytes32');
            value = ethUtil.sha3(value);
            encodedValues.push(value);
          } else if (field.type === 'string') {
            encodedTypes.push('bytes32');
            // convert string to buffer - prevents ethUtil from interpreting strings like '0xabcd' as hex
            if (typeof value === 'string') {
              value = Buffer.from(value, 'utf8');
            }
            value = ethUtil.sha3(value);
            encodedValues.push(value);
          } else if (types[field.type] !== undefined) {
            encodedTypes.push('bytes32');
            value = ethUtil.sha3(
              this.encodeData(field.type, value, types, useV4)
            );
            encodedValues.push(value);
          } else if (field.type.lastIndexOf(']') === field.type.length - 1) {
            throw new Error(
              'Arrays are unimplemented in encodeData; use V4 extension'
            );
          } else {
            encodedTypes.push(field.type);
            encodedValues.push(value);
          }
        }
      }
    }

    return ethAbi.rawEncode(encodedTypes, encodedValues);
  },

  encodeType(primaryType, types) {
    let result = '';
    let deps = this.findTypeDependencies(primaryType, types).filter(
      (dep) => dep !== primaryType
    );
    deps = [primaryType].concat(deps.sort());
    for (const type of deps) {
      const children = types[type];
      if (!children) {
        throw new Error(`No type definition specified: ${type}`);
      }
      result += `${type}(${types[type]
        .map(({name, type: t}) => `${t} ${name}`)
        .join(',')})`;
    }
    return result;
  },

  findTypeDependencies(primaryType, types, results = []) {
    [primaryType] = primaryType.match(/^\w*/u);
    if (results.includes(primaryType) || types[primaryType] === undefined) {
      return results;
    }
    results.push(primaryType);
    for (const field of types[primaryType]) {
      for (const dep of this.findTypeDependencies(field.type, types, results)) {
        !results.includes(dep) && results.push(dep);
      }
    }
    return results;
  },

  hashStruct(primaryType, data, types, useV4 = true) {
    return ethUtil.sha3(this.encodeData(primaryType, data, types, useV4));
  },

  hashType(primaryType, types) {
    return ethUtil.sha3(this.encodeType(primaryType, types));
  },

  sanitizeData(data) {
    const sanitizedData = {};
    for (const key in TYPED_MESSAGE_SCHEMA.properties) {
      if (data[key]) {
        sanitizedData[key] = data[key];
      }
    }
    if ('types' in sanitizedData) {
      sanitizedData.types = {EIP712Domain: [], ...sanitizedData.types};
    }
    return sanitizedData;
  },

  sign(typedData, useV4 = true) {
    const sanitizedData = this.sanitizeData(typedData);
    const parts = [Buffer.from('1901', 'hex')];
    parts.push(
      this.hashStruct(
        'EIP712Domain',
        sanitizedData.domain,
        sanitizedData.types,
        useV4
      )
    );
    if (sanitizedData.primaryType !== 'EIP712Domain') {
      parts.push(
        this.hashStruct(
          sanitizedData.primaryType,
          sanitizedData.message,
          sanitizedData.types,
          useV4
        )
      );
    }
    return ethUtil.sha3(Buffer.concat(parts));
  },
};

function personalSign(privateKey, msgParams) {
  const message = ethUtil.toBuffer(msgParams.data);
  const msgHash = ethUtil.hashPersonalMessage(message);
  const sig = ethUtil.ecsign(msgHash, privateKey);
  const serialized = ethUtil.bufferToHex(concatSig(sig.v, sig.r, sig.s));
  return serialized;
}

function recoverPersonalSignature(msgParams) {
  const publicKey = getPublicKeyFor(msgParams);
  const sender = ethUtil.publicToAddress(publicKey);
  const senderHex = ethUtil.bufferToHex(sender);
  return senderHex;
}

function externalTypedSignatureHash(typedData) {
  const hashBuffer = typedSignatureHash(typedData);
  return ethUtil.bufferToHex(hashBuffer);
}

function signTypedDataLegacy(privateKey, msgParams) {
  const msgHash = typedSignatureHash(msgParams.data);
  const sig = ethUtil.ecsign(msgHash, privateKey);
  return ethUtil.bufferToHex(concatSig(sig.v, sig.r, sig.s));
}

function recoverTypedSignatureLegacy(msgParams) {
  const msgHash = typedSignatureHash(msgParams.data);
  const publicKey = recoverPublicKey(msgHash, msgParams.sig);
  const sender = ethUtil.publicToAddress(publicKey);
  return ethUtil.bufferToHex(sender);
}

/**
 * A generic entry point for all typed data methods to be passed, includes a version parameter.
 */
function signTypedMessage(privateKey, msgParams, version = 'V4') {
  switch (version) {
    case 'V1':
      return signTypedDataLegacy(privateKey, msgParams);
    case 'V3':
      return signTypedData(privateKey, msgParams);
    case 'V4':
    default:
      return signTypedData_v4(privateKey, msgParams);
  }
}

function recoverTypedMessage(msgParams, version = 'V4') {
  switch (version) {
    case 'V1':
      return recoverTypedSignatureLegacy(msgParams);
    case 'V3':
      return recoverTypedSignature(msgParams);
    case 'V4':
    default:
      return recoverTypedSignature_v4(msgParams);
  }
}

function signTypedData(privateKey, msgParams) {
  const message = TypedDataUtils.sign(msgParams.data, false);
  const sig = ethUtil.ecsign(message, privateKey);
  return ethUtil.bufferToHex(concatSig(sig.v, sig.r, sig.s));
}

function signTypedData_v4(privateKey, msgParams) {
  const message = TypedDataUtils.sign(msgParams.data);
  const sig = ethUtil.ecsign(message, privateKey);
  return ethUtil.bufferToHex(concatSig(sig.v, sig.r, sig.s));
}

function recoverTypedSignature(msgParams) {
  const message = TypedDataUtils.sign(msgParams.data, false);
  const publicKey = recoverPublicKey(message, msgParams.sig);
  const sender = ethUtil.publicToAddress(publicKey);
  return ethUtil.bufferToHex(sender);
}

function recoverTypedSignature_v4(msgParams) {
  const message = TypedDataUtils.sign(msgParams.data);
  const publicKey = recoverPublicKey(message, msgParams.sig);
  const sender = ethUtil.publicToAddress(publicKey);
  return ethUtil.bufferToHex(sender);
}

export {
  TYPED_MESSAGE_SCHEMA,
  TypedDataUtils,
  personalSign,
  recoverPersonalSignature,
  externalTypedSignatureHash as typedSignatureHash,
  signTypedDataLegacy,
  recoverTypedSignatureLegacy,
  signTypedMessage,
  recoverTypedMessage,
  signTypedData,
  signTypedData_v4,
  recoverTypedSignature,
  recoverTypedSignature_v4,
};

/**
 * @param typedData - Array of data along with types, as per EIP712.
 * @returns Buffer
 */
function typedSignatureHash(typedData) {
  const error = new Error('Expect argument to be non-empty array');
  if (
    typeof typedData !== 'object' ||
    !('length' in typedData) ||
    !typedData.length
  ) {
    throw error;
  }

  const data = typedData.map(function (e) {
    return e.type === 'bytes' ? ethUtil.toBuffer(e.value) : e.value;
  });
  const types = typedData.map(function (e) {
    return e.type;
  });
  const schema = typedData.map(function (e) {
    if (!e.name) {
      throw error;
    }
    return `${e.type} ${e.name}`;
  });

  return ethAbi.soliditySHA3(
    ['bytes32', 'bytes32'],
    [
      ethAbi.soliditySHA3(new Array(typedData.length).fill('string'), schema),
      ethAbi.soliditySHA3(types, data),
    ]
  );
}
