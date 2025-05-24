FROM oven/bun:1.2.9-alpine AS migrations

WORKDIR /app

RUN bun install dbmate

COPY package.json .

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
RUN addgroup --system --gid 1001 hono
RUN adduser --system --uid 1001 hono

# Switch to non-root user
USER hono

COPY package.json .

COPY --from=app_builder_base --chown=hono:hono /app/dist ./dist
COPY --from=app_builder_base --chown=hono:hono /app/src/static ./src/static


CMD [ "bun", "run", "start" ]
