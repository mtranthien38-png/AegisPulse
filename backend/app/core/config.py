from pydantic import BaseModel


class Settings(BaseModel):
    APP_ENV: str = "development"
    APP_VERSION: str = "0.1.0"
    CORS_ORIGINS: str = "http://localhost:3000"
    DEFAULT_ORG_NAME: str = "AegisPulse Labs"
    CONTRACT_ADDRESS: str = "0xc32725AAA0062754C9fA7B297821CF47bB2C37F9"
    CONTRACT_TX_HASH: str = "0x995fe577b527bc7d6f23573d7eed6b7eda1b47ca79fd2758466e8a9d6dec237d"
    FRONTEND_URL: str = "http://localhost:3000"

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


settings = Settings()
