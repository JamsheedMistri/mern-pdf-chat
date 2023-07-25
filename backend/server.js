const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const axios = require('axios');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { Schema } = mongoose;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/pdfchat', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// Define the MongoDB schema
const chatSchema = new Schema({
	filename: String,
	fileID: String,
	messages: [
		{
			role: String,
			content: String,
		},
	],
	context: String,
});
const Chat = mongoose.model('Chat', chatSchema);

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Set up express server
const app = express();
app.use(cors());

// Define routes
app.post('/upload', upload.single('pdf'), async (req, res) => {
	const dataBuffer = fs.readFileSync(req.file.path);
	const data = await pdfParse(dataBuffer);

	const chat = new Chat({
		filename: req.file.originalname,
		fileID: req.file.filename,
		messages: [],
		context: data.text,
	});
	await chat.save();
	res.json({ id: chat._id });
});

app.get('/files', async (req, res) => {
	const chats = await Chat.find({});
	res.json(chats.map((chat) => ({ id: chat._id, filename: chat.filename })));
});

app.get('/files/:id', async (req, res) => {
	const chat = await Chat.findById(req.params.id);
	res.json(chat);
});

app.get('/files/:id/pdf', async (req, res) => {
	const chat = await Chat.findById(req.params.id);
	const filePath = path.join(__dirname, 'uploads', chat.fileID);
	res.sendFile(filePath);
});

app.post('/files/:id/messages', express.json(), async (req, res) => {
	const chat = await Chat.findById(req.params.id);
	const userMessage = req.body.message;
	chat.messages.push({
		role: 'user',
		content: userMessage,
	});

	let messages = [
		{
			role: 'system',
			content: `You are an expert at helping users understand their documents. You have just received a new document, and must learn everything about it, then be able to answer questions about it in less than 100 words.\n\nDocument content:\n ${chat.context}`,
		},
		...chat.messages.map((message) => ({
			role: message.role,
			content: message.content,
		})),
	];

	// Generate response using OpenAI API with extracted PDF text as context
	const response = await generateResponse(userMessage, messages);
	chat.messages.push({
		role: 'assistant',
		content: response,
	});

	await chat.save();
	res.json(chat);
});

// Start the server
app.listen(8000, () => {
	console.log('Server listening on port 8000');
});

// Function to generate response using OpenAI API
function generateResponse(prompt, messages) {
	return axios
		.post(
			'https://api.openai.com/v1/chat/completions',
			{
				model: 'gpt-3.5-turbo',
				messages,
				max_tokens: 1000,
			},
			{
				headers: {
					Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
				},
			}
		)
		.then((res) => res.data.choices[0].message.content);
}
