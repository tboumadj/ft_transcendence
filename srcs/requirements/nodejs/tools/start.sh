#!-bash

#npm run test;

sleep 2;
#wait-for-it postgres:5432

#npm start;

./tools/migrate.sh &
#node ./app/dist/main.js;

#wait-for-it postgres:5432;
node ./dist/main.js;
