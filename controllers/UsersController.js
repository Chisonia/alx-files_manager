import { ObjectId } from 'mongodb';
import sha1 from 'sha1';
import dbClient from '../utils/db.js';

class UsersController {
  /**
   * Create a new user
   * @param {Request} req - HTTP request
   * @param {Response} res - HTTP response
   */
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    // Validate password
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Check if the email already exists
    const existingUser = await dbClient.db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hash the password
    const hashedPassword = sha1(password);

    // Create the new user
    const newUser = { email, password: hashedPassword };
    const result = await dbClient.db.collection('users').insertOne(newUser);

    // Return the response with the created user details
    const userId = result.insertedId;
    return res.status(201).json({ id: userId, email });
  }
}

export default UsersController;
