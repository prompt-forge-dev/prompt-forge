"use client";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import type { PropsWithChildren } from "react";
import { WagmiProvider } from "wagmi";
import theme from "@/theme";
import { config } from "@/utils/wagmi";

import SyncDarkMode from "../Common/SyncDarkMode";

export function CustomProvider(props: PropsWithChildren) {
	return (
		<>
			<ColorSchemeScript />
			<WagmiProvider config={config}>
				<MantineProvider theme={theme} defaultColorScheme="dark">
					<Notifications />
					<SyncDarkMode />
					{props.children}
				</MantineProvider>
			</WagmiProvider>
		</>
	);
}
