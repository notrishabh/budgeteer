package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt"
	"github.com/notrishabh/finance-tracker/pkg/utils"
)

// Create a context key for storing user info
type contextKey string

const userContextKey = contextKey("user")

func IsAuthorized(next http.HandlerFunc, requiredRole string) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get jwt token from headers
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization required", http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "Invalid authorization header format", http.StatusUnauthorized)
			return
		}

		tokenStr := parts[1]

		claims := &utils.Claims{}

		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
			return utils.JwtKey, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}

		// Check if the user has the correct role
		if claims.Role != requiredRole {
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}

		// Send user details to the next middleware
		ctx := context.WithValue(r.Context(), userContextKey, claims)

		// User is authorized, continue to the next handler
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func GetUserFromContext(ctx context.Context) *utils.Claims {
	user, ok := ctx.Value(userContextKey).(*utils.Claims)
	if !ok {
		return nil
	}
	return user
}
