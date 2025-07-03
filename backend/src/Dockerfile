FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Run Prisma generate to build the client
RUN npx prisma generate

# Build the TypeScript app
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
