package main

import (
	"log"
	"net/http"

	"github.com/notrishabh/finance-tracker/internal/db"
	"github.com/notrishabh/finance-tracker/pkg/repository"
	"github.com/rs/cors"
)

func main() {
	db.Init()
	repository.InitRepo()
	repository.InitUserRepo()
	router := InitRouter()
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
	})
	handler := c.Handler(router)
	log.Fatal(http.ListenAndServe(":8080", handler))
}
