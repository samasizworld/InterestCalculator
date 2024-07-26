# Use the official Node.js image as a base
FROM node:20.11.1-alpine

# Set the working directory
WORKDIR /usr/src/

# Install necessary dependencies for Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn

# Install Puppeteer, which will also install Chromium
RUN npm install puppeteer

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install && npm i -g typescript

# Copy the rest of the application code
COPY . .

# Ensure the environment variable for Chromium path is set
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser


# Compile
RUN tsc

# Expose the application port
EXPOSE 4400

# Command to run the application
CMD ["npm", "start"]