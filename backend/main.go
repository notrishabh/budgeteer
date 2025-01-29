package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/notrishabh/finance-tracker/internal/db"
	"github.com/notrishabh/finance-tracker/pkg/repository"
)

func main() {
	// Load environment variables from .env file
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("PORT env var no set")
	}

	cors_origin := os.Getenv("CORS_ORIGIN")
	if cors_origin == "" {
		log.Fatal("CORS_ORIGIN is not set to the frontend URL in env var")
	}

	db.Init()
	repository.InitRepo()
	repository.InitUserRepo()
	router := InitRouter()

	log.Printf("Server starting on port %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
