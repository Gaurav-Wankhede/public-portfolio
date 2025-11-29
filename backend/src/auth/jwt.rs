use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};

/// JWT Claims structure
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    pub sub: String,      // Subject (email)
    pub exp: usize,       // Expiration time
    pub iat: usize,       // Issued at
}

/// Authentication configuration using environment variables
#[derive(Clone)]
pub struct AuthConfig {
    pub admin_email: String,
    pub admin_password_hash: String,
    pub jwt_secret: String,
    pub jwt_expiry_hours: u64,
}

impl AuthConfig {
    /// Create AuthConfig from environment variables
    pub fn from_env(
        admin_email: String,
        admin_password: String,
        jwt_secret: Option<String>,
    ) -> Self {
        // Hash the password for secure comparison
        let admin_password_hash = bcrypt::hash(&admin_password, bcrypt::DEFAULT_COST)
            .expect("Failed to hash admin password");

        // Use provided JWT secret or generate from password
        let jwt_secret = jwt_secret.unwrap_or_else(|| {
            format!("portfolio-jwt-secret-{}", &admin_password)
        });

        Self {
            admin_email,
            admin_password_hash,
            jwt_secret,
            jwt_expiry_hours: 24, // Token valid for 24 hours
        }
    }

    /// Verify email and password, return JWT token if valid
    pub fn authenticate(&self, email: &str, password: &str) -> Result<String, AuthError> {
        // Check email matches
        if email != self.admin_email {
            tracing::warn!("Authentication failed: Invalid email '{}'", email);
            return Err(AuthError::InvalidCredentials);
        }

        // Verify password
        if !bcrypt::verify(password, &self.admin_password_hash).unwrap_or(false) {
            tracing::warn!("Authentication failed: Invalid password for '{}'", email);
            return Err(AuthError::InvalidCredentials);
        }

        // Generate JWT token
        self.generate_token(email)
    }

    /// Generate a JWT token for the given email
    fn generate_token(&self, email: &str) -> Result<String, AuthError> {
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .expect("Time went backwards")
            .as_secs() as usize;

        let expiry = now + (self.jwt_expiry_hours as usize * 3600);

        let claims = Claims {
            sub: email.to_string(),
            exp: expiry,
            iat: now,
        };

        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.jwt_secret.as_bytes()),
        )
        .map_err(|e| {
            tracing::error!("Failed to generate JWT token: {}", e);
            AuthError::TokenGenerationFailed
        })
    }

    /// Verify a JWT token and return the claims
    pub fn verify_token(&self, token: &str) -> Result<Claims, AuthError> {
        decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.jwt_secret.as_bytes()),
            &Validation::default(),
        )
        .map(|data| data.claims)
        .map_err(|e| {
            tracing::warn!("Token verification failed: {}", e);
            AuthError::InvalidToken
        })
    }

    /// Check if the email in claims is the admin
    pub fn is_admin(&self, claims: &Claims) -> bool {
        claims.sub == self.admin_email
    }
}

/// Authentication errors
#[derive(Debug, thiserror::Error)]
pub enum AuthError {
    #[error("Invalid email or password")]
    InvalidCredentials,

    #[error("Invalid or expired token")]
    InvalidToken,

    #[error("Failed to generate token")]
    TokenGenerationFailed,

    #[error("Unauthorized access")]
    Unauthorized,
}

impl From<AuthError> for axum::http::StatusCode {
    fn from(err: AuthError) -> Self {
        match err {
            AuthError::InvalidCredentials => axum::http::StatusCode::UNAUTHORIZED,
            AuthError::InvalidToken => axum::http::StatusCode::UNAUTHORIZED,
            AuthError::TokenGenerationFailed => axum::http::StatusCode::INTERNAL_SERVER_ERROR,
            AuthError::Unauthorized => axum::http::StatusCode::FORBIDDEN,
        }
    }
}

/// Login request body
#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

/// Login response body
#[derive(Debug, Serialize)]
pub struct LoginResponse {
    pub token: String,
    pub expires_in: u64,
    pub token_type: String,
}

/// User info extracted from token
#[derive(Debug, Clone)]
pub struct UserInfo {
    pub email: String,
}
