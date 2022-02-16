FROM golang:1.17
WORKDIR /backendContainer
COPY . .
RUN go env -w GO111MODULE=off
RUN go get github.com/gorilla/mux
RUN go get go.mongodb.org/mongo-driver/mongo
RUN go get go.mongodb.org/mongo-driver/bson

EXPOSE 4200
CMD ["go","run","main.go"]