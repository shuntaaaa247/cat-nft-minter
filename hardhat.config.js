require("@nomiclabs/hardhat-waffle");
//テストネットへのデプロイのため追加
require("dotenv").config();
//オープンソース化のため追加
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: "0.8.9",
  // テストネットに関する記述
  networks: {
    goerli: {
      //alchemyでcreate appした時に出るHTTPSを設定
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      //.envで記述した秘密鍵
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API
  },
};
