# NexaChain AI - Technical Assessment API Documentation

Base URL: `http://localhost:8080/api`

---

## 1. Authentication APIs

### 1.1 User Registration

- **Endpoint:** `POST /auth/register`
- **Access:** Public
- **Description:** Register a new user with automatic unique referral code generation and optional referral sponsorship.

#### Request Body

```json
{
  "fullName": "Alice Johnson",
  "email": "alice@example.com",
  "mobile": "+1234567890",
  "password": "Password123!",
  "referralCode": "NEXA123456" // Optional
}
```

#### Response (201 Created)

```json
{
	"success": true,
	"message": "User registered successfully",
	"data": {
		"user": {
			"id": "6720f4c3a6479b12a84a1001",
			"fullName": "Alice Johnson",
			"email": "alice@example.com",
			"mobile": "+1234567890",
			"referralCode": "NEXAA1B2C3",
			"referredBy": "6720f4b3a6479b12a84a0999",
			"walletBalance": 0,
			"status": "active"
		},
		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
	}
}
```

---

### 1.2 User Login

- **Endpoint:** `POST /auth/login`
- **Access:** Public
- **Description:** Authenticate user and obtain a JWT bearer token.

#### Request Body

```json
{
	"email": "alice@example.com",
	"password": "Password123!"
}
```

#### Response (200 OK)

```json
{
	"success": true,
	"message": "Login successful",
	"data": {
		"user": {
			"id": "6720f4c3a6479b12a84a1001",
			"fullName": "Alice Johnson",
			"email": "alice@example.com",
			"mobile": "+1234567890",
			"referralCode": "NEXAA1B2C3",
			"referredBy": "6720f4b3a6479b12a84a0999",
			"walletBalance": 150.0,
			"totalRoiEarned": 50.0,
			"totalLevelIncomeEarned": 100.0,
			"status": "active"
		},
		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
	}
}
```

---

### 1.3 Get Current User Profile (JWT Authentication Check)

- **Endpoint:** `GET /auth/me`
- **Access:** Private (Requires `Authorization: Bearer <token>`)

#### Response (200 OK)

```json
{
	"success": true,
	"data": {
		"user": {
			"_id": "6720f4c3a6479b12a84a1001",
			"fullName": "Alice Johnson",
			"email": "alice@example.com",
			"mobile": "+1234567890",
			"referralCode": "NEXAA1B2C3",
			"walletBalance": 150,
			"status": "active"
		}
	}
}
```

---

## 2. Investment APIs

### 2.1 Create Investment

- **Endpoint:** `POST /investments`
- **Access:** Private (`Authorization: Bearer <token>`)
- **Description:** Creates an active investment package and calculates/credits level referral commissions across the sponsor chain.

#### Request Body

```json
{
	"amount": 1000,
	"planName": "Gold Plan 30D",
	"durationDays": 30,
	"dailyRoiPercentage": 1.5
}
```

#### Response (201 Created)

```json
{
	"success": true,
	"message": "Investment created successfully",
	"data": {
		"investment": {
			"_id": "6720f5cca6479b12a84a1005",
			"userId": "6720f4c3a6479b12a84a1001",
			"amount": 1000,
			"planDetails": {
				"planName": "Gold Plan 30D",
				"durationDays": 30
			},
			"startDate": "2026-10-29T10:45:00.000Z",
			"endDate": "2026-11-28T10:45:00.000Z",
			"dailyRoiPercentage": 1.5,
			"status": "Active",
			"createdAt": "2026-10-29T10:45:00.000Z"
		}
	}
}
```

---

### 2.2 View User Investments

- **Endpoint:** `GET /investments`
- **Access:** Private (`Authorization: Bearer <token>`)
- **Optional Query Parameters:** `?status=Active` or `?status=Completed`

#### Response (200 OK)

```json
{
	"success": true,
	"count": 1,
	"data": {
		"investments": [
			{
				"_id": "6720f5cca6479b12a84a1005",
				"userId": "6720f4c3a6479b12a84a1001",
				"amount": 1000,
				"planDetails": {
					"planName": "Gold Plan 30D",
					"durationDays": 30
				},
				"startDate": "2026-10-29T10:45:00.000Z",
				"endDate": "2026-11-28T10:45:00.000Z",
				"dailyRoiPercentage": 1.5,
				"status": "Active"
			}
		]
	}
}
```

---

## 3. Dashboard APIs

### 3.1 Fetch Dashboard Summary Metrics

- **Endpoint:** `GET /dashboard`
- **Access:** Private (`Authorization: Bearer <token>`)

#### Response (200 OK)

```json
{
	"success": true,
	"data": {
		"totalInvestments": 1000,
		"activeInvestments": 1000,
		"totalRoiEarned": 45.0,
		"totalLevelIncomeEarned": 50.0,
		"walletBalance": 95.0
	}
}
```

---

## 4. Referral APIs

### 4.1 Fetch Direct Referrals

- **Endpoint:** `GET /referrals/direct`
- **Access:** Private (`Authorization: Bearer <token>`)
- **Description:** Retrieves all Level 1 directly referred users.

#### Response (200 OK)

```json
{
	"success": true,
	"count": 2,
	"data": {
		"referrals": [
			{
				"_id": "6720f781a6479b12a84a1008",
				"fullName": "Bob Martin",
				"email": "bob@example.com",
				"mobile": "+1987654321",
				"referralCode": "NEXAB12345",
				"walletBalance": 0,
				"status": "active",
				"createdAt": "2026-10-29T10:40:00.000Z"
			}
		]
	}
}
```

---

### 4.2 Fetch Complete Referral Tree

- **Endpoint:** `GET /referrals/tree`
- **Access:** Private (`Authorization: Bearer <token>`)
- **Description:** Returns the hierarchical nested referral tree (Level 1, Level 2, Level 3...).

#### Response (200 OK)

```json
{
	"success": true,
	"data": {
		"tree": [
			{
				"_id": "6720f781a6479b12a84a1008",
				"fullName": "Bob Martin",
				"email": "bob@example.com",
				"mobile": "+1987654321",
				"referralCode": "NEXAB12345",
				"level": 1,
				"directReferralCount": 1,
				"children": [
					{
						"_id": "6720f800a6479b12a84a1010",
						"fullName": "Charlie Green",
						"email": "charlie@example.com",
						"mobile": "+1122334455",
						"referralCode": "NEXAC99999",
						"level": 2,
						"directReferralCount": 0,
						"children": []
					}
				]
			}
		]
	}
}
```
