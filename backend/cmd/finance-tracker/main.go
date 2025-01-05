package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/notrishabh/finance-tracker/internal/db"
	"github.com/notrishabh/finance-tracker/pkg/repository"
	"github.com/rs/cors"
)

func main() {
	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	cors_origin := os.Getenv("CORS_ORIGIN")
	if cors_origin == "" {
		log.Fatal("CORS_ORIGIN is not set to the frontend URL in env var")
	}

	db.Init()
	repository.InitRepo()
	repository.InitUserRepo()
	router := InitRouter()
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{cors_origin},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "Cookie"},
		AllowCredentials: true,
	})
	handler := c.Handler(router)

	log.Printf("Server starting on port %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
