package main

import (
	"log"
	"net/http"

	"github.com/notrishabh/finance-tracker/internal/db"
	"github.com/notrishabh/finance-tracker/pkg/repository"
)

func main() {
	db.Init()
	repository.InitRepo()
	router := InitRouter()
	log.Fatal(http.ListenAndServe(":8080", router))
}
