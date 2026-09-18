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
  const A0_NOTE =
`{{first_name}} ~ {{personalization_short}}

I work with Data teams on Databricks costs. Not pitching, just seems like we circle the same problems.

Worth connecting?`;

  const A0_LIVE_ROLE =
`{{first_name}}, I spend most of my time inside Databricks cost data for data teams around {{company}}'s size. Always useful to know people wrestling with the same compute-budget maths. Open to connecting?`;

  const A0_LIVE_WEBINAR =
`{{first_name}}, I host a 45-minute live teardown of a real Databricks bill for data leaders, no pitch in it. Thought the next one might be useful to you. Open to connecting?`;

  const A1 =
`Thanks for connecting, {{first_name}}.

No agenda${SEP}I mostly talk to data leaders about one narrow thing: why Databricks bills grow faster than the value coming out of them.

The line I hear most is this: "we love Databricks, it's just getting harder to justify the bill."

Have you ever heard this before from the team at {{company}}, or have you got it solved?`;

  const A2 =
`{{first_name}}${SEP}regardless of whether this is a live problem for you, this one's worth 60 seconds.

Databricks exposes system.compute.node_timeline. Add cpu_user_percent and cpu_system_percent and you get what your clusters were actually doing while you paid for them.

Our threshold for "oversized": under 20% average CPU, under 40% at p95, on any cluster that ran 30+ minutes.

Most workspaces are surprised by how much sits under that line.

No link, no ask here. Just something worth checking, since it costs nothing to run.`;

  const A3_V2 =
`Guess what happens from there?

That CPU check is one piece of a bigger assessment we run for clients. We just publish it directly instead of keeping it behind a call.

Seven read-only queries, one SQL warehouse session, nothing installed and no credentials shared.

They find four things: idle and oversized compute, interactive compute doing scheduled work, compute burned on runs that were always going to fail, and Photon markup on workloads that got no speedup from it. ${ASSESS}

Genuinely no strings. Plenty of teams run it and we never speak again. Curious whether the Photon one applies to you; it's the most commonly switched-on-and-forgotten setting we see.`;

  const A3_V1 =
`Following on from there : we publish the full assessment we run for clients. Seven read-only queries, one SQL warehouse session, nothing installed and no credentials shared.

They find four things: idle and oversized compute, interactive compute doing scheduled work, compute burned on runs that were always going to fail, and Photon markup on workloads that got no speedup from it.

${ASSESS}

Genuinely no strings, plenty of teams run it and we never speak again. Curious whether the Photon one applies to you; it's the most commonly switched-on-and-forgotten setting we see.`;

  const A4 =
`{{first_name}}, last one from me on this.

If it'd be quicker to just have someone walk your spend with you, we do a 30-minute session where we run the assessment live on your workspace and go through the findings together. You bring a workspace id, that's it.

${DEMO}

If it's not a priority this quarter, no problem at all${SEP}I'll leave it there and you've got the queries either way.`;

  const A5 =
`{{first_name}}${SEP}one thing and then I'll stop.

We run a masterclass on cutting Databricks cost, roughly monthly. 30 minutes of teardown on a real workspace's numbers, 15 of Q&A. Next one's {{webinar_date}}.

{{webinar_url}}

Register even if the time doesn't work and you'll get the recording.`;

  const B1 =
`{{first_name}}${SEP}quick one. Is Databricks cost something you're actively looking at right now, or is it under control?`;

  const B1_LIVE_WEBINAR =
`{{first_name}}${SEP}quick one. Is Databricks cost something you're looking at right now?

If it is, we're tearing down a real workspace's bill live on {{webinar_date}}, 45 minutes plus Q&A: {{webinar_url}}

If it's under control, just say so and I'll leave it there.`;

  const B_REPLY_HOT = `Yes, it's a live one. The bill is up about 40% year on year and our renewal conversation starts next quarter.`;
  const B_REPLY_PARK = `Under control for now, thanks though.`;

  const B2_HOT =
