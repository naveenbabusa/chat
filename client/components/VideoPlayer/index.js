import "./main.css";

import React, { createRef } from "react";

import visualizer from "./audioMeter";

export default class VideoPlayer extends React.Component {
	_isMounted = true;
	state = {
		videoRef: createRef(),
		audioMeter: {
			minHeight: 5,
			coverHeight: 0,
			coverRate: 1.2,
			middleHeight: 0,
			middleRate: 2,
			clipping: false,
			mute: true,
		},
	};

	componentDidMount() {
		const videoObj = this.state.videoRef.current;
		const { stream } = this.props;
		videoObj.srcObject = stream;
		videoObj.play();
		visualizer(stream, this.setAudio, () => this._isMounted);
	}

	componentWillUnmount() {
		this._isMounted = false;
		const { stream } = this.props;
		stream.getTracks().forEach((track) => track.stop());
	}

	isStreamOnMute = (volume) => {
		return Math.floor(volume * 100) === 0;
	};

	setAudio = (meter) => {
		const { minHeight, coverRate, middleRate } = this.state.audioMeter;
		const volume = meter.volume * 100;
		const length = Math.ceil(volume / 2) * 2;

		if (this._isMounted) {
			this.setState({
				audioMeter: {
					...this.state.audioMeter,
					mute: this.isStreamOnMute(volume),
					clipping: meter.checkClipping(),
					coverHeight: Math.max(length * coverRate, minHeight),
					middleHeight: Math.max(length * middleRate, minHeight),
				},
			});
		}
	};

	render() {
		const { muted = false, invert = false, name = "" } = this.props;
		const rotateYDeg = `rotateY(${invert ? "180deg" : "0deg"})`;
		const style = {
			transform: rotateYDeg,
			WebkitTransform: rotateYDeg,
			MozTransform: rotateYDeg,
		};
		const { coverHeight, middleHeight, clipping, mute } = this.state.audioMeter;
		const audioMeterColor = {
			backgroundColor: `${clipping ? "#ed6663" : "#00e400"}`,
		};
		const audioMeterCoverStyle = {
			height: `${coverHeight}px`,
			...audioMeterColor,
		};
		const audioMeterMiddleStyle = {
			height: `${middleHeight}px`,
			...audioMeterColor,
		};
		return (
			<div className="video-container" style={{ position: "relative" }}>
				<div className="player-overlay">
					<video
						ref={this.state.videoRef}
						muted={muted}
						className="player"
						style={style}
					/>
				</div>
				<p className="player-name">{name}</p>
				{/* <div className="player-controls">
					<button>Show</button>
				</div> */}
				<div className="audio-visualizer">
					<div className="audio-meter-panel">
						{mute ? (
							<i
								className={`fa fa-microphone-slash fa-lg`}
								style={{ color: "#ed6663" }}
							/>
						) : (
							<>
								<div className="audio-meter" style={audioMeterCoverStyle} />
								<div className="audio-meter" style={audioMeterMiddleStyle} />
								<div className="audio-meter" style={audioMeterCoverStyle} />
							</>
						)}
					</div>
				</div>
			</div>
		);
	}
}
