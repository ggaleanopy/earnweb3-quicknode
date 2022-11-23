Earnweb3 - NFT Simple Smart Contract deployed with Quicknode

This dApp allows to upload an image (JPEG or PNG, max. size: 3MB), store it (along with its metadata) using NFTStorage service and mint it to the Goerli Test Network.

A running demo is available at https://earnweb3-quicknode.vercel.app/

In order to clone and test the NextJS application two environment variables will be needed (.env.local):

1) NFT_STORAGE_API_KEY => At https://nft.storage/docs/quickstart/#create-an-account you'll be able to create an account and get an API Key for the service
2) NFT_STORAGE_LINK =>  Add NFT_STORAGE_LINK to .env.local or set its value directly in the pages/index.js code 
    const NFT_STORAGE_LINK=https://nftstorage.link/ipfs/
