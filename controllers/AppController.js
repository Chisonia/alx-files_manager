import dbClient from '../utils/db.js';
import redisClient from '../utils/redis.js';

class AppController {
  /**
   * Get the status of Redis and the database
   * @param {Request} req - HTTP request
   * @param {Response} res - HTTP response
   */
  static async getStatus(req, res) {
    const redisAlive = redisClient.isAlive();
    const dbAlive = await dbClient.isAlive();

    res.status(200).json({ redis: redisAlive, db: dbAlive });
  }

  /**
   * Get the stats of the application (number of users and files)
   * @param {Request} req - HTTP request
   * @param {Response} res - HTTP response
   */
  static async getStats(req, res) {
    const usersCount = await dbClient.nbUsers();
    const filesCount = await dbClient.nbFiles();

    res.status(200).json({ users: usersCount, files: filesCount });
  }
}

export default AppController;
