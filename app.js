(function () {
  const D = window.LI_DATA;
  const state = { mode: "sample", preview: true, notes: true, scale: 0.85 };

  // ---------- icons (paths drawn to match the LinkedIn iOS glyph set) ----------
  const I = {
    back: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12H5"/><path d="M11 6l-6 6 6 6"/></svg>',
    more: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="19" cy="12" r="1.9"/></svg>',
    star: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 17l-5.4 3 1.1-6.1L3.2 9.6l6.1-.8z"/></svg>',
    clip: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 11.5l-8.2 8.2a5.2 5.2 0 0 1-7.4-7.4l9-9a3.5 3.5 0 0 1 4.9 4.9l-9 9a1.8 1.8 0 0 1-2.5-2.5l8.3-8.3"/></svg>',
    mic: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0"/><path d="M12 17.5V21"/><path d="M8.5 21h7"/></svg>',
    x: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    check: '<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill="rgba(0,0,0,.75)"/><path d="M4.6 8.3l2.2 2.2 4.6-4.8" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    people: '<svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(0,0,0,.6)"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 19c0-3.4 2.9-5.5 6.5-5.5s6.5 2.1 6.5 5.5z"/><circle cx="17" cy="9" r="2.6"/><path d="M15.5 13.6c3 .2 5.9 2 5.9 5.4h-4.2c0-2-.6-3.9-1.7-5.4z"/></svg>',
    signal: '<svg width="18" height="12" viewBox="0 0 18 12" fill="#000"><rect x="0" y="8" width="3" height="4" rx=".8"/><rect x="5" y="5.5" width="3" height="6.5" rx=".8"/><rect x="10" y="3" width="3" height="9" rx=".8"/><rect x="15" y="0" width="3" height="12" rx=".8"/></svg>',
    wifi: '<svg width="17" height="12" viewBox="0 0 17 12" fill="#000"><path d="M8.5 11.6a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4zM3.9 7.2a6.5 6.5 0 0 1 9.2 0l-1.4 1.4a4.5 4.5 0 0 0-6.4 0zM1 4.2a10.6 10.6 0 0 1 15 0l-1.4 1.4a8.6 8.6 0 0 0-12.2 0z"/></svg>',
    battery: '<svg width="28" height="13" viewBox="0 0 28 13"><rect x=".6" y=".6" width="24" height="11.8" rx="3.4" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="1.2"/><rect x="2.2" y="2.2" width="20.8" height="8.6" rx="2" fill="#000"/><path d="M26.2 4.4v4.2a2.2 2.2 0 0 0 0-4.2z" fill="rgba(0,0,0,.4)"/></svg>'
  };

  // ---------- helpers ----------
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const URL_RE = /(https?:\/\/[^\s<]+|\b(?:[a-z0-9-]+\.)+(?:com|ai|io|net|org|co)\b(?:\/[^\s<]*)?)/gi;

  function fill(text, mode) {
    return String(text).replace(/\{\{(\w+)\}\}/g, (m, k) => (mode === "sample" ? (D.tokens[k] ?? m) : m));
  }

  function rich(text) {
    let html = esc(fill(text, state.mode));
    html = html.replace(URL_RE, (m) => {
      let trail = "";
      const t = m.match(/[.,;:!?)]+$/);
      if (t) { trail = t[0]; m = m.slice(0, -trail.length); }
      const href = /^https?:/i.test(m) ? m : "https://" + m;
      return `<a class="lnk" href="${esc(href)}" target="_blank" rel="noopener">${esc(m)}</a>${trail}`;
    });
    html = html.replace(/\{\{(\w+)\}\}/g, '<span class="tok">{{$1}}</span>');
    return html;
  }

  function firstPreview(text) {
    const filled = fill(text, "sample");
    const m = filled.match(URL_RE);
    if (!m) return "";
    let u = m[0].replace(/[.,;:!?)]+$/, "");
    const href = /^https?:/i.test(u) ? u : "https://" + u;
    let host; try { host = new URL(href).hostname.replace(/^www\./, ""); } catch { return ""; }
    const p = D.previews[host];
    if (!p) return "";
    const cal = host === "calendly.com";
    return `<a class="prev" href="${esc(href)}" target="_blank" rel="noopener"><div class="prev-img ${cal ? "cal" : ""}"></div><div class="prev-txt"><div class="prev-title">${esc(p.title)}</div><div class="prev-dom">${esc(p.domain)}</div></div></a>`;
  }

  function dayLabel(day, curDay) {
    const diff = curDay - day;
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    const d = new Date(D.baseDate); d.setDate(d.getDate() + day);
    if (diff < 7) return d.toLocaleDateString("en-US", { weekday: "long" });
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  function absDate(day) {
    const d = new Date(D.baseDate); d.setDate(d.getDate() + day);
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  }

  const av = (who, size, presence) =>
    `<span class="av" style="width:${size}px;height:${size}px;background:${who.color};font-size:${Math.round(size * .38)}px">${esc(who.initials)}${presence ? '<i class="presence"></i>' : ""}</span>`;

  const statusBar = () => `<div class="sb"><span class="sb-time">9:41</span><span class="sb-icons">${I.signal}${I.wifi}${I.battery}</span></div>`;
  const composer = () => `<div class="composer"><span class="ic">${I.clip}</span><div class="input">Write a message...</div><span class="ic">${I.mic}</span></div>`;
  const phone = (inner) => `<div class="phone-wrap"><div class="phone"><div class="screen">${inner}</div><div class="island"></div></div></div>`;

  // ---------- screens ----------
  function threadScreen(scr) {
    const msgs = scr.messages, cur = msgs[msgs.length - 1], curDay = cur.day;
    const P = D.prospect, S = D.sender;
    let body = `<div class="profile">${av(P, 56, true)}<div class="name">${esc(P.name)} <span>· 1st</span></div><div class="head">${esc(P.headline)}</div></div>`;
    let lastDay = null;
    msgs.forEach((m, i) => {
      if (m.day !== lastDay) { body += `<div class="sep">${dayLabel(m.day, curDay)}</div>`; lastDay = m.day; }
      const who = m.from === "sender" ? S : P;
      const last = i === msgs.length - 1;
      body += `<div class="msg ${m.from}${last ? " cur" : ""}">${av(who, 28)}<div class="msg-body"><div class="msg-head"><span class="msg-name">${esc(who.name)}</span><span class="msg-time">· ${esc(m.time)}</span></div><div class="msg-text">${rich(m.text)}</div>${m.from === "sender" ? firstPreview(m.text) : ""}</div>${last && m.from === "sender" ? `<span class="sent">${I.check}</span>` : ""}</div>`;
    });
    body += `<div style="height:10px"></div>`;
    return `${statusBar()}<div class="nav"><span class="ic">${I.back}</span><div class="nav-title"><div class="nav-name">${esc(P.name)}</div><div class="nav-sub"><i class="dot"></i>Active now</div></div><span class="ic">${I.more}</span><span class="ic">${I.star}</span></div><div class="body" data-scroll="bottom">${body}</div>${composer()}<div class="home"></div>`;
  }

  function inviteComposeScreen(scr) {
    const n = fill(scr.note, "sample").length;
    return `${statusBar()}<div class="nav"><span class="ic">${I.x}</span><div class="nav-center">Personalize invitation</div><span class="ic-spacer"></span></div><div class="body inv-compose"><div class="inv-label">Include a note with your invitation (optional)</div><div class="inv-note">${rich(scr.note)}</div><div class="inv-count${n > 300 ? " over" : ""}">${n}/300</div></div><div class="inv-footer"><button class="btn-primary">Connect</button></div><div class="home"></div>`;
  }

  function inviteReceivedScreen(scr) {
    const S = D.sender;
    const note = scr.note ? `<div class="inv-msg">${rich(scr.note)}</div>` : "";
    const filler = [
      { initials: "JK", color: "#8a5a2b", name: "Jonas Keller", head: "Staff Data Engineer at Northwind" },
      { initials: "LM", color: "#3d5a80", name: "Lucía Márquez", head: "Analytics Engineering Lead" }
    ].map(f => `<div class="sugg-row">${av(f, 48)}<div class="t"><b>${f.name}</b>${f.head}</div><span class="pill">Connect</span></div>`).join("");
    return `${statusBar()}<div class="nav"><span class="ic">${I.back}</span><div class="nav-title"><div class="nav-name">Invitations</div></div></div><div class="body"><div class="inv-tabs"><span class="pillf on">People</span><span class="pillf">Pages</span><span class="pillf">Events</span></div><div class="inv-count-line">Received (1)</div><div class="inv-card">${av(S, 56)}<div class="inv-main"><div class="inv-name">${esc(S.name)}</div><div class="inv-head">${esc(S.headline)}</div><div class="inv-mut">${I.people} 4 mutual connections</div>${note}<div class="inv-actions"><span class="pill pill-fill">Accept</span><span class="pill">Ignore</span></div></div></div><div class="inv-sugg">People you may know</div>${filler}</div><div class="home"></div>`;
  }

  // ---------- page ----------
  function chipHtml(c) {
    const cls = /approve/i.test(c) ? "approve" : /previous/i.test(c) ? "prev" : /sample/i.test(c) ? "sample" : /^live/i.test(c) ? "live" : /research|down/i.test(c) ? "research" : "";
    return `<span class="chip ${cls}">${esc(c)}</span>`;
  }
  function allText(scr) { return scr.type === "thread" ? scr.messages.filter(m => m.from === "sender").map(m => m.text).join("\n") : (scr.note || ""); }
  function autoChips(scr) {
    const chips = (scr.chips || []).slice();
    if (/\{\{personalization_short\}\}/.test(allText(scr))) chips.push("Needs AI research");
    else if (!chips.some(c => /^live$/i.test(c))) chips.push("Live-ready");
    if (/calendly\.com/.test(allText(scr))) chips.push("Calendly link down");
    return chips;
  }

  function currentText(scr) {
    if (scr.type === "thread") return scr.messages[scr.messages.length - 1].text;
    return scr.note || "";
  }

  function card(scr) {
    let screen, meta;
    if (scr.type === "thread") {
      screen = threadScreen(scr);
      const cur = scr.messages[scr.messages.length - 1];
      const txt = fill(cur.text, "sample");
      meta = `${txt.length} chars · ${txt.trim().split(/\s+/).length} words · Day ${cur.day} (${absDate(cur.day)})`;
    } else if (scr.type === "invite_compose") {
      screen = inviteComposeScreen(scr);
      meta = `${fill(scr.note, "sample").length}/300 chars with sample data`;
    } else {
      screen = inviteReceivedScreen(scr);
      meta = scr.note ? `${fill(scr.note, "sample").length}/300 chars with sample data` : "No note attached";
    }
    const copyBtn = currentText(scr) ? `<button class="copy" data-copy="${esc(scr.id)}">Copy text</button>` : "";
    return `<article class="card" id="${esc(scr.id)}">
      <header class="card-head"><div class="card-label">${esc(scr.label)}</div><div class="card-sub">${esc(scr.sub)}</div><div class="chips">${autoChips(scr).map(chipHtml).join("")}</div></header>
      ${phone(screen)}
      <footer class="card-foot"><div class="foot-row"><div class="meta">${meta}</div>${copyBtn}</div>${scr.notes ? `<div class="note">${scr.notes}</div>` : ""}</footer>
    </article>`;
  }

  function render() {
    const main = document.getElementById("main");
    const links = `<section class="campaign linkcheck" id="links"><div class="campaign-head"><h2>Link check</h2><p>Every URL used in the copy, tested ${esc(D.linkCheckedAt)}. Links inside the phones open in a new tab.</p></div><table class="ltable"><thead><tr><th>URL</th><th>Status</th><th>Page title</th></tr></thead><tbody>${D.linkChecks.map(l => `<tr><td>${/^https?:/.test(l.url) ? `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.url)}</a>` : `<span class="tok">${esc(l.url)}</span>`}</td><td><span class="st ${l.status === 200 ? "ok" : l.status === "broken" ? "bad" : "warn"}">${l.status === 200 ? "200 OK · verified visually" : l.status === "broken" ? "BROKEN" : "not live yet"}</span></td><td>${esc(l.title)}</td></tr>`).join("")}</tbody></table></section>`;
    main.innerHTML = D.campaigns.map(c => `<section class="campaign" id="campaign-${c.id}"><div class="campaign-head"><h2>${esc(c.title)}</h2><p>${esc(c.subtitle)}</p></div><div class="rail">${c.screens.map(card).join("")}</div></section>`).join("") + links;
    main.querySelectorAll('.body[data-scroll="bottom"]').forEach(b => { b.scrollTop = b.scrollHeight; });
    const nav = document.getElementById("sidenav");
    nav.innerHTML = D.campaigns.map(c => `<h4>${esc(c.title)}</h4>` + c.screens.map(s => {
      const tag = (s.chips || []).find(x => /approve|previous|^live$/i.test(x));
      return `<a href="#${esc(s.id)}" data-target="${esc(s.id)}">${esc(s.label)}${tag ? `<span class="tag ${/previous/i.test(tag) ? "prev" : /live/i.test(tag) ? "live" : ""}">${esc(tag)}</span>` : ""}</a>`;
    }).join("")).join("") + `<h4>More</h4><a href="scorecard.html">Benchmark scorecard →</a><a href="#links" data-target="links">Link check</a>`;
  }

  // ---------- events ----------
  document.addEventListener("click", (e) => {
    const nav = e.target.closest("[data-target]");
    if (nav) {
      e.preventDefault();
      const el = document.getElementById(nav.dataset.target);
      if (el) {
        goTo(el, nav.dataset.instant === "1"); delete nav.dataset.instant;
        document.querySelectorAll(".sidenav a").forEach(a => a.classList.toggle("active", a === nav));
        history.replaceState(null, "", "#" + nav.dataset.target);
      }
      return;
    }
    const cp = e.target.closest("[data-copy]");
    if (cp) {
      const scr = D.campaigns.flatMap(c => c.screens).find(s => s.id === cp.dataset.copy);
      const txt = fill(currentText(scr), state.mode);
      navigator.clipboard.writeText(txt).then(() => toast("Copied " + (state.mode === "sample" ? "with sample data" : "with raw {{tokens}}")));
      return;
    }
    const seg = e.target.closest(".seg button");
    if (seg) {
      seg.parentElement.querySelectorAll("button").forEach(b => b.classList.toggle("on", b === seg));
      if (seg.dataset.mode) { state.mode = seg.dataset.mode; render(); }
      if (seg.dataset.scale) { state.scale = +seg.dataset.scale; applyScale(); }
    }
  });
  document.getElementById("tgl-preview").addEventListener("change", (e) => { document.body.classList.toggle("no-preview", !e.target.checked); rescroll(); });
  document.getElementById("tgl-notes").addEventListener("change", (e) => document.body.classList.toggle("no-notes", !e.target.checked));

  function goTo(el, instant) {
    const behavior = instant ? "auto" : "smooth";
    const rail = el.closest(".rail");
    if (rail) rail.scrollTo({ left: el.offsetLeft - 26, behavior });
    const top = el.getBoundingClientRect().top + window.scrollY - (document.querySelector(".topbar").offsetHeight + 12);
    window.scrollTo({ top: Math.max(0, top), behavior });
  }
  function rescroll() { document.querySelectorAll('.body[data-scroll="bottom"]').forEach(b => { b.scrollTop = b.scrollHeight; }); }
  let tt; function toast(msg) { const t = document.getElementById("toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 1600); }

  function applyScale() {
    const fit = window.innerWidth < 900 ? Math.min(state.scale, (window.innerWidth - 32) / 417) : state.scale;
    document.documentElement.style.setProperty("--s", fit.toFixed(3));
  }
  window.addEventListener("resize", applyScale);
  const initial = location.hash.slice(1);
  if (initial) history.replaceState(null, "", location.pathname + location.search); // stop the native anchor jump into the rail
  applyScale();
  render();
  if (initial) { const a = document.querySelector(`[data-target="${CSS.escape(initial)}"]`); if (a) { a.dataset.instant = "1"; setTimeout(() => a.click(), 60); } }
})();
