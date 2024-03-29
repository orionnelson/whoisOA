FROM golang:alpine as build

ARG GEOIPUPDATE_VERSION=main
ARG GEOIP_DIRECTORY=/app/GeoIP
ARG PORT=5001
# install git and clone repo
RUN apk add --update curl git
RUN git clone https://github.com/maxmind/geoipupdate.git /tmp/build

# checkout tag
WORKDIR /tmp/build
RUN git checkout ${GEOIPUPDATE_VERSION}

# build binary for alpine
#ENV GOPATH /tmp/build
WORKDIR /tmp/build/cmd/geoipupdate
RUN go get -t ./... 2> /dev/null; exit 0
#RUN rm -f $GOPATH/go.mod
RUN go build -o geoipupdate




FROM alpine:latest

RUN apk add --update ca-certificates && \
    rm -rf /var/cache/apk/*


# copy the binary over from the build image, directly into bin dir
COPY --from=build /tmp/build/cmd/geoipupdate/geoipupdate /usr/bin/



# Download Whois Testing echo "@testing https://dl-3.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories && \
RUN echo "@testing http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories

RUN apk update

RUN apk add --no-cache whois@testing python3 py3-pip 

RUN python3 -m venv env

RUN . /env/bin/activate && \
    pip3 install Flask && \
    pip3 install regex && \
    pip3 install geoip2


WORKDIR /app
RUN mkdir -p /usr/local/share/GeoIP
#RUN mkdir -p /${GEOIP_DIRECTORY}/
COPY app.py .
WORKDIR /
RUN mkdir -p /app/GeoIP
WORKDIR /app
COPY whois.py .
COPY whois_utils.py .
COPY geoip.sh .
COPY geoloader.py .
COPY app_functions.py .

EXPOSE ${PORT}

CMD ["/bin/sh", "-c", ". geoip.sh && chmod  -R 755 /app/GeoIP && . /env/bin/activate && python3 app.py"]
#CMD ["/geoip.sh"]
#ENTRYPOINT ["python3"]
#CMD ["app.py"]