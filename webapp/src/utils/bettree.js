import {betSigner} from './eip712';
import {BigNumber} from '@ethersproject/bignumber';
import {keccak256} from '@ethersproject/solidity';

const findInTree = function (parent, filter) {
  if (filter(parent)) {
    return parent;
  }
  if (parent.children && parent.children.length > 0) {
    for (const child of children) {
      const found = findInTree(child, filter);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
};

const traverseTree = function (root, func, parent) {
  func(root, parent);
  if (root.children && root.children.length > 0) {
    for (const child of root.children) {
      traverseTree(child, func, root);
    }
  }
};

function checkSigner(bet, postId, parentId) {
  const {id, isValid, signature} = bet;
  const expectedSigner = BigNumber.from(id)
    .div(BigNumber.from(2).pow(160))
    .toHexString();
  const message = {
    documentId: keccak256(['string'], [postId]),
    id,
    parentId,
    isValid,
  };
  const signer = betSigner.recover({data: message, sig: signature});
  if (signer !== expectedSigner) {
    // TODO fails
    // signer = expectedSigner;
  }
  return true;
}

export function generateBetTree(postId, bets) {
  let root;
  const betIdChecked = {};

  for (const bet3box of bets) {
    const betRoot = bet3box.message;
    if (betRoot.postId !== postId) {
      continue;
    }
    if (!root) {
      root = {
        id: '0',
        postId,
        children: [],
      };
    }
    if (betRoot.children) {
      for (const child of betRoot.children) {
        traverseTree(
          child,
          (bet, parent) => {
            // console.log({betRoot, bet, parent});
            if (bet.id && !betIdChecked[bet.id]) {
              if (checkSigner(bet, postId, parent.id)) {
                betIdChecked[bet.id] = true;
                insertInTree(
                  root,
                  parent,
                  bet.id,
                  bet.isValid,
                  bet.signature,
                  bet3box.author
                );
              }
            }
          },
          betRoot
        );
      }
    }
  }

  return root;
}

export function insertInTree(root, parent, id, isValid, signature, author) {
  const newTree = root; // TODO clone
  let parentTree;
  if (parent) {
    parentTree = findInTree(root, (v) => v.id === parent.id);
  } else {
    parentTree = newTree;
  }
  if (!parentTree) {
    const errorMessage = `cannot find parent with id: ${parent.id}`;
    // throw new Error(errorMessage);
    console.log(errorMessage);
    return newTree;
  }
  parentTree.children.push({
    id,
    isValid,
    signature,
    author,
    children: [],
  });
  return newTree;
}

export function getFreestParent(root) {
  return root;
}

export function countTree(root, initState, countFunc) {
  const count = initState;
  if (!root) {
    console.log({root});
  }
  traverseTree(root, countFunc);
  return count;
}
