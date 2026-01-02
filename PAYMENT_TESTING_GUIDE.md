# 💳 Payment Gateway Testing Guide

This guide covers how to test **Stripe** and **SSLCommerz** payment integrations in the NagarNirman donation system.

---

## 📋 Table of Contents

- [Prerequisites](#-prerequisites)
- [Environment Setup](#-environment-setup)
- [Testing Stripe](#-testing-stripe)
- [Testing SSLCommerz](#-testing-sslcommerz)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Frontend Testing](#-frontend-testing)
- [Troubleshooting](#-troubleshooting)

---

## ✅ Prerequisites

1. **Backend server running** on `http://localhost:5000`
2. **MongoDB** connected and running
3. **Environment variables** configured in `backend/.env`

---

## 🔧 Environment Setup

### Required Environment Variables

Add these to your `backend/.env` file:

```env
# Backend URL (for payment callbacks)
BACKEND_URL=http://localhost:5000

# STRIPE CONFIGURATION
# Get from: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# SSLCOMMERZ CONFIGURATION
# Get from: https://developer.sslcommerz.com/
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
```

### Frontend Environment Variables

Add to `frontend/.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
```

---

## 💳 Testing Stripe

### 1. Create a Stripe Checkout Session

**Request:**

```bash
curl -X POST http://localhost:5000/api/payments/stripe/create-session \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500,
    "donorName": "Test User",
    "donorEmail": "test@example.com",
    "donorPhone": "01700000000",
    "isMonthly": false,
    "isAnonymous": false,
    "message": "Test donation",
    "paymentProvider": "card"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "sessionId": "cs_test_xxx...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_xxx...",
  "donationId": "6957xxx..."
}
```

### 2. Complete Payment in Browser

1. Open the `url` from the response in your browser
2. Use test card details:
   - **Card Number**: `4242 4242 4242 4242`
   - **Expiry**: Any future date (e.g., `12/34`)
   - **CVC**: Any 3 digits (e.g., `123`)
   - **Name**: Any name
   - **ZIP**: Any ZIP code (e.g., `12345`)

### 3. Verify Payment

After completing payment, you'll be redirected to the success page. Verify with:

```bash
curl -X GET http://localhost:5000/api/payments/stripe/verify/{sessionId}
```

**Expected Response:**

```json
{
  "success": true,
  "status": "completed",
  "donation": {
    "amount": 500,
    "donorName": "Test User",
    "isMonthly": false,
    "transactionId": "pi_xxx..."
  }
}
```

### Stripe Test Cards

| Card Number           | Description                       |
| --------------------- | --------------------------------- |
| `4242 4242 4242 4242` | Successful payment                |
| `4000 0000 0000 0002` | Card declined                     |
| `4000 0000 0000 9995` | Insufficient funds                |
| `4000 0000 0000 3220` | 3D Secure authentication required |

---

## 📱 Testing SSLCommerz

### 1. Initialize SSLCommerz Payment

**Request:**

```bash
curl -X POST http://localhost:5000/api/payments/sslcommerz/init \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "donorName": "Test User",
    "donorEmail": "test@example.com",
    "donorPhone": "01700000000",
    "isMonthly": false,
    "isAnonymous": false,
    "message": "Test donation via bKash",
    "paymentProvider": "bkash"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "url": "https://sandbox.sslcommerz.com/EasyCheckOut/testcxxx...",
  "sessionKey": "EXXX...",
  "transactionId": "NAGAR_1767xxx_XXX",
  "donationId": "6957xxx..."
}
```

### 2. Complete Payment in Browser

1. Open the `url` from the response
2. Choose a payment method (bKash, Nagad, Card, etc.)
3. In sandbox mode, use test credentials:
   - **Mobile Wallet**: Any valid format number
   - **Card**: Use Stripe test cards or SSLCommerz test cards
   - **OTP**: Usually `123456` or any 6 digits in sandbox

### 3. Verify Payment

After completing payment:

```bash
curl -X GET http://localhost:5000/api/payments/sslcommerz/verify/{transactionId}
```

**Expected Response:**

```json
{
  "success": true,
  "status": "completed",
  "donation": {
    "amount": 100,
    "donorName": "Test User",
    "isMonthly": false,
    "transactionId": "NAGAR_1767xxx_XXX"
  },
  "verification": { ... }
}
```

### SSLCommerz Sandbox Test Credentials

| Payment Method    | Test Credentials                             |
| ----------------- | -------------------------------------------- |
| **bKash**         | Mobile: `01711xxxxxx`, OTP: `123456`         |
| **Nagad**         | Mobile: `01711xxxxxx`, OTP: `123456`         |
| **Card (Visa)**   | `4111111111111111`, Exp: `12/30`, CVV: `123` |
| **Card (Master)** | `5111111111111111`, Exp: `12/30`, CVV: `123` |

---

## 📡 API Endpoints Reference

### Stripe Endpoints

| Method | Endpoint                                 | Description               |
| ------ | ---------------------------------------- | ------------------------- |
| `POST` | `/api/payments/stripe/create-session`    | Create checkout session   |
| `POST` | `/api/payments/stripe/webhook`           | Webhook for Stripe events |
| `GET`  | `/api/payments/stripe/verify/:sessionId` | Verify payment status     |

### SSLCommerz Endpoints

| Method | Endpoint                                         | Description                  |
| ------ | ------------------------------------------------ | ---------------------------- |
| `POST` | `/api/payments/sslcommerz/init`                  | Initialize payment           |
| `POST` | `/api/payments/sslcommerz/success`               | Success callback             |
| `POST` | `/api/payments/sslcommerz/fail`                  | Failure callback             |
| `POST` | `/api/payments/sslcommerz/cancel`                | Cancellation callback        |
| `POST` | `/api/payments/sslcommerz/ipn`                   | Instant Payment Notification |
| `GET`  | `/api/payments/sslcommerz/verify/:transactionId` | Verify payment               |

### Donation Endpoints

| Method | Endpoint                         | Description               |
| ------ | -------------------------------- | ------------------------- |
| `GET`  | `/api/payments/donations/recent` | Get recent donations      |
| `GET`  | `/api/payments/donations/stats`  | Get donation statistics   |
| `GET`  | `/api/payments/donations`        | Get all donations (Admin) |

---

## 🖥️ Frontend Testing

### Test Donation Flow

1. Navigate to `http://localhost:3000/donate`
2. Select an amount or enter a custom amount
3. Choose a payment method:
   - **Card (Stripe)**: For international card payments
   - **bKash/Nagad/Rocket**: For local mobile payments via SSLCommerz
4. Fill in donor information
5. Click "Donate Now"
6. Complete payment on the gateway
7. Verify redirect to success/failure page

### Test URLs

| Page         | URL                                    |
| ------------ | -------------------------------------- |
| Donate Page  | `http://localhost:3000/donate`         |
| Success Page | `http://localhost:3000/donate/success` |
| Failed Page  | `http://localhost:3000/donate/failed`  |
| Cancel Page  | `http://localhost:3000/donate/cancel`  |

---

## 🧪 Quick Test Commands

### Check All Endpoints

```bash
# Health check
curl http://localhost:5000/api/health

# Get donation stats
curl http://localhost:5000/api/payments/donations/stats

# Get recent donations
curl http://localhost:5000/api/payments/donations/recent

# Test Stripe session creation
curl -X POST http://localhost:5000/api/payments/stripe/create-session \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"donorName":"Test","donorEmail":"test@test.com","donorPhone":"01700000000","isMonthly":false,"isAnonymous":false}'

# Test SSLCommerz initialization
curl -X POST http://localhost:5000/api/payments/sslcommerz/init \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"donorName":"Test","donorEmail":"test@test.com","donorPhone":"01700000000","isMonthly":false,"isAnonymous":false}'
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. "STRIPE_SECRET_KEY is not configured"

- **Solution**: Add `STRIPE_SECRET_KEY` to your `.env` file

#### 2. "SSLCommerz credentials are not configured"

- **Solution**: Add `SSLCOMMERZ_STORE_ID` and `SSLCOMMERZ_STORE_PASSWORD` to `.env`

#### 3. "Invalid API Key provided" (Stripe)

- **Solution**: Ensure you're using the correct test/live key format (`sk_test_` or `sk_live_`)

#### 4. SSLCommerz returns "Invalid Store ID"

- **Solution**: Get valid sandbox credentials from [SSLCommerz Developer Panel](https://developer.sslcommerz.com/)

#### 5. Webhook verification fails

- **Solution**:
  - For local testing, use [Stripe CLI](https://stripe.com/docs/stripe-cli)
  - Run: `stripe listen --forward-to localhost:5000/api/payments/stripe/webhook`

### Debug Mode

Enable detailed logging by checking the terminal output when making requests.

---

## 📚 Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Test Cards](https://stripe.com/docs/testing)
- [SSLCommerz Documentation](https://developer.sslcommerz.com/)
- [SSLCommerz Sandbox](https://sandbox.sslcommerz.com/)

---

## ✅ Payment Integration Status

| Gateway        | Status     | Test Mode     | Production Ready         |
| -------------- | ---------- | ------------- | ------------------------ |
| **Stripe**     | ✅ Working | ✅ Configured | ⚠️ Need live keys        |
| **SSLCommerz** | ✅ Working | ✅ Configured | ⚠️ Need merchant account |

---

**Last Tested**: January 2, 2026  
**Backend Version**: 1.0.0
