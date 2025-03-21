# Use the official Node.js image as a base image
FROM node:23-alpine3.20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the entire project files into the container
COPY . .

# Start the Nuxt.js development server, which includes hot reload
CMD ["npm", "run", "dev"]