package services

import (
	"github.com/notrishabh/finance-tracker/pkg/models"
	"github.com/notrishabh/finance-tracker/pkg/repository"
)

func GetExpense() ([]models.Expense, error) {
	return repository.GetExpenses()
}

func CreateExpense(expense *models.Expense) error {
	_, err := repository.CreateExpense(expense)
	return err
}
