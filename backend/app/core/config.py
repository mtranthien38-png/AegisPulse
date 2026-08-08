from pydantic import BaseModel


class Settings(BaseModel):
    APP_ENV: str = "development"
    APP_VERSION: str = "0.1.0"
    CORS_ORIGINS: str = "http://localhost:3000"
    DEFAULT_ORG_NAME: str = "AegisPulse Labs"
    CONTRACT_ADDRESS: str = "0x4FF47a2cF80f48f848679c6B73C4b560912EbeC5"
    CONTRACT_TX_HASH: str = "0x69980c8f109895e2380b090d0fc1358964595635e7cecdbe2c3be6f7fa43cd29"
    FRONTEND_URL: str = "http://localhost:3000"

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


settings = Settings()
