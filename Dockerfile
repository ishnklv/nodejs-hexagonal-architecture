FROM node:15.4 as build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . ./

RUN npm run build


FROM node:15.4

WORKDIR /app

COPY package.json ./
COPY .env.* ./

EXPOSE ${PORT}

RUN npm install --only=production --legacy-peer-deps

COPY --from=build /app/dist ./dist

CMD ["npm", "run", "start:prod"]
