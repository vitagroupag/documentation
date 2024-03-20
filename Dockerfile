#===========================================#
## BASE IMAGE
#===========================================#

FROM nginx:mainline-alpine


#===========================================#
## INSTALL RUNTIME DEPENDENCIES
#===========================================#

ARG RUNTIME_DEPS="ca-certificates lmdb openssl pcre zlib tzdata yajl \
  libgd geoip libxslt libmaxminddb libstdc++ libcrypto1.1 libintl \
  libssl1.1 libxml2 musl bash moreutils"

# Get envsubst from gettext.
# hadolint ignore=DL3018
RUN apk add --no-cache --virtual .gettext gettext \
  && apk add --no-cache --virtual .runtime-deps ${RUNTIME_DEPS} \
  && mv /usr/bin/envsubst /tmp/ \
  && apk del .gettext

#===========================================#
## COPY BUILD FILES
#===========================================#

COPY build/html /usr/share/nginx/html

#===========================================#
## LAUNCH APP
#===========================================#

# Run reverse proxy without daemon.
CMD ["nginx", "-g", "daemon off;"]
