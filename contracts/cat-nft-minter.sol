//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract CatNFTMinter is ERC721URIStorage, ERC721Enumerable {

    using Counters for Counters.Counter;

    Counters.Counter private _lastTokenId;

    string[] colors = ["red", "orange", "yellow", "gold", "brown", "blue", "purple", "green", "gray", "black"];

    event NFTMinted(address indexed owner, uint256 indexed tokenId);

    constructor() ERC721("CatNFT", "CAT") {}

    function nftMint() public {
        _lastTokenId.increment();

        uint256 tokenId = _lastTokenId.current();

        // string[] memory randomColors;

        _safeMint(msg.sender, tokenId);

        // for (uint256 i=0; i < 5; i++) {
        //     uint256 index = uint256(keccak256(abi.encodePacked(tokenId, block.timestamp))) % colors.length;
        //     randomColors[i] = colors[index];
        // }

        bytes memory catSvg = _createCat(tokenId);

        bytes memory metadata = _createMetadata(catSvg);

        string memory uri = string(abi.encodePacked("data:application/json;base64,", Base64.encode(metadata)));

        _setTokenURI(tokenId, uri);

        emit NFTMinted(msg.sender, tokenId);
    }

    function _createCat(uint256 tokenId) view private returns (bytes memory) {

        uint256 firstIndex = uint256(keccak256(abi.encodePacked(tokenId++, block.timestamp)))%colors.length;
        uint256 secondIndex = uint256(keccak256(abi.encodePacked(tokenId++, block.timestamp)))%colors.length;
        uint256 thirdIndex = uint256(keccak256(abi.encodePacked(tokenId++, block.timestamp)))%colors.length;
        uint256 fourthIndex = uint256(keccak256(abi.encodePacked(tokenId++, block.timestamp)))%colors.length;
        uint256 fifthIndex = uint256(keccak256(abi.encodePacked(tokenId++, block.timestamp)))%colors.length;


        //CompilerError: Stack too deep when compiling inline assembly: Variable value0 is 2 slot(s) too deep inside the stack.の回避のため
        string memory secondPart = secondCreateCat(firstIndex, secondIndex, thirdIndex, fourthIndex, fifthIndex);
        string memory thirdPart = thirdCreateCat(firstIndex);

        return(
            abi.encodePacked(
                '<svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg"><rect fill="',
                colors[firstIndex],
                '" width="20" height="80" x="20" y="80" /><rect fill="',
                colors[firstIndex],
                '" width="20" height="60" x="40" y="40" /><rect fill="',
                colors[firstIndex],
                '" width="20" height="60" x="60" y="20" /><rect fill="',
                colors[firstIndex],
                '" width="20" height="40" x="80" y="40" /><rect fill="',
                colors[firstIndex],
                '" width="20" height="20" x="100" y="60" /><rect fill="',
                colors[firstIndex],
                '" width="40" height="100" x="120" y="60" /><rect fill="',
                colors[firstIndex],
                '" width="20" height="40" x="160" y="60" /><rect fill="',
                colors[firstIndex],
                '" width="20" height="20" x="180" y="60" /><rect fill="',
                colors[firstIndex],
                '" width="20" height="40" x="200" y="40" /><rect fill="',
                secondPart,
                thirdPart

                
            )
        );
    }

    function secondCreateCat(
        uint256 firstIndex, 
        uint256 secondIndex, 
        uint256 thirdIndex, 
        uint256 fourthIndex,
        uint256 fifthIndex
        ) view private returns(string memory) {
        return (
            string(abi.encodePacked(
                colors[firstIndex],
                '" width="20" height="60" x="220" y="20" /><rect fill="',
                colors[firstIndex],
                '" width="20" height="120" x="240" y="40" /><rect fill="',
                colors[firstIndex],
                '" width="20" height="80" x="260" y="80" /><rect fill="',
                colors[firstIndex],
                '" width="260" height="20" x="20" y="160" /><rect fill="',
                colors[firstIndex],
                '" width="220" height="20" x="40" y="180" /><rect fill="',
                colors[firstIndex],
                '" width="140" height="20" x="80" y="200" /><rect fill="',

                colors[secondIndex],
                '" width="20" height="40" x="60" y="100" /><rect fill="',
                colors[thirdIndex],
                '" width="20" height="40" x="180" y="100" /><rect fill="',

                colors[fourthIndex],
                '" width="100" height="20" x="100" y="220" /><rect fill="',
                colors[fifthIndex],
                '" width="20" height="20" x="120" y="220" /><rect fill="'
            ))
        );
    }

    function thirdCreateCat(uint256 firstIndex) view private returns(string memory) {
        return(
            string(abi.encodePacked(
                colors[firstIndex],
                '" width="140" height="40" x="100" y="240" /><rect fill="',
                colors[firstIndex],
                '" width="160" height="20" x="80" y="280" /><rect fill="',
                colors[firstIndex],
                '" width="40" height="20" x="240" y="260" /><rect fill="',
                colors[firstIndex],
                '" width="40" height="20" x="260" y="240" /><rect fill="',
                colors[firstIndex],
                '" width="20" height="20" x="280" y="220" /></svg>'
            ))
        );
    }

    function _createMetadata(bytes memory catSvg) private pure returns(bytes memory) {
        return(
            abi.encodePacked(
                '{"image": "data:image/svg+xml;base64,',
                Base64.encode(catSvg),
                '"}'
            )
        );
    }

    function chackNFTMintedCorrectly() public view returns(uint256) {
        return balanceOf(msg.sender);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId) public view virtual override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}