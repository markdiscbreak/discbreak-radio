exports.handler = async function() {
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
  
  const images = data.resources.map(img => ({
    filename: img.public_id,
    url: `https://res.cloudinary.com/${cloudName}/image/upload/${img.public_id}.${img.format}`
  }));

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(images)
  };
}
```

Save it, then commit and push via VS Code Source Control with message `Add Cloudinary function`.

Once deployed, we'll test it at:
```
https://delightful-lokum-4d3e47.netlify.app/.netlify/functions/cloudinary