<!--   -->

## SETUP

```
yarn
```

## START

```
yarn shell:dev
```

This will launch

- a graph-node (https://thegraph.com)
- an ethereum node on localhost:8545
- a webapp on localhost:5000

Plus it will deploy the contract and a subgraph

## WEBAPP

to add pages you have to

1. create a component in `pages` folder
2. list it in `pages/index.js`
3. associate it with a path in `routes.js`

## How to deploy on staging

### setup :

You need a mnemonic with first address enough test eth for deployment on rinkeby (default network)

save it as environment variable in : `.env.rinkeby`

### deploy smart contract on rinkeby

`yarn staging:contracts:deploy`

### deplpoy subgraph

You have to deploy the subgraph onto thegraph.com

create a subgraph on thegraph.com

replace `<thegraph-account>/blue-coati-rinkeby` wit the path of that graph on thegraph.com

add THEGRAPH_TOKEN in `.env`

`yarn staging:subgraph:deploy`

### build webapp

You then modify .env.staging to point to the subgraph endpoint

and run:

`yarn staging:webapp:build`

If it get stuck on `generating favicons...` restart the command

### publish website to ipfs

you can then upload the whole public folder in ipfs

### finally hook up to ens
