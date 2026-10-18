/* DWI Digital booth kiosk — offline, touch-first. Every demo runs locally with dummy data; nothing is sent anywhere. */
const $ = (s, r = document) => r.querySelector(s);
const el = (h) => { const d = document.createElement('div'); d.innerHTML = h.trim(); return d.firstElementChild; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
/* phones (QR visitors) get a scrolling layout instead of the scaled 1920x1080 TV stage, and no attract loop */
const MOBILE = /[?&]m=1/.test(location.search) || matchMedia('(max-width: 900px)').matches;
if (MOBILE) document.documentElement.classList.add('m');

const APPS = [
  { id: 'protect', name: 'PROTECT', c: '#fb7185', logo: 'media/logos/protect.png', line: 'Rig safeguard checks with photo proof',
    stat: ['60,082', 'photo evidences'], film: 'media/films/02 PROTECT.mp4',
    extra: [['App tutorial', 'media/protect/protect_mobile.mp4'], ['Dashboard tutorial', 'media/protect/protect_dashboard.mp4']],
    stats: [['14', 'rigs live'], ['378', 'field users'], ['60,082', 'photo evidences']],
    how: ['Each crew role gets its own CRSSC checklist on OneApp', 'Ready / Not Ready with photo, works offline', 'Not-ready equipment triggers an SWA alert', 'Live web dashboard and PDF reports for leadership'],
    demo: 'protect', tryText: 'Try it: run a safeguard check' },
  { id: 'jorun', name: 'JoRUN AI', c: '#a78bfa', logo: 'media/logos/jorun.png', line: 'AI fishing advisor — your Fisherman Friend',
    stat: ['7,258', 'fishing events mapped'], film: 'media/films/03 JoRUN AI.mp4',
    stats: [['7,258', 'fishing events, one map'], ['Seconds', 'to answer, English or Bahasa'], ['1 min', 'to a full fishing program']],
    how: ['Pick any well — it already knows its history', 'Ask anything about the job', 'Reads impression blocks and finds similar past jobs', 'Exports the fishing program as Excel or PDF'],
    demo: null, tryText: 'Live demo at the booth — ask us' },
  { id: 'tcard', name: 'T-CARD', c: '#2dd4bf', logo: 'media/logos/tcard.png', line: 'Crew-change approvals, checked automatically',
    stat: ['0%', 'disputes in the pilot'], film: 'media/films/01 T-CARD.mp4',
    stats: [['0%', 'dispute rate in the 13-rig pilot'], ['113', 'requests in 17 days'], ['IDR 45B', 'est. yearly saving, 60 rigs']],
    how: ['Contractor PIC submits one form from any phone', 'GO / NO-GO auto-check against the rules', 'WSR → Asst. Manager → Manager, each with an SLA', 'Full audit trail in SharePoint, no extra license'],
    demo: 'tcard', tryText: 'Try it: submit a crew change' },
  { id: 'qserra', name: 'QSERRA', c: '#8be04e', logo: 'media/logos/qserra.png', line: 'Quality supervision & PJSM, on one Job ID',
    stat: ['61', 'job guides'], film: 'media/films/04 QSERRA.mp4',
    stats: [['61', 'job guides with animations'], ['16,372', 'wells, type-ahead'], ['606', 'PJSM walkthrough Q&As']],
    how: ['Form A pre-work: crew, pillars, job code', 'PJSM Walkthrough: point-by-point questions & ideal answers', 'Form B PJSM · Form C execution · Form D debrief', 'Phone, tablet or desktop — online or offline'],
    demo: 'walkthrough', tryText: 'Try it: open a PJSM Walkthrough' },
  { id: 'soplego', name: 'SOP LEGO', c: '#38bdf8', logo: 'media/logos/soplego.png', line: 'SOP intake, validation and acknowledgement',
    stat: ['61', 'rigs · 13 contractors'], film: 'media/films/05 SOP LEGO.mp4',
    stats: [['60', 'mandatory SOPs'], ['61', 'rigs'], ['13', 'contractors']],
    how: ['Contractor sends one email with the SOP PDF', 'Checked automatically: rig, SOP, PIC, PDF, Area Manager', 'Filed in SharePoint, sent for acknowledgement', 'Compliance matrix shows every gap, rig by rig'],
    demo: 'soplego', tryText: 'Try it: submit an SOP' },
];
let cur = null;

/* ---------- stage scaling: design at 1920x1080, fit any screen ---------- */
function fit() { if (MOBILE) return; const s = Math.min(innerWidth / 1920, innerHeight / 1080); const st = $('#stage'); st.style.transform = `scale(${s})`;
  st.style.left = ((innerWidth - 1920 * s) / 2) + 'px'; st.style.top = ((innerHeight - 1080 * s) / 2) + 'px'; }
addEventListener('resize', fit); fit();

/* ---------- navigation ---------- */
function show(v) { document.querySelectorAll('.view').forEach((x) => x.classList.toggle('on', x.id === 'v-' + v)); }
function go(v) { if (v === 'home') { $('#appvid').pause(); show('home'); } }
function toast(msg, icon = '✉️') { const t = $('#toast'); t.querySelector('i').textContent = icon; t.querySelector('span').innerHTML = msg; t.classList.add('show');
  clearTimeout(toast._h); toast._h = setTimeout(() => t.classList.remove('show'), 3200); }
function flash() { const f = $('#flash'); f.classList.remove('on'); void f.offsetWidth; f.classList.add('on'); }

function home() {
  const g = $('#tiles'); g.innerHTML = '';
  APPS.forEach((a) => { const t = el(`<button class="tile" style="--c:${a.c}"><div class="go">›</div><img src="${a.logo}" alt=""><b>${a.name}</b><span>${a.line}</span>
      <div class="stat">${a.stat[0]}<small>${a.stat[1]}</small></div></button>`); t.onclick = () => openApp(a); g.appendChild(t); });
}
function openApp(a) {
  cur = a; document.documentElement.style.setProperty('--c', a.c);
  $('#a-logo').src = a.logo; $('#a-name').textContent = a.name; $('#a-line').textContent = a.line;
  $('#a-stats').innerHTML = a.stats.map((s) => `<div class="st3" style="--c:${a.c}"><b>${s[0]}</b><span>${s[1]}</span></div>`).join('');
  $('#a-how').innerHTML = a.how.map((h, i) => `<div><i style="--c:${a.c}">${i + 1}</i><span>${h}</span></div>`).join('');
  const tr = $('#a-try'); tr.textContent = a.tryText; tr.className = 'try' + (a.demo || a.link ? '' : ' disabled'); tr.style.setProperty('--c', a.c);
  tr.onclick = a.link ? () => window.open(a.link, '_blank', 'noopener') : a.demo ? () => openDemo(a) : null;
  const vids = [['Film', a.film]].concat(a.extra || []);
  const tabs = $('#vtabs'); tabs.innerHTML = '';
  const play = (src, b) => { const v = $('#appvid'); v.src = src; v.muted = true; v.play().catch(() => {}); tabs.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c === b)); };
  vids.forEach((v, i) => { const b = el(`<button class="chip">${v[0]}</button>`); b.onclick = () => play(v[1], b); tabs.appendChild(b); if (!i) play(v[1], b); });
  if (vids.length < 2) tabs.innerHTML = '';
  show('app');
}
function backToApp() { openApp(cur); }
function openDemo(a) {
  $('#appvid').pause();
  $('#d-logo').src = a.logo; $('#d-name').textContent = a.name;
  $('.demo-tag').textContent = a.demo === 'walkthrough' ? 'REAL WALKTHROUGH CONTENT' : 'DEMO · DUMMY DATA';
  show('demo'); DEMOS[a.demo]();
}
function steps(names, at) { $('#d-steps').innerHTML = names.map((n, i) => `<span class="${i === at ? 'on' : i < at ? 'done' : ''}">${i < at ? '✓ ' : ''}${n}</span>`).join(''); }
function body(h) { const b = $('#d-body'); b.innerHTML = h; return b; }
function seg(id, opts, val, bad = []) {
  return `<div class="seg" data-seg="${id}">${opts.map((o) => `<button class="${o === val ? 'on' : ''} ${bad.includes(o) ? 'bad' : ''}" data-v="${o}">${o}</button>`).join('')}</div>`;
}
function wireSeg(root, state) {
  root.querySelectorAll('[data-seg]').forEach((s) => s.querySelectorAll('button').forEach((b) => b.onclick = () => {
    s.querySelectorAll('button').forEach((x) => x.classList.remove('on')); b.classList.add('on'); state[s.dataset.seg] = b.dataset.v; }));
}
const now = () => { const d = new Date(); return d.toTimeString().slice(0, 5); };
let S_T0 = Date.now();
const at = (h, t0) => new Date((t0 || S_T0) + h * 3600e3).toTimeString().slice(0, 5);

