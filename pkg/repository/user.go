package repository

import (
	"context"
	"log"

	"github.com/notrishabh/finance-tracker/internal/db"
	"github.com/notrishabh/finance-tracker/pkg/models"
	"github.com/notrishabh/finance-tracker/pkg/utils"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var userCollection *mongo.Collection

func InitUserRepo() {
	if db.Client != nil {
		userCollection = db.Client.Database("finance-tracker").Collection("user")
		if userCollection == nil {
			log.Fatal("Failed to initialize expenseCollection")
		}
	} else {
		log.Fatal("mongodb cient is not initialized")
	}
}

func CreateUser(user *models.User) (*mongo.InsertOneResult, error) {
	user.ID = primitive.NewObjectID()
	hashedPassword, err := utils.HashPassword(user.Password)
	if err != nil {
		return nil, err
	}
	user.Password = hashedPassword
	return userCollection.InsertOne(context.Background(), user)
}
