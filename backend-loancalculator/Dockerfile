# Use the official Node.js image as a base
FROM node:20.11.1-alpine

# Set the working directory
WORKDIR /usr/src/

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install && npm i -g typescript

# Copy the rest of the application code
COPY . .

# Compile
RUN tsc

# Expose the application port
EXPOSE 4400

# Command to run the application
CMD ["npm", "start"]