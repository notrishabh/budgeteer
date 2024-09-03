package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/notrishabh/finance-tracker/pkg/models"
	"github.com/notrishabh/finance-tracker/pkg/services"
)

func CreateUserHandler(w http.ResponseWriter, r *http.Request) {
	var expense models.Expense
	json.NewDecoder(r.Body).Decode(&expense)
	err := services.CreateExpense(&expense)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(expense)
}
