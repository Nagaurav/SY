// SplashScreen.tsx
import React, { useEffect, FC } from 'react';
import { View, Text, StyleSheet, StatusBar, Image, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { homeService } from '../services/homeService';
import { authService } from '../services/authService';

const LOGO_SIZE = 120;

// Animated dot for loading animation
const Dot: FC<{ delay: number }> = ({ delay }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 400 }),
        withTiming(0.3, { duration: 400 })
      ),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

const SplashScreen: FC<{ onFinish?: () => void }> = ({ onFinish }) => {
  const fade = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Start animations
        fade.value = withTiming(1, { duration: 800 });
        scale.value = withSpring(1, { damping: 15, stiffness: 80 });

        // Run initialization tasks in parallel
        await Promise.all([
          // API preload - fetch essential data
          homeService.getCategories().catch((err: any) => console.log('Categories preload failed:', err)),
          
          // Check for stored auth tokens
          authService.checkAuthStatus().catch((err: any) => console.log('Auth check failed:', err)),
          
          // Version check (simulate API call)
          checkAppVersion().catch((err: any) => console.log('Version check failed:', err)),
          
          // Minimum splash duration for better UX
          new Promise(resolve => setTimeout(resolve, 2000))
        ]);

        // Additional delay for smooth transition
        setTimeout(() => {
          if (onFinish) onFinish();
        }, 500);

      } catch (error) {
        console.error('App initialization failed:', error);
        // Still proceed even if some initialization fails
        setTimeout(() => {
          if (onFinish) onFinish();
        }, 1000);
      }
    };

    initializeApp();
  }, [fade, scale, onFinish]);

  const checkAppVersion = async () => {
    // Simulate version check API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // In real app, this would call your version check API
        console.log('App version check completed');
        resolve(true);
      }, 800);
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Animated.View style={[styles.splashWrapper, animatedStyle]}>
        {
          // ----- LOGO INTEGRATION -----
          // To show your real logo:
          // 1. Place your logo image in assets/images/ as logo.png (or your preferred name).
          // 2. Uncomment the <Image> line below and comment/remove the <View> that renders "SY".

          // <Image source={require('../../assets/images/logo.png')} style={styles.logoImage} resizeMode="contain" />

          // -- Default placeholder if you don't have a logo yet:
        }
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>SY</Text>
        </View>

        <Text style={styles.title}>Samyā Yog</Text>
        <Text style={styles.subtitle}>Your journey begins here</Text>

        <View style={styles.dotsContainer}>
          <Dot delay={0} />
          <Dot delay={200} />
          <Dot delay={400} />
        </View>

        <Text style={styles.version}>v1.0.0</Text>
        <Text style={styles.loadingText}>Initializing...</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashWrapper: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  // This is a placeholder for SY text; replace this with the Image for your logo.
  logoPlaceholder: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    backgroundColor: colors.offWhite,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  // Uncomment for real logo usage
  // logoImage: {
  //   width: LOGO_SIZE,
  //   height: LOGO_SIZE,
  //   marginBottom: 32,
  // },
  logoText: {
    color: colors.primaryGreen,
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 6,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Black' : 'Roboto',
  },
  title: {
    ...typography.greeting,
    fontSize: 32,
    color: colors.offWhite,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.subtitle,
    fontSize: 16,
    color: colors.offWhite,
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '400' as const,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 40,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.offWhite,
    marginHorizontal: 6,
  },
  version: {
    marginTop: 50,
    color: colors.offWhite,
    fontSize: 12,
    opacity: 0.7,
  },
  loadingText: {
    marginTop: 16,
    color: colors.offWhite,
    fontSize: 14,
    opacity: 0.8,
    fontWeight: '500',
  },
});

export default SplashScreen; 