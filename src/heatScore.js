const BRAND_HEAT = {
    nike: 22,
    jordan: 25,
    adidas: 20,
    yeezy: 24,
    "off-white": 25,
    balenciaga: 19,
    "louis vuitton": 21,
    dior: 22,
    gucci: 18,
    prada: 17,
    chanel: 18,
};

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function getPriceScore(retailPrice) {
    const price = Number(retailPrice) || 0;
    return clamp(Math.round((price / 350) * 40), 0, 40);
}

function getRecencyScore(releaseDate) {
    if (!releaseDate) {
        return 10;
    }

    const date = new Date(releaseDate);
    if (Number.isNaN(date.getTime())) {
        return 10;
    }

    const msPerDay = 24 * 60 * 60 * 1000;
    const ageInDays = Math.abs((Date.now() - date.getTime()) / msPerDay);

    if (ageInDays <= 90) {
        return 35;
    }
    if (ageInDays <= 365) {
        return 28;
    }
    if (ageInDays <= 730) {
        return 20;
    }
    return 12;
}

function getBrandScore(brand) {
    if (!brand) {
        return 12;
    }
    const key = brand.toLowerCase();
    return BRAND_HEAT[key] || 14;
}

function getTier(score) {
    if (score >= 82) {
        return { label: "Legendary", key: "legendary" };
    }
    if (score >= 68) {
        return { label: "Hot", key: "hot" };
    }
    if (score >= 52) {
        return { label: "Warm", key: "warm" };
    }
    return { label: "Mild", key: "mild" };
}

export function getHeatScoreData(sneaker) {
    const score = clamp(
        getPriceScore(sneaker?.retailPrice) +
            getRecencyScore(sneaker?.releaseDate) +
            getBrandScore(sneaker?.brand),
        0,
        100,
    );
    const tier = getTier(score);

    return {
        score,
        tierLabel: tier.label,
        tierKey: tier.key,
    };
}
