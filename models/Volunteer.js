const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

class Volunteer {
  static collection() {
    return getDB().collection('volunteers');
  }

  static normalize(identifier) {
    return identifier.trim().toLowerCase();
  }

  static async subscribe(taskId, identifier) {
    const cleanIdentifier = this.normalize(identifier);
    const now = new Date();
    await this.collection().updateOne(
      { taskId: new ObjectId(taskId), identifier: cleanIdentifier },
      {
        $set: { status: 'subscribed', updatedAt: now },
        $setOnInsert: { taskId: new ObjectId(taskId), identifier: cleanIdentifier, createdAt: now }
      },
      { upsert: true }
    );
  }

  static async findSubscribedByTask(taskId) {
    return this.collection()
      .find({ taskId: new ObjectId(taskId), status: 'subscribed' })
      .sort({ createdAt: -1 })
      .toArray();
  }

  static async dismiss(taskId, identifier) {
    return this.collection().updateOne(
      { taskId: new ObjectId(taskId), identifier: this.normalize(identifier) },
      { $set: { status: 'dismissed', updatedAt: new Date() } }
    );
  }

  static async findByIdentifier(identifier) {
    const cleanIdentifier = this.normalize(identifier);
    return getDB().collection('volunteers').aggregate([
      { $match: { identifier: cleanIdentifier, status: 'subscribed' } },
      { $lookup: { from: 'tasks', localField: 'taskId', foreignField: '_id', as: 'task' } },
      { $unwind: '$task' },
      { $match: { 'task.active': true } },
      { $sort: { createdAt: -1 } }
    ]).toArray();
  }

  static async statsForActiveTasks() {
    return getDB().collection('tasks').aggregate([
      { $match: { active: true } },
      {
        $lookup: {
          from: 'volunteers',
          let: { taskId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$taskId', '$$taskId'] }, status: 'subscribed' } }
          ],
          as: 'volunteers'
        }
      },
      { $project: { title: 1, location: 1, volunteerCount: { $size: '$volunteers' } } },
      { $sort: { volunteerCount: -1, title: 1 } }
    ]).toArray();
  }
}

module.exports = Volunteer;
