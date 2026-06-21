class User {
  static tableName = 'users';

  constructor({ id, username, password_hash, full_name, role, created_at, last_login }) {
    this.id = id;
    this.username = username;
    this.password_hash = password_hash;
    this.full_name = full_name;
    this.role = role;
    this.created_at = created_at;
    this.last_login = last_login;
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      full_name: this.full_name,
      role: this.role,
      created_at: this.created_at,
      last_login: this.last_login
    };
  }
}

module.exports = User;
