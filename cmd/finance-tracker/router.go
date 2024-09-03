package main

import (
	"github.com/gorilla/mux"
	"github.com/notrishabh/finance-tracker/pkg/handlers"
)

func InitRouter() *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/expenses", handlers.GetExpenseHandler).Methods("GET")
	r.HandleFunc("/expenses", handlers.CreateExpenseHandler).Methods("POST")
	return r
}
