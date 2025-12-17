# syntax=docker/dockerfile-upstream:master-labs

FROM python:3.14-alpine AS python

FROM python AS build
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
WORKDIR /app
RUN --mount=type=cache,target=/var/cache/apk \
    --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    : \
    && uv sync --no-dev --locked \
    && :

FROM python AS base
COPY --parents --from=build /app/.venv /
WORKDIR /app
COPY ./src ./
ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONUNBUFFERED=0

FROM base AS production
CMD ["fastapi", "run", "--workers", "4", "api.py"]

FROM base AS development
CMD ["fastapi", "dev", "api.py"]

