export function getThumbnailUrl(sneaker) {
    return (
        sneaker?.media?.smallImageUrl?.trim() ||
        sneaker?.media?.imageUrl?.trim() ||
        ""
    );
}

export function hasThumbnail(sneaker) {
    const thumbnail = getThumbnailUrl(sneaker);

    if (!thumbnail) {
        return false;
    }

    if (["n/a", "null", "undefined"].includes(thumbnail.toLowerCase())) {
        return false;
    }

    try {
        const parsedUrl = new URL(thumbnail);
        return ["http:", "https:", "data:"].includes(parsedUrl.protocol);
    } catch (_error) {
        return false;
    }
}

function doesImageLoad(url, timeoutMs = 5000) {
    return new Promise(resolve => {
        const image = new Image();
        let settled = false;

        const timeoutId = setTimeout(() => {
            if (!settled) {
                settled = true;
                resolve(false);
            }
        }, timeoutMs);

        image.onload = () => {
            if (!settled) {
                settled = true;
                clearTimeout(timeoutId);
                resolve(true);
            }
        };

        image.onerror = () => {
            if (!settled) {
                settled = true;
                clearTimeout(timeoutId);
                resolve(false);
            }
        };

        image.src = url;
    });
}

export async function filterSneakersWithWorkingThumbnails(sneakers) {
    const sneakersWithThumbnail = sneakers.filter(hasThumbnail);
    const checks = await Promise.all(
        sneakersWithThumbnail.map(async sneaker => {
            const thumbnailUrl = getThumbnailUrl(sneaker);
            const works = await doesImageLoad(thumbnailUrl);
            return works ? sneaker : null;
        }),
    );

    return checks.filter(Boolean);
}
