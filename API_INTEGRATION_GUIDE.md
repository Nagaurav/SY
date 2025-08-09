# API Integration Guide for Samyā Yog

## Overview
This guide provides comprehensive documentation for integrating the React Native frontend with the backend API at `http://88.222.241.179:7000/api/v1`.

## Base Configuration

### Environment Setup
```typescript
// src/config/api.ts
export const API_CONFIG = {
  BASE_URL: {
    development: 'http://88.222.241.179:7000/api/v1',
    staging: 'http://88.222.241.179:7000/api/v1',
    production: 'http://88.222.241.179:7000/api/v1',
  },
  ENV: 'development', // Change for different environments
  TIMEOUT: 10000, // 10 seconds
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 50,
  },
};
```

### CORS Headers
The API configuration includes CORS headers for cross-origin requests:
```typescript
DEFAULT_HEADERS: {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}
```

## Authentication Endpoints

### 1. Send OTP
**Endpoint:** `POST /user/otp/sendotp`

**Request Body:**
```typescript
{
  phone: string;
  email?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  data?: {
    otp?: string; // For development/testing only
  };
}
```

### 2. Verify OTP
**Endpoint:** `POST /user/otp/verifyotp`

**Request Body:**
```typescript
{
  phone: string;
  otp: string;
  email?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  data?: {
    token?: string;
    user?: {
      id: string;
      name: string;
      email: string;
      phone: string;
    };
  };
}
```

### 3. Login with Email/Password
**Endpoint:** `POST /user/login`

**Request Body:**
```typescript
{
  email: string;
  password: string;
}
```

### 4. Signup
**Endpoint:** `POST /user/signup`

**Request Body:**
```typescript
{
  email: string;
  password: string;
  name: string;
  phone: string;
}
```

## FAQ Endpoints

### 1. Admin: Add FAQ
**Endpoint:** `POST /admin/faq/add`

**Request Body:**
```typescript
{
  question: string;
  answer: string;
  category: 'general' | 'booking' | 'payment' | 'technical' | 'professional' | 'yoga' | 'wellness';
  tags?: string[];
  is_active?: boolean;
  is_featured?: boolean;
}
```

**Example Request:**
```typescript
const faqData = {
  question: 'How do I book a yoga session?',
  answer: 'To book a yoga session, follow these steps: 1. Browse available professionals in the Explore section, 2. Select a professional and view their profile, 3. Choose your preferred date and time slot, 4. Complete the booking process and payment. You will receive a confirmation email with session details.',
  category: 'booking',
  tags: ['booking', 'yoga', 'session'],
  is_active: true,
  is_featured: true,
};

const response = await faqService.addFAQ(faqData);
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  data: FAQ;
}
```

### 2. Get User FAQs
**Endpoint:** `GET /user/faq/get`

**Query Parameters:**
```typescript
interface FAQQueryParams {
  page?: number;                    // Default: 1
  limit?: number;                   // Default: 10, Max: 50
  category?: 'general' | 'booking' | 'payment' | 'technical' | 'professional' | 'yoga' | 'wellness';
  search?: string;                  // Search in questions and answers
  sort_by?: 'created_at' | 'updated_at' | 'title' | 'category';
  is_active?: boolean;              // Filter by active status
}
```

**Example Request:**
```typescript
// Get featured FAQs for users
const params = {
  is_featured: true,
  page: 1,
  limit: 10
};

const response = await faqService.getUserFAQs(params);
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  data: FAQ[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
```

### 3. Get Professional FAQs
**Endpoint:** `GET /professional/faq/get`

**Query Parameters:**
```typescript
interface FAQQueryParams {
  page?: number;                    // Default: 1
  limit?: number;                   // Default: 10, Max: 50
  category?: 'general' | 'booking' | 'payment' | 'technical' | 'professional' | 'yoga' | 'wellness';
  search?: string;                  // Search in questions and answers
  sort_by?: 'created_at' | 'updated_at' | 'title' | 'category';
  is_active?: boolean;              // Filter by active status
}
```

