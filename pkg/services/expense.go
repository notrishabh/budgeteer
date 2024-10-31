package services

import (
	"github.com/notrishabh/finance-tracker/pkg/models"
	"github.com/notrishabh/finance-tracker/pkg/repository"
)

func GetExpense(userName string) ([]models.Expense, error) {
	return repository.GetExpenses(userName)
}

func CreateCategory(category *models.Category, userName string) error {
	_, err := repository.CreateCategory(category, userName)
	return err
}

func CreateExpense(expense *models.Expense, category string, userName string) error {
	_, err := repository.CreateExpense(expense, category, userName)
	return err
}

func UpdateExpense(expense *models.Expense) error {
	_, err := repository.UpdateExpense(expense)
	return err
}

func DeleteExpense(id string) error {
	_, err := repository.DeleteExpense(id)
	return err
}

func GetExpenseById(id string) (*models.Expense, error) {
	return repository.GetExpenseById(id)
}
