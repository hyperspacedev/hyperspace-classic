/**
 * Determine whether the user agent is a mobile device or a desktop client.
 * @returns `True` if user agent is mobile or `False` id the user agent is a desktop.
 */
export function isMobileAgent(): boolean {
    let agent = navigator.userAgent;
    return (/windows phone/i.test(agent) || /android/i.test(agent) || /iPad|iPhone|iPod/i.test(agent));
}

/**
 * Determines what mobile operating system the device is running.
 * @returns `ios` if an iOS device, `android` if an Android device, `unknown` if unknown, or `none` if the device isn't a mobile one.
 */
export function getMobileAgent(): string {
    let devicetype = "";
    if (isMobileAgent()) {
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            devicetype = 'ios';
        } else if (/android/i.test(navigator.userAgent)) {
            devicetype = 'android';
        } else {
            devicetype = 'unknown';
        }
    } else {
        devicetype = 'none';
    }
    return devicetype;
}