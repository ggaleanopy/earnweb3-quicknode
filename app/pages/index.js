import React, { useEffect, useRef, useState } from "react";
import { create as ipfsHttpClient } from "ipfs-http-client";
import Web3Modal from "web3modal";
import { Contract, providers, utils } from "ethers";
import truncateEthAddress from 'truncate-eth-address';
import classNames from "classnames";
import toast, { Toaster } from "react-hot-toast";
import { MdOutlineClose } from "react-icons/md";
import { FaEthereum } from "react-icons/fa";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { abi, NFT_CONTRACT_ADDRESS } from "../constants";
import { NFTStorage } from 'nft.storage'

const notify = () =>
  toast.custom(
    (t) => (
      <div
        className={classNames([
          "flex flex-row items-center justify-between w-96 bg-gray-900 px-4 py-6 text-white shadow-2xl hover:shadow-none transform-gpu translate-y-0 hover:translate-y-1 rounded-xl relative transition-all duration-1000 ease-in-out",
          t.visible ? "top-0" : "-top-96",
        ])}
      >
        <div className="text-xl">
          <FaEthereum />
        </div>
        <div className="flex flex-col items-start justify-center ml-4 cursor-default">
          <h1 className="text-base text-gray-200 font-semibold leading-none tracking-wider">Transaction Completed</h1>
          <p className="text-sm text-gray-400 mt-2 leading-relaxed tracking-wider">
            An brand new NFT was minted with the image you upload using NFTStorage and Quicknode. Congratulations!!!
          </p>
        </div>
        <div className="absolute top-2 right-2 cursor-pointer text-lg" onClick={() => toast.dismiss(t.id)}>
          <MdOutlineClose />
        </div>
      </div>
    ),
    { id: "unique-notification", position: "top-center" }
  );


