export const CHROME_SETTINGS = {
	video: {
		mandatory: {
			googLeakyBucket: true,
			googNoiseReduction: true,
		},
		optional: [],
	},
	audio: {
		mandatory: {
			googEchoCancellation: true,
			googEchoCancellation2: true,
			googAutoGainControl: true,
			googAutoGainControl2: true,
			googNoiseSuppression: true,
			googNoiseSuppression2: true,
			googHighpassFilter: true,
		},
		optional: [],
	},
};

export const NON_CHROME_SETTINGS = {
	video: true,
	audio: true,
};
