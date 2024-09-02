package db

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Client *mongo.Client

var pass = "X0OOZSVpEuCKVFGS"

func Init() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	clientOptions := options.Client().ApplyURI()
}
