#!/usr/bin/node

const dbClient = require('../utils/db');

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
      res.status(400).json({ error: 'Missing email' });
      res.end();
      return;
    }

    // Validate password
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
      res.end();
      return;
    }

    // Check if the email already exists
    const existingUser = await dbClient.userExist(email);
    if (existingUser) {
      res.status(400).json({ error: 'Already exist' });
      res.end();
      return
    }

    // Hash the password
    const hashedPassword = sha1(password);

    // Create the new user
    const newUser = await dbClient.createUser(email, hashedPassword);
    const result = await dbClient.db.collection('users').insertOne(newUser);

    // Return the response with the created user details
    const userId = result.insertedId;
    res.status(201).json({ id: userId, email });
    res.end();
  }
}

export default UsersController;
