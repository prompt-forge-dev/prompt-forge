import {
	Alert,
	Anchor,
	Box,
	Button,
	Card,
	Center,
	Grid,
	Group,
	Loader,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconCheck } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
	useAccount,
	useSignMessage,
	useWaitForTransactionReceipt,
	useWriteContract,
} from "wagmi";
import z from "zod";

import useMintRecordMutations from "@/hooks/useMintRecordMutations";
import usePromptMutations from "@/hooks/usePromptMutations";
import { NFT_CONTRACT_ABI, NFT_CONTRACT_ADDRESS } from "@/utils/abi";

const EXPLORER_URL = "https://sepolia.etherscan.io";

const promptSchema = z.object({
	prompt: z
		.string()
		.min(3, "Must be at least 3 characters")
		.max(1024, "Max 1024 characters"),
});

export const Route = createFileRoute("/_layout/_auth/studio/forge")({
	component: ForgeComponent,
});

function ForgeComponent() {
	const { address } = useAccount();
	const { generateImage } = usePromptMutations();
	const { createMintRecord } = useMintRecordMutations();

	const [prompt, setPrompt] = useState("");
	const [forgeResult, setForgeResult] = useState({
		imageCid: "",
		metadataUri: "",
	});
	const [statusMessage, setStatusMessage] = useState(
		"Ready to start creating?",
	);
	const [error, setError] = useState("");

	const {
		data: hash,
		writeContract,
		isPending: isMinting,
		reset: resetWriteContract,
	} = useWriteContract();
	const { isLoading: isConfirming, isSuccess: isConfirmed } =
		useWaitForTransactionReceipt({ hash });
	const {
		signMessage,
		data: signature,
		isPending: isSigning,
		reset: resetSignMessage,
	} = useSignMessage();

	const handleGenerateAndMint = useCallback(async (currentPrompt: string) => {
		if (!currentPrompt || !address) {
			setError("Please connect wallet and enter your prompt")
			return
		}

		setError("")
    setPrompt(currentPrompt)
		setStatusMessage("Generating image...");
		setForgeResult({ imageCid: "", metadataUri: "" });

		try {
			const { image_cid, metadata_uri } = await generateImage.mutateAsync({
				prompt: currentPrompt,
			});

			setForgeResult({ imageCid: image_cid, metadataUri: metadata_uri });
			setStatusMessage(
				"Image generated and uploaded to IPFS, ready for minting...",
			);

			try {
				// Call safeMint function of smart contract
				writeContract({
					address: NFT_CONTRACT_ADDRESS,
					abi: NFT_CONTRACT_ABI,
					functionName: "safeMint",
					args: [metadata_uri],
					gas: 300000n,
				});
			} catch (contractError: any) {
				const message = `Failed to mint NFT for image generated from prompt "${prompt}"`;
				console.error(message, contractError);
				setError(contractError?.body?.detail || message);
			}
		} catch (generateError: any) {
			const message = `Failed to generate image from prompt ${prompt}`;
			console.error(message, generateError);
			setError(generateError?.body?.detail || message);
		}
	}, [prompt, address, generateImage, writeContract]);

	const { Field, handleSubmit } = useForm({
		defaultValues: {
			prompt: "",
		},
		onSubmit: ({ value }) => {
			resetWriteContract();
			resetSignMessage();
			handleGenerateAndMint(value.prompt.trim());
		},
		validators: {
			onChange: promptSchema,
		},
	});

	// Sign message when the transaction succeeds
	useEffect(() => {
		if (isConfirmed && hash && address) {
			setStatusMessage("Forging successful! Signing for record keeping...");

			// Construct message to sign
			const messageToSign = `Mint record for ${address}, transaction hash ${hash}`;
			signMessage({ message: messageToSign });
		}
	}, [isConfirmed, hash, address, signMessage]);

	// Create mint record with signature
	useEffect(() => {
		if (signature && address && prompt && forgeResult && hash) {
			(async () => {
				try {
					await createMintRecord.mutateAsync({
						user_address: address,
						prompt: prompt,
						image_cid: forgeResult.imageCid,
						metadata_uri: forgeResult.metadataUri,
						transaction_hash: hash,
						signature: signature,
					});

					setStatusMessage(
						"You can find your NFT in gallery and studio now!!!",
					);
				} catch (error: any) {
					const message = `Failed to create mint record for transaction ${hash}`;
					console.error(message, error);
					setError(error?.body?.detail || message);
				}
			})();
		}
	}, [signature, address, prompt, forgeResult, hash]);

	const isLoadingCombined =
		generateImage.isPending ||
		isMinting ||
		isSigning ||
		createMintRecord.isPending;

	return (
		<Grid
			classNames={{
				root: "flex flex-1 h-full",
				inner: "flex-1",
			}}
		>
			<Grid.Col span={12}>
				<Group justify="flex-start" mb="md">
					<Link to="/studio" search={{ page: 1 }}>
						<Button variant="light" leftSection={<IconArrowLeft size={16} />}>
							Back to Studio
						</Button>
					</Link>
				</Group>
			</Grid.Col>
			<Grid.Col span={{ base: 12, md: 6 }} h="100%">
				<Card shadow="sm" padding="lg" radius="md" h="100%">
					<Title order={2} ta="center" mb="lg">
						Start Creating
					</Title>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							handleSubmit();
						}}
						className="space-y-6"
					>
						<Field name="prompt">
							{(field) => (
								<TextInput
									label="prompt"
									placeholder="Example: a smiling cat with sunglasses"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
									disabled={isLoadingCombined}
									error={
										field.state.meta.isBlurred &&
										field.state.meta.errors.length > 0
											? field.state.meta.errors[0]?.message
											: null
									}
									required
								/>
							)}
						</Field>

						<Button
							type="submit"
							fullWidth
							color="accent.4"
							disabled={isLoadingCombined}
							size="md"
						>
							Generate Image and Forge NFT
						</Button>
					</form>

					<Box mt="xl">
						<Title order={4} mb="xs">
							Status
						</Title>
						<Text>{statusMessage}</Text>

						{error && (
							<Alert
								icon={<IconAlertCircle />}
								title="Error"
								color="red"
								mt="md"
							>
								{error}
							</Alert>
						)}

						{hash && (
							<Alert
								icon={<IconCheck />}
								title="Transaction Sent"
								color="blue"
								mt="md"
							>
								<Text>
									Transaction Hash:{" "}
									<Anchor href={`${EXPLORER_URL}/tx/${hash}`} target="_blank">
										{hash}
									</Anchor>
								</Text>
								{isConfirming && (
									<Text>Waiting for Blockchain Confirmation...</Text>
								)}
								{isConfirmed && <Text>NFT Minted！</Text>}
							</Alert>
						)}
					</Box>
				</Card>
			</Grid.Col>
			<Grid.Col span={{ base: 12, md: 6 }}>
				<Card shadow="sm" padding="lg" radius="md" h="100%">
					<Title order={2} ta="center" mb="lg">
						Generated Result
					</Title>
					<Center h="calc(100% - 40px)">
						{generateImage.isPending || isMinting ? (
							<Loader />
						) : forgeResult.imageCid ? (
							<img
								src={`https://gateway.pinata.cloud/ipfs/${forgeResult.imageCid}`}
								alt="Generated NFT"
								style={{
									maxWidth: "100%",
									maxHeight: "100%",
									borderRadius: "8px",
								}}
							/>
						) : (
							<Text c="dimmed">Image will be shown here</Text>
						)}
					</Center>
				</Card>
			</Grid.Col>
		</Grid>
	);
}
