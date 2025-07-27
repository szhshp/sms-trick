# Stage 1: Build the application using a standard Node image
FROM node:20-bookworm AS build

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container
COPY . /app

# Clean npm cache
RUN npm cache clean --force

ADD sources.list /etc/apt/
RUN apt update

# Install necessary packages (only Chromium in this case)
RUN npm install
RUN npx -y playwright install --with-deps chromium


# Stage 2: Build a minimal distroless image
FROM gcr.io/distroless/nodejs20-debian11

# Copy the node_modules and built app from the build stage
COPY --from=build /app /app

# Set the working directory
WORKDIR /app

# Define the entry point, since distroless doesn't have a shell, npm or npx
# all command directly pass to 'node' terminal
# CMD ["/node_modules/.bin/playwright", "test"]