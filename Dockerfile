FROM ubuntu

# setup environment
ENV PORT 8080
EXPOSE ${PORT}

# install ubuntu things
RUN apt-get update
RUN apt-get install curl gnupg make gcc libpng-dev autoconf libpq-dev -y

# install rust
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y

# install node
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs

# copy in shared resources
COPY /shared /shared

# copy in server files
COPY /server/src /server/src
COPY /server/Cargo.toml /server/Cargo.toml
COPY /server/Cargo.lock /sever/Cargo.lock

# copy in web client
COPY /web/src /web/src
COPY /web/package.json /web/package.json
COPY /web/package-lock.json /web/package-lock.json
COPY /web/index.html /web/index.html
COPY /web/index.jsx /web/index.jsx
COPY /web/webpack.config.js /web/webpack.config.js
COPY /web/postcss.config.js /web/postcss.config.js
COPY /web/.babelrc /web/.babelrc
COPY /web/images /web/images
COPY /web/icons /web/icons

# build web client
WORKDIR /web
RUN npm install
RUN node_modules/.bin/webpack --env=production

ENV PATH=/root/.cargo/bin:$PATH
ENV USER root
# start the server

WORKDIR /server

RUN ["cargo", "build", "--release"]
CMD ["target/release/server", "--any-origin"]
