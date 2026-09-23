const BASE_URL =
    "https://7zbxtzymgd.execute-api.eu-north-1.amazonaws.com/messages";

export const getMessages = async () => {
    const response = await fetch(`${BASE_URL}/get`);

    if (!response.ok) {
        throw new Error(`Could not fetch messages: ${response.status}`);
    }

    const data = await response.json();

    const payload =
        typeof data.body === 'string'
            ? JSON.parse(data.body)
            : data.body || data;

    if (!payload.success) {
        throw new Error(payload.message || 'Could not fetch messages');
    }

    return payload.messages || [];
};

export const getAllMessagesFromUser = async (username) => {
    const response = await fetch(
        `${BASE_URL}/get/${encodeURIComponent(username)}`
    );

    if (!response.ok) {
        throw new Error(`Could not fetch messages: ${response.status}`);
    }

    const data = await response.json();

    const payload =
        typeof data.body === 'string'
            ? JSON.parse(data.body)
            : data.body || data;

    if (!payload.success) {
        throw new Error(payload.message || 'Could not fetch messages');
    }

    return payload.messages || [];
};

export const newMessage = async (message, token) => {
	const response = await fetch(`${BASE_URL}/post`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(message),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "Could not post message");
	}

	return data;
};

export const editMessage = async (message, token, messageId) => {
    const response = await fetch(`${BASE_URL}/edit/${messageId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(message),
    });

    const rawResponse = await response.text();

    let data = {};

    try {
        data = rawResponse ? JSON.parse(rawResponse) : {};
    } catch {
        data = {
            message: rawResponse,
        };
    }

    if (!response.ok) {
        throw new Error(
            data.message || `Could not edit message: ${response.status}`
        );
    }

    return data;
};

export const deleteMessage = async (token, messageId) => {
    const response = await fetch(`${BASE_URL}/delete/${messageId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const rawResponse = await response.text();

    let data = {};

    try {
        data = rawResponse ? JSON.parse(rawResponse) : {};
    } catch {
        data = {
            message: rawResponse,
        };
    }

    if (!response.ok) {
        throw new Error(
            data.message || `Could not delete message: ${response.status}`
        );
    }

    return data;
};