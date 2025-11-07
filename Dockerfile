# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files (excluding node_modules via .dockerignore)
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]

