#!/usr/bin/node

import dbClient from '../utils/db.js';
import redisClient from '../utils/redis.js';

class AppController {
  /**
   * Get the status of Redis and the database
   * @param {Request} req - HTTP request
   * @param {Response} res - HTTP response
   */
  static getStatus(req, res) {
    if (redisClient.isAlive() && dbClient.isAlive()){
      res.json({redis: true, db: true });
      res.end();
    }
  }

  /**
   * Get the stats of the application (number of users and files)
   * @param {Request} req - HTTP request
   * @param {Response} res - HTTP response
   */
  static async getStats(req, res) {
    const usersCount = await dbClient.nbUsers();
    const filesCount = await dbClient.nbFiles();
    res.json({ usersCount, filesCount });
    res.end();
  }
}

export default AppController;
