import "./main.css";

import React from "react";

export default function MessageBar(props) {
	const iconStyle = { color: "aliceblue" };
	return (
		<div
			className="messager-bar-panel"
			onClick={() => props.changeStatus(!props.open)}
		>
			{props.open ? (
				<i className={`fa fa-times fa-2x`} style={iconStyle} />
			) : (
				<>
					<i className={`fa fa-commenting-o fa-2x`} style={iconStyle} />
					{props.newMessageCount > 0 && (
						<div className="messageCount">
							<div>{props.newMessageCount}</div>
						</div>
					)}
				</>
			)}
		</div>
	);
}
