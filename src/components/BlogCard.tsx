// BlogCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';
import { Blog } from '../services/blogService';

interface BlogCardProps {
  blog: Blog;
  onPress: (blog: Blog) => void;
}

const { width } = Dimensions.get('window');

const BlogCard: React.FC<BlogCardProps> = ({ blog, onPress }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Draft';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
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

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(blog)}
      activeOpacity={0.8}
    >
      {/* Featured Image */}
      {blog.featured_image ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `https://via.placeholder.com/400x200/4CAF50/FFFFFF?text=${encodeURIComponent(blog.title)}` }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {blog.status === 'published' ? 'Published' : 'Draft'}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.placeholderImage}>
          <MaterialCommunityIcons name="image-text" size={40} color={colors.secondaryText} />
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
        <Text style={styles.title} numberOfLines={2}>
          {blog.title}
        </Text>

        {/* Excerpt */}
        {blog.excerpt && (
          <Text style={styles.excerpt} numberOfLines={3}>
            {blog.excerpt}
          </Text>
        )}

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
        </View>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {blog.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tagBadge}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
            {blog.tags.length > 3 && (
              <Text style={styles.moreTagsText}>+{blog.tags.length - 3} more</Text>
            )}
          </View>
        )}

        {/* Views */}
        <View style={styles.viewsContainer}>
          <MaterialCommunityIcons name="eye" size={16} color={colors.secondaryText} />
          <Text style={styles.viewsText}>{blog.views} views</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    height: 200,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: colors.secondaryText,
    fontSize: 14,
    marginTop: 8,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.primaryGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  categoryContainer: {
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 8,
    lineHeight: 24,
  },
  excerpt: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metaText: {
    fontSize: 12,
    color: colors.secondaryText,
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 12,
  },
  tagBadge: {
    backgroundColor: colors.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    color: colors.secondaryText,
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: 11,
    color: colors.secondaryText,
    fontStyle: 'italic',
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  viewsText: {
    fontSize: 12,
    color: colors.secondaryText,
    marginLeft: 4,
  },
});

export default BlogCard;
