import type { Handler } from '@netlify/functions';

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_IMAGES_TOKEN;

export const handler: Handler = async () => {
    //TODO: set a photo metadata process for prof/personal photos, add async (event)
    //const tag = event.queryStringParameters?.tag;
    //const value = event.queryStringParameters?.tag;

    try {
        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1`,
            {
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`,
                },
            }
        );

        const data = await response.json();

        if (!data.success) {
            return {
                statusCode:500,
                body: JSON.stringify({ error: data.errors }),
            };
        }

        const images = data.result.images;

        // if (tag && value) {
        //     images = images.filter((img: any) => img.metadata?.[tag] === value);
        //   }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300',
            },
            body: JSON.stringify(images),
        };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return {
            statusCode:500, 
            body: JSON.stringify({ error: 'Failed to fetch images' }),
        };
    }
}