/* ================= T-CARD ================= */
const DEMOS = {};
DEMOS.tcard = function () {
  const S = { rig: 'ACS-03', pos: 'Floorman', ccpm: 'Hijau', ffd: 'P1 — Fit', sse: 'No', pkwt: 'Valid', badge: 'Valid', days: 12, ot: 6, name: 'Rudi Hartono', log: [] };
  const N = ['Submit', 'Auto-check', 'Approvals', 'Result'];
  form();
  function form() {
    steps(N, 0);
    const b = body(`<div class="row" style="height:100%">
      <div class="col card" style="overflow:hidden">
        <div class="lbl">Crew change request · MS Forms</div>
        <div class="row"><div class="col field"><div class="lbl">Rig</div>${seg('rig', ['ACS-03', 'GW-367', 'BMS-20', 'PDSI-12'], S.rig)}</div></div>
        <div class="row"><div class="col field"><div class="lbl">Replacement crew</div><input type="text" id="tc-name" value="${S.name}"></div>
          <div class="col field"><div class="lbl">Position</div>${seg('pos', ['Floorman', 'Derrickman', 'Driller'], S.pos)}</div></div>
        <div class="field"><div class="lbl">CCPM status</div>${seg('ccpm', ['Hijau', 'Kuning', 'Merah'], S.ccpm, ['Merah'])}</div>
        <div class="field"><div class="lbl">Fit For Duty</div>${seg('ffd', ['P1 — Fit', 'Restricted', 'P5'], S.ffd, ['Restricted', 'P5'])}</div>
        <div class="row"><div class="col field"><div class="lbl">PKWT contract</div>${seg('pkwt', ['Valid', 'Expired'], S.pkwt, ['Expired'])}</div>
          <div class="col field"><div class="lbl">Badge</div>${seg('badge', ['Valid', 'Expired'], S.badge, ['Expired'])}</div>
          <div class="col field"><div class="lbl">SSE replacing SSE?</div>${seg('sse', ['No', 'Yes'], S.sse, ['Yes'])}</div></div>
      </div>
      <div class="col" style="flex:.8;display:flex;flex-direction:column;gap:22px">
        <div class="card"><div class="lbl">Days on duty (demo limit 14)</div><div class="slider"><input type="range" min="1" max="21" value="${S.days}" id="tc-days"><em id="tc-dv">${S.days} days</em></div></div>
        <div class="card"><div class="lbl">Overtime (demo limit 20 h)</div><div class="slider"><input type="range" min="0" max="40" value="${S.ot}" id="tc-ot"><em id="tc-ov">${S.ot} h</em></div></div>
        <div class="card" style="font-size:21px;line-height:1.5;color:#cdd3df">💡 Try making it fail: set CCPM to <b style="color:#ff5a52">Merah</b> or push overtime past the limit, then submit.</div>
        <button class="big-btn" id="tc-sub" style="margin-top:auto">Submit request ›</button>
      </div></div>`);
    wireSeg(b, S);
    $('#tc-days').oninput = (e) => { S.days = +e.target.value; $('#tc-dv').textContent = S.days + ' days'; };
    $('#tc-ot').oninput = (e) => { S.ot = +e.target.value; $('#tc-ov').textContent = S.ot + ' h'; };
    $('#tc-sub').onclick = () => { S.name = $('#tc-name').value || 'Rudi Hartono'; S.t0 = Date.now(); S.cum = 0; S.id = 'TC-' + (2600 + Math.floor(Math.random() * 90)); S.log = [['Submitted by Contractor PIC', at(0)]]; check(); };
  }
  async function check() {
    steps(N, 1);
    const C = [['SSE replacement', S.sse === 'No', S.sse === 'No' ? 'Not an SSE swap' : 'SSE needs special approval'],
               ['Fit For Duty', S.ffd !== 'P5', S.ffd], ['FFD restriction', S.ffd !== 'Restricted', S.ffd === 'Restricted' ? 'Restricted' : 'None'],
               ['CCPM', S.ccpm !== 'Merah', S.ccpm], ['PKWT contract', S.pkwt === 'Valid', S.pkwt], ['Badge', S.badge === 'Valid', S.badge],
               ['Days worked', S.days <= 14, S.days + ' / 14 days'], ['Overtime', S.ot <= 20, S.ot + ' / 20 h']];
    body(`<div class="lbl">GO / NO-GO auto-check · ${S.name} · ${S.pos} · ${S.rig}</div>
      <div class="tiles2" id="tc-crit">${C.map((c) => `<div class="crit"><span class="ic">…</span><b>${c[0]}</b><span>${c[2]}</span></div>`).join('')}</div>
      <div class="verdict" id="tc-ver"></div><div id="tc-next" style="margin-top:24px;display:flex;gap:18px"></div>`);
    const tiles = document.querySelectorAll('#tc-crit .crit');
    for (let i = 0; i < C.length; i++) { await sleep(330); tiles[i].classList.add(C[i][1] ? 'ok' : 'bad'); tiles[i].querySelector('.ic').textContent = C[i][1] ? '✓' : '✕'; }
    await sleep(350);
    const fails = C.filter((c) => !c[1]); const v = $('#tc-ver');
    if (!fails.length) {
      S_T0 = S.t0; S.log.push(['Auto-check: GO (8 / 8)', at(0.001)]);
      v.className = 'verdict go show'; v.innerHTML = `<b>GO</b><span>All criteria met · routed to the on-duty WSR · SLA 1 hour</span>`;
      $('#tc-next').innerHTML = `<button class="big-btn" id="tc-go">Send to approvers ›</button>`; $('#tc-go').onclick = approvals;
      toast('<b>[T-CARD] Crew Change Review — WSR</b><br>sent to the WSR on duty');
    } else {
      v.className = 'verdict nogo show'; v.innerHTML = `<b>NO-GO</b><span>${fails.length} ${fails.length > 1 ? 'criteria' : 'criterion'} failed · returned to the PIC · never reaches approval</span>`;
      $('#tc-next').innerHTML = `<div class="mail" style="flex:1"><div class="subj">[T-CARD] Request returned — ${S.rig} · ${S.name}</div><div class="from">To: Contractor PIC · ${now()}</div>
        Your crew change did not pass the automatic check:<ul>${fails.map((f) => `<li>${f[0]}: ${f[2]}</li>`).join('')}</ul></div>
        <button class="big-btn ghost" id="tc-fix" style="align-self:center">‹ Fix and resubmit</button>`;
      $('#tc-fix').onclick = form; toast('Returned to the Contractor PIC with the reasons', '↩️');
    }
  }
  function approvals() {
    steps(N, 2);
    const A = [['WSR', 'SLA 1 h', .6], ['Asst. Manager', 'SLA 3 h', 1.9], ['Manager', 'SLA 5 h', 2.5]]; let k = 0;
    const draw = () => {
      body(`<div class="lbl">Approval chain · #${S.id} · ${S.name}</div>
        <div class="chain">${['Submitted', 'Auto-check'].map((n, i) => `<div class="cn done"><div class="d">${i ? '⚡' : '0'}</div><b>${n}</b><span>${i ? 'GO' : S.log[0][1]}</span></div>`).join('')}
          ${A.map((a, i) => `<div class="cn ${i < k ? 'done' : i === k ? 'cur' : ''}"><div class="d">${i < k ? '✓' : i + 1}</div><b>${a[0]}</b><span>${i < k ? '✓ ' + a[2] + ' h' : a[1]}</span></div>`).join('')}
          <div class="cn"><div class="d">✓</div><b>Result</b><span>email to PIC</span></div></div>
        <div class="row"><div class="col mail"><div class="subj">[T-CARD] Crew Change Review — ${A[k][0]}</div><div class="from">To: ${A[k][0]} on duty · ${now()}</div>
          ${S.name} (${S.pos}) for rig ${S.rig} passed the automatic check (GO · 8 / 8) and needs your decision.<br><br>
          <span style="color:#8a6100;background:#fff4ce;padding:6px 10px;border-radius:8px">⏱ ${A[k][1]} — a reminder goes out if it isn't actioned</span></div>
          <div class="col" style="flex:.7;display:flex;flex-direction:column;gap:18px;justify-content:center">
            <div style="font-size:24px;color:#cdd3df">You are the <b style="color:#fff">${A[k][0]}</b>. Decide:</div>
            <button class="big-btn green" id="tc-ap">✓ Approve</button><button class="big-btn red" id="tc-rj">✕ Reject with reason</button></div></div>`);
      $('#tc-ap').onclick = () => { S.cum += A[k][2]; S.log.push([A[k][0] + ' approved (' + A[k][2] + ' h)', at(S.cum)]); k++;
        if (k < A.length) { toast(`<b>[T-CARD] Crew Change Review — ${A[k][0]}</b><br>the PIC is told it moved forward`); draw(); } else result(true); };
      $('#tc-rj').onclick = () => { S.cum += A[k][2]; S.log.push([A[k][0] + ' rejected: crew not familiar with rig', at(S.cum)]); result(false, A[k][0]); };
    };
    draw();
  }
  function result(ok, who) {
    steps(N, 3);
    body(`<div class="row" style="height:100%"><div class="col"><div class="verdict ${ok ? 'go' : 'nogo'} show" style="margin:0 0 24px"><b>${ok ? 'APPROVED' : 'REJECTED'}</b>
        <span>${ok ? 'Crew change cleared by all three approvers' : 'Rejected by the ' + who + ' — the reason goes to the PIC'}</span></div>
        <div class="mail"><div class="subj">[T-CARD] ${ok ? 'Approved' : 'Rejected'} — ${S.rig} · ${S.name}</div><div class="from">To: Contractor PIC · CC: WSR · ${now()}</div>
        ${ok ? `${S.name} is cleared to join ${S.rig} as ${S.pos}. Safe work!` : 'Reason: crew not familiar with rig. You can submit a new request.'}</div></div>
      <div class="col card"><div class="lbl">Audit trail · SharePoint</div><div class="audit">${S.log.map((l) => `<div><b>${l[1]}</b> — ${l[0]}</div>`).join('')}</div>
        <div style="margin-top:30px;display:flex;gap:16px"><button class="big-btn" id="tc-again">Start again</button><button class="big-btn ghost" onclick="backToApp()">Back to T-CARD</button></div></div></div>`);
    toast(ok ? '<b>Approved</b> — final email sent to the PIC' : '<b>Rejected</b> — PIC notified with the reason', ok ? '✅' : '✕');
    $('#tc-again').onclick = () => DEMOS.tcard();
  }
};

