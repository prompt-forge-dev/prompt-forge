import {
	Alert,
	Box,
	Button,
	Card,
	Container,
	Grid,
	Group,
	Loader,
	Text,
	Title,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useAccount } from "wagmi";
import { z } from "zod";

import { MintRecordsService } from "@/client";

const mintRecordsSearchSchema = z.object({
	page: z.number().catch(1),
	filter: z.enum(["mine"]).optional(),
});

const PAGE_SIZE = 15;

function getRecordsQueryOptions({
	page,
	userAddress,
}: {
	page: number;
	userAddress: string | null;
}) {
	return {
		queryFn: () => {
			if (!userAddress) {
				return MintRecordsService.getMintRecords({
					currentPage: page,
					pageSize: PAGE_SIZE,
				});
			} else {
				return MintRecordsService.getUserMintRecords({
					currentPage: page,
					pageSize: PAGE_SIZE,
					userAddress: userAddress,
				});
			}
		},
		queryKey: userAddress ? ["mint-records", userAddress] : ["mint-records"],
	};
}

export const Route = createFileRoute("/_layout/mint-records")({
	component: MintRecords,
	validateSearch: (search) => mintRecordsSearchSchema.parse(search),
});

function MintRecords() {
	const { address } = useAccount();
	const { page, filter } = Route.useSearch();

	const queryOptions = getRecordsQueryOptions({
		page: page,
		userAddress: filter === "mine" ? (address as string) : null,
	});
	const { data: records, isLoading, error } = useQuery(queryOptions);

	if (isLoading) {
		return (
			<Container>
				<Loader />
				<Text>Loading...</Text>
			</Container>
		);
	}

	if (error) {
		return (
			<Container>
				<Alert icon={<IconAlertCircle />} title="錯誤" color="red">
					"Failed to get mint records"
				</Alert>
			</Container>
		);
	}

	return (
		<Container size="xl" py="xl">
			<Title order={1} mb="lg">
				{filter === "mine" ? "My Records" : "All Records"}
			</Title>
			{/* 新增切換按鈕 */}
			<Group mb="md">
				<Link to="/mint-records" search={{ page: 1, filter: undefined }}>
					<Button variant={filter === "mine" ? "default" : "filled"}>
						All NFTs
					</Button>
				</Link>
				{address && (
					<Link to="/mint-records" search={{ page: 1, filter: "mine" }}>
						<Button variant={filter === "mine" ? "filled" : "default"}>
							My NFTs
						</Button>
					</Link>
				)}
			</Group>
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
                <Text>{record.prompt}</Text>
                <Text size="sm" mt="xs">
                  Minter: {record.user_address.substring(0, 6)}...
                </Text>
                <Text size="sm">
                  Timestamp: {new Date(record.timestamp).toLocaleDateString()}
                </Text>
              </Box>
            </Card>
          </Grid.Col>
				))}
			</Grid>
		</Container>
	);
}
