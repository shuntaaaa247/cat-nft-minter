//テストネットへのデプロイ
const fs = require("fs");
const { ethers } = require("hardhat");
const main = async () => {
    //デプロイ
    const CatNFTMinter = await ethers.getContractFactory("CatNFTMinter");
    const catNFTMinter = await CatNFTMinter.deploy();
    await catNFTMinter.deployed();

    console.log(`Contract deployed to: https://goerli.etherscan.io/address/${catNFTMinter.address}`);
    fs.writeFileSync("./catNFTMinterContract.js",
    `
    module.exports = "${catNFTMinter.address}"
    `
    );
    //フロントエンドアプリが読み込む読み込むcontracts.jsを生成
    fs.writeFileSync("./Contract.js",
    `
    export const catNFTMinterAddress = "${catNFTMinter.address}"
    `
    );
}

const catNFTMinterDeploy = async () => {
    try{
        await main();
        // 正常終了は引数０
        process.exit(0);
    } catch(err) {
        //tryでエラーが起きた時
        console.log(err);
        process.exit(1);
    }
}

catNFTMinterDeploy();