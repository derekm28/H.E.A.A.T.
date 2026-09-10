const KICKSDB_URL = "https://api.kicks.dev/v3/stockx/products";
const BRAND_NAMES = {
    nike: "Nike",
    jordan: "Jordan",
    prada: "Prada",
    givenchy: "Givenchy",
    balenciaga: "Balenciaga",
    "louis vuitton": "Louis Vuitton",
    yeezy: "Yeezy",
    adidas: "Adidas",
    gucci: "Gucci",
    dior: "Dior",
    "off-white": "Off-White",
    chanel: "Chanel",
};

function firstDefined(...values) {
    return values.find(value => value !== undefined && value !== null && value !== "");
}

function normalizeProduct(product) {
    const slug = product.slug || product.id;
    const stockXUrl = product.url || product.stockx_url ||
        (slug ? `https://stockx.com/${slug}` : "");
    const image = firstDefined(product.image, product.images?.[0]);

    return {
        ...product,
        id: product.id || product.slug,
        title: firstDefined(product.title, product.name, "Unknown sneaker"),
        name: firstDefined(product.name, product.title),
        brand: product.brand || "Unknown",
        shoe: firstDefined(product.model, product.silhouette, product.category),
        colorway: firstDefined(product.colorway, product.color, product.secondary_category),
        releaseDate: firstDefined(product.release_date, product.releaseDate),
        retailPrice: firstDefined(product.retail_price, product.retailPrice, product.msrp),
        styleId: firstDefined(product.sku, product.style_id, product.styleId),
        media: {
            smallImageUrl: image,
            imageUrl: image,
        },
        links: {
            ...(product.links || {}),
            stockX: stockXUrl,
        },
    };
}

export default async function handler(request, response) {
    if (request.method !== "GET") {
        response.status(405).json({ error: "Method not allowed" });
        return;
    }

    const apiKey = process.env.KICKSDB_API_KEY;
    if (!apiKey) {
        response.status(500).json({ error: "KICKSDB_API_KEY is not configured" });
        return;
    }

    const params = new URLSearchParams();
    const { query, brand, gender, limit = "100" } = request.query || {};
    if (query) params.set("query", query);
    if (brand) {
        const brandName = BRAND_NAMES[String(brand).toLowerCase()] || brand;
        params.set("filters", `brand = "${String(brandName).replace(/"/g, "\\\"")}"`);
    }
    if (gender) params.set("filters", `gender = "${String(gender).replace(/"/g, "\\\"")}"`);
    params.set("limit", String(Math.min(Number(limit) || 100, 100)));

    try {
        const upstream = await fetch(`${KICKSDB_URL}?${params.toString()}`, {
            headers: { Authorization: `Bearer ${apiKey}` },
        });
        const body = await upstream.json();
        if (!upstream.ok) {
            response.status(upstream.status).json({
                error: body.message || body.error || "KicksDB request failed",
            });
            return;
        }

        response.status(200).json({
            results: (body.data || []).map(normalizeProduct),
        });
    } catch (_error) {
        response.status(502).json({ error: "Unable to reach KicksDB" });
    }
}
