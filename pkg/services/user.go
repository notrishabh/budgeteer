package services

import (
	"github.com/notrishabh/finance-tracker/pkg/models"
	"github.com/notrishabh/finance-tracker/pkg/repository"
)

func CreateUser(user *models.User) error {
	_, err := repository.CreateUser(user)
	return err
}
