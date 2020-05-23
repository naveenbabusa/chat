const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const charactersLength = characters.length;

const generateCode = (size) => {
	var result = "";
	for (var i = 0; i < size; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

const getTimeOptions = {
	hour: "numeric",
	minute: "numeric",
	hour12: true,
};

const getTime = () => {
	const date = new Date();
	const time = new Intl.DateTimeFormat("en-US", getTimeOptions).format(date);
	return time;
};

const generateRoomCode = () => {
	var num = 3;
	var codes = [];
	while (num--) {
		codes.push(generateCode(3));
	}
	return codes.join("-");
};

module.exports = {
	generateRoomCode,
	generateCode,
	getTime,
};
