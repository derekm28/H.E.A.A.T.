const EVENT_STORAGE_KEY = "heaat:events";
const MAX_EVENTS = 50;

function safeParse(json) {
    try {
        return JSON.parse(json);
    } catch (_error) {
        return [];
    }
}

export function trackEvent(name, payload = {}) {
    const event = {
        name,
        payload,
        ts: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
        const existing = safeParse(
            window.localStorage.getItem(EVENT_STORAGE_KEY) || "[]",
        );
        const next = [event, ...existing].slice(0, MAX_EVENTS);
        window.localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(next));
        window.__heaat_events = next;
    }

    if (typeof console !== "undefined") {
        console.info("[heaat] event", event);
    }
}
