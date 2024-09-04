package repository

import (
	"context"
	"log"
	"time"

	"github.com/notrishabh/finance-tracker/internal/db"
	"github.com/notrishabh/finance-tracker/pkg/models"
	"go.mongodb.org/mongo-driver/bson"
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

func GetExpenses() ([]models.Expense, error) {
	var expenses []models.Expense
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	cursor, err := expenseCollection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var expense models.Expense
		if err := cursor.Decode(&expense); err != nil {
			return nil, err
		}
		expenses = append(expenses, expense)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return expenses, nil
}

func CreateExpense(expense *models.Expense) (*mongo.InsertOneResult, error) {
	expense.ID = primitive.NewObjectID()
	expense.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
	expense.UpdatedAt = expense.CreatedAt
	return expenseCollection.InsertOne(context.Background(), expense)
}

func GetExpenseById(id string) (*models.Expense, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var expense models.Expense
	err = expenseCollection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&expense)
	return &expense, err
}
