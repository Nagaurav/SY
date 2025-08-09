// paymentService.ts
// Basic payment service for the PaymentScreen

interface PaymentRequest {
  amount: number;
  method: string;
  bookingDetails?: any;
  professional?: any;
}

interface PaymentResponse {
  transactionId: string;
  status: 'success' | 'failed' | 'pending';
  message: string;
  paymentUrl?: string;
  receiptUrl?: string;
}

class PaymentService {
  // Mock implementation - replace with actual payment gateway integration
  async processPayment(payment: PaymentRequest): Promise<{ data: PaymentResponse }> {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate payment processing
        const isSuccess = Math.random() > 0.1; // 90% success rate
        
        if (isSuccess) {
          const response: PaymentResponse = {
            transactionId: 'TXN_' + Date.now() + Math.random().toString(36).substr(2, 9),
            status: 'success',
            message: 'Payment processed successfully',
            receiptUrl: 'https://receipt.example.com/receipt.pdf',
          };
          resolve({ data: response });
        } else {
          reject(new Error('Payment failed. Please try again.'));
        }
      }, 2000);
    });
  }

  async getPaymentMethods(): Promise<{ data: any[] }> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const methods = [
          { id: 'upi', name: 'UPI', icon: 'qrcode', enabled: true },
          { id: 'card', name: 'Card', icon: 'credit-card', enabled: true },
          { id: 'wallet', name: 'Wallet', icon: 'wallet', enabled: true },
          { id: 'netbanking', name: 'Net Banking', icon: 'bank', enabled: true },
        ];
        resolve({ data: methods });
      }, 500);
    });
  }

  async getPaymentHistory(userId: string): Promise<{ data: any[] }> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const payments = [
          {
            id: '1',
            amount: 1500,
            method: 'UPI',
            status: 'success',
            date: '2024-01-15',
            professionalName: 'Dr. Anya',
            transactionId: 'TXN_123456789',
          },
          {
            id: '2',
            amount: 2000,
            method: 'Card',
            status: 'success',
            date: '2024-01-10',
            professionalName: 'Dr. Vikram',
            transactionId: 'TXN_987654321',
          },
        ];
        resolve({ data: payments });
      }, 800);
    });
  }

  async getPaymentDetails(transactionId: string): Promise<{ data: any }> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const payment = {
          id: transactionId,
          amount: 1500,
          method: 'UPI',
          status: 'success',
          date: '2024-01-15',
          time: '10:30 AM',
          professionalName: 'Dr. Anya',
          professionalSpecialty: 'Yoga Therapy',
          consultationMode: 'Video Call',
          receiptUrl: 'https://receipt.example.com/receipt.pdf',
        };
        resolve({ data: payment });
      }, 600);
    });
  }

  async refundPayment(transactionId: string, reason: string): Promise<{ data: { success: boolean; message: string } }> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          data: { 
            success: true, 
            message: 'Refund processed successfully. Amount will be credited within 5-7 business days.' 
          } 
        });
      }, 1500);
    });
  }

  async validatePaymentMethod(method: string, amount: number): Promise<{ data: { valid: boolean; message?: string } }> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const isValid = method !== 'invalid_method';
        resolve({ 
          data: { 
            valid: isValid, 
            message: isValid ? undefined : 'Payment method not supported for this amount.' 
          } 
        });
      }, 300);
    });
  }
}

export const paymentService = new PaymentService(); 