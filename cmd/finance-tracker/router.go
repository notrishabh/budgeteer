package main

import (
	"github.com/gorilla/mux"
	"github.com/notrishabh/finance-tracker/pkg/handlers"
)

func InitRouter() *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/user", handlers.CreateUserHandler).Methods("POST")
	r.HandleFunc("/login", handlers.LoginUserHandler).Methods("POST")
	r.HandleFunc("/expenses", handlers.GetExpenseHandler).Methods("GET")
	r.HandleFunc("/expenses/category", handlers.CreateCategoryHandler).Methods("POST")
	r.HandleFunc("/expenses", handlers.CreateExpenseHandler).Methods("POST")
	r.HandleFunc("/expenses/{id}", handlers.GetExpenseByIdHandler).Methods("GET")
	return r
}
