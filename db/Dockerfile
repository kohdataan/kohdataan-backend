FROM postgres:14.5-alpine3.16

ENV DEFAULT_TIMEZONE UTC

RUN apk add --no-cache \
  build-base \
  curl \
  libc6-compat \
  libffi-dev \
  linux-headers \
  python3-dev \
  py-pip \
  py-cryptography \
  && rm -rf /var/cache/apk/* /tmp/* /var/tmp/*

#Healthcheck to make sure container is ready
HEALTHCHECK CMD pg_isready -U $POSTGRES_USER -d $POSTGRES_DB || exit 1

CMD ["postgres"]

VOLUME ["/var/run/postgresql", "/usr/share/postgresql/", "/var/lib/postgresql/data", "/tmp"]
