package services

import (
	"github.com/notrishabh/finance-tracker/pkg/models"
	"github.com/notrishabh/finance-tracker/pkg/repository"
)

func GetExpense() ([]models.Expense, error) {
	return repository.GetExpenses()
}

func CreateCategory(category *models.Category) error {
	_, err := repository.CreateCategory(category)
	return err
}

func CreateExpense(expense *models.Expense, category string) error {
	_, err := repository.CreateExpense(expense, category)
	return err
}

func GetExpenseById(id string) (*models.Expense, error) {
	return repository.GetExpenseById(id)
}
