exports.handler = async function() {
  try {
    const res = await fetch('https://usa19.fastcast4u.com:8340/stats?sid=1&json=1');
    const data = await res.json();
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ songtitle: data.songtitle || '' })
    };
  } catch(e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
}
