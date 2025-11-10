// api/notifications.js - Email Notification Service
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
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
    const { email, type, data } = req.body;

    if (!email || !type) {
      return res.status(400).json({ error: 'Email and type required' });
    }

    // Create transporter (using Gmail - you can use any SMTP)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    let subject, html;

    switch (type) {
      case 'weekly_reminder':
        subject = '🔥 Weekly DSA Progress Report';
        html = generateWeeklyReport(data);
        break;
      case 'revision_reminder':
        subject = '🔄 Time to Review Your Problems!';
        html = generateRevisionReminder(data);
        break;
      case 'contest_alert':
        subject = '🏆 Upcoming Contest Alert!';
        html = generateContestAlert(data);
        break;
      case 'streak_alert':
        subject = '⚠️ Don\'t Break Your Streak!';
        html = generateStreakAlert(data);
        break;
      default:
        return res.status(400).json({ error: 'Invalid notification type' });
    }

    await transporter.sendMail({
      from: '"DSA Tracker" <noreply@dsatracker.com>',
      to: email,
      subject,
      html
    });

    return res.status(200).json({ success: true, message: 'Email sent' });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}

function generateWeeklyReport(data) {
  const { username, solved, total, streak, weakTopics, contests } = data;
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .stat-box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0; }
        .stat-box h3 { color: #667eea; margin: 0 0 10px 0; }
        .btn { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 Weekly Progress Report</h1>
          <p>Hey ${username}! Here's your DSA journey update</p>
        </div>
        <div class="content">
          <div class="stat-box">
            <h3>📊 This Week's Stats</h3>
            <p><strong>Problems Solved:</strong> ${solved} / ${total}</p>
            <p><strong>Current Streak:</strong> ${streak} days 🔥</p>
            <p><strong>Success Rate:</strong> ${Math.round((solved/total)*100)}%</p>
          </div>
          
          ${weakTopics && weakTopics.length > 0 ? `
          <div class="stat-box">
            <h3>🎯 Focus Areas</h3>
            ${weakTopics.map(t => `<p>• ${t.topic} - ${t.solved}/${t.total} solved</p>`).join('')}
          </div>
          ` : ''}
          
          ${contests && contests.length > 0 ? `
          <div class="stat-box">
            <h3>🏆 Upcoming Contests</h3>
            ${contests.slice(0, 3).map(c => `
              <p><strong>${c.site}:</strong> ${c.name}<br>
              <small>${new Date(c.start_time).toLocaleString()}</small></p>
            `).join('')}
          </div>
          ` : ''}
          
          <p style="margin-top: 20px;">Keep up the great work! Consistency is key to mastering DSA.</p>
          <a href="https://dsatracker-ecru.vercel.app/" class="btn">Continue Learning →</a>
        </div>
        <div class="footer">
          <p>DSA Master Tracker | Unsubscribe anytime from settings</p>
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
        body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .problem-item { background: #fff5f5; border-left: 4px solid #e74c3c; padding: 12px; margin: 10px 0; border-radius: 5px; }
        .btn { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔄 Revision Time!</h1>
          <p>Hi ${username}, these problems need your attention</p>
        </div>
        <div class="content">
          <p><strong>${problems.length} problems</strong> are due for revision based on spaced repetition:</p>
          ${problems.slice(0, 5).map(p => `
            <div class="problem-item">
              <strong>${p.name}</strong><br>
              <small>${p.topic} • ${p.difficulty}</small>
            </div>
          `).join('')}
          ${problems.length > 5 ? `<p><em>...and ${problems.length - 5} more</em></p>` : ''}
          <p style="margin-top: 20px;">Reviewing problems strengthens your understanding and pattern recognition!</p>
          <a href="https://dsatracker-ecru.vercel.app/" class="btn">Start Revision →</a>
        </div>
        <div class="footer">
          <p>DSA Master Tracker | Spaced repetition for better retention</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateContestAlert(data) {
  const { username, contests } = data;
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .contest-item { background: #f0fff4; border-left: 4px solid #27ae60; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .badge { display: inline-block; background: #ffa116; color: white; padding: 4px 10px; border-radius: 5px; font-size: 11px; font-weight: bold; }
        .btn { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏆 Contest Alert!</h1>
          <p>Hi ${username}, contests are starting soon!</p>
        </div>
        <div class="content">
          ${contests.map(c => `
            <div class="contest-item">
              <span class="badge">${c.site}</span>
              <h3 style="margin: 10px 0;">${c.name}</h3>
              <p><strong>Starts:</strong> ${new Date(c.start_time).toLocaleString()}</p>
              <a href="${c.url}" style="color: #667eea; text-decoration: none;">Register Now →</a>
            </div>
          `).join('')}
          <p style="margin-top: 20px;">Good luck! 🚀</p>
          <a href="https://dsatracker-ecru.vercel.app/" class="btn">View All Contests →</a>
        </div>
        <div class="footer">
          <p>DSA Master Tracker | Never miss a contest</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateStreakAlert(data) {
  const { username, streak } = data;
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; text-align: center; }
        .streak-number { font-size: 72px; color: #ff6b6b; font-weight: bold; }
        .btn { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ Streak Alert!</h1>
          <p>Don't break your momentum, ${username}!</p>
        </div>
        <div class="content">
          <div class="streak-number">${streak} 🔥</div>
          <h2>Day Streak</h2>
          <p style="margin: 20px 0;">You've been consistent for ${streak} days! Don't let it end today.</p>
          <p>Solve just <strong>1 problem</strong> to keep your streak alive!</p>
          <a href="https://dsatracker-ecru.vercel.app/" class="btn">Solve Now →</a>
        </div>
        <div class="footer">
          <p>DSA Master Tracker | Consistency builds mastery</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
