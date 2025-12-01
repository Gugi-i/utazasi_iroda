export async function searchAllJourneys() {
    const url = `https://localhost:8000/journeys`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Journey search failed: " + res.status);
    return res.json();
}

export async function searchJourneysForUser(email) {
    const url = `https://localhost:8000/journeys/email/${encodeURIComponent(email)}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Journey search failed: " + res.status);
    return res.json();
}

export async function deleteJourney(journeyId) {
    const url = `https://localhost:8000/journeys/${encodeURIComponent(journeyId)}`;
    const storedUser = localStorage.getItem("user");
    const token = storedUser ? JSON.parse(storedUser).access_token : null;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // This is the standard format
        }
    });

    if (!response.ok) {
        throw new Error("Deleting journey failed: " + response.status);
    }

    return true;
}
