import torch
from diffusers import StableDiffusionPipeline


class AIPipelineFactory:
    """A factory to create an AI pipeline using the Singleton pattern."""

    _instance = None
    _pipeline = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls, *args, **kwargs)
        return cls._instance

    def __init__(self, model_id: str = "segmind/tiny-sd"):
        if hasattr(self, "_initialized"):
            return
        self._initialized = True
        self._model_id = model_id
        self._pipeline = None

    def get_pipeline(self) -> StableDiffusionPipeline:
        if self._pipeline is None:
            device = "cuda" if torch.cuda.is_available() else "cpu"
            ai_pipe = StableDiffusionPipeline.from_pretrained(
                self._model_id,
                safety_checker=None,
                use_safetensors=False,
            )
            self._pipeline = ai_pipe.to(device)

        return self._pipeline


ai_pipeline_factory = AIPipelineFactory()
