# PhonePe Payment Integration Guide

## Overview
This guide explains how to integrate PhonePe payments into your React Native app using their web-based payment gateway.

## Prerequisites
1. PhonePe Merchant Account
2. Merchant ID, Salt Key, and Salt Index from PhonePe
3. Backend server to handle webhooks
4. Publicly accessible webhook URLs

## Configuration

### 1. PhonePe Merchant Setup
- Sign up for a PhonePe merchant account
- Get your Merchant ID, Salt Key, and Salt Index
- Configure your webhook URLs in PhonePe dashboard

### 2. Environment Configuration

#### Sandbox (Testing)
```javascript
MERCHANT_ID: 'PGTESTPAYUAT'
SALT_KEY: '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399'
SALT_INDEX: '1'
BASE_URL: 'https://api-preprod.phonepe.com/apis/pg-sandbox'
```

#### Production
```javascript
MERCHANT_ID: 'YOUR_PRODUCTION_MERCHANT_ID'
SALT_KEY: 'YOUR_PRODUCTION_SALT_KEY'
SALT_INDEX: 'YOUR_PRODUCTION_SALT_INDEX'
BASE_URL: 'https://api.phonepe.com/apis/hermes'
```

### 3. Webhook URLs
Configure these URLs in your PhonePe dashboard:
- **Redirect URL**: `https://yourdomain.com/phonepe/redirect`
- **Callback URL**: `https://yourdomain.com/api/v1/user/consultation-booking/webhook/phonepe`

## Implementation Steps

### Step 1: Frontend Integration

1. **Install Dependencies**
```bash
npm install axios
```

2. **Update PhonePe Configuration**
Edit `src/utils/phonepePayment.ts`:
```javascript
const PHONEPE_CONFIG = {
  MERCHANT_ID: 'YOUR_MERCHANT_ID',
  SALT_KEY: 'YOUR_SALT_KEY',
  SALT_INDEX: 'YOUR_SALT_INDEX',
  BASE_URL: 'https://api-preprod.phonepe.com/apis/pg-sandbox', // or production URL
  REDIRECT_URL: 'https://yourdomain.com/phonepe/redirect',
  CALLBACK_URL: 'https://yourdomain.com/api/v1/user/consultation-booking/webhook/phonepe',
  BACKEND_URL: 'https://yourdomain.com/api/v1/user/consultation-booking',
};
```

3. **Use in Your Component**
```javascript
import { startPhonePePayment } from '../utils/phonepePayment';

const handlePayment = async () => {
  const success = await startPhonePePayment(
    consultantId,
    amount,
    userPhone,
    userName
  );
  
  if (success) {
    // Payment initiated successfully
    console.log('Payment initiated');
  }
};
```

### Step 2: Backend Integration

1. **Webhook Handler**
The webhook handler is already provided in `backend/phonepe-webhook-handler.js`

2. **Route Configuration**
```javascript
// In your main app.js or routes file
const { handlePhonePeWebhook, getPaymentStatus, createBooking } = require('./phonepe-webhook-handler');

// Booking routes
app.post('/api/v1/user/consultation-booking/create', createBooking);
app.post('/api/v1/user/consultation-booking/webhook/phonepe', handlePhonePeWebhook);
app.get('/api/v1/user/consultation-booking/payment-status/:booking_id', getPaymentStatus);
```

3. **Database Schema**
```sql
-- Example MySQL schema
CREATE TABLE bookings (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  professional_id VARCHAR(50) NOT NULL,
  consultation_type ENUM('online', 'offline') NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  problem TEXT,
  payment_mode VARCHAR(20) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  user_phone VARCHAR(15),
  user_name VARCHAR(100),
  status ENUM('PENDING', 'CONFIRMED', 'CANCELLED') DEFAULT 'PENDING',
  payment_status ENUM('PENDING', 'PAID', 'FAILED') DEFAULT 'PENDING',
  phonepe_transaction_id VARCHAR(100),
  phonepe_response_code VARCHAR(10),
  phonepe_response_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Step 3: Payment Flow

1. **User initiates payment**
   - App calls `startPhonePePayment()`
   - Backend creates booking record
   - PhonePe payment URL is generated
   - User is redirected to PhonePe payment page

2. **Payment processing**
   - User completes payment on PhonePe
   - PhonePe sends webhook to your backend
   - Backend updates booking status
   - User returns to app

3. **Status verification**
   - App polls backend for payment status
   - Backend checks database for updated status
   - App shows success/failure message

## Security Considerations

### 1. Signature Verification
Always verify PhonePe webhook signatures:
```javascript
const verifyPhonePeSignature = (payload, receivedChecksum) => {
  const { checksum, ...payloadWithoutChecksum } = payload;
  const payloadString = JSON.stringify(payloadWithoutChecksum);
  const string = payloadString + saltKey;
  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
  const expectedChecksum = sha256 + '###' + saltIndex;
  return expectedChecksum === receivedChecksum;
};
```

### 2. Environment Variables
Store sensitive data in environment variables:
```javascript
// .env file
PHONEPE_MERCHANT_ID=your_merchant_id
PHONEPE_SALT_KEY=your_salt_key
PHONEPE_SALT_INDEX=your_salt_index
PHONEPE_ENVIRONMENT=sandbox
```

### 3. HTTPS
Always use HTTPS in production for webhook URLs.

## Testing

### 1. Sandbox Testing
- Use PhonePe sandbox credentials
- Test with small amounts
- Verify webhook responses
- Check database updates

### 2. Test Cards
PhonePe provides test cards for sandbox:
- Success: Any valid card number
- Failure: Use specific test card numbers
- Check PhonePe documentation for current test cards

## Error Handling

### Common Issues
1. **Invalid Signature**: Check salt key and signature generation
2. **Webhook Not Received**: Verify URL accessibility and PhonePe configuration
3. **Payment Status Not Updated**: Check database connection and webhook handler
4. **Redirect Issues**: Ensure redirect URL is properly configured

### Debugging
1. Check PhonePe dashboard for transaction logs
2. Monitor webhook logs in your backend
3. Verify database updates
4. Check network connectivity

## Production Checklist

- [ ] Switch to production PhonePe credentials
- [ ] Update webhook URLs to production domain
- [ ] Enable HTTPS for all endpoints
- [ ] Set up proper error monitoring
- [ ] Configure backup webhook endpoints
- [ ] Test with real payment amounts
- [ ] Set up payment analytics
- [ ] Configure user notifications

## Support

For PhonePe-specific issues:
- PhonePe Developer Documentation
- PhonePe Merchant Support
- PhonePe API Status Page

For integration issues:
- Check this guide
- Review error logs
- Test in sandbox environment first 