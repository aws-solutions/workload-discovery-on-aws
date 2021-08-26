FROM public.ecr.aws/bitnami/node-snapshot:14

RUN groupadd -r discovery && useradd -r -g discovery discovery

RUN npm config set unsafe-perm true

RUN mkdir /code

WORKDIR /code

COPY package.json .

RUN npm install

COPY src/ src/

CMD ["node", "src/discovery/discovery.js"]
