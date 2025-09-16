import { NavLink } from "@mantine/core";
import type { IconProps } from "@tabler/icons-react";
import { Link, useLocation } from "@tanstack/react-router";
import type { ComponentType } from "react";

interface SidebarLinkProps {
	label: string;
	href: string;
	icon?: ComponentType<IconProps>;
	onClick?: () => void;
}

export const SidebarLink = ({
	label,
	href,
	icon: Icon,
	onClick,
}: SidebarLinkProps) => {
	const location = useLocation();
	const isActive = location.pathname === href;

	return (
		<NavLink
			component={Link}
			to={href}
			label={label}
			leftSection={Icon ? <Icon size={20} stroke={1.5} /> : null}
			active={isActive}
			onClick={onClick}
		/>
	);
};
