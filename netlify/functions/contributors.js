exports.handler = async function() {
  try {
    const NOTION_KEY = process.env.NOTION_KEY;
    const DATABASE_ID = process.env.NOTION_CONTRIBUTORS_ID;

    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sorts: [{ property: "Name", direction: "ascending" }]
      })
    });

    const data = await response.json();

    const contributors = data.results.map(row => {
      const props = row.properties;
      return {
        name:       props.Name?.title?.[0]?.plain_text || '',
        bio:        props.Bio?.rich_text?.[0]?.plain_text || '',
        image:      props.Image?.url || '',
        instagram:  props.Instagram?.url || '',
        mixcloud:   props.Mixcloud?.url || '',
        soundcloud: props.Soundcloud?.url || '',
        schedule:   props.Schedule?.rich_text?.[0]?.plain_text || '',
        active:     props.Active?.checkbox || false
      };
    });

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(contributors)
    };

  } catch(e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
}
