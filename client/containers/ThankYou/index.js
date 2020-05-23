import "./main.css";

import { Button } from "react-bootstrap";
import React from "react";

function ThankYouPage() {
	const redirect = () => {
		window.open("https://forms.gle/jKRaYofjxLePWhKQA", "_self");
	};

	return (
		<div className="thank-you-page">
			<div>
				<h3 className="thank-you-text">Thank you</h3>
			</div>
			<div>
				<Button
					variant="warning"
					size="lg"
					className="join-button"
					type="submit"
					onClick={redirect}
					block
				>
					Provide Feedback
				</Button>
			</div>
		</div>
	);
}

export default ThankYouPage;
