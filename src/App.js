import React,{useEffect,useState} from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

const getEthereumObject = () => window.ethereum;


const findMetaMaskAccount = async () => {
    try{
        const ethereum = getEthereumObject();
        if(!ethereum){
            console.log("Make sure you have Metamask!");
            return null;
            }
        console.log("We have the Ethereum object",ethereum);
        const accounts = await ethereum.request({methods:"eth_accounts"});
        
        if(accounts.length !==0){
            const account = accounts[0];
            console.log("Found an authoried account",account);
            return account;
            }else{
                console.log("No authorized account found");
                return null;
                }
        } catch (error){
            console.log(error);
            return null;
        }
    };


const App = () => {
  const [currentAccount,setCurrentAccount] = useState("");
  const contractAddress = '0x82250c6dA9eCF9C90aeF6136954145D565478F17';
  const connectWallet = async()={
      try{
          const ethereum = getEthereumObject();
          if(!ethereum){
              alert("Get MetaMask");
              return;
              }

          const accounts = await ethereum.request({
              methods:"eth_requestAccounts",});
          console.log("Connected",accounts[0]);
          setCurrentAccount(accounts[0]);
          } catch(error){
              console.log(error);
              }
      };

  useEffect(async () => {
      const account = await findMetaMaskAccount();
      if(account !== null){
          setCurrentAccount(account);
          }
      },[]);


  const wave = () => { 
      try {
          const {ethereum} = window;
          if(ethereum){
              const provider = new ethers.provider.Web3Provider(ethereum);
              const signer = provider.getSigner();
              cosnt wavePortalContract = new ethers.Contract(contractAddress,contractABI,signer);
              let count  = await wavePortalContract.getTotalWaves();
              console.log("Retrieved total wave count...",count.toNumber());
              
              const waveTxn = await wavePortalContract.wave();
              console.log("Mining...",waveTxn.hash);
              await waveTxn.wait();
              console.log("Minted--",waveTxn.hash);
              count = await wavePortalContract.getTotalWaves();
              console.log("Retrieved total wave count...",count.toNumber());

              }else{
                  console.log("Ethereum object does't exist!");
                  }
          }catch(error){
              console.log(error);}

  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
      </div>
    </div>
  );
}

export default App;
