import {
	Box,
	Button,
	Card,
	Center,
	Container,
	Grid,
	Group,
	Pagination,
	Text,
	Title,
} from "@mantine/core";
import { IconArrowRight, IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAccount } from "wagmi";
import { z } from "zod";

import { MintRecordsService } from "@/client";
import DataError from "@/components/Common/DataError";
import DataLoader from "@/components/Common/DataLoader";

const gallerySearchSchema = z.object({
	page: z.number().catch(1),
});

const PAGE_SIZE = 12;

export const Route = createFileRoute("/_layout/_auth/studio/")({
	component: MyStudioComponent,
	validateSearch: (search) => gallerySearchSchema.parse(search),
});

function MyStudioComponent() {
	const navigate = useNavigate({ from: Route.fullPath });
	const { page } = Route.useSearch();
	const { address } = useAccount();
	const {
		data: records,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["mint-records", address, { page }],
		queryFn: async () => {
			if (!address) return { count: 0, data: [] };

			return await MintRecordsService.getUserMintRecords({
				currentPage: page,
				pageSize: PAGE_SIZE,
				userAddress: address,
			});
		},
		enabled: !!address,
	});

	const setPage = (page: number) =>
		navigate({
			search: (prev: { page: number }) => ({ ...prev, page }),
		});

	if (isLoading) {
		return <DataLoader />;
	}

	if (error) {
		return <DataError message="Failed to load mint records" />;
	}

	if (records?.count === 0) {
		return (
			<Center style={{ minHeight: "60vh" }}>
				<Box ta="center">
					<Text size="xl" mb="md">
						You haven't forge any NFTs yet.
					</Text>
					<Link to="/studio/forge">
						<Button rightSection={<IconArrowRight size={16} />}>
							Go to Forge to create
						</Button>
					</Link>
				</Box>
			</Center>
		);
	}

	return (
		<Container size="xl" py="md" w="100%">
			<Group justify="space-between">
				<Title order={1} mb="sm">
					My Studio
				</Title>
				<Link to="/studio/forge">
					<Button leftSection={<IconPlus size={16} />}>Forge</Button>
				</Link>
			</Group>
			<Text c="dimmed" mb="xl">
				All your NFTs will be displayed here.
			</Text>

			<Grid>
				{records?.data.map((record) => (
					<Grid.Col key={record.id} span={{ base: 12, sm: 6, lg: 4 }}>
						<Card shadow="sm" padding="lg" radius="md">
							<Card.Section>
								<img
									src={`https://gateway.pinata.cloud/ipfs/${record.image_cid}`}
									alt={record.prompt}
									style={{ width: "100%", height: "auto", display: "block" }}
								/>
							</Card.Section>
							<Box mt="md">
								<Text fw={500} truncate="end">
									{record.prompt}
								</Text>
								<Text size="sm" c="dimmed">
									{new Date(record.timestamp).toLocaleDateString()}
								</Text>
							</Box>
						</Card>
					</Grid.Col>
				))}
			</Grid>

			{(records?.count ?? 0) && (
				<Group justify="center" mt="xl">
					<Pagination
						value={page}
						onChange={setPage}
						total={Math.ceil((records?.count ?? 0) / PAGE_SIZE)}
					/>
				</Group>
			)}
		</Container>
	);
}
