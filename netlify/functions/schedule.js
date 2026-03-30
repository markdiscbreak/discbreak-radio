exports.handler = async function() {
  try {
    const NOTION_KEY = process.env.NOTION_KEY;
    const DATABASE_ID = process.env.NOTION_SCHEDULE_ID;

    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sorts: [{ property: "Start", direction: "ascending" }]
      })
    });

    const data = await response.json();

    const shows = data.results.map(row => {
      const props = row.properties;
      return {
        show: props.Show?.title?.[0]?.plain_text || '',
        djName: props['DJ Name']?.rich_text?.[0]?.plain_text || '',
        day: props.Day?.rich_text?.[0]?.plain_text || '',
        start: props.Start?.rich_text?.[0]?.plain_text || '',
        end: props.End?.rich_text?.[0]?.plain_text || '',
        image: props.Image?.url || '',
        link: props.Link?.url || ''
      };
    });

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(shows)
    };

  } catch(e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
}