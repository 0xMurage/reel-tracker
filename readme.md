## Requirements

* [Devbox](https://www.jetpack.io/devbox/) or [Bun Oven](https://bun.sh/)

---

## Development Setup

1. **Activate the Devbox shell** (if using Devbox):

   ```sh
   devbox shell
   ```

2. **Copy the environment configuration**:

   ```sh
   cp .env.example .env
   ```

3. **Install project dependencies**:

   ```sh
   bun install
   ```

4. **Start the development server**:

   ```sh
   bun run dev
   ```

---

## Running in Production with Docker

1. **Make the Docker build script executable**:

   ```sh
   chmod +x scripts/docker-build.sh
   ```

2. **Build the application Docker image**:

   ```sh
   ./scripts/docker-build.sh app_release <tag:version>
   ```

3. **Build the database migrations Docker image**:

   ```sh
   ./scripts/docker-build.sh migrations <tag:version>
   ```

   > **Note:** Ensure the `<tag:version>` used in both images is the same.

4. **Update the following environment variables in your `.env` file**:

    * `APP_IMAGE`
    * `MIGRATIONS_APP`
    * `VERSION`

5. **Start the application using Docker Compose**:

   ```sh
   docker compose up
   ```