import "./main.css";

import React from "react";

export default function NotificationPanel(props) {
	return (
		<div className="notification-panel">
			{props.notifications.map((message, index) => {
				return (
					<h6 className="notification-message" key={index}>
						{message}
					</h6>
				);
			})}
		</div>
	);
}
