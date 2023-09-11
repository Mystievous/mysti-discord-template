FROM node:lts-alpine

# Install necessary dependencies and build tools
RUN apk --no-cache add --virtual .build-deps \
  python3 \
  make \
  g++ \
  && apk --no-cache add \
  bash \
  libc6-compat \
  && ln -sf python3 /usr/bin/python \
  && yarn global add node-gyp

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

ENV PATH /app/node_modules/.bin:$PATH

ENV TOKEN=
ENV CLIENT_ID=
ENV GUILD_ID=

CMD ["yarn", "start"]