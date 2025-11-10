// api/contests.js - Multiple API Fallbacks
export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Try multiple APIs for reliability
    let contests = [];

    // Try Clist.by first (most reliable)
    try {
      const response = await fetch(
        "https://clist.by/api/v4/json/contest/?upcoming=true&resource=leetcode.com,codeforces.com&order_by=start&limit=10",
        {
          headers: { Authorization: "ApiKey demo:demo" },
        }
      );

      if (response.ok) {
        const data = await response.json();
        contests = data.objects.map((c) => ({
          name: c.event,
          site: c.resource.includes("leetcode") ? "LeetCode" : "CodeForces",
          start_time: c.start,
          duration: c.duration,
          url: c.href,
          status: "BEFORE",
        }));
      }
    } catch (err) {
      console.log("Clist API failed:", err.message);
    }

    // Fallback to Kontests.net
    if (contests.length === 0) {
      const response = await fetch("https://kontests.net/api/v1/all");
      if (!response.ok) throw new Error("All APIs failed");

      const allContests = await response.json();
      contests = allContests.filter(
        (c) =>
          (c.site === "LeetCode" || c.site === "CodeForces") &&
          c.status === "BEFORE"
      );
    }

    // Sort by start time
    contests.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

    return res.status(200).json({
      success: true,
      count: contests.length,
      contests: contests.slice(0, 10), // Limit to 10
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Contest API Error:", error);
    return res.status(500).json({
      error: "Failed to fetch contests",
      message: error.message,
      success: false,
    });
  }
}
