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
	r.HandleFunc("/expenses/category", middleware.IsAuthorized(handlers.GetCategoryHandler, "user")).Methods("GET")
	r.HandleFunc("/expenses/category", middleware.IsAuthorized(handlers.CreateCategoryHandler, "user")).Methods("POST")
	r.HandleFunc("/expenses", middleware.IsAuthorized(handlers.CreateExpenseHandler, "user")).Methods("POST")
	r.HandleFunc("/expenses/{id}", middleware.IsAuthorized(handlers.GetExpenseByIdHandler, "user")).Methods("GET")
	r.HandleFunc("/expenses", middleware.IsAuthorized(handlers.UpdateExpenseHandler, "user")).Methods("PATCH")
	r.HandleFunc("/expenses/{id}", middleware.IsAuthorized(handlers.DeleteExpenseHandler, "user")).Methods("DELETE")
	return r
}
