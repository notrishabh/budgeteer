FROM golang:1.20

# Set the working directory inside the container
WORKDIR /backend

# Copy go.mod and go.sum to install dependencies
COPY go.mod go.sum ./

# Install dependencies
RUN go mod tidy

# Copy the rest of the application code into the container
COPY . .

# Expose the port the Go app will run on
EXPOSE 8080

# Run the Go application
CMD ["go", "run", "main.go"]
