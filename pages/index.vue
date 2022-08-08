<template>
  <div>
    <div class="flex flex-col items-center justify-center h-full space-y-4 text-xl">
      <span v-if="PUBLIC_KEY" v-text="PUBLIC_KEY"/>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="onConnect" v-text="'onConnect'"/>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="onMint" v-text="'MINT'"/>
      <pre v-text="data" />
      <div v-text="'NFTS MINTED DATA'" />
      <pre v-text="NFTS_DATA" style="width: 100%"/>
      <!--<pre v-text="nftContract" />-->
    </div>
  </div>
</template>

<script setup>
import {
  marketplaceAddress
} from '../config'
import NFTMarketplace from '../artifacts/contracts/MyNFT.sol/Alchemy.json'
import { createAlchemyWeb3 } from "@alch/alchemy-web3";

const { $web3Modal:web3Modal } = useNuxtApp()
const config = useRuntimeConfig()
// Using HTTPS
const web3 = createAlchemyWeb3(config.API_URL);
const data = await web3.alchemy.getNfts({owner: marketplaceAddress})
const nftContract = new web3.eth.Contract(NFTMarketplace.abi, marketplaceAddress);
const PUBLIC_KEY  = ref('');
const NFTS_DATA  = ref('');


const onConnect = async () => {
  const provider = await web3Modal.connect();
  // Subscribe to accounts change
  provider.on("accountsChanged", (accounts) => {
    console.log(accounts);
  });

// Subscribe to chainId change
  provider.on("chainChanged", (chainId) => {
    console.log(chainId);
  });

// Subscribe to provider connection
  provider.on("connect", (info) => {
    console.log(info);
  });

// Subscribe to provider disconnection
  provider.on("disconnect", (error) => {
    console.log(error);
  });
  web3.setWriteProvider(provider);
  const accounts = await web3.eth.getAccounts();
  PUBLIC_KEY.value = accounts[0];
  console.log("PUBLIC_KEY", PUBLIC_KEY);
}

const onMint = () =>{
  mintNFT("https://gateway.pinata.cloud/ipfs/QmZ3nSYnY43Bzh7vW5xv8NWDK56K16rQLGD1TLcmSxW5wY");
}

const mintNFT = async (tokenURI)=> {
  console.log("PUBLIC_KEY", PUBLIC_KEY.value);
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY.value, 'latest'); //get latest nonce
  console.log(nonce)
  //the transaction
  const tx = {
    'from': PUBLIC_KEY.value,
    'to': marketplaceAddress,
    'data': nftContract.methods.safeMint(PUBLIC_KEY.value, tokenURI).encodeABI()
  };
  console.log(tx);
  console.log("minting.....");
  // const signedTx = await web3.eth.accounts.signTransaction(tx);//, config.PRIVATE_KEY);
  // const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  try {
    const txHash = await window.ethereum
        .request({
          method: 'eth_sendTransaction',
          params: [tx],
        });
    NFTS_DATA.value = txHash;
    console.log("minting done! 🎉");
    console.log("✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash);
  } catch (error) {
    console.log("😥 Something went wrong: " + error.message);
  }

}

</script>
