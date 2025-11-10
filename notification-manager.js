// notification-manager.js - Client-side notification system
class NotificationManager {
  constructor() {
    this.emailJSPublicKey = "TqqeRlUASBSfYe5H-"; // Your EmailJS public key
    this.serviceID = "service_z5b17lb";
    this.templateID = "template_oocofi9";
    this.init();
  }

  init() {
    // Initialize EmailJS with retry mechanism
    this.initializeEmailJS();

    // Check for scheduled notifications
    this.checkScheduledNotifications();

    // Set up daily check (every hour)
    setInterval(() => this.checkScheduledNotifications(), 60 * 60 * 1000);
  }

  // Initialize EmailJS with retry
  initializeEmailJS() {
    const maxRetries = 5;
    let retryCount = 0;

    const tryInit = () => {
      if (typeof emailjs !== "undefined") {
        try {
          emailjs.init(this.emailJSPublicKey);
          console.log("✅ EmailJS initialized successfully");
          return true;
        } catch (error) {
          console.error("❌ EmailJS initialization error:", error);
        }
      }

      retryCount++;
      if (retryCount < maxRetries) {
        console.log(
          `⏳ EmailJS not ready, retrying... (${retryCount}/${maxRetries})`
        );
        setTimeout(tryInit, 1000);
      } else {
        console.error(
          "❌ EmailJS failed to initialize after",
          maxRetries,
          "attempts"
        );
      }
    };

    tryInit();
  }

  // Check if user wants notifications
  isNotificationsEnabled() {
    return localStorage.getItem("notifications_enabled") === "true";
  }

  // Get user email
  getUserEmail() {
    return localStorage.getItem("user_email") || "";
  }

  // Enable notifications
  enableNotifications(email) {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    localStorage.setItem("notifications_enabled", "true");
    localStorage.setItem("user_email", email);
    this.scheduleWeeklyReminder();
    console.log("✅ Notifications enabled for:", email);
  }

  // Disable notifications
  disableNotifications() {
    localStorage.setItem("notifications_enabled", "false");
    showNotification("🔕 Notifications disabled", "info");
  }

  // Check all scheduled notifications
  checkScheduledNotifications() {
    if (!this.isNotificationsEnabled()) return;

    const now = new Date();
    const dayOfWeek = now.getDay();
    const hour = now.getHours();

    // Weekly reminder (Every Sunday at 9 AM)
    if (dayOfWeek === 0 && hour === 9) {
      this.sendWeeklyReminder();
    }

    // Daily revision check (Every day at 8 PM)
    if (hour === 20) {
      this.checkRevisionReminders();
    }

    // Streak protection (Every day at 10 PM)
    if (hour === 22) {
      this.checkStreakProtection();
    }

    // Contest alerts (Check twice daily)
    if (hour === 9 || hour === 18) {
      this.checkUpcomingContests();
    }
  }

  // Send weekly progress report
  async sendWeeklyReminder() {
    const lastSent = localStorage.getItem("last_weekly_reminder");
    const today = new Date().toDateString();

    if (lastSent === today) return; // Already sent today

    const email = this.getUserEmail();
    if (!email) return;

    const stats = this.getWeeklyStats();

    try {
      await this.sendEmail({
        to_email: email,
        subject: "🔥 Weekly DSA Progress Report",
        message: this.formatWeeklyReport(stats),
      });

      localStorage.setItem("last_weekly_reminder", today);
      console.log("✅ Weekly reminder sent");
    } catch (error) {
      console.error("Failed to send weekly reminder:", error);
    }
  }

  // Check and send revision reminders
  async checkRevisionReminders() {
    const problems = JSON.parse(
      localStorage.getItem("dsaProblems_" + currentUser) || "[]"
    );
    const dueProblems = problems.filter((p) => this.isDueForReview(p));

    if (dueProblems.length === 0) return;

    const lastSent = localStorage.getItem("last_revision_reminder");
    const today = new Date().toDateString();

    if (lastSent === today) return;

    const email = this.getUserEmail();
    if (!email) return;

    try {
      await this.sendEmail({
        to_email: email,
        subject: "🔄 Time to Review Your Problems!",
        message: this.formatRevisionReminder(dueProblems),
      });

      localStorage.setItem("last_revision_reminder", today);
      console.log("✅ Revision reminder sent");
    } catch (error) {
      console.error("Failed to send revision reminder:", error);
    }
  }

