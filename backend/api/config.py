from pydantic import BaseSettings, validator
from typing import Any, Dict, List, Optional
from environs import Env

env = Env()
env.read_env()


class Settings(BaseSettings):
    # Logging
    LOG_LEVEL: str
    LOG_FORMAT: str = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
    LOG_SQL_MAX_SIZE: int = 10000

    # Database
    DB_HOST: Optional[str]
    DB_PORT: Optional[str]
    DB_DATABASE: Optional[str]
    DB_USER: Optional[str]
    DB_PASSWORD: Optional[str]

    DATABASE_URI: str = None

    @validator('DATABASE_URI', pre=True)
    def assemble_db_uri(cls, v: Optional[str],
                        values: Dict[str, Any]) -> str:  # noqa: N805

        if isinstance(v, str):
            return v
        return (
            f"postgresql+asyncpg://{values['DB_USER']}:{values['DB_PASSWORD']}"
            f"@{values['DB_HOST']}:{values['DB_PORT']}/{values['DB_DATABASE']}"
        )


class DevelopmentSettings(Settings):
    ENV = 'dev'

    LOG_LEVEL = 'DEBUG'


class ProductionSettings(Settings):
    ENV = 'prod'

    LOG_LEVEL = 'INFO'


settings = None


def set_environment_settings(env_name: str) -> Settings:
    env_vars_settings = {
        ('dev', 'development'): DevelopmentSettings,
        ('prod', 'production'): ProductionSettings,
    }

    global settings
    found = False
    env_name = env_name.lower()
    for env_vars, env_settings in env_vars_settings.items():
        if env_name in env_vars:
            settings = env_settings()
            settings.ENV, _ = env_vars
            found = True
            break
    if not found:
        raise ValueError(env_name)
    return settings


settings: Settings = set_environment_settings(
    env.str('ENV', default='development'))
