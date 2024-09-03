package main

import (
	"github.com/gorilla/mux"
	"github.com/notrishabh/finance-tracker/pkg/handlers"
)

func InitRouter() *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/expenses", handlers.CreateUserHandler).Methods("POST")
	return r
}
