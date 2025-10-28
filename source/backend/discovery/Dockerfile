FROM public.ecr.aws/amazonlinux/amazonlinux:2023-minimal@sha256:b76468bead480cc76add79ba5bd84b58c6d9b460add0b297b36ea9315c569ee4

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
