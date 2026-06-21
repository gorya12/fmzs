class Project {
  static tableName = 'projects';

  constructor({ id, title, description, image_url, created_by, created_at, updated_at }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.image_url = image_url;
    this.created_by = created_by;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      image_url: this.image_url,
      created_by: this.created_by,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = Project;
