import "./main.css";

import { Button } from "react-bootstrap";
import React from "react";

export function PermissionDeniedError(props) {
	const redirect = () => {
		props.history.push("/");
	};

	return (
		<div className="error-page">
			<div>
				<p className="error-text">
					The App needs Audio and Video permissions. Please provide the
					permissions and try again.
				</p>
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
					Try Again
				</Button>
			</div>
		</div>
	);
}
