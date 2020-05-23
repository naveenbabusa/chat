import "./main.css";

import React, { useEffect, useRef, useState } from "react";

import { Form } from "react-bootstrap";

export default function MessagePanel(props) {
	const lastScrollElement = useRef(null);
	const scrollToBottom = () => {
		lastScrollElement.current.scrollIntoView();
	};
	useEffect(() => {
		scrollToBottom();
	}, [props.messages]);

	const [messageText, setMessageText] = useState("");
	const sendMessage = () => {
		if (messageText) {
			props.sendMessage(messageText);
			setMessageText("");
		}
	};

	const newMessageIndex = props.messages.length - props.newMessageCount;

	const style = { visibility: `${props.hide ? "hidden" : "visible"}` };

	return (
		<div className="message-panel" style={style}>
			<div className="message-panel-body">
				{props.messages.map((message, index) => (
					<div
						key={index}
						className={`message-baloon ${
							message.from === 0 && "message-baloon-right"
						}`}
					>
						<div className="message-baloon-body">
							<h6 className="message-baloon-body-h6">{message.text}</h6>
						</div>
						<div className="message-baloon-details">
							<h6 className="message-baloon-details-h6">
								{message.from === 0 ? "You" : message.senderName} |{" "}
								{message.time}{" "}
								{index >= newMessageIndex && message.from !== 0 && (
									<span className="message-baloon-new">new</span>
								)}
							</h6>
						</div>
					</div>
				))}
				<div ref={lastScrollElement} />
			</div>
			<div className="message-panel-separator"></div>
			<div className="message-panel-footer">
				<Form.Control
					className="message-input"
					placeholder="Type Something"
					value={messageText}
					onKeyDown={(e) => {
						e.persist();
						if (e.key === "Enter") {
							sendMessage();
						}
					}}
					onChange={(e) => {
						setMessageText(e.target.value);
					}}
				/>
				<div className="message-send">
					<i
						className="fa fa-paper-plane fa-lg"
						style={{ color: `${messageText ? "#0f4c81" : "lightgrey"}` }}
						onClick={sendMessage}
					/>
				</div>
			</div>
		</div>
	);
}
