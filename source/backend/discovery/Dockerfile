FROM public.ecr.aws/amazonlinux/amazonlinux:2023-minimal@sha256:0051b1aa8e8023cd02ce41aace90dc05dcc68e9e85e44bb0abe46f25c3b2c962

RUN dnf install -y shadow-utils

RUN curl -fsSL https://rpm.nodesource.com/setup_24.x | bash -

RUN dnf install --setopt=install_weak_deps=0 nodejs-24.13.1-1nodesource -y

RUN groupadd -r discovery && useradd -r -g discovery discovery

RUN mkdir /code
WORKDIR /code

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY src/ src/

RUN chown -R discovery:discovery /code

USER discovery

CMD ["node", "src/index.mjs"]
