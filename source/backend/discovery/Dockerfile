FROM public.ecr.aws/amazonlinux/amazonlinux:2023-minimal@sha256:938e762e4201a9e1b061536a13066c0985dcd2342e83b275f873ffcfd7575abb

RUN dnf install -y shadow-utils

RUN curl -fsSL https://rpm.nodesource.com/setup_24.x | bash -

RUN dnf install --setopt=install_weak_deps=0 nodejs-24.15.0-1nodesource -y

RUN groupadd -r discovery && useradd -r -g discovery discovery

RUN mkdir /code
WORKDIR /code

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY src/ src/

RUN chown -R discovery:discovery /code

USER discovery

CMD ["node", "src/index.mjs"]
