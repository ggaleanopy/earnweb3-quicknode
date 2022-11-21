Earnweb3-Quicknode Bounty

This repository is intended to fulfill the requirements of the "Deploy a smart contract using QuickNode's RPC's" bounty (https://learnweb3.io/bounties/9bff5d28-e773-4e7d-a32a-1306058af0f1).

A running demo is available at https://earnweb3-quicknode.vercel.app/

In order to clone and test the application two environment variables will be needed:

1) NFT_STORAGE_API_KEY => At https://nft.storage/docs/quickstart/#create-an-account you'll be able to create an account and get an API Key for the service
2) NFT_STORAGE_LINK =>  Add NFT_STORAGE_LINK to .env.local or set its value directly in the pages/index.js code 
    const NFT_STORAGE_LINK=https://nftstorage.link/ipfs/
