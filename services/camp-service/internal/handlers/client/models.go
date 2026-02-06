package handlers

type CreateClientRequest struct {
	Name       string `json:"name"`
	FamilyName string `json:"family_name"`
	BirthDate  string `json:"birth_date"`
	Email      string `json:"email"`
	Number     string `json:"number"`
	Type       string `json:"type"`
}

type CreateClientResponse struct {
	ClientID string `json:"Client_id"`
}

type DeleteClientRequest struct {
	ClientID string `json:"Client_id"`
}

type GetAllClientResponse struct {
	Clients []struct {
		ID         string `json:"client_id"`
		Name       string `json:"name"`
		FamilyName string `json:"family_name"`
		BirthDate  string `json:"birth_date"`
		Email      string `json:"email"`
		Number     string `json:"number"`
		Type       string `json:"type"`
		CreatedAt  string `json:"created_at"`
	} `json:"clients"`
}

type GetCampByIdRequest struct {
	ClientID string `json:"client_id"`
}

type GetCampByIdResponse struct {
	Client struct {
		ID         string `json:"client_id"`
		Name       string `json:"name"`
		FamilyName string `json:"family_name"`
		BirthDate  string `json:"birth_date"`
		Email      string `json:"email"`
		Number     string `json:"number"`
		Type       string `json:"type"`
		CreatedAt  string `json:"created_at"`
	} `json:"client"`
}