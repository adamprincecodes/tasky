import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

function toPublicUser(user) {
  return { id: user._id, name: user.name, email: user.email };
}

export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with that email already exists.' });
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({ user: toPublicUser(user), token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong creating your account.' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }

    res.json({ user: toPublicUser(user), token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong logging you in.' });
  }
}

export async function getMe(req, res) {
  res.json({ user: toPublicUser(req.user) });
}

export async function updateProfile(req, res) {
  try {
    const { name } = req.body;
    if (name) req.user.name = name;
    await req.user.save();
    res.json({ user: toPublicUser(req.user) });
  } catch (err) {
    res.status(500).json({ message: 'Could not update profile.' });
  }
}
