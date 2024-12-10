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

  // Check if Redis client is alive
  isAlive() {
    return this.client.connected; // Returns true if connected, false otherwise
  }

  // Get value for a given key
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

  // Set a value with a given expiration time (in seconds)
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

  // Delete a key
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

// Export a single instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
