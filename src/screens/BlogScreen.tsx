// BlogScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../navigation/constants';
import { colors } from '../theme/colors';
import { ScreenContainer, ScreenHeader, LoadingState, EmptyState, SearchBar, Dropdown } from '../components/common';
import { useLoadingState, useSearchState } from '../hooks/useCommonState';
import BlogCard from '../components/BlogCard';
import blogService, { Blog, BlogFilters } from '../services/blogService';

const { width } = Dimensions.get('window');

const BlogScreen: React.FC = () => {
  const navigation = useNavigation();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const { loading, refreshing, error, setLoading, setRefreshing, setError } = useLoadingState(true);
  const { searchQuery, setSearchQuery, filterBySearch } = useSearchState();

  const fetchBlogs = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    setError(null);
    
    try {
      const filters: BlogFilters = {
        status: 'published', // Only show published blogs
      };
      
      if (selectedCategory !== 'all') {
        filters.category = selectedCategory;
      }
      
      if (selectedTags.length > 0) {
        filters.tags = selectedTags;
      }
      
      const response = await blogService.getBlogs(filters);
      
      if (response.success && response.data) {
        setAllBlogs(response.data);
        setBlogs(response.data);
      } else {
        setError('Failed to load blogs');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load blogs');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory, selectedTags]);

  const fetchCategoriesAndTags = useCallback(async () => {
    try {
      const [categoriesData, tagsData] = await Promise.all([
        blogService.getCategories(),
        blogService.getTags(),
      ]);
      setCategories(categoriesData);
      setTags(tagsData);
    } catch (error) {
      console.error('Error fetching categories and tags:', error);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
    fetchCategoriesAndTags();
  }, [fetchBlogs, fetchCategoriesAndTags]);

  const onRefresh = useCallback(() => {
    fetchBlogs(true);
  }, [fetchBlogs]);

  // Apply search filter
  const applySearchFilter = useCallback(() => {
    if (!searchQuery.trim()) {
      setBlogs(allBlogs);
      return;
    }
    
    const filtered = filterBySearch(allBlogs, ['title', 'excerpt', 'tags', 'author']);
    setBlogs(filtered);
  }, [allBlogs, searchQuery, filterBySearch]);

  useEffect(() => {
    applySearchFilter();
  }, [applySearchFilter]);

  const handleBlogPress = (blog: Blog) => {
    navigation.navigate(ROUTES.BLOG_DETAIL, { blogId: blog.id });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedTags([]);
    setSearchQuery('');
  };

  const renderBlogCard = ({ item }: { item: Blog }) => (
    <BlogCard blog={item} onPress={handleBlogPress} />
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Discover Wellness Insights</Text>
        <Text style={styles.welcomeSubtitle}>
          Explore expert articles on yoga, wellness, and healthy living
        </Text>
      </View>

      {/* Search Bar */}
      <SearchBar
        placeholder="Search blogs..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
      />

      {/* Filter Toggle */}
      <TouchableOpacity
        style={styles.filterToggle}
        onPress={() => setShowFilters(!showFilters)}
      >
        <MaterialCommunityIcons 
          name={showFilters ? "filter-off" : "filter-variant"} 
          size={20} 
          color={colors.primaryGreen} 
        />
        <Text style={styles.filterToggleText}>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Text>
      </TouchableOpacity>

      {/* Filters Section */}
      {showFilters && (
        <View style={styles.filtersSection}>
          {/* Category Filter */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Category</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.filterOptions}
            >
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  selectedCategory === 'all' && styles.filterOptionActive
                ]}
                onPress={() => handleCategoryChange('all')}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedCategory === 'all' && styles.filterOptionTextActive
                ]}>
                  All
                </Text>
              </TouchableOpacity>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterOption,
                    selectedCategory === category && styles.filterOptionActive
                  ]}
                  onPress={() => handleCategoryChange(category)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    selectedCategory === category && styles.filterOptionTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Tags Filter */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Tags</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.filterOptions}
            >
              {tags.slice(0, 10).map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.filterOption,
                    selectedTags.includes(tag) && styles.filterOptionActive
                  ]}
                  onPress={() => handleTagToggle(tag)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    selectedTags.includes(tag) && styles.filterOptionTextActive
                  ]}>
                    #{tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Clear Filters */}
          {(selectedCategory !== 'all' || selectedTags.length > 0) && (
            <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
              <MaterialCommunityIcons name="close-circle" size={16} color={colors.white} />
              <Text style={styles.clearFiltersText}>Clear Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Results Count */}
      <View style={styles.resultsCount}>
        <Text style={styles.resultsText}>
          {blogs.length} blog{blogs.length !== 1 ? 's' : ''} found
        </Text>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Blog" />
        <LoadingState />
      </ScreenContainer>
    );
  }

  if (error && !refreshing) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Blog" />
        <EmptyState
          message={error}
          onRetry={() => fetchBlogs()}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenHeader title="Blog" />
      
      <FlatList
        data={blogs}
        renderItem={renderBlogCard}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            message="No blogs found"
            description="Try adjusting your search or filters"
            onRetry={() => fetchBlogs()}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primaryGreen]}
            tintColor={colors.primaryGreen}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  welcomeSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primaryText,
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.secondaryText,
    textAlign: 'center',
    lineHeight: 22,
  },
  searchBar: {
    marginBottom: 16,
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  filterToggleText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryGreen,
  },
  filtersSection: {
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
  },
  filterOption: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterOptionActive: {
    backgroundColor: colors.primaryGreen,
    borderColor: colors.primaryGreen,
  },
  filterOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.secondaryText,
  },
  filterOptionTextActive: {
    color: colors.white,
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryRed,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
  },
  clearFiltersText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  resultsCount: {
    alignItems: 'center',
    marginBottom: 8,
  },
  resultsText: {
    fontSize: 14,
    color: colors.secondaryText,
    fontWeight: '500',
  },
});

export default BlogScreen;
