FROM node:18

COPY src /opt/app 

WORKDIR /opt/app/

RUN npm install

ENTRYPOINT ["node", "/opt/app/musician.js"]