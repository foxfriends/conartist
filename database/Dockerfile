FROM rust:1.26.0
RUN cargo install diesel_cli --no-default-features --features "postgres"

COPY /migrations /migrations
COPY Cargo.toml Cargo.toml
COPY wait.sh wait.sh
