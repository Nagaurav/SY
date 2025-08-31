// blogService.ts
import { makeApiRequest } from '../config/api';
import { API_CONFIG } from '../config/api';
// Load local blogs dataset until API is wired
// eslint-disable-next-line @typescript-eslint/no-var-requires
const blogsData = require('../data/blogs.json');

export interface Blog {
  id: number;
  title: string;
  slug: string;
  meta_description: string | null;
  keywords: string[];
  content: string;
  author: string;
  publish_date: string | null;
  category: string;
  tags: string[];
  featured_image: number | null;
  excerpt: string;
  reading_time: number | null;
  status: 'published' | 'draft';
  views: number;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  og_url: string | null;
  schema_markup: any;
  updated_at: string;
}

export interface BlogResponse {
  success: boolean;
  count: number;
  data: Blog[];
}

export interface BlogFilters {
  category?: string;
  tags?: string[];
  author?: string;
  status?: 'published' | 'draft';
  search?: string;
}

class BlogService {
  /**
   * Fetch all blogs with optional filtering
   */
  async getBlogs(filters: BlogFilters = {}, page: number = 1, limit: number = 10): Promise<BlogResponse> {
    try {
      // Use full provided dataset until API is connected
      const mockBlogs: Blog[] = (blogsData.blogs || []) as Blog[];

      // Apply filters
      let filteredBlogs = mockBlogs.filter(blog => {
        if (filters.status && blog.status !== filters.status) return false;
        if (filters.category && blog.category !== filters.category) return false;
        if (filters.author && blog.author !== filters.author) return false;
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          return (
            blog.title.toLowerCase().includes(searchLower) ||
            (blog.excerpt || '').toLowerCase().includes(searchLower) ||
            blog.tags.some(tag => tag.toLowerCase().includes(searchLower))
          );
        }
        return true;
      });

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

      return {
        success: true,
        count: filteredBlogs.length,
        data: paginatedBlogs
      };
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw new Error('Failed to fetch blogs');
    }
  }

  /**
   * Fetch a single blog by ID
   */
  async getBlogById(id: number): Promise<Blog | null> {
    try {
      const blogsResponse = await this.getBlogs();
      const blog = blogsResponse.data.find(b => b.id === id);
      return blog || null;
    } catch (error) {
      console.error('Error fetching blog by ID:', error);
      throw new Error('Failed to fetch blog');
    }
  }

  /**
   * Fetch blogs by category
   */
  async getBlogsByCategory(category: string): Promise<Blog[]> {
    try {
      const blogsResponse = await this.getBlogs({ category });
      return blogsResponse.data;
    } catch (error) {
      console.error('Error fetching blogs by category:', error);
      throw new Error('Failed to fetch blogs by category');
    }
  }

  /**
   * Search blogs
   */
  async searchBlogs(query: string): Promise<Blog[]> {
    try {
      const blogsResponse = await this.getBlogs({ search: query });
      return blogsResponse.data;
    } catch (error) {
      console.error('Error searching blogs:', error);
      throw new Error('Failed to search blogs');
    }
  }

  /**
   * Get all unique categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const blogsResponse = await this.getBlogs();
      const categories = [...new Set(blogsResponse.data.map(blog => blog.category))];
      return categories.filter(category => category && category.trim() !== '');
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  /**
   * Get all unique tags
   */
  async getTags(): Promise<string[]> {
    try {
      const blogsResponse = await this.getBlogs();
      const allTags = blogsResponse.data.flatMap(blog => blog.tags);
      const uniqueTags = [...new Set(allTags)];
      return uniqueTags.filter(tag => tag && tag.trim() !== '');
    } catch (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
  }

  /**
   * Increment blog views (for analytics)
   */
  async incrementViews(blogId: number): Promise<void> {
    try {
      // In a real implementation, this would make an API call
      console.log(`Incrementing views for blog ${blogId}`);
    } catch (error) {
      console.error('Error incrementing blog views:', error);
    }
  }
}

export default new BlogService();
