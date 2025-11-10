// api/groq.js - Serverless function for Groq API (Vercel)
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Get API key from environment variable
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  
  if (!GROQ_API_KEY) {
    console.error('GROQ_API_KEY not found in environment variables');
    return res.status(500).json({ 
      error: 'Server configuration error',
      message: 'API key not configured'
    });
  }
  
  const { messages, userContext } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request: messages array required' });
  }

  try {
    // Prepare messages with system context
    const fullMessages = [
      { 
        role: 'system', 
        content: userContext || 'You are an expert DSA learning assistant. Provide concise, practical advice.' 
      },
      ...messages
    ];

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: fullMessages,
        temperature: 0.7,
        max_tokens: 800
      })
    });

    const data = await response.json();
    
    // Log error if Groq API fails
    if (!response.ok) {
      console.error('Groq API error:', data);
      return res.status(response.status).json({
        error: data.error?.message || 'Groq API error',
        details: data
      });
    }
    
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
