import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("PromptForgeNFTModule", (m) => {
  const promptForgedNFT = m.contract("PromptForgeNFT");

  const uri = "https://yellow-immediate-tuna-425.mypinata.cloud/ipfs/QmTvZ8i6wojEitie2b7Yn7ZaUfMhwLSvAYF8uXoCZwi9SL";

  m.call(promptForgedNFT, "safeMint", [uri]);

  return { promptForgedNFT };
});
