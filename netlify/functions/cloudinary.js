exports.handler = async function() {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image?max_results=100`, {
      headers: {
        'Authorization': `Basic ${credentials}`
      }
    });

    const data = await res.json();

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(data)
    };

  } catch(e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
}