class SpecialOffer {
  static tableName = 'special_offers';

  constructor({ id, title, description, created_by, created_at, updated_at }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.created_by = created_by;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      created_by: this.created_by,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = SpecialOffer;
