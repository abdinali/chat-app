import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
	const { fullName, email, password } = req.body;
	try {
		if (!fullName || !email || !password) {
			return res.status(400).json({ message: 'All fields are required.' });
		}

		if (password.length < 6) {
			// send requirement message to client
			return res.status(400).json({ message: 'Password must be at least 6 characters.' });
		}

		// check if user already exists with that email
		const user = await User.findOne({ email });

		// if user is found, email already exists, notify client
		if (user) return res.status(400).json({ message: 'Email already exists.' });

		// hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// create new user with credentials
		const newUser = new User({
			fullName,
			email,
			password: hashedPassword,
		});

		if (newUser) {
			// generate jwt token
			generateToken(newUser._id, res);

			await newUser.save();

			// send success message to client
			res.status(201).json(newUser);
		} else {
			res.status(400).json({ message: 'Invalid user credentials.' });
		}
	} catch (error) {
		console.log('Error in signup controller.', error.message);
		res.status(500).json({ message: 'Internal Server Error.' });
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		// check if user with email exists
		const user = await User.findOne({ email });

		if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

		const isCorrectPassword = await bcrypt.compare(password, user.password);

		if (!isCorrectPassword) return res.status(400).json({ message: 'Invalid credentials.' });

		// credentials are valid, generate token
		generateToken(user._id, res);

		res.status(200).json(user);
	} catch (error) {}
};

export const logout = (req, res) => {
	try {
		// clear cookie
		res.cookie('jwt', '', { maxAge: 0 });
		return res.status(200).json({ message: 'Logged out successfully.' });
	} catch (error) {
		console.log('Error in logout controller', error.message);
		return res.status(500).json({ message: 'Internal Server Error.' });
	}
};
