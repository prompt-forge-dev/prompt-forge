import { useMutation } from "@tanstack/react-query";

import { type PromptRequest, PromptsService } from "@/client";

const usePromptMutations = () => {
	const generateImage = useMutation({
		mutationFn: (data: PromptRequest) =>
			PromptsService.generateImage({ requestBody: data }),
	});

	return { generateImage };
};

export default usePromptMutations;