**Example Request:**
```typescript
// Get professional-related FAQs
const params = {
  category: 'professional',
  page: 1,
  limit: 10
};

const response = await faqService.getProfessionalFAQs(params);
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  data: FAQ[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
```

## FAQ Data Structure

```typescript
interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'booking' | 'payment' | 'technical' | 'professional' | 'yoga' | 'wellness';
  tags?: string[];
  is_active: boolean;
  is_featured?: boolean;
  view_count?: number;
  helpful_count?: number;
  not_helpful_count?: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
  last_updated_by?: string;
}

interface FAQCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  faq_count: number;
}
```

## Customer Support Endpoints

### 1. Create Support Ticket
**Endpoint:** `POST /user/customer-support/create`

**Request Body:**
```typescript
{
  subject: string;
  description: string;
  category: 'technical' | 'billing' | 'booking' | 'general' | 'complaint' | 'feedback';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  attachments?: string[];
  tags?: string[];
}
```

**Example Request:**
```typescript
const ticketData = {
  subject: 'Payment Issue - Transaction Failed',
  description: 'I tried to book a yoga session but the payment failed. I received an error message saying "Transaction declined". I have sufficient balance in my account. Please help me resolve this issue.',
  category: 'billing',
  priority: 'high',
  tags: ['payment', 'booking'],
};

const response = await customerSupportService.createTicket(ticketData);
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  data: CustomerSupportTicket;
}
```

### 2. Get User Support Tickets
**Endpoint:** `GET /user/customer-support/{user_id}`

**Query Parameters:**
```typescript
interface CustomerSupportQueryParams {
  page?: number;                    // Default: 1
  limit?: number;                   // Default: 10, Max: 50
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: 'technical' | 'billing' | 'booking' | 'general' | 'complaint' | 'feedback';
  sort_by?: 'created_at' | 'updated_at' | 'priority' | 'status';
}
```

**Example Request:**
```typescript
// Get open tickets for a user
const params = {
  status: 'open',
  page: 1,
  limit: 10
};

const response = await customerSupportService.getUserTickets('user_123', params);
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  data: CustomerSupportTicket[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
```

## Customer Support Data Structure

```typescript
interface CustomerSupportTicket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  category: 'technical' | 'billing' | 'booking' | 'general' | 'complaint' | 'feedback';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  attachments?: string[];
  tags?: string[];
  user_info?: {
    name: string;
    email: string;
    phone: string;
  };
  responses?: CustomerSupportResponse[];
}

interface CustomerSupportResponse {
  id: string;
  ticket_id: string;
  user_id?: string;
  support_agent_id?: string;
  message: string;
  is_from_support: boolean;
  created_at: string;
  attachments?: string[];
}
```

## Professional Filter Endpoints

### 1. Get Filtered Professionals
**Endpoint:** `GET /professional/filter`

**Query Parameters:**
```typescript
interface ProfessionalFilterQueryParams {
  page?: number;                    // Default: 1
  limit?: number;                   // Default: 10, Max: 50
  is_online?: boolean;              // Filter online professionals
  duration?: number;                // Filter by session duration (minutes)
  category?: string;                // Filter by category
  expertise?: string;               // Filter by expertise
  city?: string;                    // Filter by city
  min_rating?: number;              // Minimum rating filter
  max_price?: number;               // Maximum price filter
  min_price?: number;               // Minimum price filter
  gender?: 'all' | 'male' | 'female'; // Filter by gender
  languages?: string;               // Filter by languages
  sort_by?: 'rating' | 'experience' | 'price_low_to_high' | 'price_high_to_low' | 'distance';
  latitude?: number;                // For location-based sorting
  longitude?: number;               // For location-based sorting
  availability?: 'available_now' | 'available_today' | 'available_this_week';
  service_type?: 'consultation' | 'therapy' | 'class' | 'workshop';
}
```