/* ================= PROTECT ================= */
DEMOS.protect = function () {
  const ROLES = [['Toolpusher', '🧑‍✈️'], ['Driller', '⚙️'], ['Derrickman', '🏗️'], ['Floorman', '🔧'], ['Mechanic', '🛠️'], ['Truckpusher', '🚛'], ['HES Field', '⛑️']];
  const ITEMS = { Toolpusher: [['Drawwork brake band', 'Brake band and linkage free of wear, pins secured'], ['Drilling line', 'No broken wires, ton-miles within limit'],
      ['Annular preventer', 'Function test done, closing time logged'], ['Accumulator pressure', '3000 psi, pre-charge within range'], ['Choke manifold', 'Valves aligned, gauges readable']],
    default: [['Crown-o-matic', 'Trips before the block reaches the crown'], ['Handrails & toe boards', 'Secure, no gaps'], ['Fire extinguisher', 'Pressure in green, tag current'],
      ['Mud gas separator', 'Vent line clear, U-tube full'], ['Escape line & Geronimo', 'Anchored, brake works']] };
  const S = { role: 'Toolpusher', rig: 'ACS-03', marks: {}, photos: {} };
  const N = ['Role & rig', 'Checklist', 'Dashboard'];
  pick();
  function pick() {
    steps(N, 0);
    const b = body(`<div class="lbl">1 · Who is checking?</div><div class="roles">${ROLES.map((r) => `<button class="role ${r[0] === S.role ? 'on' : ''}" data-r="${r[0]}"><i>${r[1]}</i>${r[0]}</button>`).join('')}</div>
      <div class="lbl" style="margin-top:34px">2 · Which rig?</div>${seg('rig', ['ACS-03', 'GW-367', 'BMS-20', 'PDSI-12', 'ACS-11'], S.rig)}
      <div class="card" style="margin-top:34px;font-size:22px;color:#cdd3df;line-height:1.5">📶 Works with no signal: the checklist saves on the phone and syncs by itself when the network comes back.</div>
      <div style="position:absolute;right:38px;bottom:30px"><button class="big-btn" id="pr-go">Start checklist ›</button></div>`);
    b.querySelectorAll('.role').forEach((r) => r.onclick = () => { b.querySelectorAll('.role').forEach((x) => x.classList.remove('on')); r.classList.add('on'); S.role = r.dataset.r; });
    wireSeg(b, S); $('#pr-go').onclick = list;
  }
  function list() {
    steps(N, 1); S.marks = {}; S.photos = {};
    const it = ITEMS[S.role] || ITEMS.default;
    const b = body(`<div class="lbl">CRSSC checklist · ${S.role} · ${S.rig} · tour ${now()}</div>
      <div id="pr-items">${it.map((x, i) => `<div class="item"><div><b>${x[0]}</b><span>Guideline: ${x[1]}</span></div><div class="acts">
        <button class="ph" data-i="${i}">📷 Photo</button><button class="r" data-i="${i}">Ready</button><button class="n" data-i="${i}">Not ready</button></div></div>`).join('')}</div>
      <div style="display:flex;gap:18px;align-items:center;margin-top:10px"><span id="pr-prog" style="font-size:22px;color:#8b93a7">0 / ${it.length} checked</span><div style="flex:1"></div>
        <button class="big-btn" id="pr-sub" style="opacity:.4">Submit report ›</button></div>`);
    const upd = () => { const n = Object.keys(S.marks).length; $('#pr-prog').textContent = `${n} / ${it.length} checked · ${Object.keys(S.photos).length} photos`; $('#pr-sub').style.opacity = n === it.length ? 1 : .4; };
    b.querySelectorAll('.ph').forEach((x) => x.onclick = () => { flash(); S.photos[x.dataset.i] = true; x.classList.add('on'); x.textContent = '📷 ✓'; upd(); });
    b.querySelectorAll('.r,.n').forEach((x) => x.onclick = () => { const i = x.dataset.i; S.marks[i] = x.classList.contains('r') ? 'ready' : 'not';
      x.parentNode.querySelectorAll('.r,.n').forEach((y) => y.classList.remove('on')); x.classList.add('on');
      if (S.marks[i] === 'not') toast(`<b>${it[i][0]}</b> flagged NOT READY<br>WSR notified · SWA required`, '⚠️'); upd(); });
    $('#pr-sub').onclick = () => { if (Object.keys(S.marks).length === it.length) dash(it); else toast('Check every item first', '☝️'); };
  }
  function dash(it) {
    steps(N, 2);
    const ready = Object.values(S.marks).filter((m) => m === 'ready').length, pct = Math.round(ready / it.length * 100);
    const not = it.filter((_, i) => S.marks[i] === 'not');
    const roles = ROLES.map((r) => [r[0], r[0] === S.role ? 100 : [100, 80, 60, 100, 40, 0, 100][ROLES.indexOf(r)]]);
    body(`<div class="row" style="height:100%">
      <div class="col card" style="flex:.8;text-align:center"><div class="lbl">${S.rig} · readiness</div>
        <div class="ring" style="background:conic-gradient(${pct === 100 ? 'var(--green)' : 'var(--amber)'} ${pct * 3.6}deg, rgba(255,255,255,.08) 0)"><div><div><b>${pct}%</b><span>${ready} / ${it.length} ready</span></div></div></div>
        <div style="margin-top:26px;font-size:22px;color:#cdd3df">${not.length ? '⚠️ Rig flagged until the SWA is resolved' : '✅ Ready to operate'}</div></div>
      <div class="col card"><div class="lbl">Role completion · today</div>${roles.map((r) => `<div class="rolerow"><span>${r[0]}</span><div class="bar"><i style="width:${r[1]}%;${r[1] < 100 ? 'background:var(--amber)' : ''}"></i></div><b>${r[1]}%</b></div>`).join('')}</div>
      <div class="col" style="display:flex;flex-direction:column;gap:16px">
        ${not.length ? not.map((n) => `<div class="alert"><b>NOT READY</b> · ${n[0]}<br><span style="color:#cdd3df;font-size:18px">Awaiting SWA resolution · ${S.role} · ${now()}</span></div>`).join('') : '<div class="card" style="font-size:22px">No open alerts 🎉</div>'}
        <div class="card"><div class="lbl">Evidence gallery</div><div class="gallery">${it.map((x, i) => S.photos[i] ? `<div>${x[0]}</div>` : '').join('') || '<span style="color:#8b93a7;font-size:18px">No photos taken</span>'}</div></div>
        <div style="margin-top:auto;display:flex;gap:14px"><button class="big-btn" onclick="DEMOS.protect()">Run another check</button></div></div></div>`);
    toast('Report synced · visible on the web dashboard', '📡');
  }
};

