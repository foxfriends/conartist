FROM node:17.6.0 AS web
WORKDIR /build/web
COPY ./web/package.json ./web/package-lock.json /build/web
RUN npm ci
COPY ./shared/ /build/shared/
COPY ./web/ /build/web/
RUN npm run build
CMD ["false"]

FROM rust:1.85.1-bookworm AS build
WORKDIR /build
ARG FEATURES="mailer"
RUN apt-get update && apt-get install -y libssl-dev 
COPY Cargo.toml Cargo.lock /build/
COPY ./dev/ /build/dev/
COPY ./server/ /build/server/
RUN cargo build --bin server --locked --release --no-default-features --features "$FEATURES"
CMD ["false"]

FROM debian:bookworm
RUN apt-get update && apt-get install -y libpq-dev

WORKDIR /app
COPY --from=build /build/target/release/server server
COPY --from=web /build/web/public_html/ public_html/

ENV WEB_ROOT=/app/public_html
ENV PORT=8080

EXPOSE $PORT

CMD ["./server"]
