FROM node:20-alpine
WORKDIR /var/www/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "run", "start:dev"]