// homeService.ts
// Basic home service for the HomeScreen - USING MOCK DATA ONLY
import { makeApiRequest } from '../config/api';

interface Category {
  id: string;
  title: string;
  icon: string;
  route: string;
  description?: string;
  color?: string;
}

interface HomeData {
  categories: Category[];
  featuredProfessionals: any[];
  wellnessTips: any[];
  quickStats: any[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

class HomeService {
  // Mock data implementation - no API calls
  async getCategories(): Promise<ApiResponse<Category[]>> {
    // Return static categories - no API call
    const categories: Category[] = [
      {
        id: 'yoga',
        title: 'Yoga',
        icon: 'yoga',
        route: 'Yoga',
        color: '#2A7F62',
        description: 'Yoga classes and consultation',
      },
      {
        id: 'dietician',
        title: 'Dietician',
        icon: 'food-apple',
        route: 'Dietician',
        color: '#FF6B35',
        description: 'Nutrition and diet planning',
      },
      {
        id: 'ayurveda',
        title: 'Ayurveda',
        icon: 'leaves',
        route: 'Ayurveda',
        color: '#FFD93D',
        description: 'Traditional healing system',
      },
      {
        id: 'mental_health',
        title: 'Mental Health',
        icon: 'brain',
        route: 'MentalHealth',
        color: '#6C5CE7',
        description: 'Psychological wellness support',
      },
      {
        id: 'meditation',
        title: 'Meditation',
        icon: 'meditation',
        route: 'Meditation',
        color: '#5F27CD',
        description: 'Mindfulness and meditation',
      },
      {
        id: 'homeopathy',
        title: 'Homeopathy',
        icon: 'water',
        route: 'Homeopathy',
        color: '#74B9FF',
        description: 'Natural healing remedies',
      },
      {
        id: 'nutritionist',
        title: 'Nutritionist',
        icon: 'nutrition',
        route: 'Nutritionist',
        color: '#FD79A8',
        description: 'Expert nutrition guidance',
      },
      {
        id: 'naturopath',
        title: 'Naturopath',
        icon: 'flower-tulip-outline',
        route: 'Naturopath',
        color: '#00B894',
        description: 'Natural health therapies',
      },
    ];
    
    return {
      success: true,
      message: 'Categories loaded successfully (Mock Data)',
      data: categories,
    };
  }

  async getFeaturedProfessionals(): Promise<ApiResponse<any[]>> {
    // Return mock featured professionals - no API call
    const mockProfessionals = [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        category: 'yoga',
        expertise: ['Hatha Yoga', 'Vinyasa Flow', 'Meditation'],
        rating: 4.8,
        experience_years: 8,
        is_online: true,
        consultation_fee: 1200,
        city: 'Mumbai',
        avatar: 'https://via.placeholder.com/100',
      },
      {
        id: '2',
        name: 'Dr. Rajesh Kumar',
        category: 'ayurveda',
        expertise: ['Panchakarma', 'Herbal Medicine', 'Diet Consultation'],
        rating: 4.6,
        experience_years: 12,
        is_online: false,
        consultation_fee: 1500,
        city: 'Delhi',
        avatar: 'https://via.placeholder.com/100',
      },
      {
        id: 'prof_3',
        name: 'Dr. Priya Sharma',
        category: 'dietician',
        expertise: ['Weight Management', 'Sports Nutrition', 'Diabetes Care'],
        rating: 4.9,
        experience_years: 6,
        is_online: true,
        consultation_fee: 1000,
        city: 'Bangalore',
        avatar: 'https://via.placeholder.com/100',
      },
      {
        id: '4',
        name: 'Dr. Amit Patel',
        category: 'mental_health',
        expertise: ['Anxiety', 'Depression', 'Stress Management'],
        rating: 4.7,
        experience_years: 10,
        is_online: true,
        consultation_fee: 1800,
        city: 'Pune',
        avatar: 'https://via.placeholder.com/100',
      },
      {
        id: '5',
        name: 'Dr. Meera Singh',
        category: 'homeopathy',
        expertise: ['Chronic Diseases', 'Skin Problems', 'Child Care'],
        rating: 4.5,
        experience_years: 15,
        is_online: false,
        consultation_fee: 800,
        city: 'Chennai',
        avatar: 'https://via.placeholder.com/100',
      },
      {
        id: '6',
        name: 'Dr. Arjun Reddy',
        category: 'meditation',
        expertise: ['Mindfulness', 'Transcendental Meditation', 'Breathing Techniques'],
        rating: 4.8,
        experience_years: 7,
        is_online: true,
        consultation_fee: 1200,
        city: 'Hyderabad',
        avatar: 'https://via.placeholder.com/100',
      },
    ];
    
    return {
      success: true,
      message: 'Featured professionals loaded successfully (Mock Data)',
      data: mockProfessionals,
    };
  }

  async getWellnessTips(): Promise<ApiResponse<any[]>> {
    // Return mock wellness tips - no API call
    const tips = [
      {
        id: '1',
        title: 'Morning Yoga Routine',
        description: 'Start your day with 10 minutes of sun salutation',
        category: 'yoga',
      },
      {
        id: '2',
        title: 'Healthy Eating Habits',
        description: 'Include more fruits and vegetables in your daily diet',
        category: 'nutrition',
      },
      {
        id: 'tip_3',
        title: 'Stress Management',
        description: 'Practice deep breathing exercises for 5 minutes daily',
        category: 'mental_health',
      },
      {
        id: '4',
        title: 'Ayurvedic Morning Routine',
        description: 'Drink warm water with lemon and honey on empty stomach',
        category: 'ayurveda',
      },
    ];
    
    return {
      success: true,
      message: 'Wellness tips loaded successfully (Mock Data)',
      data: tips,
    };
  }

  async getQuickStats(): Promise<ApiResponse<any[]>> {
    // Return mock quick stats - no API call
    const stats = [
      {
        id: '1',
        title: 'Total Sessions',
        value: '150+',
        icon: 'calendar-check',
      },
      {
        id: '2',
        title: 'Happy Clients',
        value: '500+',
        icon: 'account-heart',
      },
      {
        id: 'stat_3',
        title: 'Expert Professionals',
        value: '50+',
        icon: 'account-tie',
      },
      {
        id: '4',
        title: 'Cities Covered',
        value: '25+',
        icon: 'map-marker',
      },
    ];
    
    return {
      success: true,
      message: 'Quick stats loaded successfully (Mock Data)',
      data: stats,
    };
  }

  async getHomeData(): Promise<ApiResponse<HomeData>> {
    try {
      const [categoriesRes, professionalsRes, tipsRes, statsRes] = await Promise.all([
        this.getCategories(),
        this.getFeaturedProfessionals(),
        this.getWellnessTips(),
        this.getQuickStats(),
      ]);

      return {
        success: true,
        message: 'Home data loaded successfully (Mock Data)',
        data: {
          categories: categoriesRes.data,
          featuredProfessionals: professionalsRes.data,
          wellnessTips: tipsRes.data,
          quickStats: statsRes.data,
        },
      };
    } catch (error: any) {
      console.error('Error fetching home data:', error);
      return {
        success: false,
        message: error.message || 'Failed to load home data',
        data: {
          categories: [],
          featuredProfessionals: [],
          wellnessTips: [],
          quickStats: [],
        },
      };
    }
  }
}

export const homeService = new HomeService(); 