**Example Request:**
```typescript
// Get online professionals with 30-minute sessions
const params = {
  is_online: true,
  duration: 30,
  page: 1,
  limit: 10
};

const response = await professionalFilterService.getFilteredProfessionals(params);
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  data: Professional[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters_applied: {
    is_online?: boolean;
    duration?: number;
    category?: string;
    city?: string;
    min_rating?: number;
    price_range?: {
      min: number;
      max: number;
    };
  };
}
```

## Professional Data Structure

```typescript
interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  category: string;
  expertise: string[];
  experience_years: number;
  rating: number;
  total_reviews: number;
  is_online: boolean;
  is_offline: boolean;
  is_home_visit: boolean;
  consultation_fee: number;
  duration: number; // in minutes
  languages: string[];
  city: string;
  location: string;
  latitude?: number;
  longitude?: number;
  bio: string;
  education: string[];
  certifications: string[];
  specializations: string[];
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  working_hours: {
    start_time: string;
    end_time: string;
  };
  created_at: string;
  updated_at: string;
}
```

## Professional Slot Management Endpoints

### 1. Create Slot
**Endpoint:** `POST /professional/slot/create`

**Request Body:**
```typescript
{
  professional_id: string;
  date: string; // YYYY-MM-DD format
  start_time: string; // HH:MM:SS format
  end_time: string; // HH:MM:SS format
  slot_type: 'online' | 'offline' | 'home_visit';
  price?: number;
  location?: string;
  notes?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  data: ProfessionalSlot;
}
```

### 2. Get All Slots
**Endpoint:** `GET /professional/slot/get`

**Query Parameters:**
```typescript
interface ProfessionalSlotsQueryParams {
  page?: number;                    // Default: 1
  limit?: number;                   // Default: 10, Max: 50
  professional_id?: string;         // Filter by professional ID
  date?: string;                    // Filter by specific date (YYYY-MM-DD)
  start_date?: string;              // Filter by date range start
  end_date?: string;                // Filter by date range end
  is_available?: boolean;           // Filter by availability
  slot_type?: 'online' | 'offline' | 'home_visit'; // Filter by slot type
  time_slot?: string;               // Filter by time slot
}
```

**Example Request:**
```typescript
// Get available online slots for a specific professional on a date
const params = {
  professional_id: 'prof_123',
  date: '2025-01-15',
  is_available: true,
  slot_type: 'online',
  page: 1,
  limit: 10
};

const response = await professionalSlotsService.getSlots(params);
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  data: ProfessionalSlot[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
```

### 3. Get Slot by ID
**Endpoint:** `GET /professional/slot/get/{slotId}`

**Response:**
```typescript
{
  success: boolean;
  message: string;
  data: ProfessionalSlot;
}
```

### 4. Update Slot
**Endpoint:** `PUT /professional/slot/update/{slotId}`

**Request Body:**
```typescript
{
  date?: string;
  start_time?: string;
  end_time?: string;
  slot_type?: 'online' | 'offline' | 'home_visit';
  is_available?: boolean;
  price?: number;
  location?: string;
  notes?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  data: ProfessionalSlot;
}
```

### 5. Delete Slot
**Endpoint:** `DELETE /professional/slot/delete/{slotId}`

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

## Professional Slot Data Structure

```typescript
interface ProfessionalSlot {
  id: string;
  professional_id: string;
  date: string; // YYYY-MM-DD format
  start_time: string; // HH:MM:SS format
  end_time: string; // HH:MM:SS format
  slot_type: 'online' | 'offline' | 'home_visit';
  is_available: boolean;
  is_booked: boolean;
  booking_id?: string;
  price?: number;
  location?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
```

## Yoga Classes Endpoints

### 1. Get Yoga Classes (with filtering)
**Endpoint:** `GET /user/yoga-classes`

