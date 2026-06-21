class NewsItem {
  static tableName = 'news';

  constructor({ id, title, category, excerpt, content, image_url, created_by, created_at, updated_at, is_active }) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.excerpt = excerpt;
    this.content = content;
    this.image_url = image_url;
    this.created_by = created_by;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.is_active = is_active;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      category: this.category,
      excerpt: this.excerpt,
      content: this.content,
      image_url: this.image_url,
      created_by: this.created_by,
      created_at: this.created_at,
      updated_at: this.updated_at,
      is_active: this.is_active
    };
  }
}

module.exports = NewsItem;
