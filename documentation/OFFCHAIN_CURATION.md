With the current centralised internet, user gives control to their data to third party entities. Such entities are able to censor content they deemed false or inapropriate. This is often abused for pollitical reason.

Web3 aims to solve that by oferring user-controlled data and censorship resistence. The later is a problem though as censorship is many times a required feature for communities, especially for vulnerable communities like children. In the web2 ecosystem such censure is unfortunately in control of third party that as mentioned often abuse it for political purpse (sometime under pressure from governments).

Vitalik Butterin proposed a [solution](https://ethresear.ch/t/prediction-markets-for-content-curation-daos/1312) to allow application to provide "good censorship" without requiring the application "owner" to be on constant watch. Unfortunately the solution as stated require on-chain tx, proving a negative incentive to participate.

Blue-coati solve the latter by implementation a solution that allow curator to simply sign off-chain messages to bet. The only requirement is that they first stake a deposit. We use a clever mechanism for counting vote that avoid the need for bet to be on-chain unless a dispute is to be resolved.

Blue-coati is a server less aplication, relying on ipfs for storage of all content through the use of 3box/orbit-db. All bet counting logic is performed on the client.

Judges can decide to judge on a particular content.

Once this done, bettors that succesfully predicted the outcome can punish the other side and get potentially rewarded.

Judgement can still be appealed through a decentralised court system like [Kleros](https://kleros.io/) where judges (moderators) would have stake a slashable deposit.
