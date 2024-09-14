package repository

import (
	"context"
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/notrishabh/finance-tracker/internal/db"
	"github.com/notrishabh/finance-tracker/pkg/models"
	"github.com/notrishabh/finance-tracker/pkg/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var expenseCollection *mongo.Collection
var categoryCollection *mongo.Collection

func InitRepo() {
	if db.Client != nil {
		expenseCollection = db.Client.Database("finance-tracker").Collection("expense")
		categoryCollection = db.Client.Database("finance-tracker").Collection("category")
		if expenseCollection == nil {
			log.Fatal("Failed to initialize expenseCollection")
		}
		if categoryCollection == nil {
			log.Fatal("Failed to initialize categoryCollection")
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

func CreateCategory(category *models.Category, userName string) (*mongo.InsertOneResult, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{"name": category.Name}

	var foundCategory models.Category

	err := categoryCollection.FindOne(ctx, filter).Decode(&foundCategory)
	if err != nil && err != mongo.ErrNoDocuments {
		return nil, err
	}
	if err == nil && foundCategory != (models.Category{}) {
		msg := fmt.Sprintf("Category %s already exists.", foundCategory.Name)
		return nil, errors.New(msg)
	}

	category.UserID, err = utils.GetUserIDfromUsername(userName)
	if err != nil {
		return nil, err
	}

	category.UserMade = true
	category.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
	category.UpdatedAt = category.CreatedAt

	return categoryCollection.InsertOne(context.Background(), category)
}

func CreateExpense(expense *models.Expense, category string) (*mongo.InsertOneResult, error) {
	expense.ID = primitive.NewObjectID()
	expense.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
	expense.UpdatedAt = expense.CreatedAt

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{"name": category}

	var foundCategory models.Category

	err := categoryCollection.FindOne(ctx, filter).Decode(&foundCategory)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("Category not found. Please create a new category.")
		}
		return nil, err
	}
	expense.Category = foundCategory

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
