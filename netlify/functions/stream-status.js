// netlify/functions/stream-status.js
//
// Checks whether the Disc Break Cloudflare Stream live input is currently
// receiving a broadcast. Returns { live: true, videoId } when active.
//
// Required env vars (Netlify site settings):
//   CF_ACCOUNT_ID     — Cloudflare account ID
//   CF_STREAM_TOKEN   — API token with Stream:Read permission
//   CF_LIVE_INPUT_UID — Live Input UID for Disc Break Live

exports.handler = async () => {
  const { CF_ACCOUNT_ID, CF_STREAM_TOKEN, CF_LIVE_INPUT_UID } = process.env;

  if (!CF_ACCOUNT_ID || !CF_STREAM_TOKEN || !CF_LIVE_INPUT_UID) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: JSON.stringify({ live: false, error: "Missing Cloudflare env vars" }),
    };
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream/live_inputs/${CF_LIVE_INPUT_UID}/videos`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${CF_STREAM_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        body: JSON.stringify({ live: false }),
      };
    }

    const data = await res.json();
    const videos = data?.result || [];
    const activeLive = videos.find((v) => v?.status?.state === "live-inprogress");

    if (activeLive) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        body: JSON.stringify({ live: true, videoId: activeLive.uid }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: JSON.stringify({ live: false }),
    };
  } catch (err) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: JSON.stringify({ live: false, error: String(err) }),
    };
  }
};