/* ================= QSERRA · PJSM Walkthrough ================= */
DEMOS.walkthrough = function () {
  steps(['PJSM Walkthrough'], 0);
  const J = (window.QSERRA_JOBS || []).filter((j) => j.points.length);
  let job = J.find((j) => j.code === '1.5') || J[0], pi = 0;
  const b = body(`<div class="wt"><div class="list"><div class="q"><input type="text" id="wt-q" placeholder="Search a job, e.g. BOPE"></div><div class="jobs" id="wt-jobs"></div></div>
    <div class="main"><div class="top2"><video id="wt-v" muted loop playsinline autoplay></video><div><div class="lbl" id="wt-t"></div><div class="pts" id="wt-pts"></div></div></div>
      <div style="display:flex;flex-direction:column;gap:16px;min-height:0"><div class="pnav"><b id="wt-pn"></b><div style="display:flex;gap:12px">
        <button class="big-btn ghost" id="wt-prev" style="height:70px;font-size:24px">‹ Previous</button><button class="big-btn" id="wt-next" style="height:70px;font-size:24px">Next point ›</button></div></div>
        <div class="qa" id="wt-qa"></div></div></div></div>`);
  b.style.padding = '0';
  const jobs = () => { const q = ($('#wt-q').value || '').toLowerCase();
    $('#wt-jobs').innerHTML = J.filter((j) => !q || (j.code + ' ' + j.title).toLowerCase().includes(q)).map((j) => `<button class="job ${j === job ? 'on' : ''}" data-c="${j.code}"><em>${j.code}</em>${j.title}</button>`).join('');
    $('#wt-jobs').querySelectorAll('.job').forEach((x) => x.onclick = () => { job = J.find((j) => j.code === x.dataset.c); pi = 0; jobs(); draw(true); }); };
  const draw = (newVid) => {
    if (newVid) { const v = $('#wt-v'); v.src = job.video; v.play().catch(() => {}); }
    $('#wt-t').textContent = job.code + ' · ' + job.title;
    $('#wt-pts').innerHTML = job.points.map((p, i) => `<button class="pt ${i === pi ? 'on' : ''}" data-i="${i}"><i>${i + 1}</i>${p.p}</button>`).join('');
    $('#wt-pts').querySelectorAll('.pt').forEach((x) => x.onclick = () => { pi = +x.dataset.i; draw(); });
    const p = job.points[pi];
    $('#wt-pn').textContent = `Point ${pi + 1} of ${job.points.length} · ${p.p}`;
    $('#wt-qa').innerHTML = p.qa.map((q) => `<button class="qc"><b>❓ ${q.q}</b><div class="tap">Tap to see the ideal answer</div><div class="ans">✓ ${q.a}</div></button>`).join('');
    $('#wt-qa').querySelectorAll('.qc').forEach((x) => x.onclick = () => x.classList.toggle('open'));
    $('#wt-prev').style.opacity = pi ? 1 : .4; $('#wt-next').textContent = pi < job.points.length - 1 ? 'Next point ›' : '✓ Walkthrough done';
  };
  $('#wt-q').oninput = jobs;
  $('#wt-prev').onclick = () => { if (pi) { pi--; draw(); } };
  $('#wt-next').onclick = () => { if (pi < job.points.length - 1) { pi++; draw(); } else toast('PJSM Walkthrough complete — Form A can continue', '✅'); };
  jobs(); draw(true);
};

