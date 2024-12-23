#!/usr/bin/node

const { createClient } = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (err) => console.log(err));
    this.connected = false;
    this.client.on('connect', () => {
      this.connected = true;
    });
  }

  /**
   * Checks if the Redis client is connected
   * @returns {boolean} - True if connected, false otherwise
   */
  isAlive() {
    return this.connected;
  }

  /**
   * Retrieves the value of a key from Redis
   * @param {string} key - The key to retrieve
   * @returns {Promise<string | null>} - The value associated with the key, or null if not found
   */
  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    const val = await getAsync(key);
    return val;
  }

  /**
   * Sets a value in Redis with an expiration time
   * @param {string} key - The key to set
   * @param {string} value - The value to store
   * @param {number} duration - Expiration time in seconds
   * @returns {Promise<string>} - Response from Redis
   */
  async set(key, value, duration) {
    const setAsync = promisify(this.client.set).bind(this.client);
    await setAsync(key, value, 'EX', duration);
  }

  /**
   * Deletes a key from Redis
   * @param {string} key - The key to delete
   * @returns {Promise<number>} - Number of keys deleted (0 or 1)
   */
  async del(key) {
    const delAsync = promisify(this.client.del).bind(this.client);
    await delAsync(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
