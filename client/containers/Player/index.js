import "./main.css";

import React, { useState } from "react";

function Player() {
	return (
		<div className="video-container">
			<div className="player-overlay">
				<video
					onContextMenu={() => false}
					src="https://www.w3schools.com/html/mov_bbb.mp4"
					muted
					className="videoElement"
				/>
			</div>
			<div className="video-controls">
				<button>Hello</button>
				<button>world</button>
			</div>
		</div>
	);
}

export default Player;
