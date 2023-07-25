import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { pdfjs, Document, Page } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.js',
	import.meta.url
).toString();

const ChatInterface = () => {
	const { id } = useParams();
	const [chat, setChat] = useState(null);
	const [message, setMessage] = useState('');
	const [numPages, setNumPages] = useState(null);
	const [pageNumber, setPageNumber] = useState(1);

	const onDocumentLoadSuccess = ({ numPages }) => {
		setNumPages(numPages);
	};

	const changePage = offset =>
		setPageNumber(prevPageNumber => prevPageNumber + offset);

	const previousPage = () => changePage(-1);
	const nextPage = () => changePage(1);

	useEffect(() => {
		const fetchChat = async () => {
			const res = await axios.get(`http://localhost:8000/files/${id}`);
			setChat(res.data);
		};
		fetchChat();
	}, [id]);

	const handleSubmit = event => {
		event.preventDefault();
		setChat({
			...chat,
			messages: [
				...chat.messages,
				{
					role: 'user',
					content: message,
				},
			],
		});
		axios
			.post(`http://localhost:8000/files/${id}/messages`, {
				message,
			})
			.then(res => {
				setChat(res.data);
			});
		setMessage('');
	};

	return (
		<div className="flex">
			<div className="w-1/2 p-4">
				<Document
					file={`http://localhost:8000/files/${id}/pdf`}
					onLoadSuccess={onDocumentLoadSuccess}
				>
					<Page
						pageNumber={pageNumber}
						renderTextLayer={false}
						renderAnnotationLayer={false}
					/>
				</Document>
				<div className="w-full flex flex-row justify-center items-center gap-2">
					<button
						type="button"
						onClick={previousPage}
						disabled={pageNumber <= 1}
						className="bg-blue-500 text-white py-2 px-4"
					>
						&larr;
					</button>
					<span>
						Page {pageNumber} of {numPages}
					</span>
					<button
						type="button"
						onClick={nextPage}
						disabled={pageNumber >= numPages}
						className="bg-blue-500 text-white py-2 px-4"
					>
						&rarr;
					</button>
				</div>
			</div>
			<div className="w-1/2 p-4 flex flex-col space-y-4">
				<ul className="space-y-2 overflow-scroll flex-1">
					{chat?.messages.map((msg, index) => (
						<li
							key={index}
							className={`border p-2 ${
								msg.role === 'user' ? 'bg-blue-200' : 'bg-slate-200'
							}`}
						>
							{msg.content}
						</li>
					))}
				</ul>
				<form onSubmit={handleSubmit} className="flex space-x-2">
					<input
						type="text"
						value={message}
						onChange={e => setMessage(e.target.value)}
						className="flex-1 border p-2"
					/>
					<button type="submit" className="bg-green-500 text-white py-2 px-4">
						Send
					</button>
				</form>
			</div>
		</div>
	);
};

export default ChatInterface;
