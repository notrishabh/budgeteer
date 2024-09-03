package repository

import (
	"context"
	"log"
	"time"

	"github.com/notrishabh/finance-tracker/internal/db"
	"github.com/notrishabh/finance-tracker/pkg/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var expenseCollection *mongo.Collection

func InitRepo() {
	if db.Client != nil {
		expenseCollection = db.Client.Database("finance-tracker").Collection("expense")
		if expenseCollection == nil {
			log.Fatal("Failed to initialize expenseCollection")
		}
	} else {
		log.Fatal("mongodb cient is not initialized")
	}
}

func GetExpenses(expense *models.Expense) (*mongo.InsertOneResult, error) {
	expense.ID = primitive.NewObjectID()
	expense.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
	expense.UpdatedAt = expense.CreatedAt
	return expenseCollection.InsertOne(context.Background(), expense)
}

func CreateExpense(expense *models.Expense) (*mongo.InsertOneResult, error) {
	expense.ID = primitive.NewObjectID()
	expense.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
	expense.UpdatedAt = expense.CreatedAt
	return expenseCollection.InsertOne(context.Background(), expense)
}
