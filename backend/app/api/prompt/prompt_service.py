import json
import logging
from io import BytesIO

import httpx
from diffusers import DiffusionPipeline
from fastapi import HTTPException

from app.core.config import settings

from .prompt_model import PromptRequest, PromptResponse


class PromptService:
    def __init__(self, ai_pipeline: DiffusionPipeline):
        self._logger = logging.getLogger(self.__class__.__name__)
        self._ai_pipeline = ai_pipeline

    async def _upload_files_to_ipfs(self, *, files: bytes) -> str:
        """Upload image file to IPFS and return CID."""
        headers = {
            "pinata_api_key": settings.PINATA_API_KEY,
            "pinata_secret_api_key": settings.PINATA_SECRET_API_KEY,
        }

        async with httpx.AsyncClient(
            timeout=settings.PINATA_API_TIMEOUT_SECONDS
        ) as client:
            try:
                response = await client.post(
                    url=str(settings.PINATA_API_URL),
                    headers=headers,
                    files=files,
                )
                response.raise_for_status()

                cid = response.json()["IpfsHash"]
                return cid
            except (httpx.HTTPStatusError, httpx.RequestError, httpx.ReadTimeout) as e:
                self._logger.exception("Failed to upload file to IPFS")

                raise HTTPException(
                    status_code=500, detail="Failed to upload files to IPFS"
                ) from e

    async def _generate_image_locally(self, *, prompt: str) -> bytes:
        """Generates an image using the local AI model."""
        image = self._ai_pipeline(prompt).images[0]
        img_byte_arr = BytesIO()
        image.save(img_byte_arr, format="JPEG")
        return img_byte_arr.getvalue()

    async def generate_image_from_prompt(
        self,
        *,
        request: PromptRequest,
    ) -> PromptResponse:
        try:
            prompt = request.prompt

            # Step 1: Generate the image locally
            image_data = await self._generate_image_locally(prompt=prompt)

            # Step 2: Upload generated image to IPFS
            files = {"file": ("image.jpeg", image_data, "image/jpeng")}
            image_cid = await self._upload_files_to_ipfs(files=files)

            # Step 3: Upload metadata to IPFS
            metadata = {
                "name": request.prompt,
                "description": f"An NFT created by Prompt Forge with prompt: '{prompt}'",
                "image": f"ipfs://{image_cid}",
            }
            metadata_bytes = json.dumps(metadata).encode("utf-8")
            files = {"file": ("metadata.json", metadata_bytes, "application/json")}
            metadata_cid = await self._upload_files_to_ipfs(files=files)

            return PromptResponse(
                prompt=prompt,
                image_cid=image_cid,
                metadata_uri=f"ipfs://{metadata_cid}",
            )
        except (httpx.HTTPStatusError, httpx.RequestError, httpx.ReadTimeout) as e:
            self._logger.exception(
                f"Failed to generate a new image from prompt {prompt}"
            )

            raise HTTPException(
                status_code=500,
                detail=f"Failed to call API to generate a new image from prompt '{prompt}'",
            ) from e
