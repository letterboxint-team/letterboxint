# syntax=docker/dockerfile-upstream:master-labs

FROM oven/bun:1 AS bun
WORKDIR /app

FROM bun AS build
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=bun.lock,target=bun.lock \
    bun install --frozen-lockfile
COPY --parents index.html package.json src vite.config.ts .
RUN bun run build

FROM nginx:alpine@sha256:455c39afebd4d98ef26dd70284aa86e6810b0485af5f4f222b19b89758cabf1e AS production

COPY --from=build /app/build /usr/share/nginx/html

# Set proper permissions and switch to the existing nginx user
# RUN chown -R nginx:nginx /usr/share/nginx/html

# USER nginx
