FROM public.ecr.aws/amazonlinux/amazonlinux:2023-minimal@sha256:0caa7d3c2a199a700f488b055058b0798cff190bc0cf08bacd6003b9d03e9dfd

RUN dnf install -y shadow-utils

RUN curl -fsSL https://rpm.nodesource.com/setup_24.x | bash -

RUN dnf install --setopt=install_weak_deps=0 nodejs-24.18.0-1nodesource -y

RUN groupadd -r discovery && useradd -r -g discovery discovery

RUN mkdir /code
WORKDIR /code

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY src/ src/

RUN chown -R discovery:discovery /code

USER discovery

CMD ["node", "src/index.mjs"]
