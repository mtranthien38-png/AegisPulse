from pydantic import BaseModel


class Settings(BaseModel):
    APP_ENV: str = "development"
    APP_VERSION: str = "0.1.0"
    CORS_ORIGINS: str = "http://localhost:3000"
    DEFAULT_ORG_NAME: str = "AegisPulse Labs"
    CONTRACT_ADDRESS: str = ""
    FRONTEND_URL: str = "http://localhost:3000"

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


settings = Settings()
