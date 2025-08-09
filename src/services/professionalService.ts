// professionalService.ts
// Basic professional service for the ExpertProfileScreen

interface Professional {
  id: string;
  name: string;
  specialty: string;
  expertise: string;
  experience: number;
  timeSlots?: TimeSlot[];
  rating?: number;
  reviewCount?: number;
}

interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
}

class ProfessionalService {
  // Mock implementation - replace with actual API calls
  async getProfessionalById(id: string): Promise<{ data: Professional }> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const professional: Professional = {
          id,
          name: 'Dr. Anya',
          specialty: 'Yoga Therapy',
          expertise: 'Yoga Therapy',
          experience: 8,
          rating: 4.5,
          reviewCount: 24,
          timeSlots: [
            { id: '1', time: '9:00 AM', isAvailable: true },
            { id: '2', time: '10:00 AM', isAvailable: true },
            { id: '3', time: '2:00 PM', isAvailable: false },
            { id: '4', time: '3:00 PM', isAvailable: true },
            { id: '5', time: '4:00 PM', isAvailable: true },
          ],
        };
        resolve({ data: professional });
      }, 1000);
    });
  }

  async getProfessionalsByCategory(category: string): Promise<{ data: Professional[] }> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const professionals: Professional[] = [
          {
            id: '1',
            name: 'Dr. Anya',
            specialty: 'Yoga Therapy',
            expertise: 'Yoga Therapy',
            experience: 8,
            rating: 4.5,
            reviewCount: 24,
          },
          {
            id: '2',
            name: 'Dr. Vikram',
            specialty: 'Ayurveda',
            expertise: 'Ayurveda',
            experience: 12,
            rating: 4.8,
            reviewCount: 31,
          },
        ];
        resolve({ data: professionals });
      }, 500);
    });
  }

  async getAvailableSlots(professionalId: string, date: string): Promise<{ data: TimeSlot[] }> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const slots: TimeSlot[] = [
          { id: '1', time: '9:00 AM', isAvailable: true },
          { id: '2', time: '10:00 AM', isAvailable: true },
          { id: '3', time: '2:00 PM', isAvailable: false },
          { id: '4', time: '3:00 PM', isAvailable: true },
          { id: '5', time: '4:00 PM', isAvailable: true },
        ];
        resolve({ data: slots });
      }, 500);
    });
  }

  async bookAppointment(professionalId: string, slotId: string, date: string): Promise<{ data: any }> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          data: { 
            bookingId: 'booking_' + Date.now(),
            status: 'confirmed',
            message: 'Appointment booked successfully'
          } 
        });
      }, 1000);
    });
  }
}

export const professionalService = new ProfessionalService(); 