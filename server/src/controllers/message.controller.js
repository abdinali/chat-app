import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import cloudinary from '../lib/cloudinary.js';

export const getUsersForSidebar = async (req, res) => {
	try {
		const userId = req.user._id;

		// retreive all users besides the active user (you)
		const filteredUsers = await User.find({ _id: { $ne: userId } }).select('-password');

		res.status(200).json(filteredUsers);
	} catch (error) {
		console.log('Error in getUsersForSidebar controller:', error.message);
		res.status(500).json({ message: 'Internal Server Error.' });
	}
};

export const getMessages = async (req, res) => {
	try {
		// id of user to contact
		const { id: chatPartnerId } = req.params;

		// your id
		const userId = req.user._id;

		// find all the message documents between the user (you) and your contact
		const messages = await Message.find({
			$or: [
				{ senderId: userId, receiverId: chatPartnerId },
				{ senderId: chatPartnerId, receiverId: userId },
			],
		});

		res.status(200).json(messages);
	} catch (error) {
		console.log('Error in getMessages controller:', error.message);
		res.status(500).json({ message: 'Internal Server Error.' });
	}
};

export const sendMessage = async (req, res) => {
	try {
		const { text, image } = req.body;

		// id of user to contact
		const { id: chatPartnerId } = req.params;

		// your id
		const userId = req.user._id;

		let imageUrl;

		if (image) {
			// if user provides an image, upload it to cloudinary
			const uploadResponse = await cloudinary.uploader.upload(image);
			imageUrl = uploadResponse.secure_url;
		}

		const newMessage = new Message({
			senderId: userId,
			receiverId: chatPartnerId,
			text,
			image: imageUrl,
		});

		await newMessage.save();

		res.status(201).json(newMessage);
	} catch (error) {
		console.log('Error in sendMessage controller:', error.message);
		res.status(500).json({ message: 'Internal Server Error.' });
	}
};
