/* BigHammer.ai LinkedIn sequences — copy + sample merge data.
   Edit copy here. Tokens use {{token}} syntax. SEP is what renders where the
   source copy had an em dash removed (change to ",", "~", " - " etc. in one place).
   Structure: campaigns → steps (left to right, in send order) → variants (stacked). */
(function () {
  const SEP = " - ";

  const sender = {
    name: "Adithya Murali",
    headline: "Co-founder, BigHammer.ai · Databricks cost",
    initials: "AM",
    color: "#5b3fa0"
  };

  const prospect = {
    first_name: "Sarah",
    name: "Sarah Mitchell",
    headline: "Head of Data Platform at Meridian Health",
    company: "Meridian Health",
    initials: "SM",
    color: "#0b6e4f"
  };

  const ASSESS = "https://assessment.bighammerops.com";
  const DEMO = "https://calendly.com/bighammer-marketing/your-free-bighammer-ai-demo";
  const WEBINAR = "https://webinar.bighammerai.com/";

  const tokens = {
    first_name: prospect.first_name,
    company: prospect.company,
    personalization_short: "your point on Unity Catalog migration eating the quarter landed",
    webinar_date: "Thursday 15 October, 12pm ET",
    webinar_url: WEBINAR,
    replay_url: WEBINAR // no replay page exists yet; falls back to the webinar page so the link works
  };

  const previews = {
    "assessment.bighammerops.com": { title: "Reduce Your Databricks Costs up to 75% — BigHammer.ai", domain: "assessment.bighammerops.com" },
    "calendly.com": { title: "BigHammer Ai - Calendly", domain: "calendly.com" },
    "webinar.bighammerai.com": { title: "Reduce Databricks Costs — to 75% — Live Masterclass | BigHammer.ai", domain: "webinar.bighammerai.com" }
  };

  const linkChecks = [
    { url: ASSESS, status: 200, title: "Reduce Your Databricks Costs up to 75% — BigHammer.ai" },
    { url: DEMO, status: "broken", title: "HTTP 200 but the page renders \"BigHammer Ai — This calendar is currently unavailable.\" Re-enable the event type in Calendly before A4, B2-hot or C3 ship." },
    { url: WEBINAR, status: "warn", title: "Loads, but the served HTML still says \"June 18, 2026 · 11:00 AM ET\"; only the in-browser render shows 15 Oct, 12:00 PM ET. Link unfurls and crawlers see the June date." },
    { url: "{{replay_url}}", status: null, title: "No replay page exists yet — sample falls back to the webinar page" }
  ];
  const linkCheckedAt = "18 Sep 2026, 23:08 IST";

  const T = "10:00 am";   // every send goes out at 10 AM
  const TR = "10:20 am";  // sample prospect replies
  const TA = "10:45 am";  // sends that answer a same-day reply

  // ---------- COPY ----------
  const TITLE = '"Reduce your Databricks costs up to 75%, without adding headcount"';

  const A0_NOTE =
`{{first_name}} ~ {{personalization_short}}

I work with Data teams on Databricks costs. Not pitching, just seems like we circle the same problems.

Worth connecting?`;

  const A0_LIVE_ROLE =
`{{first_name}}, I spend most of my time inside Databricks cost data for data teams around {{company}}'s size. Always useful to know people wrestling with the same compute-budget maths. Open to connecting?`;

  const A0_LIVE_WEBINAR =
`{{first_name}}, I help run a free 45-minute live masterclass for data leaders: ${TITLE}. No pitch in the session itself. Thought the next one might be useful to you. Open to connecting?`;

  const A1 =
`Thanks for connecting, {{first_name}}.

No agenda${SEP}I mostly talk to data leaders about one narrow thing: why Databricks bills grow faster than the value coming out of them.

The line I hear most is this: "we love Databricks, it's just getting harder to justify the bill."

Have you ever heard this before from the team at {{company}}, or have you got it solved?`;

  const A2 =
`{{first_name}}${SEP}regardless of whether this is a live problem for you, this one's worth 60 seconds.

Databricks keeps a minute-by-minute log of what every cluster node was doing, in a system table called system.compute.node_timeline. Two columns matter: cpu_user_percent (time the CPU spent running your code) and cpu_system_percent (time it spent on overhead). Add them together and you get how busy the machines you paid for actually were.

Our line for "oversized": under 20% busy on average, under 40% in the busiest 5% of minutes, on any cluster that ran 30 minutes or more. Below that line you are paying for capacity that sat idle most of the hour, and most workspaces are surprised how much of the bill sits there.

It's the first of six patterns our founder Srinath Reddy walks through live in ${TITLE} on {{webinar_date}}, 45 minutes plus Q&A: {{webinar_url}}

Register even if the time doesn't work and you'll get the recording.`;

  const A3_V2 =
`Following on from that CPU check: it's one of seven read-only SQL queries we publish as a free Databricks cost assessment.

How it works: you paste the seven queries into one SQL warehouse session (about an hour, nothing installed, no credentials shared). They read 90 days of your own billing and compute system tables and export six CSVs. Upload those to the BigHammer assessment dashboard and it shows where the money is leaking, in four buckets: idle and oversized compute, interactive clusters doing scheduled work, spend burned on runs that were always going to fail, and Photon's 2x price on workloads that got no speedup from it.

One healthcare firm's numbers from exactly this: $308K a year of idle all-purpose compute, $315K on failed jobs, $2.74M of Photon markup.

Run it here: https://assessment.bighammerops.com

Two ways to use what it finds: bring your numbers to the masterclass Q&A on {{webinar_date}} ({{webinar_url}}), or reply "numbers" and I'll run it with you on a 30-minute call.`;

  const A3_V1 =
`Following on from there : we publish the full assessment we run for clients. Seven read-only queries, one SQL warehouse session, nothing installed and no credentials shared.

They find four things: idle and oversized compute, interactive compute doing scheduled work, compute burned on runs that were always going to fail, and Photon markup on workloads that got no speedup from it.

${ASSESS}

Genuinely no strings, plenty of teams run it and we never speak again. Curious whether the Photon one applies to you; it's the most commonly switched-on-and-forgotten setting we see.`;

  const A4 =
`{{first_name}}, last one from me on this, and the only one with a real ask.

The assessment finds the leaks. Fixing them is the part teams usually want a second pair of hands for, and that's what BigHammer does.

In short: 40 to 70% of Databricks workloads are simple ETL and batch jobs that don't need premium Spark clusters. Our AI agents right-size what should stay on Databricks, move what shouldn't to a cheaper engine (parity-checked row by row, in weeks, no manual rewrites), then keep the bill from creeping back with tagging, budget alerts and compute policies. Same workloads, same SLAs. The healthcare firm above cut Databricks TCO by about 50%; the ceiling we see is 75%.

If it'd be quicker to just have someone walk your spend with you, we do a 30-minute session where we run the assessment live on your workspace and go through the findings together. You bring a workspace id, that's it:
${DEMO}

If it's not a priority this quarter, no problem at all${SEP}I'll leave it there and you've got the queries and the masterclass recording either way.`;

  const A5 =
`{{first_name}}${SEP}one thing and then I'll stop.

Next live masterclass: ${TITLE}, {{webinar_date}}, 45 minutes plus Q&A, hosted by Srinath Reddy, BigHammer's founder, who ran exabyte-scale data platforms before this.

What's covered: the six structural patterns that quietly inflate a Databricks bill (idle and off-hours clusters, Photon on simple ETL, failed-run and retry leakage, cluster spin-up overhead, small-file bloat, missing guardrails), the see it / control it / guard it framework for fixing them, and a real healthcare case walked end to end. Top three Q&A questions win a $50 Amazon gift card.

{{webinar_url}}

Register even if the time doesn't work and you'll get the recording.`;

  const B1 =
`{{first_name}}${SEP}quick one. Is Databricks cost something you're actively looking at right now, or is it under control?`;

  const B1_LIVE_WEBINAR =
`{{first_name}}${SEP}quick one. Is Databricks cost something you're looking at right now?

If it is: our founder Srinath Reddy is tearing down a real workspace's bill live on {{webinar_date}}. ${TITLE}, 45 minutes plus Q&A, the six cost patterns and a healthcare case end to end: {{webinar_url}}

If it's under control, just say so and I'll leave it there.`;

  const B_REPLY_HOT = `Yes, it's a live one. The bill is up about 40% year on year and our renewal conversation starts next quarter.`;
  const B_REPLY_PARK = `Under control for now, thanks though.`;

  const B2_HOT =
`Thought so${SEP}it's the most common thing on my list right now.

Three ways to get a number on it, pick whichever fits:

1. Run it yourself. Seven read-only SQL queries, one warehouse session, about an hour, nothing installed. They pull 90 days of your billing and compute system tables; upload the CSVs to our dashboard and it shows the four leaks: idle and oversized compute, interactive clusters doing scheduled work, failed-run burn, and Photon markup with no speedup. ${ASSESS}

2. Watch it done live. ${TITLE}, {{webinar_date}}, 45 minutes plus Q&A with our founder: {{webinar_url}}

3. Do it with us. 30 minutes, we run the assessment on your workspace and go through the findings: ${DEMO}

Either way, what's your rough annual Databricks spend, so I know whether this is even worth your time?`;

  const B2_COLD =
`{{first_name}}${SEP}assuming that's a "not right now", which is fair.

Leaving you two things that are useful either way.

The free assessment: seven read-only SQL queries, one warehouse session, nothing installed. They read 90 days of your billing and compute system tables and show four leaks: oversized clusters by CPU utilisation, interactive clusters running scheduled jobs, spend on runs that failed anyway, and Photon markup with no speedup. ${ASSESS}

And the next live masterclass, ${TITLE}, {{webinar_date}}: {{webinar_url}} (the recording goes to everyone who registers).

That's it from me.`;

  const B3_PARK =
`Understood${SEP}I'll get out of your way.

If it becomes live later: the free assessment (seven read-only queries that show where a Databricks bill leaks) is at ${ASSESS}, the next masterclass is at {{webinar_url}}, and you can just reply here.

Out of interest, what's the thing that would make it urgent${SEP}a budget review, a renewal, or a project that's blocked behind the commit?`;

  const C1 =
`{{first_name}}${SEP}thanks for coming to the masterclass yesterday.

The bit people usually go back to is the utilisation threshold: under 20% average CPU and under 40% in the busiest 5% of minutes, on any cluster that ran 30 minutes or more. That's our definition of "oversized", and it's the first of the seven read-only queries in the free assessment. One warehouse session, about an hour, and the dashboard shows the four leaks Srinath walked through: ${ASSESS}

If it'd be quicker with someone on the call, we run it live with you in 30 minutes: ${DEMO}

Anything from the session you want me to go deeper on?`;

  const C2_V2 =
`You know what? Your calendar just won.

You registered for ${TITLE} and couldn't make it, but BigHammer has got you. Recording's here: {{replay_url}}

The short version: six structural patterns inflate most Databricks bills (idle clusters, Photon on simple ETL, failed-run burn, spin-up overhead, small files, no guardrails), and Srinath walks through a healthcare firm that cut Databricks TCO by about 50%, end to end.

The fastest way to see your own version: the free assessment, seven read-only SQL queries, one warehouse session, about an hour: ${ASSESS}

Worth 45 minutes if you get a gap.`;

  const C2_V1 =
`{{first_name}}${SEP}you registered for ${TITLE} but didn't make it, which usually just means the calendar won.

Recording's here: {{replay_url}}

The short version: six structural patterns inflate most Databricks bills, Srinath walks through a healthcare firm that cut Databricks TCO by about 50%, and the seven read-only assessment queries show you your own version in about an hour: ${ASSESS}

Worth 45 minutes if you get a gap.`;

  const C3 =
`{{first_name}}${SEP}did you get a chance to run any of the seven assessment queries?

If it'd be faster to have someone do it with you, we do a 30-minute session where we run them live on your workspace and go through the four leaks they find: ${DEMO}

And if the recording is still on the to-do list, it's at {{replay_url}}. The next live masterclass is on {{webinar_date}}: {{webinar_url}}`;

  // ---------- helpers ----------
  const S = (day, text) => ({ from: "sender", day, time: T, text });
  const P = (day, text) => ({ from: "prospect", day, time: TR, text, sample: true });
  const SA = (day, text) => ({ from: "sender", day, time: TA, text });

  const mA1 = S(0, A1), mA2 = S(3, A2), mA3v2 = S(7, A3_V2), mA3v1 = S(7, A3_V1), mA4 = S(12, A4), mA5 = S(25, A5);
  const mB1 = S(0, B1);

  // ---------- sequences as rows (paths). Columns = steps left to right; every cell continues its own row. ----------
  const conn = (key, type, variant, note) => ({ key, type, kinds: ["connection"], variant, note });
  const msg = (key, messages, kinds) => ({ key, type: "thread", kinds: kinds || ["message"], messages });

  const A_COLS = [
    { id: "A0t", label: "A0", title: "Connection request · as typed", day: "Before the accept" },
    { id: "A0r", label: "A0", title: "Connection request · as received", day: "Before the accept" },
    { id: "A1", label: "A1", title: "Thank-you", day: "Day 0 · 10 AM" },
    { id: "A2", label: "A2", title: "Value, no ask", day: "Day 3 · 10 AM" },
    { id: "A3", label: "A3", title: "The queries", day: "Day 7 · 10 AM" },
    { id: "A4", label: "A4", title: "The ask", day: "Day 12 · 10 AM" },
    { id: "A5", label: "A5", title: "Soft revival", day: "Day 25 · 10 AM" }
  ];
  const pathA = (id, label, noteKey, note, a3, a3key) => ({
    id, label,
    cells: [
      conn(noteKey + "-typed", "invite_compose", "", note),
      conn(noteKey, "invite_received", "", note),
      msg("A1", [mA1]),
      msg("A2", [mA1, mA2]),
      msg(a3key, [mA1, mA2, a3]),
      msg("A4", [mA1, mA2, a3, mA4]),
      msg("A5", [mA1, mA2, a3, mA4, mA5])
    ]
  });

  const B_COLS = [
    { id: "B1", label: "B1", title: "The open", day: "Day 0 · 10 AM" },
    { id: "B2", label: "B2", title: "Follow-up", day: "By reply" }
  ];
  const pathB = (id, label, open, openKey, tail, tailKey, tailKinds) => ({
    id, label,
    cells: [msg(openKey, [open], ["message", "inmail"]), msg(tailKey, [open, ...tail], tailKinds)]
  });
  const mB1live = S(0, B1_LIVE_WEBINAR);
  const HOT = [P(0, B_REPLY_HOT), SA(0, B2_HOT)];
  const PARK = [P(0, B_REPLY_PARK), SA(0, B3_PARK)];
  const COLD = [S(4, B2_COLD)];

  const C_COLS = [
    { id: "C1", label: "C1 / C2", title: "Day after the event", day: "Day 0 · 10 AM" },
    { id: "C3", label: "C3", title: "Either", day: "Day 4 · 10 AM" }
  ];

  const campaigns = [
    {
      id: "A",
      title: "Campaign A — Connector",
      kinds: ["connection", "message"],
      subtitle: "Connection request, then a message sequence after the accept. Cold, no prior relationship. Each row is one complete path.",
      columns: A_COLS,
      rows: [
        pathA("A-p1", "Path 1 · post-reactive note · A3 new version", "A0-note", A0_NOTE, mA3v2, "A3-v2"),
        pathA("A-p2", "Path 2 · post-reactive note · A3 previous version", "A0-note", A0_NOTE, mA3v1, "A3-v1"),
        pathA("A-p3", "Path 3 · LIVE · role-based note, no research field", "A0-live-role", A0_LIVE_ROLE, mA3v2, "A3-v2"),
        pathA("A-p4", "Path 4 · LIVE · webinar-led note, no research field", "A0-live-webinar", A0_LIVE_WEBINAR, mA3v2, "A3-v2"),
        pathA("A-p5", "Path 5 · no note", "A0-bare", null, mA3v2, "A3-v2")
      ]
    },
    {
      id: "B",
      title: "Campaign B — Message",
      kinds: ["message", "inmail"],
      subtitle: "Direct messages to existing 1st-degree connections and open profiles, or InMail. No connection step. Each row is one reply branch.",
      columns: B_COLS,
      rows: [
        pathB("B-p1", "Path 1 · 9-word open → positive reply → B2-hot · Day 0", mB1, "B1", HOT, "B2-hot", ["message"]),
        pathB("B-p2", "Path 2 · 9-word open → \"not now\" → B3-park · Day 0", mB1, "B1", PARK, "B3-park", ["message"]),
        pathB("B-p3", "Path 3 · 9-word open → no reply → B2-cold · Day 4", mB1, "B1", COLD, "B2-cold", ["message", "inmail"]),
        pathB("B-p4", "Path 4 · LIVE webinar-led open → positive reply → B2-hot · Day 0", mB1live, "B1-live", HOT, "B2-hot", ["message"]),
        pathB("B-p5", "Path 5 · LIVE webinar-led open → \"not now\" → B3-park · Day 0", mB1live, "B1-live", PARK, "B3-park", ["message"]),
        pathB("B-p6", "Path 6 · LIVE webinar-led open → no reply → B2-cold · Day 4", mB1live, "B1-live", COLD, "B2-cold", ["message", "inmail"])
      ]
    },
    {
      id: "C",
      title: "Campaign C — Webinar / Event",
      kinds: ["message"],
      subtitle: "Messages to event registrants: attendees and no-shows. Each row is one audience.",
      columns: C_COLS,
      rows: [
        { id: "C-p1", label: "Path 1 · attendee", cells: [msg("C1", [S(0, C1)]), msg("C3", [S(0, C1), S(4, C3)])] },
        { id: "C-p2", label: "Path 2 · no-show · C2 new version", cells: [msg("C2-v2", [S(0, C2_V2)]), msg("C3", [S(0, C2_V2), S(4, C3)])] },
        { id: "C-p3", label: "Path 3 · no-show · C2 previous version", cells: [msg("C2-v1", [S(0, C2_V1)]), msg("C3", [S(0, C2_V1), S(4, C3)])] }
      ]
    }
  ];

  // Flat, de-duplicated list of distinct messages (used by the scorecard and by Copy).
  const SCORE_KEYS = { "A0-note-typed": "A0-compose", "A0-note": "A0-received" };
  campaigns.forEach(c => {
    const seen = new Map();
    c.rows.forEach(r => r.cells.forEach((cell, i) => {
      const id = SCORE_KEYS[cell.key] || cell.key;
      cell.scoreId = id;
      if (!seen.has(id)) seen.set(id, Object.assign({ id, label: `${c.columns[i].label} · ${c.columns[i].title}`, sub: r.label }, cell));
    }));
    c.screens = [...seen.values()];
  });

  window.LI_DATA = { SEP, sender, prospect, tokens, previews, linkChecks, linkCheckedAt, campaigns };
})();
