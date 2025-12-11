// api/send-email.js - Production-Ready Email API using Resend
// Deploy this to Vercel as a serverless function

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, type, data } = req.body;

    if (!to || !type) {
      return res.status(400).json({ error: 'Email and type required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Get Resend API key from environment variable
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    
    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not configured in Vercel environment variables');
      return res.status(500).json({ 
        error: 'Email service not configured. Please add RESEND_API_KEY to Vercel environment variables.' 
      });
    }

    // Generate email content based on type
    let subject, html;

    switch (type) {
      case 'test':
        subject = '✅ DSA Tracker - Test Email';
        html = generateTestEmail(data);
        break;
      case 'weekly_report':
        subject = '📊 Your Weekly DSA Progress Report';
        html = generateWeeklyReport(data);
        break;
      case 'revision_reminder':
        subject = '🔄 Time to Review Your Problems!';
        html = generateRevisionReminder(data);
        break;
      default:
        return res.status(400).json({ error: 'Invalid email type' });
    }

    // Send email using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'DSA Tracker <noreply@dsatarcker.com>', // Change to your verified domain
        to: [to],
        subject,
        html
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', result);
      throw new Error(result.message || 'Failed to send email');
    }

    console.log('✅ Email sent successfully to:', to);
    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully',
      emailId: result.id 
    });

  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to send email',
      details: 'Check Vercel logs for more information'
    });
  }
}

// Email Templates

