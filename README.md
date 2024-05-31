## Overview
This project is a drag-and-drop workflow builder built with modern web technologies. The builder allows users to visually design workflows by dragging and dropping nodes, connecting them, and configuring their properties.

## Prerequisites
- Node.js (v20 or higher)
- pnpm package manager
- Docker (for containerized deployment)

## Getting Started

### Using pnpm Package Manager

#### 1. Install pnpm
If you haven't installed `pnpm`, you can do so by running:
```bash
npm install -g pnpm
```

#### 2. Install Dependencies
Navigate to the project directory and install the dependencies:
```bash
pnpm install
```

#### 3. Run the Application in Development Mode
Start the application in development mode:
```bash
pnpm run dev
```
The application will be available at `http://localhost:3000`.

### Docker Deployment

#### 1. Build Docker Image
You can build the Docker image using the provided `Dockerfile`. Navigate to the project directory and run:
```bash
docker build -t workflow-builder .
```

#### 2. Run the Docker Container
After building the Docker image, run the container:
```bash
docker run -p 3000:3000 workflow-builder
```
The application will be accessible at `http://localhost:3000`.

## Dockerfile

```dockerfile
# Base image with Node.js and pnpm
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

# Install production dependencies
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Build the application
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

# Final stage: copy necessary files and expose the port
FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
EXPOSE 3000
CMD [ "pnpm", "start" ]
```

## Available Scripts

### `pnpm run dev`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `pnpm run build`
Builds the app for production to the `dist` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

### `pnpm start`
Runs the built app in production mode. Make sure to build the app before running this script.

## Contributing
If you would like to contribute to this project, please follow the steps below:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes.
4. Submit a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
