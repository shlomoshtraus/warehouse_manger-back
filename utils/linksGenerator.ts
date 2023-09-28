
export function generateConfirmationLink(url, userId) {
    return `${url}/user/confirm/${userId}`;
}

export function generateRequestPasswordLink(url, userId) {
    return `${url}/reset/${userId}`;
}