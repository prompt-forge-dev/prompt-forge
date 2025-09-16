import { IconLayoutDashboard, IconPalette } from "@tabler/icons-react";
import type React from "react";

interface NavLinkConfig {
	label: string;
	href: string;
	icon?: React.FC;
}

export const navLinks: NavLinkConfig[] = [
	{ label: "Gallery", href: "/gallery", icon: IconLayoutDashboard },
	{ label: "Studio", href: "/studio", icon: IconPalette },
];
