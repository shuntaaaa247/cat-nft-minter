const { inputToConfig } = require("@ethereum-waffle/compiler");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CatNFTMinterのテスト", async function() {
    let CatNFTMinter;
    const contractName = "CatNFTMinter";
    const tokenName = "CatNFT";
    const tokenSymbol = "CAT";
    let owner;
    let addr1;

    beforeEach(async function() {
        [owner, addr1] = await ethers.getSigners();
        CatNFTMinter = await ethers.getContractFactory(contractName);
        catNFTMinter = await CatNFTMinter.deploy();
        await catNFTMinter.deployed();
    });
    
    it("トークンの名前とシンボルがセットされるべき", async function(){
        expect(await catNFTMinter.name()).to.equal(tokenName);
        expect(await catNFTMinter.symbol()).to.equal(tokenSymbol);
    });

    it("しっかりNFTが発行が発行されるべき", async function(){
        await catNFTMinter.nftMint();
        await catNFTMinter.connect(addr1).nftMint();
        expect(await catNFTMinter.ownerOf(1)).to.equal(owner.address);
        expect(await catNFTMinter.ownerOf(2)).to.equal(addr1.address);
    });

    it("NFT発行後イベントが発行されるべき", async function(){
        await expect(catNFTMinter.nftMint()).to.emit(catNFTMinter, "NFTMinted").withArgs(owner.address, 1);
    });
})