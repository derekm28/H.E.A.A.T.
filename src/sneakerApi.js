export async function getSneakers(params = {}) {
    const searchParams = new URLSearchParams();

    Object.entries({ limit: 100, ...params }).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            searchParams.set(key, value);
        }
    });

    const response = await fetch(`/api/sneakers?${searchParams.toString()}`);
    const body = await response.json();

    if (!response.ok) {
        throw new Error(body.error || "Unable to load sneakers");
    }

    return body.results || [];
}
