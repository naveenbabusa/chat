import "./main.css";

import { Button, Form, Modal } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import { generateRoomCode } from "../../../helpers";

function DetailsModal(props) {
	const [show, setShow] = useState(true);
	const hashValue = location.hash.replace("#", "") || generateRoomCode();
	history.pushState({}, null, `#${hashValue}`);

	const [meetingID, setMeetingID] = useState(hashValue);
	const [isMeetingIDValid, setIsMeetingIDValid] = useState(false);
	useEffect(() => {
		setIsMeetingIDValid(
			meetingID.length == 11 && meetingID[3] == "-" && meetingID[7] == "-"
		);
	}, [meetingID]);

	const [name, setName] = useState("");
	const [isNameValid, setIsNameValid] = useState(false);
	useEffect(() => {
		setIsNameValid(name.length > 0 && name.length <= 15);
	}, [name]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (isNameValid && isMeetingIDValid) {
			setShow(false);
			history.pushState({}, null, `#${meetingID}`);
			props.onSubmit({ meetingID, name });
		}
	};

	return (
		<Modal show={show} backdrop="static">
			<Modal.Header>
				<Modal.Title>
					<h4>
						<span className="logo-span">
							<img src="assets/images/logo-32x32.ico" />{" "}
						</span>{" "}
						Almost there!
					</h4>
				</Modal.Title>
			</Modal.Header>
			<Form onSubmit={handleSubmit} noValidate>
				<Modal.Body>
					<Form.Group>
						<Form.Label>Meeting ID</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter Meeting ID"
							defaultValue={meetingID}
							isValid={isMeetingIDValid}
							isInvalid={!isMeetingIDValid}
							onChange={(e) => {
								setMeetingID(e.target.value);
							}}
						/>
						<Form.Control.Feedback type="valid">
							Copy the URL to invite more friends
						</Form.Control.Feedback>
						<Form.Control.Feedback type="invalid">
							Please provide a meeting id in XXX-XXX-XXX
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group>
						<Form.Label>Name</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter your name"
							isValid={isNameValid}
							isInvalid={!isNameValid}
							required
							onChange={(e) => {
								setName(e.target.value.trim());
							}}
						/>
						<Form.Text className="text-muted">
							This will be used as your identity in the meeting
						</Form.Text>
						<Form.Control.Feedback type="invalid">
							Please enter your name. Maximum 15 characters allowed.
						</Form.Control.Feedback>
					</Form.Group>
				</Modal.Body>

				<Modal.Footer>
					<Button
						variant="primary"
						type="submit"
						disabled={!isNameValid || !isMeetingIDValid}
					>
						Enter
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
}

export default DetailsModal;
