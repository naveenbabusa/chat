import "./main.css";

import { Button, Form, ResponsiveEmbed } from "react-bootstrap";
import React, { createRef, useEffect, useState } from "react";

function LandingPage() {
	const [id, setId] = useState("");
	const [pwd, setPwd] = useState("");
	const [showError, setShowError] = useState(false);
	const videoRef = createRef();

	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				const videoObj = videoRef.current;
				videoObj.srcObject = stream;
				videoObj.play();
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const onCreate = () => {
		setShowError(true);
	};

	const onJoin = () => {
		console.log(id, pwd);
	};

	return (
		<div className="layout">
			<div className="player-overlay">
				<video
					onContextMenu={() => false}
					ref={videoRef}
					muted
					className="videoElement"
				/>
			</div>

			<div className="meeting-options">
				<Form>
					<Form.Group>
						<Form.Control
							placeholder="Meeting ID"
							onChange={(e) => {
								setId(e.target.value);
							}}
							required
						/>
					</Form.Group>
					<Form.Group>
						<Form.Control
							type="password"
							placeholder="Password"
							onChange={(e) => {
								setPwd(e.target.value);
							}}
							required
						/>
					</Form.Group>
					<Button
						variant="warning"
						size="lg"
						className="join-button"
						type="submit"
						block
						onClick={onJoin}
					>
						JOIN A MEETING
					</Button>
					{showError && <div className="error">*Invalid Details</div>}
				</Form>

				<div className="horizontal-divider" />

				<Button variant="success" onClick={onCreate}>
					HOST A MEETING
				</Button>
			</div>
		</div>
	);
}

export default LandingPage;
