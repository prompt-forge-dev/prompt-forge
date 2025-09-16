// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {PromptForgeNFT} from "./PromptForgeNFT.sol";
import {ERC721TokenReceiver} from "./utils/ERC721TokenReceiver.sol";

contract PromptForgeNFTTest is Test {
  PromptForgeNFT promptForgeNFT;

  // Test accounts
  address public user1 = address(0x1);
  address public user2 = address(0x2);

  function setUp() public {
    promptForgeNFT = new PromptForgeNFT();
  }

  function test_SafeMint_AnyoneCanMint() public {
    string memory uri = "https://example.com/nft/1";

    // Forge with user 1
    vm.prank(user1);
    promptForgeNFT.safeMint(uri);

    assertEq(promptForgeNFT.ownerOf(0), user1, "User 1 should own the first NFT");

    // Forge with user 2
    vm.prank(user2);
    promptForgeNFT.safeMint(uri);

    assertEq(promptForgeNFT.ownerOf(1), user2, "User 2 should own the second NFT");
  }

  function test_SafeMint_IncrementsTokenId() public {
    string memory uri = "https://example.com/nft/1";

    vm.prank(user1);
    uint256 tokenId1 = promptForgeNFT.safeMint(uri);
    assertEq(tokenId1, 0, "First token ID should be 0");

    vm.prank(user2);
    uint256 tokenId2 = promptForgeNFT.safeMint(uri);
    assertEq(tokenId2, 1, "Second token ID should be 1");
  }
}