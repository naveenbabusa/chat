import "./main.css";

import React, { useEffect, useState } from "react";

import ControlBar from "../../components/ControlBar";
import DetailsModal from "../../components/Modal";
import MessageBar from "../../components/MessageBar";
import MessagePanel from "../../components/MessagePanel";
import NotificationPanel from "../../components/Notification";
import Peer from "simple-peer";
import SA from "../../../constants";
import VideoPlayer from "../../components/VideoPlayer";
import { getTime } from "../../../helpers";
import { getUserMediaSettings } from "../../helpers";
import io from "socket.io-client";

export default function Home(props) {
	const [socket, setSocket] = useState(null);
	const [credentials, setCredentials] = useState(null);

	const [currentStream, setCurrentStream] = useState();
	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia(getUserMediaSettings())
			.then((stream) => {
				setCurrentStream(stream);
				setPeers((peers) => [
					{ name: "You", invert: true, id: 0, stream, muted: true },
					...peers,
				]);
			})
			.catch((err) => {
				if (err.message.includes("Permission denied")) {
					props.history.push("/permission-denied");
				}
				console.error(err);
			});
	}, []);

	const [peers, setPeers] = useState([]);
	const registerListenerOnPeer = (id, name, peer) => {
		peer.on("stream", (stream) => {
			newPeerSound.play();
			setPeers((peers) => {
				const peerConfig = {
					name,
					invert: false,
					id,
					stream,
					muted: false,
					peerObject: peer,
				};
				const index = peers.map((peer) => peer.id).indexOf(id);
				if (index !== -1) {
					peers[index] = peerConfig;
					return peers;
				}
				return [...peers, peerConfig];
			});
		});

		peer.on("close", () => {
			removePeer(id);
		});

		peer.on("error", (err) => {
			removePeer(id);
		});
	};

	const killPeer = (peer) => {
		if (peer) {
			peer.destroy();
		}
	};

	const removePeer = (id) => {
		setPeers((peers) => {
			return peers.filter((e) => {
				if (e.id == id) {
					killPeer(e.peerObject);
				}
				return e.id != id;
			});
		});
	};

	const [messages, setMessages] = useState([]);
	const [notifications, setNotifications] = useState([]);
	const [openChatPanel, setOpenChatPanel] = useState(false);
	const [newMessageCount, setNewMessageCount] = useState(0);

	const newPeerSound = new Audio("assets/sounds/login.mp3");
	const newMessageSound = new Audio("assets/sounds/newMessage.mp3");

	const registerSocket = (socket) => {
		socket.on(SA.NOTIFICATION, (data) => {
			const { text, eventType, from } = data;

			setTimeout(() => {
				setNotifications((notifications) =>
					notifications.filter((notification) => notification !== text)
				);
			}, 5000);

			setNotifications((notifications) => [...notifications, text]);
			if (eventType === "disconnect") {
				removePeer(from);
			}
		});

		socket.on(SA.CHAT_MESSAGE, (data) => {
			newMessageSound.play();
			setMessages((messages) => [...messages, { ...data, time: getTime() }]);
			setNewMessageCount((count) => count + 1);
		});

		const peerLookUp = {};

		socket.on(SA.DISCOVERY, (data) => {
			data.forEach((node) => {
				const peer = new Peer({
					initiator: true,
					trickle: false,
					stream: currentStream,
				});
				peer.on("signal", (data) => {
					socket.emit(SA.OFFER, { id: node, data });
				});
				peerLookUp[node] = peer;
			});
		});

		socket.on(SA.OFFER, (offer) => {
			const { data, id, name } = offer;
			const peer = new Peer({
				initiator: false,
				trickle: false,
				stream: currentStream,
			});
			peer.on("signal", (signalData) => {
				if (signalData.type === "answer") {
					socket.emit(SA.ANSWER, { id, data: signalData });
				}
			});
			registerListenerOnPeer(id, name, peer);
			peer.signal(data);
		});

		socket.on(SA.ANSWER, (answer) => {
			const { data, id, name } = answer;
			const peer = peerLookUp[id];
			if (peer) {
				registerListenerOnPeer(id, name, peer);
				peer.signal(data);
			}
		});
	};

	useEffect(() => {
		if (!currentStream || !credentials) {
			return;
		}
		const socket = io.connect({
			query: {
				code: credentials.meetingID,
				name: credentials.name,
				pwd: "hello",
				startMeeting: false,
			},
		});
		registerSocket(socket);
		socket.on("connect", () => {
			setSocket(socket);
		});
	}, [currentStream, credentials]);

	const onSendMessage = (message) => {
		socket.emit(SA.CHAT_MESSAGE, {
			text: message,
		});
		setMessages((messages) => [
			...messages,
			{ from: 0, text: message, time: getTime() },
		]);
		setNewMessageCount((count) => count + 1);
	};

	const [audioOnMute, setAudioOnMute] = useState(false);
	const [videoOnMute, setVideoOnMute] = useState(false);
	useEffect(() => {
		if (currentStream) {
			currentStream.getAudioTracks().forEach((track) => {
				track.enabled = !audioOnMute;
			});
		}
	}, [currentStream, audioOnMute]);
	useEffect(() => {
		if (currentStream) {
			currentStream.getVideoTracks().forEach((track) => {
				track.enabled = !videoOnMute;
			});
		}
	}, [currentStream, videoOnMute]);

	const dropCall = () => {
		if (socket) {
			socket.disconnect();
		}
		peers.forEach((peer) => {
			killPeer(peer.peerObject);
		});
		setPeers((peers) => [peers[0]]);
		props.history.push("/thank-you");
	};

	return (
		<div>
			<DetailsModal onSubmit={setCredentials} />
			<div className="video-cards">
				{peers.map((peer) => {
					const { name, invert, id, stream, muted } = peer;
					return (
						<div className="video-player-card" key={id}>
							<VideoPlayer
								stream={stream}
								key={id}
								name={name}
								invert={invert}
								muted={muted}
							/>
						</div>
					);
				})}
			</div>
			<div className="notifications">
				<NotificationPanel notifications={notifications} />
			</div>
			<div className="messages">
				<MessageBar
					open={openChatPanel}
					changeStatus={(status) => {
						setOpenChatPanel(status);
						if (!status) {
							setNewMessageCount(0);
						}
					}}
					newMessageCount={newMessageCount}
				/>
				{openChatPanel && (
					<MessagePanel
						open={openChatPanel}
						messages={messages}
						sendMessage={onSendMessage}
						hide={!openChatPanel}
						newMessageCount={newMessageCount}
					/>
				)}
			</div>
			{!openChatPanel && (
				<div className="controlbar">
					<ControlBar
						audioOnMute={audioOnMute}
						videoOnMute={videoOnMute}
						setAudio={() => {
							setAudioOnMute((onMute) => !onMute);
						}}
						setVideo={() => {
							setVideoOnMute((onMute) => !onMute);
						}}
						dropCall={dropCall}
					/>
				</div>
			)}
		</div>
	);
}
