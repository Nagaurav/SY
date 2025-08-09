// bookingService.ts
import { Alert } from 'react-native';

// Types for booking API
export interface BookingRequest {
  professionalId: string;
  userId: string;
  service: string;
  consultationMode: 'chat' | 'audio' | 'video' | 'in-person';
  dateTime: string;
  duration: number;
  amount: number;
  paymentMethod?: string;
}

export interface BookingResponse {
  success: boolean;
  bookingId: string;
  paymentUrl?: string;
  message?: string;
  data?: any;
}

export interface BookingDetails {
  id: string;
  professionalId: string;
  userId: string;
  service: string;
  consultationMode: string;
  dateTime: string;
  duration: number;
  amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  professional?: {
    id: string;
    name: string;
    expertise: string;
    avatar?: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface PriceCalculationRequest {
  professionalId: string;
  service: string;
  consultationMode: string;
  duration: number;
}

export interface PriceCalculationResponse {
  success: boolean;
  amount: number;
  currency: string;
  breakdown?: {
    basePrice: number;
    durationMultiplier: number;
    modeMultiplier: number;
  };
}

export interface PaymentStatusResponse {
  success: boolean;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  message?: string;
}

// Configuration
import { getEndpointUrl, getAuthToken, API_CONFIG } from '../config/api';

class BookingService {
  private async makeRequest(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any,
    headers?: Record<string, string>
  ): Promise<any> {
    try {
      const url = getEndpointUrl(endpoint);
      const requestHeaders = {
        ...API_CONFIG.DEFAULT_HEADERS,
        ...headers,
      };

      // Add auth token if available
      const token = await getAuthToken();
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }

      const requestOptions: RequestInit = {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('BookingService API Error:', error);
      throw new Error(error.message || 'Network request failed');
    }
  }

  // Create a new booking
  async createBooking(bookingData: BookingRequest): Promise<BookingResponse> {
    // Use mock data as requested by user
    return this.createBookingMock(bookingData);
  }

  // Calculate booking price
  async calculatePrice(priceData: PriceCalculationRequest): Promise<PriceCalculationResponse> {
    // Use mock data as requested by user
    return this.calculatePriceMock(priceData);
  }

  // Check payment status
  async getPaymentStatus(bookingId: string): Promise<PaymentStatusResponse> {
    // Use mock data as requested by user
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      status: 'completed',
      transactionId: `txn_${Date.now()}`,
      message: 'Payment completed successfully',
    };
  }

  // Get user's bookings
  async getUserBookings(userId: string): Promise<BookingDetails[]> {
    // Use mock data as requested by user
    return this.getUserBookingsMock(userId);
  }

  // Get professional's bookings
  async getProfessionalBookings(professionalId: string): Promise<BookingDetails[]> {
    // Use mock data as requested by user
    await new Promise(resolve => setTimeout(resolve, 1500));
    return [
      {
        id: 'booking_prof_1',
        professionalId,
        userId: 'user_123',
        service: 'Yoga Therapy',
        consultationMode: 'video',
        dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        duration: 60,
        amount: 1500,
        status: 'confirmed',
        paymentStatus: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
          id: 'user_123',
          name: 'John Doe',
          email: 'john@example.com',
        },
      },
    ];
  }

  // Get specific booking details
  async getBookingDetails(bookingId: string): Promise<BookingDetails> {
    // Use mock data as requested by user
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: bookingId,
      professionalId: 'prof_1',
      userId: 'user_123',
      service: 'Yoga Therapy',
      consultationMode: 'video',
      dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      duration: 60,
      amount: 1500,
      status: 'confirmed',
      paymentStatus: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      professional: {
        id: 'prof_1',
        name: 'Dr. Anya',
        expertise: 'Yoga Therapy',
      },
      user: {
        id: 'user_123',
        name: 'John Doe',
        email: 'john@example.com',
      },
    };
  }

  // Cancel a booking
  async cancelBooking(bookingId: string): Promise<{ success: boolean; message: string }> {
    // Use mock data as requested by user
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      message: 'Booking cancelled successfully',
    };
  }

  // Get payment analytics (for admin/professional dashboard)
  async getPaymentAnalytics(): Promise<any> {
    // Use mock data as requested by user
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      totalRevenue: 15000,
      totalBookings: 25,
      averageRating: 4.8,
      monthlyStats: [
        { month: 'Jan', revenue: 5000, bookings: 8 },
        { month: 'Feb', revenue: 6000, bookings: 10 },
        { month: 'Mar', revenue: 4000, bookings: 7 },
      ],
    };
  }

  // Mock method for development/testing
  async createBookingMock(bookingData: BookingRequest): Promise<BookingResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate success response
    return {
      success: true,
      bookingId: `booking_${Date.now()}`,
      paymentUrl: 'https://phonepe.com/pay/123456',
      message: 'Booking created successfully',
    };
  }

  async calculatePriceMock(priceData: PriceCalculationRequest): Promise<PriceCalculationResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock price calculation
    const basePrice = 1000;
    const durationMultiplier = priceData.duration / 60; // per hour
    const modeMultiplier = priceData.consultationMode === 'video' ? 1.2 : 1.0;
    
    const amount = Math.round(basePrice * durationMultiplier * modeMultiplier);
    
    return {
      success: true,
      amount,
      currency: 'INR',
      breakdown: {
        basePrice,
        durationMultiplier,
        modeMultiplier,
      },
    };
  }

  async getUserBookingsMock(userId: string): Promise<BookingDetails[]> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return [
      {
        id: 'booking_1',
        professionalId: 'prof_1',
        userId,
        service: 'Yoga Therapy',
        consultationMode: 'video',
        dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        duration: 60,
        amount: 1500,
        status: 'confirmed',
        paymentStatus: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        professional: {
          id: 'prof_1',
          name: 'Dr. Anya',
          expertise: 'Yoga Therapy',
        },
      },
      {
        id: 'booking_2',
        professionalId: 'prof_2',
        userId,
        service: 'Ayurveda Consultation',
        consultationMode: 'chat',
        dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 30,
        amount: 800,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        professional: {
          id: 'prof_2',
          name: 'Dr. Vikram',
          expertise: 'Ayurveda',
        },
      },
    ];
  }
}

export const bookingService = new BookingService(); 