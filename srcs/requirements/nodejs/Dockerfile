FROM node:20

WORKDIR /app

COPY . .
COPY .env .

RUN npm install -g npm
RUN npm install

RUN chmod +x node_modules/.bin/prisma
RUN npx prisma generate

RUN chmod +x tools/migrate.sh
RUN chmod +x tools/start.sh

EXPOSE 3000


ENTRYPOINT ["sh", "tools/start.sh"]