**Query Parameters:**
```typescript
interface YogaClassesQueryParams {
  page?: number;                    // Default: 1
  limit?: number;                   // Default: 10, Max: 50
  city?: string;                    // Filter by city
  group_online?: boolean;           // Filter online group classes
  group_offline?: boolean;          // Filter offline group classes
  one_to_one_online?: boolean;      // Filter online 1-on-1 classes
  one_to_one_offline?: boolean;     // Filter offline 1-on-1 classes
  home_visit?: boolean;             // Filter home visit classes
  min_price?: number;               // Minimum price filter
  max_price?: number;               // Maximum price filter
  disease?: string;                 // Filter by disease/specialization
  is_disease_specific?: boolean;    // Filter disease-specific classes
  gender_focus?: 'all' | 'male' | 'female';
  duration?: 'ONE_MONTH' | 'THREE_MONTHS' | 'SIX_MONTHS' | 'ONE_YEAR';
  sort_by?: 'price_low_to_high' | 'price_high_to_low' | 'near_to_far' | 'far_to_near';
  latitude?: number;                // For location-based sorting
  longitude?: number;               // For location-based sorting
  allow_mid_month_entry?: boolean;  // Filter by mid-month entry availability
  languages?: string;               // Filter by languages
}
```

**Example Request:**
```typescript
// Get online yoga classes in Mumbai for back pain, sorted by price low to high
const params = {
  city: 'Mumbai',
  group_online: true,
  one_to_one_online: true,
  disease: 'Back Pain',
  is_disease_specific: true,
  sort_by: 'price_low_to_high',
  page: 1,
  limit: 10
};

const response = await yogaClassesService.getYogaClasses(params);
```

**Response:**
```typescript
{
  msg: string;
  data: YogaClass[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
```

### 2. Get Yoga Class Details
**Endpoint:** `GET /user/yoga-classes/{classId}`

**Response:**
```typescript
{
  data: YogaClass;
}
```

### 3. Book Yoga Class
**Endpoint:** `POST /user/yoga-classes/book`

**Request Body:**
```typescript
{
  class_id: number;
  booking_type: 'group_online' | 'group_offline' | 'one_to_one_online' | 'one_to_one_offline' | 'home_visit';
  user_id: string;
  payment_method?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  data?: {
    booking_id: string;
    payment_url?: string;
  };
}
```

### 4. Get My Yoga Classes
**Endpoint:** `GET /user/yoga-classes/my-classes`

**Response:**
```typescript
{
  data: YogaClass[];
}
```

## Yoga Class Data Structure

```typescript
interface YogaClass {
  id: number;
  professional_id: number;
  title: string;
  description: string;
  duration: 'ONE_MONTH' | 'THREE_MONTHS' | 'SIX_MONTHS' | 'ONE_YEAR';
  days: string; // Comma-separated days
  start_time: string;
  end_time: string;
  group_online: boolean;
  group_offline: boolean;
  one_to_one_online: boolean;
  one_to_one_offline: boolean;
  home_visit: boolean;
  languages: string; // Comma-separated languages
  is_disease_specific: boolean;
  disease?: string;
  price_home_visit: number;
  price_one_to_one_online: number | null;
  price_one_to_one_offline: number;
  price_group_online: number;
  price_group_offline: number;
  max_participants_online: number;
  max_participants_offline: number;
  allow_mid_month_entry: boolean;
  gender_focus: 'all' | 'male' | 'female';
  location: string;
  city?: string;
  time_slot?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
  effective_price: number;
}
```

## Booking Endpoints

### 1. Create Booking
**Endpoint:** `POST /booking/create`

### 2. Calculate Price
**Endpoint:** `POST /booking/calculate-price`

### 3. Get Payment Status
**Endpoint:** `GET /booking/payment-status/{bookingId}`

### 4. Get User Bookings
**Endpoint:** `GET /booking/user/{userId}`

### 5. Cancel Booking
**Endpoint:** `PUT /booking/cancel/{bookingId}`

## Error Handling

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Format
```typescript
{
  success: false;
  message: string;
  error?: string;
}
```