`Thought so${SEP}it's the most common thing on my list right now.

Two ways to get a number on it:

1. Run it yourself. We publish the exact read-only queries: ${ASSESS}${SEP}seven queries, one session, nothing installed.

2. Do it with us. 30 minutes, we run it live on your workspace and go through the findings:
${DEMO}

Either's fine. What's your rough annual Databricks spend, so I know whether this is even worth your time?`;

  const B2_COLD =
`{{first_name}}${SEP}assuming that's a "not right now", which is fair.

Leaving you one thing that's useful either way: the read-only queries we use to assess Databricks spend. CPU utilisation, cluster class, failed-run waste, Photon markup. One SQL warehouse session, nothing installed.

${ASSESS}

That's it from me.`;

  const B3_PARK =
`Understood${SEP}I'll get out of your way.

If it becomes live later, the queries live at ${ASSESS} and you can just reply here.

Out of interest, what's the thing that would make it urgent${SEP}a budget review, a renewal, or a project that's blocked behind the commit?`;

  const C1 =
`{{first_name}}${SEP}thanks for coming to the masterclass yesterday.

The bit people usually go back to is the utilisation threshold: under 20% average CPU and under 40% at p95, on any cluster that ran 30 minutes or more. That's the definition we use for "oversized", and it's in the published queries.

${ASSESS}

Anything from the session you want me to go deeper on?`;

  const C2_V2 =
`You know what? Your calendar just won.
But you still couldn't make it to reduce your databricks costs up to 75%, but Bighammer has got you!

Recording's here: {{replay_url}}

The short version: seven read-only queries, four findings, and about half the savings need no migration at all. Worth 30 minutes if you get a gap.`;

  const C2_V1 =
`{{first_name}}${SEP}you registered for the Databricks cost masterclass but didn't make it, which usually just means the calendar won.

Recording's here: {{replay_url}}

The short version: seven read-only queries, four findings, and about half the savings need no migration at all. Worth 30 minutes if you get a gap.`;

  const C3 =
