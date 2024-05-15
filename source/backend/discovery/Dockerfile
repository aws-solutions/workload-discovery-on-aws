FROM public.ecr.aws/docker/library/node:20

RUN groupadd -r discovery && useradd -r -g discovery discovery

RUN mkdir /code

WORKDIR /code

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY src/ src/

CMD ["node", "src/index.js"]
