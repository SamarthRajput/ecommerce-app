FROM node:24-alpine3.21

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Build TypeScript
RUN npm run build || npx tsc -b

# Expose backend port
EXPOSE 3001

# Run migrations, generate Prisma client, seed DB, then start server
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma generate && npx prisma db seed && node dist/src/index.js"]