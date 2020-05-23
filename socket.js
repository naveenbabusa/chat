const SA = require("./constants");

const CONNECTION = (socket, io) => {
	let { code, name = "Anonymous" } = socket.handshake.query;
	socket.join(code);
	socket.emit(
		SA.DISCOVERY,
		Object.keys(io.sockets.adapter.rooms[code].sockets).filter(
			(socketID) => socketID != socket.id
		)
	);
	socket.to(code).emit(SA.NOTIFICATION, {
		from: socket.id,
		senderName: name,
		text: `${name} Joined`,
		eventType: "connect",
	});

	socket.on(SA.OFFER, (data) => {
		io.to(data.id).emit(SA.OFFER, { ...data, id: socket.id, name });
	});

	socket.on(SA.ANSWER, (data) => {
		io.to(data.id).emit(SA.ANSWER, { ...data, id: socket.id, name });
	});

	socket.on(SA.CHAT_MESSAGE, (data) => {
		socket.to(code).emit(SA.CHAT_MESSAGE, {
			from: socket.id,
			senderName: name,
			...data,
		});
	});

	socket.on("disconnect", () => {
		io.to(code).emit(SA.NOTIFICATION, {
			from: socket.id,
			senderName: name,
			text: `${name} Left`,
			eventType: "disconnect",
		});
	});
};

module.exports = {
	CONNECTION,
};
