package main

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/notrishabh/finance-tracker/pkg/handlers"
	"github.com/notrishabh/finance-tracker/pkg/middleware"
)

func protectedEndpoint(w http.ResponseWriter, _ *http.Request) {
	w.Write([]byte("This is a protected endpoint"))
}

func InitRouter() *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/user", handlers.CreateUserHandler).Methods("POST")
	r.HandleFunc("/login", handlers.LoginUserHandler).Methods("POST")
	r.HandleFunc("/expenses", middleware.IsAuthorized(handlers.GetExpenseHandler, "user")).Methods("GET")
	r.HandleFunc("/expenses/category", handlers.CreateCategoryHandler).Methods("POST")
	r.HandleFunc("/expenses", handlers.CreateExpenseHandler).Methods("POST")
	r.HandleFunc("/expenses/{id}", handlers.GetExpenseByIdHandler).Methods("GET")
	return r
}
