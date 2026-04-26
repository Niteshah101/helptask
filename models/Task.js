const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

class Task {
  static collection() {
    return getDB().collection('tasks');
  }

  static async create({ title, description, location, ownerId }) {
    const task = {
      title: title.trim(),
      description: description.trim(),
      location: location?.trim() || 'Not specified',
      ownerId: new ObjectId(ownerId),
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await this.collection().insertOne(task);
    return { ...task, _id: result.insertedId };
  }

  static async findActive() {
    return this.collection().find({ active: true }).sort({ createdAt: -1 }).toArray();
  }

  static async findByOwner(ownerId) {
    return this.collection().find({ ownerId: new ObjectId(ownerId) }).sort({ createdAt: -1 }).toArray();
  }

  static async findById(id) {
    if (!ObjectId.isValid(id)) return null;
    return this.collection().findOne({ _id: new ObjectId(id) });
  }

  static async findByIdAndOwner(taskId, ownerId) {
    if (!ObjectId.isValid(taskId) || !ObjectId.isValid(ownerId)) return null;
    return this.collection().findOne({ _id: new ObjectId(taskId), ownerId: new ObjectId(ownerId) });
  }

  static async close(taskId, ownerId) {
    return this.collection().updateOne(
      { _id: new ObjectId(taskId), ownerId: new ObjectId(ownerId) },
      { $set: { active: false, updatedAt: new Date() } }
    );
  }
}

module.exports = Task;
