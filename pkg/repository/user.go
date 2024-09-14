package repository

import (
	"context"
	"errors"
	"log"

	"github.com/notrishabh/finance-tracker/internal/db"
	"github.com/notrishabh/finance-tracker/pkg/models"
	"github.com/notrishabh/finance-tracker/pkg/utils"
	"go.mongodb.org/mongo-driver/bson"
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

	// check if username is already taken
	err := userCollection.FindOne(context.Background(), bson.M{"username": user.Username}).Decode(&models.User{})
	if err == nil {
		return nil, errors.New("username already taken")
	}

	hashedPassword, err := utils.HashPassword(user.Password)
	if err != nil {
		return nil, err
	}
	user.Password = hashedPassword
	if user.Role == "" {
		user.Role = "user"
	}
	return userCollection.InsertOne(context.Background(), user)
}

func LoginUser(username string, password string) (*models.User, error) {
	var user models.User
	err := userCollection.FindOne(context.Background(), bson.M{"username": username}).Decode(&user)
	if err != nil {
		return nil, err
	}
	found := utils.CheckPasswordHash(password, user.Password)
	if found == false {
		return nil, errors.New("incorrect password")
	}
	return &user, nil
}
