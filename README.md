# MERN PDF Chat
**MERN PDF Chat** is a web application that allows users to upload PDFs, view them, and chat with them. It uses ChatGPT 3.5-Turbo via the OpenAI API to understand the PDF's text, and has a user-friendly UI that allows users to interact with the PDF like a chat bot. This README provides instructions for setting up and running both the frontend and backend components of the application.

## Backend Setup and Running

1. Install the required dependencies:

```shell
cd backend
npm install
```

2. Set up environment variables by creating a `.env` file and populating it with the necessary values. Example file can be found in `backend/.env.example`.

3. Start the backend server:

```shell
npm start
```

The backend server will run at [localhost:8000](http://localhost:8000).

**Note**: Make sure you have MongoDB set up and running.

## Frontend Setup and Running

1. Install the required dependencies:

```shell
cd frontend
npm install
```

2. Start the frontend server:

```shell
npm start
```

The frontend server will run at [localhost:3000](http://localhost:3000). You can access the running application by opening this URL in your web browser.