/* ================= SOP LEGO ================= */
DEMOS.soplego = function () {
  const SOPS = [['SOP-RU-01', 'Rig Up'], ['SOP-RD-02', 'Rig Down'], ['SOP-BOP-07', 'BOP Pressure Test'], ['SOP-TRP-04', 'Tripping Pipe'], ['SOP-MOV-01', 'Rig Moving'], ['SOP-H2S-03', 'H2S Response']];
  const RIGS = ['ACS-03', 'GW-367', 'BMS-20', 'PDSI-12'];
  const S = { rig: 'ACS-03', sop: 'SOP-BOP-07', am: 'Budi Santoso' };
  const N = ['Compose', 'Validation', 'Acknowledge', 'Compliance'];
  compose();
  function compose() {
    steps(N, 0);
    const title = () => SOPS.find((x) => x[0] === S.sop)[1];
    const b = body(`<div class="row" style="height:100%"><div class="col" style="flex:.85">
        <div class="field"><div class="lbl">Rig</div>${seg('rig', RIGS, S.rig)}</div>
        <div class="field"><div class="lbl">SOP</div>${seg('sop', SOPS.map((x) => x[0]), S.sop)}</div>
        <div class="field"><div class="lbl">Approved by Area Manager</div><input type="text" id="sl-am" value="${S.am}"></div>
        <div class="card" style="font-size:20px;color:#cdd3df;line-height:1.5">💡 Clear the Area Manager name and send, to see how SOP LEGO rejects an incomplete submission.</div></div>
      <div class="col"><div class="compose"><div class="hd">New message</div>
        <div class="ln"><span>To</span><b>SOP LEGO intake mailbox</b></div>
        <div class="ln"><span>Subject</span><b id="sl-subj"></b></div>
        <div class="bd" id="sl-body"></div><div class="att">📄 <span id="sl-att"></span></div></div>
        <div style="display:flex;justify-content:flex-end;margin-top:22px"><button class="big-btn" id="sl-send">Send ›</button></div></div></div>`);
    const upd = () => { S.am = $('#sl-am').value.trim(); $('#sl-subj').textContent = `[SOP LEGO] ${S.rig} | ${S.sop} | ${title()}`;
      $('#sl-body').textContent = `No Dokumen Kontraktor: ${S.sop}-K\nRevisi: 2\nKeterangan: SOP terbaru untuk rig ${S.rig}\nApproved by Area Manager: ${S.am || '<isi nama Area Manager>'}`;
      $('#sl-att').textContent = `${S.sop}_${title().replace(/ /g, '_')}_rev2.pdf · 1.8 MB`; };
    b.querySelectorAll('[data-seg]').forEach((s) => s.querySelectorAll('button').forEach((x) => x.addEventListener('click', () => setTimeout(upd))));
    wireSeg(b, S); $('#sl-am').oninput = upd; upd();
    $('#sl-send').onclick = () => { upd(); validate(); };
  }
  async function validate() {
    steps(N, 1);
    const ok = S.am.length >= 3;
    const P = [['✉', 'Email received', 'from the contractor'], ['🛡', 'Company security scan', 'attachments cleared'], ['🏗', 'Rig recognised', S.rig],
               ['📘', 'SOP on the register', S.sop], ['👤', 'Contractor PIC verified', 'sender matches the rig PIC'], ['📄', 'PDF attached', 'under 10 MB'],
               ['✍', 'Area Manager approval', ok ? S.am : 'missing'], ['🗂', 'Filed in SharePoint', `SOPs / ${S.rig} / ${S.sop}`]];
    body(`<div class="row" style="height:100%"><div class="col"><div class="pipe" id="sl-pipe">${P.map((p) => `<div class="pstep"><i>${p[0]}</i><b>${p[1]}</b><span>${p[2]}</span></div>`).join('')}</div></div>
      <div class="col" style="flex:.8" id="sl-side"></div></div>`);
    const st = document.querySelectorAll('#sl-pipe .pstep');
    for (let i = 0; i < P.length; i++) { await sleep(380); st[i].classList.add('on');
      if (i === 6 && !ok) { st[i].classList.add('bad'); st[i].querySelector('i').textContent = '✕';
        $('#sl-side').innerHTML = `<div class="mail"><div class="subj">[SOP LEGO] Pengajuan ditolak — ${S.sop}</div><div class="from">To: Contractor · ${now()}</div>
          Pengajuan Anda tidak dapat diproses:<ul><li>Baris "Approved by Area Manager" belum diisi</li></ul>Silakan kirim ulang dengan nama Area Manager.</div>
          <button class="big-btn ghost" style="margin-top:22px" id="sl-fix">‹ Fix and resend</button>`;
        $('#sl-fix').onclick = compose; toast('Rejection reply sent to the contractor', '↩️'); return; }
      st[i].classList.add('ok'); st[i].querySelector('i').textContent = '✓'; }
    $('#sl-side').innerHTML = `<div class="mail"><div class="subj">[SOP LEGO] Pengajuan diterima — ${S.sop}</div><div class="from">To: Contractor · ${now()}</div>
      SOP Anda sudah diterima dan dikirim ke Acknowledger untuk direview.</div><button class="big-btn" style="margin-top:22px" id="sl-ack">Open as Acknowledger ›</button>`;
    toast('Sent to the rig Acknowledgers in Teams & Outlook', '📨'); $('#sl-ack').onclick = ack;
  }
  function ack() {
    steps(N, 2);
    body(`<div class="row" style="height:100%;align-items:center"><div class="col teams"><div class="tt">⚡ Approvals · Microsoft Teams</div><h3>SOP LEGO — ${S.sop} · ${S.rig}</h3>
        <div class="kv"><span>Contractor</span><b>Rig contractor</b></div><div class="kv"><span>Area Manager</span><b>${S.am}</b></div>
        <div class="kv"><span>Document</span><b>${S.sop} rev 2 (PDF)</b></div><div class="kv"><span>Received</span><b>${now()}</b></div></div>
      <div class="col" style="flex:.7;display:flex;flex-direction:column;gap:18px"><div style="font-size:24px;color:#cdd3df">You are the <b style="color:#fff">Acknowledger</b>:</div>
        <button class="big-btn green" id="sl-ok">✓ Acknowledge</button><button class="big-btn red" id="sl-no">✕ Reject with remarks</button></div></div>`);
    $('#sl-ok').onclick = () => matrix(true); $('#sl-no').onclick = () => matrix(false);
  }
  function matrix(ok) {
    steps(N, 3);
    const cols = SOPS.map((x) => x[0]);
    const base = { 'ACS-03': 'gpgxgg', 'GW-367': 'ggpgxg', 'BMS-20': 'gxggpg', 'PDSI-12': 'pggxgg' };
    let cells = `<div class="m-h"></div>${cols.map((c) => `<div class="m-h">${c}</div>`).join('')}`;
    RIGS.forEach((r) => { cells += `<div class="m-h" style="text-align:left">${r}</div>`;
      cols.forEach((c, i) => { let k = base[r][i]; const hit = r === S.rig && c === S.sop; if (hit) k = ok ? 'g' : 'x';
        cells += `<div class="m-${k}${hit ? ' m-new' : ''}">${k === 'g' ? '✓ Verified' : k === 'p' ? 'Pending' : 'Missing'}</div>`; }); });
    body(`<div class="lbl">Compliance matrix · rig by rig</div><div class="matrix" style="grid-template-columns:160px repeat(${cols.length},1fr)">${cells}</div>
      <div class="row" style="margin-top:26px"><div class="col mail"><div class="subj">[SOP LEGO] ${ok ? 'Verified' : 'Rejected'} — ${S.sop} · ${S.rig}</div><div class="from">To: Contractor · ${now()}</div>
        ${ok ? 'SOP Anda sudah di-acknowledge dan tercatat sebagai Verified.' : 'SOP Anda ditolak. Remarks: revisi prosedur langkah 4.'}</div>
        <div style="display:flex;align-items:center;gap:16px"><button class="big-btn" onclick="DEMOS.soplego()">Submit another</button></div></div>`);
    toast(ok ? `<b>${S.sop}</b> verified for ${S.rig}` : 'Contractor notified with remarks', ok ? '✅' : '✕');
  }
};

