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

func GetExpenses(userName string) ([]models.Expense, error) {
	var expenses []models.Expense
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	UserID, err := utils.GetUserIDfromUsername(userName)
	if err != nil {
		return nil, err
	}

	cursor, err := expenseCollection.Find(ctx, bson.M{"user_id": UserID})
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

func GetCategories(userName string) ([]models.Category, error) {
	var categories []models.Category
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	UserID, err := utils.GetUserIDfromUsername(userName)
	if err != nil {
		return nil, err
	}

	filter := bson.M{
		"$or": []bson.M{
			{"user_id": UserID},
			{"user_made": false},
			{"user_made": bson.M{"$exists": false}},
		},
	}

	cursor, err := categoryCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var category models.Category
		if err := cursor.Decode(&category); err != nil {
			return nil, err
		}
		categories = append(categories, category)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return categories, nil
}

func CreateCategory(category *models.Category, userName string) (*mongo.InsertOneResult, error) {
	userID, err := utils.GetUserIDfromUsername(userName)
	if err != nil {
		return nil, err
	}

	foundCategory, _ := GetCategoryByName(category.Name, userID)

	if foundCategory != nil && foundCategory != &(models.Category{}) {
		msg := fmt.Sprintf("Category %s already exists.", foundCategory.Name)
		return nil, errors.New(msg)
	}

	category.UserID = userID
	category.ID = primitive.NewObjectID()
	category.UserMade = true
	category.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
	category.UpdatedAt = category.CreatedAt

	return categoryCollection.InsertOne(context.Background(), category)
}

func GetCategoryByName(name string, userID primitive.ObjectID) (*models.Category, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{
		"$or": []bson.M{
			{
				"user_made": true,
				"name":      name,
				"user_id":   userID,
			},
			{
				"user_made": bson.M{"$exists": false},
				"name":      name,
			},
		},
	}

	var foundCategory models.Category

	err := categoryCollection.FindOne(ctx, filter).Decode(&foundCategory)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("Category not found. Please create a new category.")
		}
		return nil, err
	}
	return &foundCategory, nil
}

func CreateExpense(expense *models.Expense, category string, userName string) (*mongo.InsertOneResult, error) {

	userID, err := utils.GetUserIDfromUsername(userName)
	if err != nil {
		return nil, err
	}

	expense.ID = primitive.NewObjectID()
	expense.UserID = userID
	expense.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
	expense.UpdatedAt = expense.CreatedAt

	foundCategory, err := GetCategoryByName(category, userID)
	if err != nil {
		return nil, err
	}

	expense.Category = *foundCategory

	return expenseCollection.InsertOne(context.Background(), expense)
}

func UpdateExpense(id string, expense *models.Expense, category string) (*mongo.UpdateResult, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	existingExpense, err := GetExpenseById(id)
	if err != nil {
		return nil, err
	}

	if expense.Name != "" {
		existingExpense.Name = expense.Name
	}
	if expense.Price != 0 {
		existingExpense.Price = expense.Price
	}
	if category != "" {
		foundCategory, err := GetCategoryByName(category, existingExpense.UserID)
		if err != nil {
			return nil, err
		}
		existingExpense.Category = *foundCategory
	}

	existingExpense.UpdatedAt = primitive.NewDateTimeFromTime(time.Now())

	return expenseCollection.UpdateOne(context.Background(), bson.M{"_id": objectID}, bson.M{"$set": existingExpense})
}

func DeleteExpense(id string) (*mongo.DeleteResult, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	return expenseCollection.DeleteOne(context.Background(), bson.M{"_id": objectID})
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
