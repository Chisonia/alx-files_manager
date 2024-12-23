#!/usr/bin/node
const { MongoClient } = require('mongodb');
const mongo = require('mongodb');
const { pwdHashed } = require('./utils');

class DBClient {
  constructor() {
    const host = (process.env.DB_HOST) ? process.env.DB_HOST : 'localhost';
    const port = (process.env.DB_PORT) ? process.env.DB_PORT : 27017;
    this.database = process.env.DB_DATABASE ? process.env.DB_DATABASE : 'files_manager';
    const url = `mongodb://${host}:${port}`;
    this.connected = false;
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.client.connect().then(() => {this.connected = true;}).catch((err) => console.log(err.message));
  }
  
  isAlive() {
    return this.connected
  }

  /**
   * Get the number of documents in the 'users' collection
   */
  async nbUsers() {
   await this.client.connect();
   const users = await this.client.db(this.database).collection('users').countDocuments();
   return users;
  }

  /**
   * Get the number of documents in the 'files' collection
   */
  async nbFiles() {
    await this.client.connect();
    const users = await this.client.db(this.database).collection('file').countDocuments();
    return users;                                                                                                  
  }

  async createUser(email, password){
    const hashedPd = pwdHashed(password);
    await this.client.connect();
    const user = await this.client.db(this.database).collection('users').insertOne({ email, password: hashedPd});
    return user;
  }

  async getUser(email){
    await this.client.connect();
    const user = await this.client.db(this.database).collection('users').find({ email }).toArray();
    if (!user.length) {
      return null;
    }
    return user[0];
  }

  async getUserById(id){
    const _id = new mongo.ObjectID(id);
    await this.client.connect();
    const user = await this.client.db(thi.database).collection('users').find({_id}).toArray();
    if (!user.length){
      return null;
    }
    return user[0];
  }

  async userExist(email){
    const user = await this.getUser(email);
    if (!user){
      return false;
    }
    return true;
  }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();
export default dbClient;
