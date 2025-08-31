// articleService.ts
// Load local articles dataset until API is wired
const articlesData = require('../data/articles.json');

export interface Article {
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
  featured_image: string | number | null;
  excerpt: string;
  reading_time: number | null;
  status: string;
  views: number;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  og_url: string | null;
  schema_markup: any;
  updated_at: string;
}

export interface ArticleResponse {
  data: Article[];
  count: number;
  page: number;
  limit: number;
}

export interface ArticleFilters {
  status?: string;
  category?: string;
  author?: string;
  search?: string;
}

/**
 * Article Service
 * Handles all article-related operations
 */
class ArticleService {
  /**
   * Fetch all articles with optional filtering
   */
  async getArticles(filters: ArticleFilters = {}, page: number = 1, limit: number = 10): Promise<ArticleResponse> {
    try {
      // For now, load from local data
      const mockArticles: Article[] = (articlesData.articles || []) as Article[];
      
      // Apply filters
      let filteredArticles = mockArticles.filter(article => {
        if (filters.status && article.status !== filters.status) return false;
        if (filters.category && article.category !== filters.category) return false;
        if (filters.author && article.author !== filters.author) return false;
        
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          return (
            article.title.toLowerCase().includes(searchLower) ||
            (article.excerpt || '').toLowerCase().includes(searchLower) ||
            article.tags.some(tag => tag.toLowerCase().includes(searchLower))
          );
        }
        
        return true;
      });

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

      return {
        data: paginatedArticles,
        count: filteredArticles.length,
        page,
        limit
      };
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw new Error('Failed to fetch articles');
    }
  }

  /**
   * Fetch a single article by ID
   */
  async getArticleById(id: number): Promise<Article | null> {
    try {
      const articlesResponse = await this.getArticles();
      const article = articlesResponse.data.find(a => a.id === id);
      return article || null;
    } catch (error) {
      console.error('Error fetching article by ID:', error);
      throw new Error('Failed to fetch article');
    }
  }

  /**
   * Fetch articles by category
   */
  async getArticlesByCategory(category: string): Promise<Article[]> {
    try {
      const articlesResponse = await this.getArticles({ category });
      return articlesResponse.data;
    } catch (error) {
      console.error('Error fetching articles by category:', error);
      throw new Error('Failed to fetch articles by category');
    }
  }

  /**
   * Search articles
   */
  async searchArticles(query: string): Promise<Article[]> {
    try {
      const articlesResponse = await this.getArticles({ search: query });
      return articlesResponse.data;
    } catch (error) {
      console.error('Error searching articles:', error);
      throw new Error('Failed to search articles');
    }
  }

  /**
   * Get all available categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const articlesResponse = await this.getArticles();
      const categories = [...new Set(articlesResponse.data.map(article => article.category))];
      return categories.filter(category => category && category.trim() !== '');
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  /**
   * Get all available tags
   */
  async getTags(): Promise<string[]> {
    try {
      const articlesResponse = await this.getArticles();
      const allTags = articlesResponse.data.flatMap(article => article.tags);
      const uniqueTags = [...new Set(allTags)];
      return uniqueTags.filter(tag => tag && tag.trim() !== '');
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw new Error('Failed to fetch tags');
    }
  }

  /**
   * Increment article views (for analytics)
   */
  async incrementViews(articleId: number): Promise<void> {
    try {
      // In a real app, this would update the database
      console.log(`Incrementing views for article ${articleId}`);
    } catch (error) {
      console.error('Error incrementing article views:', error);
    }
  }
}

export default new ArticleService();