export default function Home() {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [url, setUrl] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [tokenIdsMinted, setTokenIdsMinted] = useState("0");
  const web3ModalRef = useRef();

  const handleFile = (e) => {
    setMessage("");
    const newFiles = [];
    let file = e.target.files;
    const message = "";
    for (let i = 0; i < file.length; i++) {
      const fileType = file[i]['type'];
      const validImageTypes = ['image/jpeg', 'image/png'];
      console.log(file[i].size / 1024 / 1024);
      if (!validImageTypes.includes(fileType)) {
        setMessage("Only images of types jpeg and png are allowed");
        return;
      }

      if ((file[i].size / 1024 / 1024) > 3) {
        setMessage("Image file must be less than 3 MB");
        return;
      }

      newFiles.push(file[i]);
    }

    setFiles(newFiles);
    e.target.value = null;
  }

  useEffect(() => {
    setDisabled(files.length === 0);
  }, [files]);

  const removeImage = (i) => {
    setFiles(files.filter(x => x.name !== i));
  }

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      throw new Error("Change network to Goerli");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  useEffect(() => {
    if (!connected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [connected]);

  useEffect(() => {
    if (parseInt(tokenIdsMinted) > 0) {
      setSuccess("The token #" + tokenIdsMinted + " of the EarnWeb3 Quicknode Bounty NFT Collection has been minted to the address: " + address + ".");
      setUrl("https://goerli.etherscan.io/address/" + NFT_CONTRACT_ADDRESS);
    }
  }, [tokenIdsMinted, address, url]);

  const connectWallet = async () => {
    try {
      const web3Provider = await getProviderOrSigner();
      const userAddress = await web3Provider.getSigner().getAddress()
      setConnected(true)
      setAddress(userAddress)
    } catch (err) {
      console.error(err);
    }
  };

  //At https://nft.storage/docs/quickstart/#create-an-account you'll be able to create an account and
  //then get an API Key for the service
  const API_KEY = process.env.NFT_STORAGE_API_KEY;
  //Add NFT_STORAGE_LINK to .env.local or set its value directly here: 
  //NFT_STORAGE_LINK=https://nftstorage.link/ipfs/
  const NFT_STORAGE_LINK = process.env.NFT_STORAGE_LINK;

  const getTokenIdsMinted = async () => {
    const provider = await getProviderOrSigner();
    const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
    const _tokenIds = await nftContract._tokenIds();
    setTokenIdsMinted(_tokenIds.toString());
  };

  const mintEarnWeb3NFT = async (address, tokenUri) => {
    const signer = await getProviderOrSigner(true);
    const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
    const tx = await nftContract.mintNFT(tokenUri);
    await tx.wait();
  };

  const storeEarnWeb3NFT = async (image) => {
    const nft = {
      image,
      name: "EarnWeb3 Quicknode Bounty NFT",
      description: "EarnWeb3 NFT",
    }

    const client = new NFTStorage({ token: API_KEY });
    const metadata = await client.store(nft);
    const tokenUri = metadata.url.replace("ipfs://", NFT_STORAGE_LINK);
    return tokenUri;
  }

  const uploadAndMint = async () => {
    try {
      setMessage("");
      setLoading(true);

      if (!files || files.length === 0) {
        throw new Error("No files selected");
      }

      const file = files[0];
      const tokenUri = await storeEarnWeb3NFT(file);
      await mintEarnWeb3NFT(address, tokenUri);
      await getTokenIdsMinted();

      removeImage(file.name);
      setLoading(false);
      notify();
    }
    catch (err) {
      setMessage(err.toString());
      console.error(err.toString());
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="h-screen flex justify-center items-center bg-sky-100 px-2">
        <div className="p-3 md:w-1/2 w-[360px] rounded-md">
          <span className="flex justify-center items-center bg-white text-[14px] font-bold mb-1 text-red-500">{message}</span>
          <span className="flex text-[13px] font-bold mb-1 text-blue-900">{success}</span>
          <span className="flex text-[13px] font-bold mb-1 text-blue-900" style={{ visibility: success !== '' ? 'visible' : 'hidden' }}>You can review the transaction here:&nbsp;<a href={url} target="_blank" rel="noreferrer" className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600">Goerli Test Explorer</a></span>
          <div className="h-32 w-full overflow-hidden relative shadow-md border-2 items-center rounded-md border-gray-400 border-dotted">
            <input type="file" onClick={() => setSuccess("")} onChange={handleFile} className="h-full w-full opacity-0 z-10 absolute cursor-pointer" name="files[]" />
            <div className="h-full w-full bg-gray-200 absolute z-1 flex justify-center items-center top-0">
              <div className="flex flex-col">
                <i className="mdi mdi-folder-open text-[30px] text-gray-400 text-center"></i>
                <span className="text-[12px]">{`Drag and Drop a file`}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 mb-2">
            {files.map((file, key) => {
              return (
                <div key={key} className='w-full h-18 flex items-center justify-between rounded p-3 bg-white'>
                  <div className="flex flex-row items-center gap-2">
                    <div className="h-16 w-16 ">
                      <img className="w-full h-full rounded" src={URL.createObjectURL(file)} />
                    </div>
                    <span className="truncate w-44">{file.name}</span>
                  </div>
                  <div onClick={() => { removeImage(file.name) }} className="h-6 w-6 bg-red-400 flex items-center cursor-pointer justify-center rounded-sm">
                    <i className="mdi mdi-trash-can text-white text-[14px]"></i>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex space-x-2 justify-center mb-4">
            <button type="button"
              id="btnConnectWallet"
              title={address}
              onClick={connectWallet}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
              {connected ? truncateEthAddress(address) : "Connect Wallet"}
            </button>
            <button type="button"
              onClick={() => setConfirmOpen(true)}
              className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${disabled ? "rounded opacity-50 cursor-not-allowed" : ""} `}
              disabled={disabled}>
              Upload image to NFTStorage and Mint NFT
            </button>
            <Toaster />
          </div>
          <span
            className="flex text-[13px] mb-1 text-blue-700 justify-center items-center bg-gray-200 rounded-md border-gray-400 border-solid border-2"
          >
            This dApp allows to upload an image (JPEG or PNG, max. size: 3MB), store it (along with its metadata) using NFTStorage service and mint it to the Goerli Test Network. The smart contract was deployed using Quicknode's RPC's.

          </span>
          <span
            className="flex text-[13px] mb-1 text-blue-700 justify-center items-center bg-gray-200 rounded-md border-gray-400 border-double border-4"
          >
            &copy; {(new Date()).getFullYear()}&nbsp;-&nbsp;<a className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href="https://gustavogaleano.com/" target="_blank" rel="noreferrer">Gustavo Galeano</a>
          </span>
        </div>
      </div>

      <div className="loading" style={{ visibility: loading ? 'visible' : 'hidden' }}>
        <div className="loader"></div>
      </div>
      <div>
        <ConfirmDialog
          title="Transaction Confirmation"
          open={confirmOpen}
          setOpen={setConfirmOpen}
          onConfirm={uploadAndMint}
        >
          The selected image will be uploaded to NFTStorage and an NFT will be minted. Are you sure you want to proceed?
        </ConfirmDialog>
      </div>

    </div>

  )
}