/* ---------- attract mode: after idle, loop the films full screen ---------- */
const IDLE_MS = 7e9;   // web copy: no attract loop let idleT = null, attIdx = 0;
const REEL = ['media/films/00 Booth Loop.mp4'];   // the whole TV1 loop, one continuous film
function startAttract() { const a = $('#attract'), v = $('#attvid'); a.style.display = 'block'; $('#appvid').pause();
  const next = () => { v.src = REEL[attIdx % REEL.length]; attIdx++; v.play().catch(() => {}); }; v.onended = next; v.onerror = next; next(); }
function stopAttract() { const a = $('#attract'); if (a.style.display === 'block') { a.style.display = 'none'; $('#attvid').pause(); show('home'); } }
function poke() { return; clearTimeout(idleT); idleT = setTimeout(startAttract, IDLE_MS); }
['pointerdown', 'keydown', 'touchstart'].forEach((e) => addEventListener(e, () => { stopAttract(); poke(); }, { capture: true }));
/* ---------- contact: "Want this for your company?" (phones) ---------- */
const CONTACT = { name: 'Fadel Thariq Gifari', title: 'Performance Engineer · DWI Digital, Pertamina Hulu Rokan', tel: '+6281378481090',
  wa: '6281378481090', email: 'mk.fadel.gifari@mitrakerja.pertamina.com', linkedin: 'https://linkedin.com/in/fadelg' };
