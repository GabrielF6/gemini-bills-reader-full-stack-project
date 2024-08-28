# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and yarn.lock files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Ensure the build directory exists
RUN mkdir -p dist

# Build the TypeScript code
RUN yarn run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run your application
CMD ["yarn", "start"]
