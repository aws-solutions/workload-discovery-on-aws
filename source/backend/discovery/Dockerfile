FROM public.ecr.aws/amazonlinux/amazonlinux:2023-minimal@sha256:081da1cfe1cc78d26449397c48294796b4b9c6799353108fabc7b4d14fc2ab9e

RUN dnf install -y shadow-utils

RUN curl -fsSL https://rpm.nodesource.com/setup_24.x | bash -

RUN dnf install --setopt=install_weak_deps=0 nodejs-24.16.0-1nodesource -y

RUN groupadd -r discovery && useradd -r -g discovery discovery

RUN mkdir /code
WORKDIR /code

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY src/ src/

RUN chown -R discovery:discovery /code

USER discovery

CMD ["node", "src/index.mjs"]