const WA_TEXT = encodeURIComponent('Halo Pak Fadel, saya tertarik dengan aplikasi DWI Digital (dari booth).');
const MAIL = `mailto:${CONTACT.email}?subject=${encodeURIComponent('DWI Digital apps - follow-up from the booth')}`;
const cbtns = () => `<div class="cbtns"><a class="cb wa" href="https://wa.me/${CONTACT.wa}?text=${WA_TEXT}" target="_blank" rel="noopener">💬 WhatsApp</a>
  <a class="cb" href="tel:${CONTACT.tel}">📞 Call</a><a class="cb" href="${MAIL}">✉️ Email</a></div>`;
function contactFooter() {
  return el(`<div class="cfoot"><b>Want this for your company?</b><span>Talk to <strong>${CONTACT.name}</strong><br>${CONTACT.title}</span>${cbtns()}
    <div class="cmore"><a href="${CONTACT.linkedin}" target="_blank" rel="noopener">LinkedIn</a> · <a href="media/contact/fadel.vcf" download="Fadel Thariq Gifari.vcf">Save contact</a></div></div>`);
}
$('#v-home').appendChild(contactFooter());
$('#v-app').appendChild(contactFooter());
$('#v-demo').appendChild(el(`<div class="dbar"><b>Want this for your company?</b>${cbtns()}</div>`));
/* ---------- JoRUN AI live: on the booth laptop (Start TV2.command runs JoRUN on :5050), "Try it" opens the real app ---------- */
const JORUN_URL = 'http://127.0.0.1:5050/';
DEMOS.jorun = function () {
  steps(['JoRUN AI · live'], 0);
  document.querySelector('.demo-tag').textContent = 'LIVE APP';
  body(`<iframe src="${JORUN_URL}" style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:0 0 30px 30px;background:#fff" allow="camera; microphone; clipboard-write"></iframe>`);
};
if (!MOBILE && (location.protocol === 'file:' || /^(localhost|127\.0\.0\.1)$/.test(location.hostname))) {
  fetch(JORUN_URL + 'health', { mode: 'no-cors', cache: 'no-store' }).then(() => {
    const j = APPS.find((a) => a.id === 'jorun'); j.demo = 'jorun'; j.tryText = 'Try it: ask JoRUN AI live';
  }).catch(() => {});
}
/* phones / public site: JoRUN runs on the booth laptop and is shared through ngrok while Start TV2 is running.
   The button only lights up when that link answers; Stop TV2 takes it offline again. */
