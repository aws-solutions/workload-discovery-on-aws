FROM public.ecr.aws/amazonlinux/amazonlinux:2023-minimal@sha256:181f434838407aabfc38239fd542561be523c194dbe2cf000ff04730d391a6f4

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
