import {
	AppShell,
	Burger,
	Button,
	Group,
	Menu,
	Modal,
	ScrollArea,
	Stack,
	Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconWallet } from "@tabler/icons-react";
import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";
import { useMemo } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { SidebarLink } from "@/components/Common/SidebarLink";
import { navLinks } from "@/constants/navLinks";

export const Route = createFileRoute("/_layout")({
	component: Layout,
});

function Layout() {
	const [navBarOpened, { toggle: toggleNavBar }] = useDisclosure();
	const [modalOpened, { open: openModal, close: closeModal }] =
		useDisclosure(false);
	const { isConnected, address } = useAccount();
	const { disconnect } = useDisconnect();
	const { connectors, connect } = useConnect();
	const matches = useMatches();

	// Check if the current route matches _auth.tsx
	const isAuthenticatedRoute = matches.some((match) =>
		match.routeId.includes("_auth"),
	);

	const normalized_address = useMemo(() => {
		if (!isConnected || !address) return null;

		let lowered = address.toLowerCase();
		lowered = lowered.startsWith("0x") ? lowered.slice(2) : lowered;

		return `${lowered.slice(0, 4)}...${lowered.slice(-4)}`;
	}, [isConnected, address]);

	return (
		<AppShell
			header={{ height: 60 }}
			navbar={{
				width: 250,
				breakpoint: "sm", // navbar hides on smaller than 'sm'
				collapsed: { mobile: !navBarOpened },
			}}
			padding="md"
		>
			<AppShell.Header className="shadow-xs">
				<Group h="100%" justify="space-between" wrap="nowrap" px="md">
					<Group h="100%" className="flex-1">
						<Burger
							opened={navBarOpened}
							onClick={toggleNavBar}
							hiddenFrom="sm"
							size="sm"
						/>
						<Text fw={700}>Prompt Forge</Text>
					</Group>
					<Group>
						{isConnected ? (
							<Menu shadow="md" width={200} position="bottom-end" withArrow>
								<Menu.Target>
									<div>{normalized_address}</div>
								</Menu.Target>

								<Menu.Dropdown>
									<Menu.Item onClick={() => disconnect()} color="red">
										Disconnect
									</Menu.Item>
								</Menu.Dropdown>
							</Menu>
						) : (
							<Button
								onClick={openModal}
								variant="filled"
								leftSection={<IconWallet size={16} />}
							>
								Connect Wallet
							</Button>
						)}
					</Group>
				</Group>
			</AppShell.Header>

			<AppShell.Navbar p="md" className="shadow-xs">
				<ScrollArea>
					{navLinks.map((link) => (
						<SidebarLink
							key={link.href}
							label={link.label}
							href={link.href}
							icon={link.icon}
						/>
					))}
				</ScrollArea>
			</AppShell.Navbar>

			<AppShell.Main
				style={{
					display: "flex",
					flexDirection: "column",
				}}
			>
				{isAuthenticatedRoute && !isConnected ? (
					<Stack className="flex-1" align="center" justify="center" gap="md">
						<Text fw={700}>Prompt Forge</Text>
						<Button
							onClick={openModal}
							variant="filled"
							leftSection={<IconWallet size={16} />}
						>
							Connect Wallet
						</Button>
					</Stack>
				) : (
					<Outlet />
				)}
			</AppShell.Main>

			<Modal
				opened={modalOpened}
				onClose={closeModal}
				title="Choose Wallet"
				centered
			>
				<Stack>
					{connectors.map((connector) => (
						<Button
							key={connector.uid}
							onClick={() => {
								connect({ connector });
								closeModal();
							}}
						>
							{connector.name}
						</Button>
					))}
				</Stack>
			</Modal>
		</AppShell>
	);
}
