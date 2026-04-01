exports.handler = async function() {
  try {
    const NOTION_KEY = process.env.NOTION_KEY;
    const DATABASE_ID = process.env.NOTION_EVENTS_ID;

    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sorts: [{ property: "Date", direction: "descending" }]
      })
    });

    const data = await response.json();

    if (!data.results) {
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "No results from Notion", detail: data })
      };
    }

    const events = data.results.map(row => {
      const props = row.properties;
      return {
        name:        props.Name?.title?.[0]?.plain_text || '',
        venue:       props.Venue?.rich_text?.[0]?.plain_text || '',
        date:        props.Date?.date?.start || '',
        description: props.Description?.rich_text?.[0]?.plain_text || '',
        image:       props.Image?.url || '',
        link:        props.Link?.url || ''
      };
    });

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(events)
    };

  } catch(e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
}
