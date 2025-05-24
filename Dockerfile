FROM oven/bun:1.2.9-alpine AS migrations

WORKDIR /app

RUN addgroup --system --gid 1001 hono && adduser --system --uid 1001 hono

RUN bun install dbmate && mkdir data && chown -R hono:hono /app

COPY --chown=hono:hono package.json .

# Switch to non-root user
USER hono:hono

COPY database/migrations database/migrations

CMD [ "bun", "run", "db:migrate" ]


# Build application
FROM oven/bun:1.2.9-alpine AS app_builder_base

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile --production

# Copy source code
COPY . .

# Build the application
RUN bun run build

FROM oven/bun:1.2.9-alpine AS app_release

WORKDIR /app

# Create app user
RUN addgroup --system --gid 1001 hono && adduser --system --uid 1001 hono

# Switch to non-root user
USER hono:hono

COPY --chown=hono:hono package.json .

COPY --from=app_builder_base --chown=hono:hono /app/dist ./dist
COPY --from=app_builder_base --chown=hono:hono /app/src/static ./src/static


CMD [ "bun", "run", "start" ]
