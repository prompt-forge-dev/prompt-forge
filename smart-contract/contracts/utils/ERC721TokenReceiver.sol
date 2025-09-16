// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

/**
 * @dev Mock contract to receive ERC721 tokens.
 * This is used for testing purposes.
 */
contract ERC721TokenReceiver is IERC721Receiver {
    // The onERC721Received function must return its own selector to be a valid receiver
    function onERC721Received(
        address /* operator */,
        address /* from */,
        uint256 /* tokenId */,
        bytes calldata /* data */
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}