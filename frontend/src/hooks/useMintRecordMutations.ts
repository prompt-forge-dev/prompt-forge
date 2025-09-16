import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type MintRecordCreate, MintRecordsService } from "@/client";

const useMintRecordMutations = () => {
	const queryClient = useQueryClient();

	const createMintRecord = useMutation({
		mutationFn: (data: MintRecordCreate) =>
			MintRecordsService.createMintRecord({ requestBody: data }),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["mint-records"] }),
	});

	return { createMintRecord };
};

export default useMintRecordMutations;
