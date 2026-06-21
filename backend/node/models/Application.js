class Application {
  static tableName = 'applications';

  constructor({ id, type, name, phone, email, company, service, message, status, response, created_at, updated_at, updated_by }) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.company = company;
    this.service = service;
    this.message = message;
    this.status = status;
    this.response = response;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.updated_by = updated_by;
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      phone: this.phone,
      email: this.email,
      company: this.company,
      service: this.service,
      message: this.message,
      status: this.status,
      response: this.response,
      created_at: this.created_at,
      updated_at: this.updated_at,
      updated_by: this.updated_by
    };
  }
}

module.exports = Application;
