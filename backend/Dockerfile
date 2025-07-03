FROM node:24-alpine3.21

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy Prisma files and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the code
COPY . .

# Build TypeScript
RUN npm run build

# Set env and expose port
ENV NODE_ENV=production
EXPOSE 3001

# Use prisma migrate deploy (safe for production) + start app
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
