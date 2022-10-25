FROM public.ecr.aws/docker/library/node:16

RUN groupadd -r discovery && useradd -r -g discovery discovery

RUN mkdir /code

WORKDIR /code

COPY package.json .

RUN npm install --production

COPY src/ src/

CMD ["node", "src/index.js"]
