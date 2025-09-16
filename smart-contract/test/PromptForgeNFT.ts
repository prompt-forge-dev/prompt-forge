import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";

import { network } from "hardhat";

describe("PromptForgeNFT", async () => {
	// Change here: Use 'function' instead of arrow function
	const { viem } = await network.connect();
	let publicClient;
	let deployer;
	let user1;
	let user2;

	// We'll set these up in the beforeEach hook to ensure a clean state for each test
	let promptForgeNFT;

	beforeEach(async () => {
		// Change here: Use 'function' instead of arrow function
		publicClient = await viem.getPublicClient();
		[deployer, user1, user2] = await viem.getWalletClients();
		promptForgeNFT = await viem.deployContract("PromptForgeNFT");
	});

	it("Should allow any user to mint and own their NFT", async () => {
		const uri1 = "test_token_uri_1";
		const uri2 = "test_token_uri_2";

		// Use user1 to call safeMint
		const mintTx1 = await promptForgeNFT.write.safeMint([uri1], {
			account: user1.account,
		});
		await publicClient.waitForTransactionReceipt({ hash: mintTx1 });

		// Verify user1 owns the first NFT (tokenId 0)
		const ownerOfToken0 = await promptForgeNFT.read.ownerOf([0n]);
		assert.equal(
			ownerOfToken0.toLowerCase(),
			user1.account.address.toLowerCase(),
		);

		// Use user2 to call safeMint
		const mintTx2 = await promptForgeNFT.write.safeMint([uri2], {
			account: user2.account,
		});
		await publicClient.waitForTransactionReceipt({ hash: mintTx2 });

		// Verify user2 owns the second NFT (tokenId 1)
		const ownerOfToken1 = await promptForgeNFT.read.ownerOf([1n]);
		assert.equal(
			ownerOfToken1.toLowerCase(),
			user2.account.address.toLowerCase(),
		);
	});

	it("Should return an incrementing tokenId for each mint", async () => {
		const uri = "test_token_uri";

		// First mint
		const { result: tokenId0 } = await publicClient.simulateContract({
			account: user1.account,
			address: promptForgeNFT.address,
			abi: promptForgeNFT.abi,
			functionName: "safeMint",
			args: [uri],
		});
		assert.equal(tokenId0, 0n);

		await promptForgeNFT.write.safeMint([uri], { account: user1.account });

		// Second mint
		const { result: tokenId1 } = await publicClient.simulateContract({
			account: user2.account,
			address: promptForgeNFT.address,
			abi: promptForgeNFT.abi,
			functionName: "safeMint",
			args: [uri],
		});
		assert.equal(tokenId1, 1n);
	});
});