  // Check streak and send protection alert
  async checkStreakProtection() {
    const userStats = JSON.parse(
      localStorage.getItem("dsaStats_" + currentUser) || "{}"
    );
    const streak = userStats.currentStreak || 0;

    if (streak < 3) return; // Only protect streaks >= 3 days

    const today = new Date().toDateString();
    const lastActiveDate = userStats.lastActiveDate;

    // If user hasn't solved anything today
    if (lastActiveDate !== today) {
      const lastSent = localStorage.getItem("last_streak_alert");
      if (lastSent === today) return;

      const email = this.getUserEmail();
      if (!email) return;

      try {
        await this.sendEmail({
          to_email: email,
          subject: "⚠️ Don't Break Your Streak!",
          message: this.formatStreakAlert(streak),
        });

        localStorage.setItem("last_streak_alert", today);
        console.log("✅ Streak alert sent");
      } catch (error) {
        console.error("Failed to send streak alert:", error);
      }
    }
  }

  // Check upcoming contests
  async checkUpcomingContests() {
    try {
      const response = await fetch(
        "https://clist.by/api/v4/json/contest/?upcoming=true&resource__regex=leetcode|codeforces&order_by=start&limit=5",
        {
          headers: {
            Authorization:
              "ApiKey ayushgiri:3251b6318ecfc5cd8f882b57d4359cd082e19940",
          },
        }
      );

      if (!response.ok) return;

      const data = await response.json();
      const contests = data.objects || [];

      // Check for contests starting in next 24 hours
      const upcomingContests = contests.filter((c) => {
        const startTime = new Date(c.start);
        const hoursUntil = (startTime - new Date()) / (1000 * 60 * 60);
        return hoursUntil > 0 && hoursUntil <= 24;
      });

      if (upcomingContests.length === 0) return;

      const lastSent = localStorage.getItem("last_contest_alert");
      const today = new Date().toDateString();

      if (lastSent === today) return;

      const email = this.getUserEmail();
      if (!email) return;

      try {
        await this.sendEmail({
          to_email: email,
          subject: "🏆 Contest Starting Soon!",
          message: this.formatContestAlert(upcomingContests),
        });

        localStorage.setItem("last_contest_alert", today);
        console.log("✅ Contest alert sent");
      } catch (error) {
        console.error("Failed to send contest alert:", error);
      }
    } catch (error) {
      console.error("Failed to check contests:", error);
    }
  }