function generateTestEmail(data) {
  const { username, totalProblems, solved } = data;
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          background: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        .container { 
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 28px;
        }
        .content { 
          padding: 40px 30px;
          line-height: 1.6;
        }
        .stat-box {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .stat-box h3 {
          margin: 0 0 15px 0;
          color: #667eea;
        }
        .stat-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .stat-item:last-child {
          border-bottom: none;
        }
        .btn {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 8px;
          margin: 20px 0;
          font-weight: 600;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #666;
          font-size: 13px;
        }
        .success-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="success-icon">✅</div>
          <h1>Email Notifications Working!</h1>
          <p>Your DSA Tracker is successfully connected</p>
        </div>
        <div class="content">
          <p>Hi <strong>${username}</strong>! 👋</p>
          
          <p>Great news! Your email notifications are now set up and working perfectly. You'll receive:</p>
          
          <ul style="line-height: 2;">
            <li>📊 Weekly progress reports every Monday</li>
            <li>🔄 Revision reminders for spaced repetition</li>
            <li>🎯 Personalized learning insights</li>
          </ul>
          
          <div class="stat-box">
            <h3>📈 Your Current Stats</h3>
            <div class="stat-item">
              <span>Total Problems</span>
              <strong>${totalProblems}</strong>
            </div>
            <div class="stat-item">
              <span>Solved Independently</span>
              <strong>${solved}</strong>
            </div>
            <div class="stat-item">
              <span>Success Rate</span>
              <strong>${totalProblems > 0 ? Math.round((solved/totalProblems)*100) : 0}%</strong>
            </div>
          </div>
          
          <p>Keep up the great work! Consistency is key to mastering DSA. 🚀</p>
          
          <center>
            <a href="https://dsatracker-ecru.vercel.app/" class="btn">Continue Learning →</a>
          </center>
        </div>
        <div class="footer">
          <p><strong>DSA Master Tracker</strong></p>
          <p>You're receiving this email because you enabled notifications.</p>
          <p style="font-size: 11px; color: #999; margin-top: 10px;">
            Powered by Resend • Disable anytime from your tracker settings
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateWeeklyReport(data) {
  const { username, totalProblems, weekProblems, solved, streak, weakTopics, avgTime } = data;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          background: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        .container { 
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 28px;
        }
        .content { 
          padding: 40px 30px;
          line-height: 1.6;
        }
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin: 25px 0;
        }
        .stat-card {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
        }
        .stat-card .number {
          font-size: 36px;
          font-weight: bold;
          color: #667eea;
          margin: 10px 0;
        }
        .stat-card .label {
          font-size: 13px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .topic-box {
          background: #fff5f5;
          border-left: 4px solid #e74c3c;
          padding: 15px;
          margin: 10px 0;
          border-radius: 5px;
        }
        .topic-box strong {
          color: #e74c3c;
        }
        .btn {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 8px;
          margin: 20px 0;
          font-weight: 600;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #666;
          font-size: 13px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📊 Weekly Progress Report</h1>
          <p>Hey ${username}! Here's your DSA journey update</p>
        </div>
        <div class="content">
          <p>Here's a summary of your learning progress this week:</p>
          
          <div class="stat-grid">
            <div class="stat-card">
              <div class="label">This Week</div>
              <div class="number">${weekProblems}</div>
              <div class="label">Problems</div>
            </div>
            <div class="stat-card">
              <div class="label">Solved</div>
              <div class="number">${solved}</div>
              <div class="label">Successfully</div>
            </div>
            <div class="stat-card">
              <div class="label">Daily Streak</div>
              <div class="number">${streak} 🔥</div>
              <div class="label">Days</div>
            </div>
            <div class="stat-card">
              <div class="label">Avg Time</div>
              <div class="number">${avgTime}</div>
              <div class="label">Minutes</div>
            </div>
          </div>
          
          ${weekProblems > 0 ? `
          <p><strong>Success Rate:</strong> ${Math.round((solved/weekProblems)*100)}% 
          ${Math.round((solved/weekProblems)*100) >= 70 ? '🎉 Excellent!' : '💪 Keep pushing!'}</p>
          ` : ''}
          
          ${weakTopics && weakTopics.length > 0 ? `
          <h3 style="color: #667eea; margin-top: 30px;">🎯 Focus Areas</h3>
          <p>These topics need more practice:</p>
          ${weakTopics.map(t => `
            <div class="topic-box">
              <strong>${t.topic}</strong> - ${t.solved}/${t.total} solved (${t.rate}%)
              <br><small>Practice ${Math.max(5 - t.solved, 0)} more problems</small>
            </div>
          `).join('')}
          ` : '<p>🌟 Great job! You\'re performing well across all topics!</p>'}
          
          <h3 style="color: #667eea; margin-top: 30px;">💡 This Week's Goal</h3>
          <p>Focus on solving at least <strong>5 problems</strong> from your weak topics. Quality over quantity!</p>
          
          <center>
            <a href="https://dsatracker-ecru.vercel.app/" class="btn">Continue Learning →</a>
          </center>
        </div>
        <div class="footer">
          <p><strong>DSA Master Tracker</strong></p>
          <p>Weekly reports sent every Monday • Manage settings in your tracker</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateRevisionReminder(data) {
  const { username, problems } = data;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          background: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        .container { 
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 28px;
        }
        .content { 
          padding: 40px 30px;
          line-height: 1.6;
        }
        .problem-item {
          background: #fff5f5;
          border-left: 4px solid #e74c3c;
          padding: 15px;
          margin: 10px 0;
          border-radius: 5px;
        }
        .problem-item strong {
          color: #e74c3c;
          font-size: 16px;
        }
        .btn {
          display: inline-block;
          background: #e74c3c;
          color: white;
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 8px;
          margin: 20px 0;
          font-weight: 600;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #666;
          font-size: 13px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div style="font-size: 48px; margin-bottom: 10px;">🔄</div>
          <h1>Revision Time!</h1>
          <p>Hi ${username}, these problems need your attention</p>
        </div>
        <div class="content">
          <p>Based on spaced repetition, <strong>${problems.length} problems</strong> are due for review:</p>
          
          ${problems.slice(0, 5).map(p => `
            <div class="problem-item">
              <strong>${p.name}</strong><br>
              <small>${p.topic} • ${p.difficulty}</small>
            </div>
          `).join('')}
          
          ${problems.length > 5 ? `<p><em>...and ${problems.length - 5} more</em></p>` : ''}
          
          <p style="margin-top: 25px;">
            <strong>Why revise?</strong><br>
            Reviewing problems strengthens your understanding and improves pattern recognition. 
            Studies show that spaced repetition increases retention by up to 200%!
          </p>
          
          <center>
            <a href="https://dsatracker-ecru.vercel.app/" class="btn">Start Revision →</a>
          </center>
        </div>
        <div class="footer">
          <p><strong>DSA Master Tracker</strong></p>
          <p>Spaced repetition for better retention • Disable reminders in settings</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
