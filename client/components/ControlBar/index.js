import "./main.css";

import React from "react";

const ControlBar = (props) => {
	const { audioOnMute, videoOnMute, setAudio, setVideo, dropCall } = props;
	const iconStyle = { color: "aliceblue" };

	return (
		<div className="controlbar-head">
			<div className="control-button" onClick={setAudio}>
				<i className={`fa fa-microphone fa-2x`} style={iconStyle} />
				{audioOnMute && <div className="control-button-disabled" />}
			</div>
			<div className="control-button" onClick={dropCall}>
				<i className={`fa fa-times fa-2x`} style={iconStyle} />
			</div>
			<div className="control-button" onClick={setVideo}>
				<i className={`fa fa-video-camera fa-2x`} style={iconStyle} />
				{videoOnMute && <div className="control-button-disabled" />}
			</div>
		</div>
	);
};

export default ControlBar;
