class News {
  static tableName = 'news';

  constructor({ id, title, content, date, image_url, created_by, created_at, updated_at, is_active }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.date = date;
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
      content: this.content,
      date: this.date,
      image_url: this.image_url,
      created_by: this.created_by,
      created_at: this.created_at,
      updated_at: this.updated_at,
      is_active: this.is_active
    };
  }
}

module.exports = News;
