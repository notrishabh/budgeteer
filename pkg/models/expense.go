package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Expense struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserID    primitive.ObjectID `bson:"user_id,omitempty" json:"user_id,omitempty"`
	Name      string             `bson:"name,omitempty" json:"name,omitempty"`
	Category  Category           `bson:"category,omitempty" json:"category"`
	Price     uint               `bson:"price,omitempty" json:"price"`
	CreatedAt primitive.DateTime `bson:"created_at,omitempty" json:"created_at"`
	UpdatedAt primitive.DateTime `bson:"updated_at,omitempty" json:"updated_at"`
}
