# Dockerfile

FROM node:19.4.0-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . /app/

COPY docker-entrypoint.sh /usr/local/bin/

EXPOSE 8007

ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["npm", "run", "start"]
