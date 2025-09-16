// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PromptForgeNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    constructor()
      ERC721("PromptForgeNFT", "PFNFT")
      Ownable(msg.sender) {}

    function safeMint(string memory uri) public returns (uint256) {
        address to = msg.sender;
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        return tokenId;
    }
}