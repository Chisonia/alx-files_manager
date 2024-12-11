import redis from 'redis';

class RedisClient {
  constructor() {
    // Create a Redis client using redis@2.8.0
    this.client = redis.createClient();

    // Handle Redis client connection errors
    this.client.on('error', (error) => {
      console.error('Redis client error:', error);
    });
  }

  /**
   * Checks if the Redis client is connected
   * @returns {boolean} - True if connected, false otherwise
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Retrieves the value of a key from Redis
   * @param {string} key - The key to retrieve
   * @returns {Promise<string | null>} - The value associated with the key, or null if not found
   */
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, value) => {
        if (err) {
          console.error(`Error getting key "${key}":`, err);
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  }

  /**
   * Sets a value in Redis with an expiration time
   * @param {string} key - The key to set
   * @param {string} value - The value to store
   * @param {number} duration - Expiration time in seconds
   * @returns {Promise<string>} - Response from Redis
   */
  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, 'EX', duration, (err, reply) => {
        if (err) {
          console.error(`Error setting key "${key}":`, err);
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  /**
   * Deletes a key from Redis
   * @param {string} key - The key to delete
   * @returns {Promise<number>} - Number of keys deleted (0 or 1)
   */
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, reply) => {
        if (err) {
          console.error(`Error deleting key "${key}":`, err);
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }
}

const redisClient = new RedisClient();
export default redisClient;
