import { CHROME_SETTINGS, NON_CHROME_SETTINGS } from "./constants";

export const isChrome =
	/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

export const getUserMediaSettings = () => {
	if (isChrome) {
		return CHROME_SETTINGS;
	}
	return NON_CHROME_SETTINGS;
};
