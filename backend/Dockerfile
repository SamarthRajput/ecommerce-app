FROM node:24-alpine3.21

# Set working directory
WORKDIR /app

# Copy package files and install deps
COPY package.json package-lock.json* ./
RUN npm ci

# Generate Prisma client (must happen before tsc)
COPY prisma ./prisma
RUN npx prisma generate

# Copy all remaining files
COPY . .

# Build TypeScript
RUN npm run build

# Expose the port Railway will connect to
EXPOSE 3001

# Set NODE_ENV and start the server with a production-safe Prisma migration
ENV NODE_ENV=production
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
