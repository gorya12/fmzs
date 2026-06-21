class ActivityLog {
  static tableName = 'activity_log';

  constructor({ id, user_id, action, entity_type, entity_id, details, created_at }) {
    this.id = id;
    this.user_id = user_id;
    this.action = action;
    this.entity_type = entity_type;
    this.entity_id = entity_id;
    this.details = details;
    this.created_at = created_at;
  }

  toJSON() {
    return {
      id: this.id,
      user_id: this.user_id,
      action: this.action,
      entity_type: this.entity_type,
      entity_id: this.entity_id,
      details: this.details,
      created_at: this.created_at
    };
  }
}

module.exports = ActivityLog;