const JORUN_PUBLIC = 'https://crank-saggy-retainer.ngrok-free.dev/';   // fixed ngrok dev domain; live only while Start TV2 runs
const JORUN_WEB = 'jorun/';   // JoRUN's screens hosted next to this page; they talk to JORUN_PUBLIC with ngrok's skip header (no warning page)
function checkPublicJorun() {
  if (!JORUN_PUBLIC || !MOBILE) return;
  const j = APPS.find((a) => a.id === 'jorun');
  fetch(JORUN_PUBLIC + 'health', { headers: { 'ngrok-skip-browser-warning': '1' }, cache: 'no-store' })
    .then((r) => r.json()).then((d) => { const up = d && d.status === 'ok';
      j.link = up ? JORUN_WEB : null; j.tryText = up ? 'Try it: ask JoRUN AI live ↗' : 'Live demo at the booth — ask us';
      if (cur === j && $('#v-app').classList.contains('on')) { const tr = $('#a-try'); tr.textContent = j.tryText; tr.className = 'try' + (up ? '' : ' disabled');
        tr.onclick = up ? () => window.open(j.link, '_blank', 'noopener') : null; } })
    .catch(() => { j.link = null; });
}
checkPublicJorun(); setInterval(checkPublicJorun, 60000);
home(); poke();