  // Send email using EmailJS
  async sendEmail(params) {
    if (typeof emailjs === "undefined") {
      console.error("EmailJS not loaded");
      throw new Error("EmailJS SDK not loaded. Please refresh the page.");
    }

    // Validate required parameters
    if (!params.to_email) {
      throw new Error("Recipient email is required");
    }

    if (!params.subject) {
      throw new Error("Email subject is required");
    }

    if (!params.message) {
      throw new Error("Email message is required");
    }

    try {
      console.log("🔧 EmailJS Debug Info:", {
        serviceID: this.serviceID,
        templateID: this.templateID,
        publicKey: this.emailJSPublicKey,
        to_email: params.to_email
      });

      // Try direct emailjs.send with proper template variables
      const templateParams = {
        to_email: params.to_email,
        to_name: params.to_email.split('@')[0],
        subject: params.subject,
        message: params.message,
        from_name: "DSA Master Tracker",
        reply_to: "noreply@dsatracker.com"
      };

      console.log("📧 Sending with template params:", templateParams);

      const result = await emailjs.send(
        this.serviceID,
        this.templateID,
        templateParams
      );

      console.log("✅ Email sent successfully:", result);
      return result;
    } catch (error) {
      console.error("❌ EmailJS send error details:", {
        error: error,
        status: error.status,
        text: error.text,
        message: error.message
      });

      // More detailed error handling
      let errorMessage = "Failed to send email";
      
      if (error.status) {
        switch (error.status) {
          case 400:
            errorMessage = "Bad Request - Check template variables match your EmailJS template";
            break;
          case 401:
            errorMessage = "Unauthorized - Invalid public key or service ID";
            break;
          case 402:
            errorMessage = "Payment Required - EmailJS quota exceeded";
            break;
          case 404:
            errorMessage = "Not Found - Service ID or Template ID not found";
            break;
          case 422:
            errorMessage = "Unprocessable Entity - Template variables mismatch";
            break;
          default:
            errorMessage = `HTTP ${error.status}: ${error.text || "Unknown error"}`;
        }
      } else if (error.text) {
        errorMessage = error.text;
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  }

  // Helper: Check if problem is due for review
  isDueForReview(problem) {
    if (!problem.nextReview || !problem.solvedAlone) return false;
    const today = new Date();
    const reviewDate = new Date(problem.nextReview);
    return reviewDate <= today;
  }

  // Helper: Get weekly stats
  getWeeklyStats() {
    const problems = JSON.parse(
      localStorage.getItem("dsaProblems_" + currentUser) || "[]"
    );
    const userStats = JSON.parse(
      localStorage.getItem("dsaStats_" + currentUser) || "{}"
    );

    const solved = problems.filter((p) => p.solvedAlone).length;
    const total = problems.length;
    const streak = userStats.currentStreak || 0;

    // Get weak topics
    const topicData = {};
    problems.forEach((p) => {
      if (!topicData[p.topic]) topicData[p.topic] = { total: 0, solved: 0 };
      topicData[p.topic].total++;
      if (p.solvedAlone) topicData[p.topic].solved++;
    });

    const weakTopics = Object.entries(topicData)
      .map(([topic, data]) => ({
        topic,
        solved: data.solved,
        total: data.total,
        rate: Math.round((data.solved / data.total) * 100),
      }))
      .filter((t) => t.total >= 2 && t.rate < 70)
      .sort((a, b) => a.rate - b.rate)
      .slice(0, 3);

    return { solved, total, streak, weakTopics, username: currentUser };
  }

  // Format weekly report
  formatWeeklyReport(stats) {
    return `
Hi ${stats.username}! 🚀

Here's your weekly DSA progress:

📊 Stats:
• Problems Solved: ${stats.solved}/${stats.total}
• Current Streak: ${stats.streak} days 🔥
• Success Rate: ${Math.round((stats.solved / stats.total) * 100)}%

${
  stats.weakTopics.length > 0
    ? `
🎯 Focus Areas:
${stats.weakTopics
  .map((t) => `• ${t.topic}: ${t.solved}/${t.total} (${t.rate}%)`)
  .join("\n")}
`
    : ""
}

Keep up the great work! 💪

Visit: https://dsatracker-ecru.vercel.app/
    `.trim();
  }

  // Format revision reminder
  formatRevisionReminder(problems) {
    return `
Hi! 🔄

You have ${problems.length} problems due for revision:

${problems
  .slice(0, 5)
  .map((p) => `• ${p.name} (${p.topic} - ${p.difficulty})`)
  .join("\n")}
${problems.length > 5 ? `\n...and ${problems.length - 5} more` : ""}

Reviewing strengthens your understanding!

Visit: https://dsatracker-ecru.vercel.app/
    `.trim();
  }

  // Format contest alert
  formatContestAlert(contests) {
    return `
🏆 Contest Alert!

Contests starting in next 24 hours:

${contests
  .map((c) => {
    const site = c.resource.includes("leetcode") ? "LeetCode" : "CodeForces";
    const startTime = new Date(c.start).toLocaleString();
    return `• ${site}: ${c.event}\n  Starts: ${startTime}`;
  })
  .join("\n\n")}

Good luck! 🚀

Visit: https://dsatracker-ecru.vercel.app/
    `.trim();
  }

  // Format streak alert
  formatStreakAlert(streak) {
    return `
⚠️ Streak Alert!

Your ${streak}-day streak is at risk! 🔥

Solve just 1 problem today to keep it alive.

Don't break your momentum!

Visit: https://dsatracker-ecru.vercel.app/
    `.trim();
  }

  // Schedule weekly reminder
  scheduleWeeklyReminder() {
    const now = new Date();
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + (7 - now.getDay()));
    nextSunday.setHours(9, 0, 0, 0);

    const timeUntil = nextSunday - now;

    setTimeout(() => {
      this.sendWeeklyReminder();
      // Reschedule for next week
      setInterval(() => this.sendWeeklyReminder(), 7 * 24 * 60 * 60 * 1000);
    }, timeUntil);
  }

  // Test email function
  async sendTestEmail() {
    const email = this.getUserEmail();
    if (!email) {
      throw new Error(
        "No email configured. Please enter your email address first."
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error(
        "Invalid email format. Please enter a valid email address."
      );
    }

    try {
      console.log("🧪 Sending test email to:", email);

      const result = await this.sendEmail({
        to_email: email,
        subject: "🧪 DSA Tracker - Test Email Confirmation",
        message: `Hi there! 👋

This is a test email from your DSA Tracker to confirm that email notifications are working correctly.

✅ EmailJS integration is working perfectly!
✅ Your email (${email}) is configured and verified
✅ You'll now receive automated notifications for:
  • 📊 Weekly progress reports (Sundays at 9 AM)
  • 🔄 Revision reminders (Daily at 8 PM)
  • 🏆 Contest alerts (Twice daily)
  • 🔥 Streak protection alerts (Daily at 10 PM)

🎯 Next Steps:
  • Keep solving problems to maintain your streak
  • Check your spam folder if you don't see future emails
  • You can disable notifications anytime from the dashboard

Happy coding! 🚀

Best regards,
DSA Master Tracker Team
https://dsatracker-ecru.vercel.app/

---
This is an automated message. Please do not reply to this email.`,
      });

      console.log("✅ Test email sent successfully:", result);
      return true;
    } catch (error) {
      console.error("❌ Test email failed:", error);
      throw error;
    }
  }
}

// Initialize notification manager
const notificationManager = new NotificationManager();

// Export for use in main app
if (typeof module !== "undefined" && module.exports) {
  module.exports = NotificationManager;
}
