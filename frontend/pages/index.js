import Head from 'next/head';
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import { catNFTMinterAddress } from "../../Contract"
import CatNFTMinter from '../contracts/CatNFTMinter.json';
import { Blocks } from "react-loader-spinner"
import Link from 'next/link';

export default function Home() {

  const goerliId = '0x5'
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState(false);

  const [isLoading, setLoading] = useState(false);

  //MetaMaskがインストールされているか
  const checkMetaMaskInstalled = () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert('MetaMaskをインストールしてください');
    } else {
      //ユーザーがアカウントを切り替えた時のために、accountsChangedイベント指定
      ethereum.on('accountsChanged', checkAccountChanged);
      //ユーザーがネットワークを切り替えた時のために、chainChangedイベント指定
      ethereum.on('chainChanged', checkChainId);
    }
  }

  //MetaMaskがGoerliに接続されているか

  const checkChainId = async () => {
    const { ethereum } = window;
    //MetaMaskがインストールされていた場合
    if (ethereum) {
      const chain = await ethereum.request({method: 'eth_chainId'});
      if (chain === goerliId) {
        setChainId(true);
      } else {
        allClear();
        //強制終了
        return;
      }
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      allClear();
      //選んだアカウントがaccountsの０番になる。アカウントを選ぶページに遷移
      const accounts = await ethereum.request({method: 'eth_requestAccounts'})
      setAccount(accounts[0]);
      
    } catch (err) {
      alert("エラーが発生しました");
    };
  };

  const checkAccountChanged = async() => {
    alert("アカウントが切り替わりました")
    allClear();
  }

  const allClear = () => {
    //初期化
    setAccount('');
    setChainId(false);
    //ネットワークを確認
    checkChainId();
  }

  const nftMint = async (event) => {
    event.preventDefault();
    try{
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();
      const catNFTMinterContract = new ethers.Contract(catNFTMinterAddress, CatNFTMinter.abi, signer);
      const tx = await catNFTMinterContract.nftMint();
      await tx.wait();
      setLoading(false);
      alert("NFTが発行されました!!!");
    } catch(err) {
      setLoading(false);
      alert("NFTの発行が中止されました");
    }
    
    
  }

  const startLoad = (event) => {
    event.preventDefault();
    setLoading(true);
    alert("ロードを開始します")
  }

  //初回レンダリング時
  useEffect(() => {
    checkMetaMaskInstalled();
    checkChainId();
  }, []);


  return (
    <>
      <Head>
        <title>Dot Cat NFT Minter</title>
      </Head>
      <div className={'flex flex-col items-center bg-gradient-to-br min-h-screen'}>
        <h1 className={'text-5xl mt-32 mb-10'}>ランダムなドット猫NFTをゲットしよう</h1>
        <div className={"flex flex-row"}>
            <img src = "cat1.svg" alt="My Happy SVG"/>
            <img src = "cat2.svg" alt="My Happy SVG"/>
            <img src = "cat3.svg" alt="My Happy SVG"/>
        </div>
        
        <p>your wallet address:{account}</p>
        <p>{isLoading}</p>
        {(!chainId) ? (
          <div className={"flex flex-col items-center"}>
            <p className={"mt-3 "}>MetaMaskがインストールされているかを確認し、Goerliテストネットワークに接続してください。</p>
          </div>
        ):(
        (account === '') ? (
          <div className={'flex flex-col items-center'}>
          <p className={"my-3"}>本番用ウォレットアカウントでの連携はお控えください。</p>
          <button className={'bg-transparent text-blue-700 front-semibold py-2 px-4 border border-blue-500 rounded hover:border-transparent hover:text-white hover:bg-blue-500 hover:cursor-pointer'} 
          onClick={connectWallet}>
          MetaMaskを連携
          </button>
          
          </div>
          
        ):(
          (isLoading) ? (
          <div>
          <p></p>
          <Blocks
          visible={true}
          height="80"
          width="80"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          />
          <p className={'mt-1'}>NFT発行中</p>
          </div>
          ) : (
          <div className={"w-full max-w-xs "}>
            <form>
            <button className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-5 mb-10"}
            onClick={nftMint}>NFTを発行</button>
            </form>
            <Link href={`https://testnets.opensea.io/${account}`} className={"underline"}>Check your NFTs on opensea testnet</Link>
            
          </div>
          )
        )
        )}
      </div>

    </>
  )
}