### Frontend Error Handling
```typescript
try {
  const response = await makeApiRequest(endpoint, method, body, queryParams);
  return response;
} catch (error: any) {
  // Handle specific error types
  if (error.name === 'AbortError') {
    throw new Error('Request timeout. Please check your connection and try again.');
  }
  
  if (error.message.includes('Network request failed')) {
    throw new Error('Network error. Please check your internet connection.');
  }
  
  throw error;
}
```

## Authentication & Token Management

### Token Storage
```typescript
// Store token after successful authentication
await setAuthToken(token);

// Retrieve token for API requests
const token = await getAuthToken();

// Remove token on logout
await removeAuthToken();
```

### Automatic Token Inclusion
The `makeApiRequest` function automatically includes the Authorization header for all requests except auth endpoints:
```typescript
if (!endpoint.includes('/otp/') && !endpoint.includes('/login') && !endpoint.includes('/signup')) {
  const token = await getAuthToken();
  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }
}
```

## Query Parameter Best Practices

### 1. Boolean Parameters
Convert booleans to strings for backend compatibility:
```typescript
const buildQueryString = (params: Record<string, any>): string => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'boolean') {
        queryParams.append(key, value.toString()); // "true" or "false"
      } else {
        queryParams.append(key, value.toString());
      }
    }
  });
  
  return queryParams.toString() ? `?${queryParams.toString()}` : '';
};
```

### 2. Pagination
Always include pagination parameters:
```typescript
const queryParams = {
  page: 1,
  limit: 10,
  // ... other filters
};
```

### 3. Filter Combinations
Build dynamic query parameters based on user selections:
```typescript
const buildQueryParams = (): FAQQueryParams => {
  const params: FAQQueryParams = {
    page: pagination.page,
    limit: pagination.limit,
  };

  if (selectedCategory) params.category = selectedCategory;
  if (searchTerm) params.search = searchTerm;
  if (isActiveOnly) params.is_active = true;
  // ... more filters

  return params;
};
```

## Testing with Postman

### 1. Test FAQ Add Endpoint (Admin)
```
POST http://88.222.241.179:7000/api/v1/admin/faq/add
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE

{
  "question": "How do I book a yoga session?",
  "answer": "To book a yoga session, follow these steps: 1. Browse available professionals in the Explore section, 2. Select a professional and view their profile, 3. Choose your preferred date and time slot, 4. Complete the booking process and payment. You will receive a confirmation email with session details.",
  "category": "booking",
  "tags": ["booking", "yoga", "session"],
  "is_active": true,
  "is_featured": true
}
```

### 2. Test FAQ Get Endpoint (User)
```
GET http://88.222.241.179:7000/api/v1/user/faq/get?category=booking&page=1&limit=10
Authorization: Bearer YOUR_TOKEN_HERE
```

### 3. Test FAQ Get Endpoint (Professional)
```
GET http://88.222.241.179:7000/api/v1/professional/faq/get?category=professional&page=1&limit=10
Authorization: Bearer YOUR_TOKEN_HERE
```

### 4. Test Customer Support Create Endpoint
```
POST http://88.222.241.179:7000/api/v1/user/customer-support/create
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "subject": "Payment Issue - Transaction Failed",
  "description": "I tried to book a yoga session but the payment failed. I received an error message saying \"Transaction declined\". I have sufficient balance in my account. Please help me resolve this issue.",
  "category": "billing",
  "priority": "high",
  "tags": ["payment", "booking"]
}
```

### 5. Test Customer Support Get Endpoint
```
GET http://88.222.241.179:7000/api/v1/user/customer-support/user_123?status=open&page=1&limit=10
Authorization: Bearer YOUR_TOKEN_HERE
```

### 6. Test Professional Filter Endpoint
```
GET http://88.222.241.179:7000/api/v1/professional/filter?is_online=true&duration=30&page=1&limit=10
```

### 7. Test Professional Slots Endpoint
```
GET http://88.222.241.179:7000/api/v1/professional/slot/get?professional_id=prof_123&date=2025-01-15&is_available=true
```

