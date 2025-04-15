FROM node:17.6.0 AS web
WORKDIR /build/web
COPY ./web/package.json ./web/package-lock.json ./
RUN npm ci
COPY ./shared/ /build/shared/
COPY ./web/ /build/web/
ENV NODE_ENV=production
RUN npm run deploy
CMD ["false"]


FROM rust:1.86.0-bullseye AS deps
WORKDIR /build
RUN apt-get update && apt-get install -y libssl-dev 
COPY Cargo.toml Cargo.lock ./
COPY ./dev/ ./dev/
COPY ./server/ ./server/
CMD ["false"]

FROM deps AS build
ARG FEATURES="mailer"
RUN cargo build --bin server --locked --release --no-default-features --features "$FEATURES"
CMD ["false"]

FROM deps AS build-load
RUN cargo build --bin import-conventions --locked --release


FROM rust:1.86.0-bullseye AS migrate
RUN cargo install diesel_cli --no-default-features --features postgres
WORKDIR /app
COPY ./database/migrations/ ./database/migrations
CMD ["diesel", "migration", "run"]


FROM debian:bullseye AS load
WORKDIR /app 
COPY --from=build-load /build/target/release/import-conventions import-conventions
CMD ["./import-conventions", "./conventions/*"]


FROM debian:bullseye AS release
RUN apt-get update && apt-get install -y libpq-dev

WORKDIR /app
COPY --from=build /build/target/release/server server
COPY --from=web /build/web/public_html/ public_html/

ENV WEB_ROOT=/app/public_html
ENV PORT=3000

EXPOSE $PORT

CMD ["./server"]
