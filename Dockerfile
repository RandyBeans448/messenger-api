# Development stage
FROM node:18.17.0-alpine As build


WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18.17.0-alpine As production

WORKDIR /app

COPY db ./db
COPY ormconfig.ts ./ormconfig.ts
COPY package*.json ./

# Copy the app from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

CMD ["node", "dist/src/main"]