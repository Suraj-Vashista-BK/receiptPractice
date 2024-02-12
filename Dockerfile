FROM node:16-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

RUN npm install typescript jest

COPY . .

RUN npm run build

RUN npm test

EXPOSE 3000

CMD ["node", "dist/index.js"]