### 8. Test Create Slot Endpoint
```
POST http://88.222.241.179:7000/api/v1/professional/slot/create
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "professional_id": "prof_123",
  "date": "2025-01-15",
  "start_time": "09:00:00",
  "end_time": "10:00:00",
  "slot_type": "online",
  "price": 500,
  "location": "Online",
  "notes": "Morning session"
}
```

### 9. Test Yoga Classes Endpoint
```
GET http://88.222.241.179:7000/api/v1/user/yoga-classes?city=Mumbai&group_online=true&sort_by=price_low_to_high&page=1&limit=10
```

### 10. Test OTP Endpoint
```
POST http://88.222.241.179:7000/api/v1/user/otp/sendotp
Content-Type: application/json

{
  "phone": "+919876543210"
}
```

### 11. Test with Authentication
```
GET http://88.222.241.179:7000/api/v1/user/yoga-classes
Authorization: Bearer YOUR_TOKEN_HERE
```

## Development vs Production

### Switching Between Mock and Real API
```typescript
// In faqService.ts
const fetchFAQs = async () => {
  try {
    // Use mock for development, real API for production
    const response = await faqService.getUserFAQsMock();
    // OR
    const response = await faqService.getUserFAQs(params);
  } catch (error) {
    // Handle error
  }
};
```

### Environment Configuration
```typescript
// Change environment in api.ts
export const API_CONFIG = {
  ENV: 'development', // Change to 'production' for live API
  // ...
};
```

## Performance Optimization

### 1. Request Caching
Implement caching for frequently accessed data:
```typescript
const cache = new Map();

const getCachedData = async (key: string, fetchFunction: () => Promise<any>) => {
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const data = await fetchFunction();
  cache.set(key, data);
  return data;
};
```

### 2. Debounced Search
Implement debounced search for better performance:
```typescript
import { debounce } from 'lodash';

const debouncedSearch = debounce((searchTerm: string) => {
  fetchFAQs({ search: searchTerm });
}, 300);
```

### 3. Infinite Scrolling
Implement pagination with infinite scrolling:
```typescript
const loadMoreFAQs = async () => {
  if (pagination.page < pagination.pages && !loading) {
    setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    // Append new data to existing data
  }
};
```

## Monitoring and Debugging

### 1. Request Logging
```typescript
console.log(`API Request: ${method} ${url}`, { body, queryParams });
console.log(`API Response: ${response.status} ${response.statusText}`);
```

### 2. Error Tracking
```typescript
console.error('API Request Error:', error);
// Send to error tracking service (e.g., Sentry)
```

### 3. Network Status Monitoring
```typescript
import NetInfo from '@react-native-async-storage/async-storage';

const checkNetworkStatus = async () => {
  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    // Show offline message
  }
};
```

## Security Best Practices

### 1. Token Security
- Store tokens securely using AsyncStorage
- Implement token refresh mechanism
- Clear tokens on logout

### 2. Input Validation
- Validate all user inputs before sending to API
- Sanitize query parameters
- Handle edge cases gracefully

### 3. Error Information
- Don't expose sensitive information in error messages
- Log errors for debugging but show user-friendly messages

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend has proper CORS headers
   - Check if frontend and backend are on different domains

2. **Authentication Errors**
   - Verify token is being sent correctly
   - Check token expiration
   - Ensure proper Authorization header format

3. **Network Timeouts**
   - Increase timeout value if needed
   - Implement retry mechanism
   - Check network connectivity

4. **Data Format Issues**
   - Verify request/response data structure matches TypeScript interfaces
   - Check for missing required fields
   - Validate data types

### Debug Checklist
- [ ] Check API endpoint URL
- [ ] Verify request headers
- [ ] Validate request body/query parameters
- [ ] Check authentication token
- [ ] Review error response
- [ ] Test with Postman
- [ ] Check network connectivity
- [ ] Verify backend is running

This guide should help ensure seamless integration between your React Native frontend and backend API. For any issues, refer to the troubleshooting section or contact the backend team. 