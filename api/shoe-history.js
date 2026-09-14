import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const product = req.body?.product;

    if (!product?.title) {
        res.status(400).json({ error: "Product details are required" });
        return;
    }

    try {
        const result = await client.responses.create({
            model: "gpt-5-mini",
            instructions:
                `Write a concise, engaging sneaker history summary using only
                the supplied facts. Do not invent collaborations, designers, athletes, 
                cultural claims, materials, or release history. If the supplied facts 
                are insufficient, say that historical context is limited. Keep the response 
                to 2 or 3 sentences.`,
            input: JSON.stringify({
                title: product.title,
                brand: product.brand,
                model: product.shoe,
                colorway: product.colorway,
                releaseDate: product.releaseDate,
                retailPrice: product.retailPrice,
                styleId: product.styleId,
                description: product.description,
            }),
        });

        res.status(200).json({ summary: result.output_text, });

    } catch (error) {
        console.error("AI history error:", error);
        res.status(500).json({
            error: "Unable to generate shoe history",
        });
    }
}
