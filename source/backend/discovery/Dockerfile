FROM node:12.6.0-slim

RUN groupadd -r discovery && useradd -r -g discovery discovery

RUN apt-get update -y && apt-get -y install python-pip && pip install awscli

RUN mkdir /code

WORKDIR /code

COPY package.json .

RUN npm install

COPY src/ src/

CMD ["node", "src/discovery/discovery.js"]
