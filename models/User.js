const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

class User {
  static collection() {
    return getDB().collection('users');
  }

  static async create({ name, email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      createdAt: new Date()
    };
    const result = await this.collection().insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  static async findByEmail(email) {
    return this.collection().findOne({ email: email.trim().toLowerCase() });
  }

  static async findById(id) {
    if (!ObjectId.isValid(id)) return null;
    return this.collection().findOne({ _id: new ObjectId(id) }, { projection: { passwordHash: 0 } });
  }

  static async validatePassword(user, password) {
    return bcrypt.compare(password, user.passwordHash);
  }
}

module.exports = User;
