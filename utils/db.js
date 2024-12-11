import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    const url = `mongodb://${host}:${port}`;
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.db = null;

    // Connect to MongoDB
    this.client
      .connect()
      .then(() => {
        this.db = this.client.db(database);
        console.log('MongoDB connected successfully');
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error.message);
      });
  }

  /**
   * Check if the connection to MongoDB is alive
   * @returns {Promise<boolean>} - True if connected, otherwise false
   */
  async isAlive() {
    try {
      // Check if the connection is alive
      await this.client.db('admin').command({ ping: 1 });
      return true;
    } catch (error) {
      console.error('MongoDB ping failed:', error.message);
      return false;
    }
  }

  /**
   * Get the number of documents in the 'users' collection
   * @returns {Promise<number>} - Number of users
   */
  async nbUsers() {
    try {
      if (!this.db) {
        throw new Error('Database not connected');
      }
      return this.db.collection('users').countDocuments();
    } catch (error) {
      console.error('Error fetching user count:', error.message);
      return 0;
    }
  }

  /**
   * Get the number of documents in the 'files' collection
   * @returns {Promise<number>} - Number of files
   */
  async nbFiles() {
    try {
      if (!this.db) {
        throw new Error('Database not connected');
      }
      return this.db.collection('files').countDocuments();
    } catch (error) {
      console.error('Error fetching file count:', error.message);
      return 0;
    }
  }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();
export default dbClient;
