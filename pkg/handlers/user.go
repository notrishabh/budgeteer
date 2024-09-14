package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/notrishabh/finance-tracker/pkg/models"
	"github.com/notrishabh/finance-tracker/pkg/services"
	"github.com/notrishabh/finance-tracker/pkg/utils"
)

func CreateUserHandler(w http.ResponseWriter, r *http.Request) {
	var user models.User
	json.NewDecoder(r.Body).Decode(&user)

	if user.Password == "" || user.Username == "" {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err := services.CreateUser(&user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(user)
}

func LoginUserHandler(w http.ResponseWriter, r *http.Request) {
	var user models.User
	json.NewDecoder(r.Body).Decode(&user)
	if user.Password == "" || user.Username == "" {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	loggedInUser, err := services.LoginUser(user.Username, user.Password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	token, err := utils.GenerateJWT(loggedInUser.Username, loggedInUser.Role)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"id":       loggedInUser.ID,
		"username": loggedInUser.Username,
		"role":     loggedInUser.Role,
		"token":    token,
		"expires":  time.Now().Add(24 * time.Hour).Unix(),
	}

	json.NewEncoder(w).Encode(response)
}