`{{first_name}}${SEP}did you get a chance to run any of the assessment queries?

If it'd be faster to have someone do it with you, we do a 30-minute session where we run it live on your workspace and go through what it finds:

${DEMO}`;

  // ---------- helpers ----------
  const S = (day, text) => ({ from: "sender", day, time: T, text });
  const P = (day, text) => ({ from: "prospect", day, time: TR, text, sample: true });
  const SA = (day, text) => ({ from: "sender", day, time: TA, text });

  const mA1 = S(0, A1), mA2 = S(3, A2), mA3v2 = S(7, A3_V2), mA3v1 = S(7, A3_V1), mA4 = S(12, A4), mA5 = S(25, A5);
  const mB1 = S(0, B1);

  // kinds: "connection" | "message" | "inmail"
  const campaigns = [
    {
      id: "A",
      title: "Campaign A — Connector",
      kinds: ["connection", "message"],
      subtitle: "Connection request, then a message sequence after the accept. Cold, no prior relationship.",
      steps: [
        {
          id: "A0", label: "A0", title: "Connection request", day: null, dayText: "Before the accept",
          variants: [
            { id: "A0-compose", type: "invite_compose", kinds: ["connection"], variant: "Variation 1 · post-reactive note · as typed by the sender", note: A0_NOTE },
            { id: "A0-received", type: "invite_received", kinds: ["connection"], variant: "Variation 1 · post-reactive note · as the prospect sees it", note: A0_NOTE },
            { id: "A0-live-role", type: "invite_received", kinds: ["connection"], variant: "Variation 2 · LIVE · role-based, no research field", note: A0_LIVE_ROLE },
            { id: "A0-live-webinar", type: "invite_received", kinds: ["connection"], variant: "Variation 3 · LIVE · webinar-led, no research field", note: A0_LIVE_WEBINAR },
            { id: "A0-bare", type: "invite_received", kinds: ["connection"], variant: "Variation 4 · no note", note: null }
          ]
        },
        { id: "A1", label: "A1", title: "Thank-you", day: 0, variants: [{ id: "A1", type: "thread", kinds: ["message"], variant: "", messages: [mA1] }] },
        { id: "A2", label: "A2", title: "Value, no ask", day: 3, variants: [{ id: "A2", type: "thread", kinds: ["message"], variant: "", messages: [mA1, mA2] }] },
        {
          id: "A3", label: "A3", title: "The queries", day: 7,
          variants: [
            { id: "A3-v2", type: "thread", kinds: ["message"], variant: "Variation 1 · new", messages: [mA1, mA2, mA3v2] },
            { id: "A3-v1", type: "thread", kinds: ["message"], variant: "Variation 2 · previous", messages: [mA1, mA2, mA3v1] }
          ]
        },
        { id: "A4", label: "A4", title: "The ask", day: 12, variants: [{ id: "A4", type: "thread", kinds: ["message"], variant: "", messages: [mA1, mA2, mA3v2, mA4] }] },
        { id: "A5", label: "A5", title: "Soft revival", day: 25, variants: [{ id: "A5", type: "thread", kinds: ["message"], variant: "", messages: [mA1, mA2, mA3v2, mA4, mA5] }] }
      ]
    },
    {
      id: "B",
      title: "Campaign B — Message",
      kinds: ["message", "inmail"],
      subtitle: "Direct messages to existing 1st-degree connections and open profiles, or InMail. No connection step.",
      steps: [
        {
          id: "B1", label: "B1", title: "The open", day: 0,
          variants: [
            { id: "B1", type: "thread", kinds: ["message", "inmail"], variant: "Variation 1 · the 9-word open", messages: [mB1] },
            { id: "B1-live", type: "thread", kinds: ["message", "inmail"], variant: "Variation 2 · LIVE · webinar-led", messages: [S(0, B1_LIVE_WEBINAR)] }
          ]
        },
        {
          id: "B2", label: "B2", title: "Follow-up", day: null, dayText: "Day 0 after a reply, Day 4 with no reply",
          variants: [
            { id: "B2-hot", type: "thread", kinds: ["message"], variant: "B2-hot · after a positive reply · Day 0", messages: [mB1, P(0, B_REPLY_HOT), SA(0, B2_HOT)] },
            { id: "B2-cold", type: "thread", kinds: ["message", "inmail"], variant: "B2-cold · no reply · Day 4", messages: [mB1, S(4, B2_COLD)] },
            { id: "B3-park", type: "thread", kinds: ["message"], variant: "B3-park · after a \"not now\" · Day 0", messages: [mB1, P(0, B_REPLY_PARK), SA(0, B3_PARK)] }
          ]
        }
      ]
    },
    {
      id: "C",
      title: "Campaign C — Webinar / Event",
      kinds: ["message"],
      subtitle: "Messages to event registrants: attendees and no-shows.",
      steps: [
        {
          id: "C1", label: "C1 / C2", title: "Day after the event", day: 0,
          variants: [
            { id: "C1", type: "thread", kinds: ["message"], variant: "C1 · attendee", messages: [S(0, C1)] },
            { id: "C2-v2", type: "thread", kinds: ["message"], variant: "C2 · no-show · Variation 1 · new", messages: [S(0, C2_V2)] },
            { id: "C2-v1", type: "thread", kinds: ["message"], variant: "C2 · no-show · Variation 2 · previous", messages: [S(0, C2_V1)] }
          ]
        },
        { id: "C3", label: "C3", title: "Either", day: 4, variants: [{ id: "C3", type: "thread", kinds: ["message"], variant: "", messages: [S(0, C1), S(4, C3)] }] }
      ]
    }
  ];

  // Flat list kept for the scorecard page.
  campaigns.forEach(c => { c.screens = c.steps.flatMap(st => st.variants.map(v => Object.assign({ label: `${st.label} · ${st.title}`, sub: v.variant }, v))); });

  window.LI_DATA = { SEP, sender, prospect, tokens, previews, linkChecks, linkCheckedAt, campaigns };
})();
