import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { metaMask, walletConnect } from "wagmi/connectors";

export const config = createConfig({
	chains: [sepolia],
	connectors: [
		metaMask(),
		walletConnect({ projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID }),
	],
	transports: {
		[sepolia.id]: http(),
	},
});

declare module "wagmi" {
	interface Register {
		config: typeof config;
	}
}
