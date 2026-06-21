class Offer {
  static tableName = 'offers';

  constructor({ id, title, description, price_old, price_new, features, icon, created_by, created_at, updated_at, is_active }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price_old = price_old;
    this.price_new = price_new;
    this.features = features;
    this.icon = icon;
    this.created_by = created_by;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.is_active = is_active;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      price_old: this.price_old,
      price_new: this.price_new,
      features: this.features,
      icon: this.icon,
      created_by: this.created_by,
      created_at: this.created_at,
      updated_at: this.updated_at,
      is_active: this.is_active
    };
  }
}

module.exports = Offer;
