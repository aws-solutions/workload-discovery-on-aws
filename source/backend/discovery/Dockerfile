FROM public.ecr.aws/amazonlinux/amazonlinux:2023-minimal@sha256:13bffb7de7ef4836742a6be2b09642e819aaec50ceed1d7961424e19a95da0de

RUN dnf install -y shadow-utils

RUN curl -fsSL https://rpm.nodesource.com/setup_24.9.0 | bash -

RUN dnf install nodejs -y

RUN groupadd -r discovery && useradd -r -g discovery discovery

RUN mkdir /code
WORKDIR /code

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY src/ src/

RUN chown -R discovery:discovery /code

USER discovery

CMD ["node", "src/index.mjs"]
