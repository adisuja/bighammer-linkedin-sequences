/* BigHammer.ai LinkedIn sequences — copy + sample merge data.
   Edit copy here. Tokens use {{token}} syntax. SEP is what renders where the
   source copy had an em dash removed (change to ",", "~", " - " etc. in one place). */
(function () {
  const SEP = " - ";

  const sender = {
    name: "Adithya Murali",
    headline: "Co-founder, BigHammer.ai · Databricks cost",
    initials: "AM",
    color: "#5b3fa0"
  };

  const prospect = {
    first_name: "Priya",
    name: "Priya Raman",
    headline: "Head of Data Platform at Meridian Health",
    company: "Meridian Health",
    initials: "PR",
    color: "#0b6e4f"
  };

  // Live links (all tested 2026-09-18, see linkChecks below).
  const ASSESS = "https://assessment.bighammerops.com";
  const DEMO = "https://calendly.com/bighammer-marketing/your-free-bighammer-ai-demo";
  const WEBINAR = "https://webinar.bighammerai.com/";

  const tokens = {
    first_name: prospect.first_name,
    company: prospect.company,
    personalization_short: "your point on Unity Catalog migration eating the quarter landed",
    webinar_date: "Thursday 15 October, 12pm ET",
    webinar_url: WEBINAR,
    // No replay page exists yet; sample points at the webinar page so the link works. Replace when the recording is hosted.
    replay_url: WEBINAR
  };

  // Link-preview cards (LinkedIn unfurls the first URL in a message). Keyed by hostname. Titles are the live <title> tags.
  const previews = {
    "assessment.bighammerops.com": { title: "Reduce Your Databricks Costs up to 75% — BigHammer.ai", domain: "assessment.bighammerops.com" },
    "calendly.com": { title: "BigHammer Ai - Calendly", domain: "calendly.com" },
    "webinar.bighammerai.com": { title: "Reduce Databricks Costs — to 75% — Live Masterclass | BigHammer.ai", domain: "webinar.bighammerai.com" }
  };

  const linkChecks = [
    { url: ASSESS, status: 200, title: "Reduce Your Databricks Costs up to 75% — BigHammer.ai" },
    { url: DEMO, status: "broken", title: "HTTP 200 but the page renders \"BigHammer Ai — This calendar is currently unavailable.\" Re-enable the event type in Calendly before A4, B2-hot or C3 ship." },
    { url: WEBINAR, status: 200, title: "Reduce Databricks Costs — to 75% — Live Masterclass | BigHammer.ai" },
    { url: "{{replay_url}}", status: null, title: "No replay page exists yet — sample falls back to the webinar page" }
  ];
  const linkCheckedAt = "18 Sep 2026, 23:08 IST";

  // Day 0 of every sequence (used for the date separators in the thread).
  const baseDate = new Date(2026, 8, 21); // Mon 21 Sep 2026

  // ---------- COPY ----------
  const A0_NOTE =
`{{first_name}} ~ {{personalization_short}}

I work with Data teams on Databricks costs. Not pitching, just seems like we circle the same problems.

Worth connecting?`;

  // LIVE track: no AI-researched field. Two options, pick one per seat.
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

  // ---------- helpers to build threads ----------
  const S = (day, time, text, extra) => Object.assign({ from: "sender", day, time, text }, extra || {});
  const P = (day, time, text) => ({ from: "prospect", day, time, text, sample: true });

  const mA1 = S(0, "9:14 am", A1);
  const mA2 = S(3, "10:02 am", A2);
  const mA3v2 = S(7, "8:47 am", A3_V2);
  const mA3v1 = S(7, "8:47 am", A3_V1);
  const mA4 = S(12, "9:31 am", A4);
  const mA5 = S(25, "11:05 am", A5);

  const campaigns = [
    {
      id: "A",
      title: "Campaign A — Connector",
      subtitle: "Connection request + post-accept sequence. Cold, no prior relationship.",
      screens: [
        {
          id: "A0-compose", type: "invite_compose", label: "A0 · Connection request note", sub: "Variant A1 — post-reactive (Tier 1–2 only) · what the sender types",
          note: A0_NOTE, chips: ["300 char cap"],
          notes: "Sent from the prospect's profile: ··· → Personalize invite. Free accounts are capped at 200 characters and a monthly quota; the 300 cap applies to Premium seats. {{personalization_short}} must be ≤120 chars or the note overflows."
        },
        {
          id: "A0-received", type: "invite_received", label: "A0 · Connection request note", sub: "Variant A1 — as the prospect sees it (My Network → Invitations)",
          note: A0_NOTE, chips: [],
          notes: "Zero links in the note. It buys the accept, nothing else. Reply-to-note does not accept the invitation, so the thread only opens once they tap Accept."
        },
        {
          id: "A0-live-role", type: "invite_compose", label: "A0 · LIVE note (option 1)", sub: "No AI research needed · role-based",
          note: A0_LIVE_ROLE, chips: ["LIVE"],
          notes: "LIVE track: uses only CRM fields (first name, company). Benchmarks put the acceptance sweet spot at 120–180 characters; this sits just above, so trim the middle sentence if acceptance lags."
        },
        {
          id: "A0-live-webinar", type: "invite_received", label: "A0 · LIVE note (option 2)", sub: "No AI research needed · webinar-led · as the prospect sees it",
          note: A0_LIVE_WEBINAR, chips: ["LIVE"],
          notes: "LIVE track: names the masterclass as the reason to connect without a link (links in notes read as spam). Pairs with A5 or B1-LIVE for the registration ask."
        },
        {
          id: "A0-bare", type: "invite_received", label: "A0 · Connection request", sub: "Variant A2 — no personalization available · send the request bare",
          note: null, chips: ["No note"],
          notes: "Tier 5 fallback: when there is nothing specific to say, send no note at all. Accept rates on unpersonalised notes sit below the no-note baseline."
        },
        {
          id: "A1", type: "thread", label: "A1 · Day 0 after accept", sub: "The thank-you that isn't a pitch", chips: [],
          messages: [mA1],
          notes: "Why it works: names the exact pain in the prospect's own vocabulary, then asks a question that's genuinely easy to answer either way. \"We've got it solved\" is a useful reply too — it tells you to move on."
        },
        {
          id: "A2", type: "thread", label: "A2 · Day 3", sub: "Value, no ask", chips: [],
          messages: [mA1, mA2],
          notes: "No link. No CTA. This message exists purely to prove you know the platform."
        },
        {
          id: "A3-v2", type: "thread", label: "A3 · Day 7", sub: "The queries — first link · NEW VERSION", chips: ["To approve"],
          messages: [mA1, mA2, mA3v2],
          notes: "Correct one to be approved. Opens by continuing A2's CPU check rather than restarting the pitch. First link in the sequence; LinkedIn will unfurl it into the preview card unless it is removed before sending."
        },
        {
          id: "A3-v1", type: "thread", label: "A3 · Day 7", sub: "The queries — previous version, for comparison", chips: ["Previous"],
          messages: [mA1, mA2, mA3v1],
          notes: "Superseded by the version marked To approve."
        },
        {
          id: "A4", type: "thread", label: "A4 · Day 12", sub: "The ask", chips: [],
          messages: [mA1, mA2, mA3v2, mA4],
          notes: "Only hard CTA in the sequence. The exit line gives permission to say no, which is what keeps the thread alive for A5."
        },
        {
          id: "A5", type: "thread", label: "A5 · Day 25", sub: "Soft revival — only if no reply to A1–A4", chips: ["Conditional"],
          messages: [mA1, mA2, mA3v2, mA4, mA5],
          notes: "Cap the sequence at 5 touches. Kill on any reply, including negative ones, and route to a human. Note the copy says 30 + 15 minutes; the live page says 45 minutes plus Q&A."
        }
      ]
    },
    {
      id: "B",
      title: "Campaign B — Message",
      subtitle: "Direct messages to existing 1st-degree connections, open profiles, or InMail. No connection step.",
      screens: [
        {
          id: "B1", type: "thread", label: "B1 · Day 0", sub: "The 9-word open", chips: [],
          messages: [S(0, "9:12 am", B1)],
          notes: "Deliberately tiny. First-degree connections reply to questions, not to paragraphs. The \"or is it under control\" half is what makes it answerable: it gives permission to say no, which is why people say something.<br><br><b>Branch on the reply</b><br>\"Yes / it's a problem\" → B2-hot<br>\"It's fine / not now\" → B3-park, then stop<br>No reply after 4 days → B2-cold"
        },
        {
          id: "B1-live", type: "thread", label: "B1 · LIVE webinar-led", sub: "Direct-to-registration variant of the open", chips: ["LIVE"],
          messages: [S(0, "9:12 am", B1_LIVE_WEBINAR)],
          notes: "LIVE track: same question, but the webinar is the answer for a \"yes\". Use when the goal of the send is seats, not conversations. Same branching as B1."
        },
        {
          id: "B2-hot", type: "thread", label: "B2-hot · same day", sub: "After a positive reply", chips: ["Sample reply shown"],
          messages: [S(0, "9:12 am", B1), P(0, "9:40 am", B_REPLY_HOT), S(0, "9:52 am", B2_HOT)],
          notes: "The prospect's reply is a sample to show the branch in context. Ends on the spend question so the reply qualifies the deal, not just the interest."
        },
        {
          id: "B2-cold", type: "thread", label: "B2-cold · Day 4", sub: "No reply to B1", chips: [],
          messages: [S(0, "9:12 am", B1), S(4, "9:15 am", B2_COLD)],
          notes: "Leaves value and closes the loop. Sequence ends here."
        },
        {
          id: "B3-park", type: "thread", label: "B3-park", sub: "After a \"not now\"", chips: ["Sample reply shown"],
          messages: [S(0, "9:12 am", B1), P(0, "9:38 am", B_REPLY_PARK), S(0, "10:03 am", B3_PARK)],
          notes: "That last question converts about as often as any hard CTA in the sequence, because it's the actual question and people like answering it."
        }
      ]
    },
    {
      id: "C",
      title: "Campaign C — Webinar / Event",
      subtitle: "For LinkedIn Event registrants, attendees, and no-shows. Warmest list you have.",
      screens: [
        {
          id: "C1", type: "thread", label: "C1 · Attendee, day after", sub: "Thanks + the threshold", chips: [],
          messages: [S(0, "8:55 am", C1)],
          notes: "Repeats the single most-quoted number from the session and points at where it lives."
        },
        {
          id: "C2-v2", type: "thread", label: "C2 · No-show, day after", sub: "NEW VERSION", chips: ["To approve"],
          messages: [S(0, "8:58 am", C2_V2)],
          notes: "To be approved. No first-name merge in this version, so it reads identically for every no-show. {{replay_url}} has no live page yet; the sample falls back to the webinar page."
        },
        {
          id: "C2-v1", type: "thread", label: "C2 · No-show, day after", sub: "Previous version, for comparison", chips: ["Previous"],
          messages: [S(0, "8:58 am", C2_V1)],
          notes: "Superseded by the version marked To approve."
        },
        {
          id: "C3", type: "thread", label: "C3 · Either, day 5", sub: "Attendee or no-show", chips: [],
          messages: [S(0, "8:55 am", C1), S(4, "9:20 am", C3)],
          notes: "Shown after C1; the same message follows C2 for no-shows."
        }
      ]
    }
  ];

  window.LI_DATA = { SEP, sender, prospect, tokens, previews, linkChecks, linkCheckedAt, baseDate, campaigns };
})();
