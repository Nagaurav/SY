// authService.ts
import { getEndpointUrl, getAuthToken, setAuthToken, removeAuthToken, API_CONFIG } from '../config/api';

// Types for auth API
export interface SendOTPRequest {
  phone: string;
  email?: string;
}

export interface VerifyOTPRequest {
  phone: string;
  otp: string;
  email?: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface AuthResponse {
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
  error?: string;
}

export interface OTPResponse {
  success: boolean;
  message: string;
  data?: {
    otp?: string; // For development/testing
  };
}

class AuthService {
  private async makeRequest(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any,
    headers?: Record<string, string>
  ): Promise<any> {
    try {
      const url = getEndpointUrl(endpoint);
      const requestHeaders: Record<string, string> = {
        ...API_CONFIG.DEFAULT_HEADERS,
        ...headers,
      };

      // Add auth token if available (except for auth endpoints)
      if (!endpoint.includes('/otp/') && !endpoint.includes('/login') && !endpoint.includes('/signup')) {
        const token = await getAuthToken();
        if (token) {
          requestHeaders.Authorization = `Bearer ${token}`;
        }
      }

      const requestOptions: RequestInit = {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
      };

      console.log('AuthService Request:', {
        url,
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('AuthService Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        let errorData = {};
        try {
          const responseText = await response.text();
          console.error('AuthService Raw Error Response:', responseText);
          console.error('AuthService Response Status:', response.status);
          console.error('AuthService Response Headers:', Object.fromEntries(response.headers.entries()));
          
          // Try to parse as JSON, fallback to text
          try {
            errorData = JSON.parse(responseText);
          } catch (parseError) {
            errorData = { message: responseText || `HTTP ${response.status}: ${response.statusText}` };
          }
        } catch (parseError) {
          console.error('AuthService Error Response Parse Error:', parseError);
          errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
        }
        console.error('AuthService Error Response:', errorData);
        throw new Error(errorData.message || errorData.msg || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('AuthService API Error:', error);
      throw new Error(error.message || 'Network request failed');
    }
  }

  // Send OTP
  async sendOTP(request: SendOTPRequest): Promise<OTPResponse> {
    try {
      console.log('=== SEND OTP DEBUG ===');
      console.log('Original request:', request);
      
      // Format phone number to match API expectations (without country code)
      let formattedPhone = request.phone.trim();
      // Remove country code if present
      if (formattedPhone.startsWith('+91')) {
        formattedPhone = formattedPhone.substring(3);
      }
      // Remove leading zeros
      formattedPhone = formattedPhone.replace(/^0+/, '');
      
      // Validate phone number format
      if (formattedPhone.length !== 10) {
        throw new Error('Phone number must be exactly 10 digits');
      }
      
      // Format request body according to API expectations
      const requestBody = {
        phone: formattedPhone
      };
      
      console.log('Formatted phone:', formattedPhone);
      console.log('Formatted request body:', requestBody);
      console.log('API Endpoint:', API_CONFIG.ENDPOINTS.AUTH.SEND_OTP);
      console.log('Full URL:', getEndpointUrl(API_CONFIG.ENDPOINTS.AUTH.SEND_OTP));
      
      const response = await this.makeRequest(API_CONFIG.ENDPOINTS.AUTH.SEND_OTP, 'POST', requestBody);
      console.log('Raw OTP response:', response);
      
      // Handle the actual API response format
      // Transform the response to match our expected format
      return {
        success: true,
        message: response.msg || 'OTP sent successfully',
        data: response
      };
    } catch (error: any) {
      console.error('OTP send error details:', error);
      
      // Provide more specific error messages
      if (error.message.includes('Phone number must be exactly 10 digits')) {
        throw new Error('Please enter a valid 10-digit phone number');
      } else if (error.message.includes('Network')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      } else {
        throw new Error(`Failed to send OTP: ${error.message}`);
      }
    }
  }

  // Test API connection
  async testApiConnection(): Promise<boolean> {
    try {
      console.log('Testing API connection...');
      const response = await fetch(getEndpointUrl('/health'), {
        method: 'GET',
        headers: API_CONFIG.DEFAULT_HEADERS,
      });
      console.log('API connection test response:', response.status);
      return response.ok;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  // Test OTP endpoints
  async testOTPEndpoints(): Promise<{ sendOTP: boolean; verifyOTP: boolean; details: any }> {
    const testPhone = '9876543210'; // Without country code to match API expectations
    const testOTP = '123456';
    
    try {
      console.log('Testing OTP endpoints...');
      
      // Test send OTP
      const sendOTPResponse = await fetch(getEndpointUrl(API_CONFIG.ENDPOINTS.AUTH.SEND_OTP), {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify({ phone: testPhone }),
      });
      
      console.log('Send OTP test response:', sendOTPResponse.status);
      const sendOTPData = await sendOTPResponse.text();
      console.log('Send OTP test data:', sendOTPData);
      
      // Test verify OTP with correct format
      const verifyOTPResponse = await fetch(getEndpointUrl(API_CONFIG.ENDPOINTS.AUTH.VERIFY_OTP), {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify({ 
          phone: testPhone, 
          code: testOTP
        }),
      });
      
      console.log('Verify OTP test response:', verifyOTPResponse.status);
      const verifyOTPData = await verifyOTPResponse.text();
      console.log('Verify OTP test data:', verifyOTPData);
      
      return {
        sendOTP: sendOTPResponse.ok,
        verifyOTP: verifyOTPResponse.ok,
        details: {
          sendOTPStatus: sendOTPResponse.status,
          sendOTPData: sendOTPData,
          verifyOTPStatus: verifyOTPResponse.status,
          verifyOTPData: verifyOTPData,
        }
      };
    } catch (error) {
      console.error('OTP endpoints test failed:', error);
      return { 
        sendOTP: false, 
        verifyOTP: false, 
        details: { error: error.message }
      };
    }
  }

  // Test different request formats for OTP verification
  async testOTPFormats(): Promise<any> {
    const testPhone = '9876543210'; // Without country code to match API expectations
    const testOTP = '123456';
    
    const formats = [
      { name: 'otp_code only', body: { phone: testPhone, otp_code: testOTP } },
      { name: 'otp only', body: { phone: testPhone, otp: testOTP } },
      { name: 'both fields', body: { phone: testPhone, otp: testOTP, otp_code: testOTP } },
      { name: 'code field', body: { phone: testPhone, code: testOTP } },
      { name: 'verification_code', body: { phone: testPhone, verification_code: testOTP } },
    ];
    
    const results = [];
    
    for (const format of formats) {
      try {
        const response = await fetch(getEndpointUrl(API_CONFIG.ENDPOINTS.AUTH.VERIFY_OTP), {
          method: 'POST',
          headers: API_CONFIG.DEFAULT_HEADERS,
          body: JSON.stringify(format.body),
        });
        
        const data = await response.text();
        results.push({
          format: format.name,
          status: response.status,
          data: data,
          success: response.ok
        });
      } catch (error) {
        results.push({
          format: format.name,
          error: error.message,
          success: false
        });
      }
    }
    
    return results;
  }

  // Verify OTP
  async verifyOTP(request: VerifyOTPRequest): Promise<AuthResponse> {
    try {
      console.log('=== OTP VERIFICATION DEBUG ===');
      console.log('Original request:', request);
      
      // Format phone number to match API expectations (without country code)
      let formattedPhone = request.phone.trim();
      // Remove country code if present
      if (formattedPhone.startsWith('+91')) {
        formattedPhone = formattedPhone.substring(3);
      }
      // Remove leading zeros
      formattedPhone = formattedPhone.replace(/^0+/, '');
      
      // Format request body according to API expectations
      const requestBody = {
        phone: formattedPhone,
        code: request.otp.trim()
      };
      
      console.log('Formatted phone:', formattedPhone);
      console.log('Formatted OTP code:', request.otp.trim());
      console.log('Formatted request body:', requestBody);
      console.log('API Endpoint:', API_CONFIG.ENDPOINTS.AUTH.VERIFY_OTP);
      console.log('Full URL:', getEndpointUrl(API_CONFIG.ENDPOINTS.AUTH.VERIFY_OTP));
      
      // For development/testing, you can use mock data
      if (__DEV__ && request.otp === '123456') {
        console.log('Using mock OTP verification for development');
        return this.verifyOTPMock(request);
      }
      
      const response = await this.makeRequest(API_CONFIG.ENDPOINTS.AUTH.VERIFY_OTP, 'POST', requestBody);
      console.log('Raw OTP verification response:', response);
      
      // Handle the actual API response format
      // The API returns: {"msg":"OTP verified. User registered.","user":{...},"token":"..."}
      if (response.token) {
        await setAuthToken(response.token);
        
        // Transform the response to match our expected format
        return {
          success: true,
          message: response.msg || 'OTP verified successfully',
          data: {
            token: response.token,
            user: response.user ? {
              id: response.user.user_id?.toString() || '',
              name: `${response.user.first_name || ''} ${response.user.last_name || ''}`.trim(),
              email: response.user.email || '',
              phone: response.user.phone || '',
            } : undefined
          }
        };
      }
      
      // Handle error responses
      if (response.msg && response.msg.includes('Invalid') || response.msg.includes('expired')) {
        return {
          success: false,
          message: response.msg || 'OTP verification failed',
          error: response.msg
        };
      }
      
      return {
        success: false,
        message: response.msg || 'OTP verification failed',
        data: response
      };
    } catch (error: any) {
      console.error('OTP verification error details:', error);
      
      // Provide more specific error messages
      if (error.message.includes('Invalid or expired OTP')) {
        throw new Error('The OTP code is invalid or has expired. Please request a new OTP.');
      } else if (error.message.includes('Network')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      } else {
        throw new Error(`OTP verification failed: ${error.message}`);
      }
    }
  }



  // Signup with email/password
  async signupWithEmail(request: SignupRequest): Promise<AuthResponse> {
    try {
      // Format phone number to match API expectations (without country code)
      let formattedPhone = request.phone.trim();
      // Remove country code if present
      if (formattedPhone.startsWith('+91')) {
        formattedPhone = formattedPhone.substring(3);
      }
      // Remove leading zeros
      formattedPhone = formattedPhone.replace(/^0+/, '');
      
      // Split name into first_name and last_name
      const nameParts = request.name.trim().split(' ');
      const first_name = nameParts[0] || '';
      const last_name = nameParts.slice(1).join(' ') || '';
      
      // Format request body according to API expectations
      const requestBody = {
        first_name: first_name,
        last_name: last_name,
        phone: formattedPhone,
        dob: "1990-05-15", // Default date of birth - you might want to make this configurable
        gender: "male", // Default gender - you might want to make this configurable
        city: "New York", // Default city - you might want to make this configurable
        email: request.email.trim(),
        latitude: 40.7128, // Default latitude - you might want to make this configurable
        longitude: -74.0060, // Default longitude - you might want to make this configurable
        password: request.password
      };
      
      console.log('Formatted signup request body:', requestBody);
      console.log('API Endpoint:', API_CONFIG.ENDPOINTS.AUTH.SIGNUP);
      console.log('Full URL:', getEndpointUrl(API_CONFIG.ENDPOINTS.AUTH.SIGNUP));
      
      const response = await this.makeRequest(API_CONFIG.ENDPOINTS.AUTH.SIGNUP, 'POST', requestBody);
      
      // If signup is successful and token is returned, store it
      if (response.success && response.data?.token) {
        await setAuthToken(response.data.token);
      }
      
      return response;
    } catch (error: any) {
      throw new Error(`Failed to signup: ${error.message}`);
    }
  }

  // Logout
  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.makeRequest(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, 'POST');
      
      // Clear stored token
      await removeAuthToken();
      
      return response;
    } catch (error: any) {
      // Even if logout API fails, clear local token
      await removeAuthToken();
      throw new Error(`Failed to logout: ${error.message}`);
    }
  }

  // Refresh token
  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN, 'POST');
      
      // If refresh is successful and new token is returned, store it
      if (response.success && response.data?.token) {
        await setAuthToken(response.data.token);
      }
      
      return response;
    } catch (error: any) {
      throw new Error(`Failed to refresh token: ${error.message}`);
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await getAuthToken();
      return !!token;
    } catch (error) {
      return false;
    }
  }

  // Check auth status and validate token
  async checkAuthStatus(): Promise<{ isAuthenticated: boolean; user?: any }> {
    try {
      const token = await getAuthToken();
      if (!token) {
        return { isAuthenticated: false };
      }

      // Validate token by calling user profile API
      const user = await this.getCurrentUser();
      return { isAuthenticated: true, user };
    } catch (error) {
      // If token is invalid, clear it
      await removeAuthToken();
      return { isAuthenticated: false };
    }
  }

  // Get current user info
  async getCurrentUser(): Promise<any> {
    try {
      const response = await this.makeRequest(API_CONFIG.ENDPOINTS.USER.PROFILE);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get user info: ${error.message}`);
    }
  }

  // Mock methods for development/testing
  async sendOTPMock(request: SendOTPRequest): Promise<OTPResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate success response
    return {
      success: true,
      message: 'OTP sent successfully',
      data: {
        otp: '123456', // For development - remove in production
      },
    };
  }

  async verifyOTPMock(request: VerifyOTPRequest): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate verification (accept any 6-digit OTP for testing)
    if (request.otp.length === 6 && /^\d+$/.test(request.otp)) {
      const mockToken = `mock_token_${Date.now()}`;
      await setAuthToken(mockToken);
      
      return {
        success: true,
        message: 'OTP verified successfully',
        data: {
          token: mockToken,
          user: {
            id: 'user_123',
            name: 'Test User',
            email: request.email || 'test@example.com',
            phone: request.phone,
          },
        },
      };
    } else {
      throw new Error('Invalid OTP');
    }
  }



  async signupWithEmailMock(request: SignupRequest): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate signup
    const mockToken = `mock_token_${Date.now()}`;
    await setAuthToken(mockToken);
    
    return {
      success: true,
      message: 'Signup successful',
      data: {
        token: mockToken,
        user: {
          id: 'user_123',
          name: request.name,
          email: request.email,
          phone: request.phone,
        },
      },
    };
  }

  // Test OTP functionality with detailed logging
  async testOTPFlow(phone: string): Promise<{ sendSuccess: boolean; verifySuccess: boolean; details: any }> {
    try {
      console.log('=== TESTING OTP FLOW ===');
      console.log('Test phone:', phone);
      
      // Step 1: Send OTP
      console.log('Step 1: Sending OTP...');
      const sendResult = await this.sendOTP({ phone });
      console.log('Send OTP result:', sendResult);
      
      // Step 2: Wait a moment for OTP to be processed
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Step 3: Try to verify with a test OTP (123456)
      console.log('Step 2: Verifying OTP with test code 123456...');
      const verifyResult = await this.verifyOTP({ phone, otp: '123456' });
      console.log('Verify OTP result:', verifyResult);
      
      return {
        sendSuccess: sendResult.success,
        verifySuccess: verifyResult.success,
        details: {
          sendResult,
          verifyResult,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('OTP flow test failed:', error);
      return {
        sendSuccess: false,
        verifySuccess: false,
        details: { error: error.message }
      };
    }
  }

  // Get OTP status and suggestions
  async getOTPStatus(phone: string): Promise<{ status: string; suggestions: string[] }> {
    try {
      console.log('=== OTP STATUS CHECK ===');
      console.log('Phone:', phone);
      
      const suggestions: string[] = [];
      
      // Check phone number format
      let formattedPhone = phone.trim();
      if (formattedPhone.startsWith('+91')) {
        formattedPhone = formattedPhone.substring(3);
      }
      formattedPhone = formattedPhone.replace(/^0+/, '');
      
      if (formattedPhone.length !== 10) {
        suggestions.push('Phone number must be exactly 10 digits');
      }
      
      // Check if phone number looks valid
      if (!/^\d{10}$/.test(formattedPhone)) {
        suggestions.push('Phone number should contain only digits');
      }
      
      // Test API connection
      const apiConnected = await this.testApiConnection();
      if (!apiConnected) {
        suggestions.push('Cannot connect to server. Check your internet connection.');
      }
      
      return {
        status: suggestions.length === 0 ? 'ready' : 'issues_found',
        suggestions
      };
    } catch (error) {
      return {
        status: 'error',
        suggestions: [`Error checking OTP status: ${error.message}`]
      };
    }
  }
}

export const authService = new AuthService(); 