FROM public.ecr.aws/amazonlinux/amazonlinux:2023-minimal

RUN dnf install -y shadow-utils

RUN curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -

RUN dnf install nodejs -y

RUN groupadd -r discovery && useradd -r -g discovery discovery

RUN mkdir /code

WORKDIR /code

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY src/ src/

CMD ["node", "src/index.mjs"]
