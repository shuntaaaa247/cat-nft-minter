const { ethers } = require("hardhat")

const main = async () => {
    CatNFTMinter = await ethers.getContractFactory("CatNFTMinter");
    catNFTMInter = await CatNFTMinter.deploy();
    await catNFTMInter.deployed();

    console.log(`コントラクトアドレス：${catNFTMInter.address}`);
}

const deploy = async () => {
    try{
        //以下のコードを実行してみる
        //main関数を実行
        await main();
        // 正常終了は引数０
        process.exit(0);
    } catch(err) {
        //tryでエラーが起きた時
        console.log(err);
        process.exit(1);
    }
}
deploy();