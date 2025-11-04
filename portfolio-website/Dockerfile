# Use official Node.js LTS (Long Term Support) image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application files
COPY server.js ./
COPY public ./public
COPY views ./views

# Expose port 3000
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Run as non-root user for security
USER node

# Start the application
CMD ["node", "server.js"]
