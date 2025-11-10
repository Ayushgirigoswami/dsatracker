// api/groq.js
export default async function handler(req, res) {
  
  // --- NEW MARKER LINE TO TEST DEPLOYMENT ---
  console.log('--- RUNNING LATEST GROQ.JS v3 (with llama3 model) ---');
  // --- END OF NEW LINE ---

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.error('GROQ_API_KEY is not set in Vercel environment variables.');
    return res.status(500).json({ error: 'Internal server error', message: 'API key not configured.' });
  }

  try {
    const { messages, userContext } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    const modelToUse = 'llama3-70b-8192';

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelToUse, // Using the correct model
        messages: messages,
        temperature: 0.7,
        max_tokens: 800,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const error = await response.json();
      // THIS IS THE ERROR WE NEED TO SEE
      console.error('Groq API Error Response:', error); 
      return res.status(response.status).json(error);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Internal Server Error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
