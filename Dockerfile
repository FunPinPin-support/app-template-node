FROM node:14.17.0 as package
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
CMD npm run start
