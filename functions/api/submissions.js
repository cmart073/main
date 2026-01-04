// API endpoint to list all wedding submissions
export async function onRequestGet(context) {
  try {
    if (!context.env.WEDDING_SUBMISSIONS) {
      return new Response(JSON.stringify({ error: 'KV not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // List all submission keys
    const list = await context.env.WEDDING_SUBMISSIONS.list({ prefix: 'submission:' });
    
    // Fetch all submissions
    const submissions = await Promise.all(
      list.keys.map(async (key) => {
        const data = await context.env.WEDDING_SUBMISSIONS.get(key.name);
        return JSON.parse(data);
      })
    );
    
    // Sort by timestamp, newest first
    submissions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return new Response(JSON.stringify(submissions), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
