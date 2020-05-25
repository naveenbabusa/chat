const { CONNECTION } = require("./socket");
const express = require("express");
const path = require("path");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

io.on("connection", (socket) => CONNECTION(socket, io));

app.use((req, res, next) => {
	if (
		process.env.NODE_ENV === "production" &&
		req.headers["x-forwarded-proto"] !== "https"
	) {
		return res.redirect("https://" + req.headers.host + req.url);
	}
	return next();
});

app.use(express.static(__dirname + "/public"));

app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname + "/public/index.html"));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
	console.log(`Server listening ${PORT}`);
});
