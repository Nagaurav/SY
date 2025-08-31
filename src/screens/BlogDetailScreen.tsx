// BlogDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Share,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { ScreenContainer, ScreenHeader, LoadingState } from '../components/common';
import blogService, { Blog } from '../services/blogService';
import { ROUTES, RootStackParamList } from '../navigation/constants';

type BlogDetailRouteProp = RouteProp<RootStackParamList, typeof ROUTES.BLOG_DETAIL>;

const { width } = Dimensions.get('window');

const BlogDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<BlogDetailRouteProp>();
  const { blogId } = route.params;
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlog();
  }, [blogId]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const blogData = await blogService.getBlogById(blogId);
      if (blogData) {
        setBlog(blogData);
        // Increment views
        await blogService.incrementViews(blogId);
      } else {
        setError('Blog not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load blog');
      console.error('Error fetching blog:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!blog) return;
    
    try {
      await Share.share({
        message: `Check out this blog: ${blog.title}\n\n${blog.excerpt || blog.meta_description || 'Read more on our app!'}`,
        title: blog.title,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share blog');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Draft';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Draft';
    }
  };

  const formatReadingTime = (minutes: number | null) => {
    if (!minutes || minutes === 0) return 'Quick read';
    return `${minutes} min read`;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Programming': '#2196F3',
      'React': '#61DAFB',
      'JavaScript': '#F7DF1E',
      'Yoga': '#4CAF50',
      'Wellness': '#FF9800',
      'default': '#9C27B0',
    };
    return colors[category as keyof typeof colors] || colors.default;
  };

  if (loading) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Blog" onBack={handleBack} />
        <LoadingState />
      </ScreenContainer>
    );
  }

  if (error || !blog) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Blog" onBack={handleBack} />
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={48} color={colors.error} />
          <Text style={styles.errorText}>{error || 'Blog not found'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchBlog}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenHeader title="Blog" onBack={handleBack} />
      
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Featured Image */}
        {blog.featured_image ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: `https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=${encodeURIComponent(blog.title)}` }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ) : (
          <View style={styles.placeholderImage}>
            <MaterialCommunityIcons name="image-text" size={60} color={colors.secondaryText} />
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Category */}
          {blog.category && (
            <View style={styles.categoryContainer}>
              <View 
                style={[
                  styles.categoryBadge, 
                  { backgroundColor: getCategoryColor(blog.category) + '20' }
                ]}
              >
                <Text style={[styles.categoryText, { color: getCategoryColor(blog.category) }]}>
                  {blog.category}
                </Text>
              </View>
            </View>
          )}

          {/* Title */}
          <Text style={styles.title}>{blog.title}</Text>

          {/* Meta Information */}
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="account" size={16} color={colors.secondaryText} />
              <Text style={styles.metaText}>{blog.author}</Text>
            </View>
            
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="calendar" size={16} color={colors.secondaryText} />
              <Text style={styles.metaText}>{formatDate(blog.publish_date)}</Text>
            </View>
            
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="clock-outline" size={16} color={colors.secondaryText} />
              <Text style={styles.metaText}>{formatReadingTime(blog.reading_time)}</Text>
            </View>
            
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="eye" size={16} color={colors.secondaryText} />
              <Text style={styles.metaText}>{blog.views} views</Text>
            </View>
          </View>

          {/* Excerpt */}
          {blog.excerpt && (
            <View style={styles.excerptContainer}>
              <Text style={styles.excerpt}>{blog.excerpt}</Text>
            </View>
          )}

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              <Text style={styles.tagsLabel}>Tags:</Text>
              <View style={styles.tagsList}>
                {blog.tags.map((tag, index) => (
                  <View key={index} style={styles.tagBadge}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Content */}
          <View style={styles.blogContent}>
            <Text style={styles.contentLabel}>Content:</Text>
            <Text style={styles.contentText}>
              {blog.content.replace(/<[^>]*>/g, '')} {/* Remove HTML tags for now */}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <MaterialCommunityIcons name="share-variant" size={20} color={colors.white} />
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.bookmarkButton}>
              <MaterialCommunityIcons name="bookmark-outline" size={20} color={colors.primaryGreen} />
              <Text style={styles.bookmarkButtonText}>Bookmark</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  imageContainer: {
    height: 250,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    height: 250,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: colors.secondaryText,
    fontSize: 16,
    marginTop: 12,
  },
  content: {
    padding: 20,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 16,
    lineHeight: 36,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    minWidth: '45%',
  },
  metaText: {
    fontSize: 14,
    color: colors.secondaryText,
    marginLeft: 6,
  },
  excerptContainer: {
    backgroundColor: colors.lightSage,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  excerpt: {
    fontSize: 16,
    color: colors.primaryText,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  tagsContainer: {
    marginBottom: 20,
  },
  tagsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 8,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagBadge: {
    backgroundColor: colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '500',
  },
  blogContent: {
    marginBottom: 24,
  },
  contentLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 12,
  },
  contentText: {
    fontSize: 16,
    color: colors.primaryText,
    lineHeight: 26,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  shareButton: {
    flex: 1,
    backgroundColor: colors.primaryGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  shareButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bookmarkButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primaryGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  bookmarkButtonText: {
    color: colors.primaryGreen,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: colors.primaryGreen,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BlogDetailScreen;
