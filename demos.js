/* App-faithful demos (override kiosk.js DEMOS). Dummy data only; nothing leaves this laptop. */
const W = (url, inner) => `<div class="win"><div class="chrome"><i></i><i></i><i></i><div class="url">${url}</div></div><div class="wbody">${inner}</div></div>`;
const cap = (t) => `<div class="cap">${t}</div>`;
const appBody = (h) => { const b = body(h); b.classList.add('app-mode'); return b; };
const fopt = (name, opts, val) => opts.map((o) => `<div class="fopt ${o === val ? 'on' : ''}" data-n="${name}" data-v="${o}"><span class="rb"></span>${o}</div>`).join('');
const wireF = (root, S) => root.querySelectorAll('.fopt').forEach((o) => o.onclick = () => {
  root.querySelectorAll(`.fopt[data-n="${o.dataset.n}"]`).forEach((x) => x.classList.remove('on')); o.classList.add('on'); S[o.dataset.n] = o.dataset.v; });
const sid = () => Math.floor(Date.now() / 1000).toString().slice(-6);

/* ============ T-CARD: Microsoft Forms → Power Automate → Outlook → Microsoft Lists (CrewChangeLog) ============ */
DEMOS.tcard = function () {
  const S = { rig: 'ACS-03', shift: 'Pagi (06:00)', absent: 'Andi Pratama', apos: 'Floorman', reason: 'Cuti Tahunan', rname: 'Rudi Hartono', rpos: 'Floorman',
              ccpm: 'Hijau', med: 'Fit', sse: 'Tidak', ffd: 'Tidak', badge: 'Masih berlaku', pkwt: 'Ya', days: '12', ot: '0', log: [] };
  const N = ['Microsoft Forms', 'Power Automate', 'Outlook', 'Microsoft Lists'];
  form();
  function form() {
    steps(N, 0);
    const q = (n, t, inner) => `<div class="fq"><div class="t"><em>${n}.</em>${t} <i>*</i></div>${inner}</div>`;
    const tx = (k) => `<input class="fi" data-k="${k}" value="${S[k]}">`;
    const b = appBody(W('forms.office.com · T-CARD — Crew Change Request', `<div class="forms"><div class="fcard"><div class="fban"></div>
      <div class="ftitle"><h1>T-CARD — Crew Change Request</h1><p>Temporary Crew-change Automated Review &amp; Decision · PHR DWI WOWI Operations</p></div>
      ${q(1, 'Rig Name', tx('rig'))}${q(2, 'Shift', fopt('shift', ['Pagi (06:00)', 'Malam (18:00)'], S.shift))}
      ${q(3, 'Absent Crew Name', tx('absent'))}${q(4, 'Absent Position', tx('apos'))}
      ${q(5, 'Absence Reason', fopt('reason', ['Cuti Tahunan', 'Sakit', 'Istri melahirkan'], S.reason))}
      ${q(6, 'Replacement Name', tx('rname'))}${q(7, 'Replacement Position', tx('rpos'))}
      ${q(8, 'CCPM Status', fopt('ccpm', ['Hijau', 'Kuning', 'Merah'], S.ccpm))}${q(9, 'Medical Status', fopt('med', ['Fit', 'Unfit'], S.med))}
      ${q(10, 'SSE', fopt('sse', ['Tidak', 'Ya'], S.sse))}${q(11, 'FFD Restricted', fopt('ffd', ['Tidak', 'Ya'], S.ffd))}
      ${q(12, 'Badge Expiry', fopt('badge', ['Masih berlaku', 'Sudah expired'], S.badge))}${q(13, 'PKWT Active', fopt('pkwt', ['Ya', 'Tidak'], S.pkwt))}
      ${q(14, 'Days Worked', tx('days'))}${q(15, 'OT Days Used', tx('ot'))}
      ${q(16, 'Doc_Link (folder evidence)', `<input class="fi" value="https://…/evidence/ACS-03_RudiH" disabled>`)}
      <button class="fsub" id="tc-sub">Submit</button></div></div>`) + cap('💡 Try <b>CCPM: Merah</b> or <b>Medical: Unfit</b> to see a NO-GO'));
    wireF(b, S);
    b.querySelectorAll('input.fi[data-k]').forEach((i) => i.oninput = () => { S[i.dataset.k] = i.value; });
    $('#tc-sub').onclick = async () => {
      S.id = S.rig.replace(/\s/g, '') + '-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + sid(); S.t0 = Date.now(); S_T0 = S.t0; S.cum = 0;
      S.log = [['Submitted (Microsoft Forms)', at(0)]];
      $('.fcard').innerHTML = `<div class="fban"></div><div class="fthanks"><div class="ok">✓</div><h2>Thanks!</h2><p style="color:#605e5c;font-size:17px">Your response was submitted.</p></div>`;
      toast('<b>[T-CARD] Submission received</b><br>confirmation email to the Contractor PIC');
      await sleep(1400); flow();
    };
  }
  async function flow() {
    steps(N, 1);
    const d = +S.days || 0, ot = +S.ot || 0;
    const C = [['CCPM Status', S.ccpm !== 'Merah', S.ccpm], ['Medical Status', S.med === 'Fit', S.med], ['SSE (replacement)', S.sse === 'Tidak', S.sse],
               ['FFD Restricted', S.ffd === 'Tidak', S.ffd], ['Badge Expiry', S.badge === 'Masih berlaku', S.badge], ['PKWT Active', S.pkwt === 'Ya', S.pkwt],
               ['Days Worked (limit 14)', d <= 14, d], ['OT Days Used (limit 3)', ot <= 3, ot]];
    const fails = C.filter((c) => !c[1]); const go = !fails.length;
    const act = (id, ico, t, sub, ac, inner = '') => `<div class="act" id="${id}" style="--ac:${ac}"><div class="ah"><span class="ico">${ico}</span>${t}<small>${sub}</small><span class="st">•</span></div>${inner ? `<div class="ab">${inner}</div>` : ''}</div>`;
    appBody(W('make.powerautomate.com · T-CARD — Crew Change Intake · Run history', `<div class="pa"><div class="pbar">⚡ T-CARD — Crew Change Intake <span>· Run ${new Date().toLocaleString('en-GB')}</span></div>
      <div class="run"><div class="lane">
        ${act('a1', 'F', 'When a new response is submitted', 'Microsoft Forms', '#03787c')}<div class="arrow"></div>
        ${act('a2', 'F', 'Get response details', '41 fields', '#03787c')}<div class="arrow"></div>
        ${act('a3', '⚙', 'Check GO / NOGO criteria', 'CONFIG Excel', '#0f6cbd', C.map((c) => `<div class="kv"><span>${c[0]}</span><b class="${c[1] ? 'g' : 'r'}">${c[2]} · ${c[1] ? 'OK' : 'NOGO'}</b></div>`).join(''))}<div class="arrow"></div>
        ${act('a4', '◇', 'Condition: GO?', go ? 'true' : 'false', '#5c2d91')}<div class="arrow"></div>
        <div class="branch"><div class="yes"><div class="bh">If yes</div>${act('y1', 'L', 'Create item — CrewChangeLog', 'SharePoint', '#036c70')}${act('y2', '✉', 'Send email to WSR (on duty)', 'Office 365 Outlook', '#0f6cbd')}</div>
          <div class="no"><div class="bh">If no</div>${act('n1', 'L', 'Create item — Final Status: NOGO', 'SharePoint', '#036c70')}${act('n2', '✉', 'Send NOGO email to Contractor PIC', 'Office 365 Outlook', '#0f6cbd')}</div></div>
      </div></div></div>`) + cap('This is the real engine: <b>Power Automate</b> checks every rule in seconds'));
    const mark = async (id, ok = true, open = false) => { const a = $('#' + id); a.classList.add('on', ok ? 'ok' : 'no'); a.querySelector('.st').textContent = ok ? '✓' : '✕'; if (open) a.classList.add('open'); a.scrollIntoView({ block: 'center', behavior: 'smooth' }); await sleep(560); };
    await sleep(400); await mark('a1'); await mark('a2'); await mark('a3', true, true); await sleep(900); await mark('a4');
    if (go) { await mark('y1'); await mark('y2'); S.log.push(['Auto-check: GO', at(0.002)]); S.stage = 'WSR Review'; toast('<b>[T-CARD] Crew Change Review — WSR</b><br>sent to the WSR on duty'); await sleep(1200); outlook(0); }
    else { await mark('n1', true); await mark('n2', true); S.log.push(['Auto-check: NOGO (' + fails.map((f) => f[0]).join(', ') + ')', at(0.002)]); S.final = 'NOGO';
      toast('NOGO email sent to the Contractor PIC with the reasons', '↩️'); await sleep(1300); nogoMail(fails); }
  }
  function nogoMail(fails) {
    steps(N, 2);
    appBody(W('outlook.office.com · Inbox — Contractor PIC', `<div class="ow"><div class="ohd">Outlook <div class="srch"></div></div><div class="grid">
      <div class="fold"><div class="on">Inbox</div><div>Sent Items</div><div>Drafts</div></div>
      <div class="ml"><div class="mi on unread"><b>T-CARD Notifications</b><span>[T-CARD] NOGO — ${S.id}</span></div><div class="mi"><b>T-CARD Notifications</b><span>[T-CARD] Submission received</span></div></div>
      <div class="rp"><h2>[T-CARD] NOGO — ${S.rig} · ${S.rname}</h2><div class="snd"><div class="av">T</div><div><b>T-CARD Notifications</b><span>To: Contractor PIC · ${at(0.003)}</span></div></div>
        Your crew change request did not pass the automatic check and was not sent for approval:
        <table class="det">${fails.map((f) => `<tr><td>${f[0]}</td><td style="color:#a4262c;font-weight:600">${f[2]} — NOGO</td></tr>`).join('')}</table>
        Please fix the items above and submit a new request.<br><br><span class="obtn p" id="tc-fix">Fix and submit again</span></div></div></div>`));
    $('#tc-fix').onclick = form;
  }
  function outlook(k) {
    steps(N, 2);
    const A = [['WSR', 'CoRep', 1, .6], ['Asst. Manager', 'AsstMgr', 3, 1.9], ['Manager', 'Manager', 5, 2.5]]; const a = A[k];
    appBody(W(`outlook.office.com · Inbox — ${a[0]} on duty`, `<div class="ow"><div class="ohd">Outlook <div class="srch"></div></div><div class="grid">
      <div class="fold"><div class="on">Inbox</div><div>Sent Items</div><div>Archive</div></div>
      <div class="ml"><div class="mi on unread"><b>T-CARD Notifications</b><span>[T-CARD] Crew Change Review — ${a[0]}</span></div><div class="mi"><b>DWI Engineering</b><span>Weekly ops review</span></div><div class="mi"><b>HSE</b><span>Safety bulletin</span></div></div>
      <div class="rp"><h2>[T-CARD] Crew Change Review — ${a[0]}</h2><div class="snd"><div class="av">T</div><div><b>T-CARD Notifications</b><span>To: ${a[0]} on duty · ${at(S.cum + 0.01)}</span></div></div>
        A crew change request passed the automatic GO check and needs your review.
        <table class="det"><tr><td>Submission ID</td><td>${S.id}</td></tr><tr><td>Rig Name</td><td>${S.rig} · ${S.shift}</td></tr><tr><td>Absent Crew</td><td>${S.absent} — ${S.apos} (${S.reason})</td></tr>
          <tr><td>Replacement</td><td>${S.rname} — ${S.rpos}</td></tr><tr><td>CCPM / Medical</td><td>${S.ccpm} / ${S.med}</td></tr><tr><td>Days Worked / OT Days</td><td>${S.days} / ${S.ot}</td></tr>
          ${k ? `<tr><td>Previous approval</td><td>${A[k - 1][0]}: Approved</td></tr>` : ''}</table>
        <span class="obtn">View Submission in SharePoint</span><br><br><span class="obtn g" id="tc-ap">Approve</span><span class="obtn r" id="tc-rj">Reject</span>
        <div style="margin-top:16px;font-size:14px;color:#8a6100;background:#fff4ce;padding:8px 12px;border-radius:4px;display:inline-block">⏱ SLA ${a[2]} hour${a[2] > 1 ? 's' : ''} — a reminder is sent if this isn't actioned</div></div></div></div>`)
      + cap(`You are the <b>${a[0]}</b> — approve or reject`));
    $('#tc-ap').onclick = () => { S.cum += a[3]; S.log.push([`${a[0]} approved (${a[3]} h)`, at(S.cum)]); S[a[1]] = 'Approve';
      if (k < 2) { toast(`<b>[T-CARD] Crew Change Review — ${A[k + 1][0]}</b><br>Contractor PIC notified of progress`); outlook(k + 1); } else { S.final = 'Approved'; list(); } };
    $('#tc-rj').onclick = () => { S.cum += a[3]; S.log.push([`${a[0]} rejected`, at(S.cum)]); S[a[1]] = 'Reject'; S.final = 'Rejected'; list(); };
  }
  function list() {
    steps(N, 3);
    const P = (v) => v === 'Approve' || v === 'Approved' || v === 'GO' ? 'p-g' : v === 'Reject' || v === 'Rejected' || v === 'NOGO' ? 'p-r' : 'p-y';
    const rows = [[S.rig + '-' + S.rname, S.id, S.rig, S.shift, S.absent, S.apos, S.rname, S.ccpm, S.CoRep || '—', S.AsstMgr || '—', S.Manager || '—', S.final, S.cum.toFixed(1), true],
      ['BMS-20-Agus Salim', 'BMS-20-20261014112', 'BMS-20', 'Malam (18:00)', 'Hendra W.', 'Derrickman', 'Agus Salim', 'Hijau', 'Approve', 'Approve', 'Approve', 'Approved', '4.6'],
      ['GW-367-Joko Susanto', 'GW-367-20261014098', 'GW-367', 'Pagi (06:00)', 'Dedi S.', 'Floorman', 'Joko Susanto', 'Merah', '—', '—', '—', 'NOGO', '0.0'],
      ['PDSI-12-Fajar N.', 'PDSI-12-20261013077', 'PDSI-12', 'Pagi (06:00)', 'Yusuf R.', 'Roustabout', 'Fajar N.', 'Hijau', 'Approve', 'Approve', 'Pending', 'Pending', '3.1'],
      ['ACS-11-Rahmat H.', 'ACS-11-20261013051', 'ACS-11', 'Malam (18:00)', 'Bayu P.', 'HE Operator', 'Rahmat H.', 'Kuning', 'Approve', 'Approve', 'Approve', 'Approved', '6.2']];
    const H = ['Judul', 'Submission ID', 'Rig Name', 'Shift', 'Absent Crew Name', 'Absent Position', 'Replacement Name', 'CCPM Status', 'CoRep Action', 'AsstMgr Action', 'Manager Action', 'Final Status', 'Total Elapsed Hrs'];
    appBody(W('Microsoft Lists · Tracking Crew Change WOWI Ops · CrewChangeLog', `<div class="ls"><div class="lhd">Microsoft Lists<div class="srch"></div></div>
      <div class="lcmd"><span>✎ Edit in grid view</span><span>↗ Share</span><span>🔗 Copy link</span><span>⤓ Export</span><span>⚡ Automate</span></div>
      <div class="ltitle"><div class="ico">☰</div><div><small>Tracking Crew Change WOWI Ops</small><b>CrewChangeLog</b></div>
        <div class="views"><span class="on">All Items</span><span>Drilling</span><span>Pending - Asst. Manager Review</span><span>Pending - Manager Review</span></div></div>
      <div class="tbl"><table><tr>${H.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr class="${r[13] ? 'new' : ''}">${r.slice(0, 13).map((c, i) => `<td>${i >= 8 && i <= 11 ? `<span class="pill ${P(c)}">${c}</span>` : c}</td>`).join('')}</tr>`).join('')}</table>
        <div style="padding:20px 14px;font-size:15px;color:#323130"><b>Audit trail · ${S.id}</b><br>${S.log.map((l) => `${l[1]} — ${l[0]}`).join('<br>')}</div></div></div>`)
      + cap('Every decision lands in <b>CrewChangeLog</b> — <span style="color:#fff">dummy rows for the demo</span>'));
    toast(S.final === 'Approved' ? '<b>[T-CARD] Approved</b> — final email to the Contractor PIC' : '<b>[T-CARD] Rejected</b> — PIC notified with remarks', S.final === 'Approved' ? '✅' : '✕');
    setTimeout(() => { if ($('.ls')) $('.cap').innerHTML = '<span id="tc-again" style="cursor:pointer">↺ Tap here to submit another request</span>'; const a = $('#tc-again'); if (a) a.onclick = () => DEMOS.tcard(); }, 3500);
  }
};

/* ============ PROTECT: OneApp mobile (CRSSC) + web dashboard ============ */
DEMOS.protect = function () {
  const ROLES = [['Derrickman', '🧗'], ['Driller', '👷'], ['Floorman', '🔧'], ['HES Field', '⛑️'], ['Mechanic', '⚙️'], ['Toolpusher', '🧑‍✈️'], ['Truckpusher', '🚛']];
  const ITEMS = [['ACCUMULATOR', 'Pressure Switch', 'Pastikan switch dalam posisi Auto, bleed pressure sampai 2700 psi, pompa hidup dan 3000 psi pompa mati'],
                 ['ACCUMULATOR', 'Drawdown Test', 'Lakukan sesuai RSP well control'], ['BOP', 'Annular Preventer', 'Function test, catat closing time'],
                 ['DRAWWORK', 'Brake Band', 'Brake band & linkage tidak aus, pin terkunci'], ['DRILLING LINE', 'Dead Line Anchor', 'Clamp terpasang, tidak ada kawat putus']];
  const S = { role: 'Toolpusher', rig: 'ACS-03', step: 1, i: 0, marks: {}, photos: {} };
  const N = ['OneApp · Role & rig', 'OneApp · Checklist', 'Dashboard'];
  const frame = (inner, nav = 'Checklist') => `<div class="phone"><div class="scr"><div class="sbar"><span>12:03</span><span>📶 90%</span></div>
    <div class="ahd">P.R.O.T.E.C.T<div class="sp"></div><div class="sy">⟳</div><div class="me"></div></div><div class="pc" id="pc">${inner}</div>
    <div class="nav">${[['⌂', 'Home'], ['🛡', 'Checklist'], ['📅', '7 Days'], ['⚙', 'Equipment'], ['👤', 'Profile']].map((n) => `<div class="${n[1] === nav ? 'on' : ''}"><i>${n[0]}</i>${n[1]}</div>`).join('')}</div></div></div>`;
  const stepper = (k) => `<div class="ostep">${[1, 2, 3, 4].map((n) => `<span class="${n < k ? 'dn' : n === k ? 'on' : ''}">${n < k ? '✓' : n}</span>${n < 4 ? `<hr class="${n < k ? 'dn' : ''}">` : ''}`).join('')}</div><div class="olabels"><span>Role</span><span>Rig</span><span>Freq</span><span>Checklist</span></div>`;
  const side = (h) => `<div style="color:#cdd3df;font-size:24px;line-height:1.5;padding:20px">${h}</div>`;
  role();
  function role() {
    steps(N, 0);
    const b = appBody(`<div class="prow"><div>${frame(`<div style="font-weight:700;font-size:20px">CRSSC</div><div class="s" style="font-size:12.5px;color:#6b7280">Comprehensive Rig Safety Safeguard Checklist</div>
      <div class="ocard" style="margin-top:12px"><h4>Mulai Checklist Baru</h4><div class="s">Pilih role, tipe rig, dan frekuensi inspeksi</div>${stepper(1)}
        <div style="font-size:13px;font-weight:700;margin-top:6px">👷 Select Your Role (PIC)</div>
        <div class="ogrid">${ROLES.map((r) => `<div class="orole ${r[0] === S.role ? 'on' : ''}" data-r="${r[0]}"><i>${r[1]}</i>${r[0]}</div>`).join('')}</div>
        <button class="obtn" id="pr-n1">NEXT →</button></div>`)}</div>
      <div>${side('<b style="color:#fff;font-size:34px">OneApp · PROTECT</b><br>This is the real field app on the crew\'s phone.<br><br>① Pick your role<br>② Pick the rig<br>③ Check each safeguard with a photo<br><br><span style="color:#8b93a7">Works with no signal — syncs when back online.</span>')}</div></div>`);
    b.querySelectorAll('.orole').forEach((r) => r.onclick = () => { b.querySelectorAll('.orole').forEach((x) => x.classList.remove('on')); r.classList.add('on'); S.role = r.dataset.r; });
    $('#pr-n1').onclick = rig;
  }
  function rig() {
    const b = appBody(`<div class="prow"><div>${frame(`<div style="font-weight:700;font-size:20px">CRSSC</div><div class="s" style="font-size:12.5px;color:#6b7280">Comprehensive Rig Safety Safeguard Checklist</div>
      <div class="ocard" style="margin-top:12px"><h4>Mulai Checklist Baru</h4><div class="s">Pilih role, tipe rig, dan frekuensi inspeksi</div>${stepper(2)}
        <div class="ook">✓ Role: ${S.role}</div><div style="font-size:13px;font-weight:700;margin-top:12px">🏗 Select Rig</div><div class="s">Pilih nama rig yang akan diinspeksi</div>
        <div id="pr-rigs">${['ACS-03', 'GW-367', 'BMS-20', 'PDSI-12'].map((r) => `<div class="oin" data-g="${r}" style="${r === S.rig ? 'border-color:#1e3a6e' : ''}"><span>${r}</span><span>${r === S.rig ? '✓' : '🔍'}</span></div>`).join('')}</div>
        <div class="ook" style="background:#eff6ff;border-color:#bfdbfe;color:#1e3a6e">✓ Rig Type: WPF Conventional</div>
        <div style="display:grid;grid-template-columns:1fr 2fr;gap:8px"><button class="obtn ghost" id="pr-b">← Back</button><button class="obtn" id="pr-n2">START CHECKLIST →</button></div></div>`)}</div>
      <div>${side('Tap a rig, then start the checklist.')}</div></div>`);
    b.querySelectorAll('[data-g]').forEach((r) => r.onclick = () => { S.rig = r.dataset.g; rig(); });
    $('#pr-b').onclick = role; $('#pr-n2').onclick = () => { S.i = 0; S.marks = {}; S.photos = {}; item(); };
  }
  function item() {
    steps(N, 1);
    const it = ITEMS[S.i], m = S.marks[S.i], done = Object.keys(S.marks).length;
    const b = appBody(`<div class="prow"><div>${frame(`<div class="orig"><small>ASSIGNED RIG</small><b>${S.rig}</b><div class="pr">WPF Conventional · Tour Progress — ${S.role} · ${done}/${ITEMS.length}</div></div>
      <div class="ocat">◆ ${it[0]} <span style="float:right;color:#6b7280;font-weight:600">${S.i + 1}/${ITEMS.length}</span></div>
      <div class="ocard"><h4>${it[1]}</h4><div class="oguide">📌 <b>Inspection Guideline:</b> ${it[2]}</div>
        <div style="font-size:11px;font-weight:800;color:#6b7280;letter-spacing:.08em;margin-top:10px">PHOTO EVIDENCE · OPTIONAL</div>
        <div class="ophoto ${S.photos[S.i] ? 'has' : ''}" id="pr-ph">${S.photos[S.i] ? '📷 IMG_' + (2041 + S.i) + '.jpg · ' + at(0, Date.now()) : '📷<br>Add Photo Evidence<br><span style="font-size:11px">Take a photo or upload from gallery</span>'}</div>
        <div style="font-size:11px;font-weight:800;color:#6b7280;letter-spacing:.08em;margin-top:10px">READINESS STATUS</div>
        <div class="orb"><button class="r ${m === 'r' ? 'on' : ''}" id="pr-r">✓ Ready to Operate</button><button class="n ${m === 'n' ? 'on' : ''}" id="pr-x">✕ Not Ready</button></div>
        ${m === 'n' ? '<div class="owarn">⚠ This equipment will be flagged as NOT READY TO OPERATE. A notification is sent to the Well Site Representative (WSR) for immediate maintenance action.</div>' : ''}</div>
      <div class="osub"><button class="obtn" id="pr-next" style="${m ? '' : 'opacity:.45'}">${S.i < ITEMS.length - 1 ? 'NEXT ITEM →' : 'SUBMIT CRSSC REPORT'}</button></div>`)}</div>
      <div>${side(`<b style="color:#fff">${it[1]}</b><br>Read the guideline, add a photo, then mark it <span style="color:#4ade80">Ready</span> or <span style="color:#f87171">Not Ready</span>.<br><br><span style="color:#8b93a7">Item ${S.i + 1} of ${ITEMS.length}</span>`)}</div></div>`);
    $('#pr-ph').onclick = () => { flash(); S.photos[S.i] = true; item(); };
    $('#pr-r').onclick = () => { S.marks[S.i] = 'r'; item(); };
    $('#pr-x').onclick = () => { S.marks[S.i] = 'n'; toast(`<b>${it[1]}</b> NOT READY<br>WSR notified for immediate action`, '⚠️'); item(); };
    $('#pr-next').onclick = () => { if (!m) return toast('Mark Ready or Not Ready first', '☝️'); if (S.i < ITEMS.length - 1) { S.i++; item(); } else home(); };
  }
  function home() {
    steps(N, 2);
    const not = ITEMS.filter((_, i) => S.marks[i] === 'n'), ready = ITEMS.length - not.length, pct = Math.round(ready / ITEMS.length * 100);
    const roles = ROLES.map((r, i) => [r[0], r[0] === S.role ? 100 : [0, 85, 100, 60, 40, 0, 20][i]]);
    appBody(`<div class="prow"><div>${frame(`<div style="font-size:12.5px;color:#6b7280">Good Afternoon,</div><div style="font-weight:700;font-size:18px">Crew ${S.role}</div>
      <div class="ostats"><div><b>${11}</b><span>Submitted</span></div><div><b>0</b><span>Offline</span></div><div><b style="color:#dc2626">${not.length}</b><span>Not Ready</span></div></div>
      ${not.length ? `<div class="oalert"><b>⚠ RIG NOT READY TO OPERATE</b>${not.map((n) => n[1]).join(', ')} — awaiting SWA resolution</div>` : '<div class="ook">✓ All checked items ready to operate</div>'}
      <div style="font-size:11px;font-weight:800;color:#6b7280;letter-spacing:.08em;margin:12px 0 4px">ROLE COMPLETION — TODAY</div>
      ${roles.map((r) => `<div class="orc ${r[1] === 100 ? 'full' : ''}"><span>•</span><div><div style="font-size:13px">${r[0]}</div><div class="bar"><i style="width:${r[1]}%"></i></div></div><em>${r[1]}%</em></div>`).join('')}`, 'Home')}</div>
      <div class="dash"><div class="dh"><div><b>P.R.O.T.E.C.T DASHBOARD</b><br><small>COMPLIANCE TRACKER · v6.0</small></div><div style="margin-left:auto;font-size:13px;color:#6b7280">Synced just now · ${S.rig}</div></div>
        <div class="kp"><div><b>14</b><span>Active rigs</span></div><div><b>7</b><span>Roles monitored</span></div><div><b>${pct}%</b><span>${S.rig} readiness</span></div><div><b>${301 + Object.keys(S.photos).length}</b><span>Evidence photos</span></div></div>
        <div class="sec"><h5>${not.length ? 'AWAITING SWA RESOLUTION' : 'STATUS'} · ${S.rig}</h5>${not.length ? not.map((n) => `<div class="swa"><b>Not Ready:</b> ${n[0]} — ${n[1]} · flagged by ${S.role} · ${at(0, Date.now())}</div>`).join('') : '<div style="font-size:14px">No open SWA — rig ready to operate.</div>'}</div>
        <div class="sec"><h5>${S.role.toUpperCase()} EVIDENCE GALLERY</h5><div class="gal">${ITEMS.map((x, i) => S.photos[i] ? `<div>${x[1]}</div>` : '').join('') || '<span style="font-size:14px;color:#6b7280">No photos in this demo run — tap “Add Photo Evidence” next time</span>'}</div></div>
        <div style="position:absolute;right:22px;bottom:20px"><button class="big-btn" onclick="DEMOS.protect()" style="height:70px;font-size:24px">↺ Run another check</button></div></div></div>`);
    toast('Report synced · live on the web dashboard', '📡');
  }
};

/* ============ QSERRA Mobile (landscape): Form A · PJSM Walkthrough ============ */
DEMOS.walkthrough = function () {
  steps(['QSERRA Mobile · Form A'], 0);
  const J = (window.QSERRA_JOBS || []).filter((j) => j.points.length);
  let job = null, pi = 0, maxp = 0;
  const shell = (stepOn, inner, foot) => `<div class="qs"><div class="qside"><div class="br"><img src="media/logos/qserra.png"><div><b>QSERRA</b><small>PJSM &amp; Work Supervision</small></div></div>
      <div class="mi">⌂ Beranda</div><div class="mi on">⊕ Pekerjaan Baru</div><div class="mi">▤ PJSM Walkthrough</div></div>
    <div class="qmain"><div class="qhd"><div><h1>Form A · Pre-Work Activity Supervision</h1><p>Lengkapi sebelum pekerjaan dimulai (setelah One SIKA terbit) — submit membuat Job ID</p></div><div class="rf">⟳ Refresh</div></div>
      <div class="qst">${['Informasi Pekerjaan', 'PJSM Walkthrough', '3 Pilar', 'Crew', 'Service Company', 'Checklist', 'Plan Time &amp; Submit'].map((s, i) => `<span class="${i === stepOn ? 'on' : i < stepOn ? 'dn' : ''}"><i>${i < stepOn ? '✓' : i + 1}</i>${s}</span>`).join('')}</div>
      ${inner}<div class="qft">${foot}</div></div></div>`;
  pick();
  function pick() {
    const b = appBody(shell(0, `<div class="qpanel" style="grid-template-columns:1fr"><div class="qpl" style="border:0"><div class="qfield"><label>Jenis pekerjaan (Library panduan) *</label>
        <div class="qdd"><span>${job ? job.code + '   ' + job.title : 'Pilih jenis pekerjaan…'}</span><span>⌄</span></div></div>
        <div class="qjobs" style="columns:2;column-gap:20px">${J.map((j) => `<button class="qjob ${job === j ? 'on' : ''}" data-c="${j.code}">${j.code}&nbsp;&nbsp;&nbsp;${j.title}</button>`).join('')}</div></div></div>`,
      `<span></span><button class="qbtn" id="qs-n">Berikutnya ›</button>`));
    b.querySelectorAll('.qjob').forEach((x) => x.onclick = () => { job = J.find((j) => j.code === x.dataset.c); pick(); });
    $('#qs-n').onclick = () => { if (!job) return toast('Pilih jenis pekerjaan dulu — PJSM Walkthrough mengikuti jenis pekerjaan.', '☝️'); pi = 0; maxp = 0; walk(); };
  }
  function walk() {
    const p = job.points[pi], last = pi === job.points.length - 1;
    appBody(shell(1, `<div class="qpanel"><div class="qpl"><div class="qcap">PJSM WALKTHROUGH · ${job.title}</div>
        ${job.points.map((x, i) => `<button class="qpt ${i === pi ? 'on' : i <= maxp && i !== pi ? 'dn' : ''}" data-i="${i}" ${i > maxp ? 'disabled style="opacity:.55"' : ''}><i>${i < pi || (i <= maxp && i !== pi) ? '✓' : i + 1}</i><div>${x.p}<small>${x.qa.length} pertanyaan</small></div></button>`).join('')}</div>
      <div class="qpr"><h2>Poin ${pi + 1} dari ${job.points.length} · ${p.p}</h2><div class="hint">Bacakan pertanyaan kepada crew dan pastikan jawabannya sesuai jawaban ideal. Tidak ada isian — tekan Poin berikutnya setelah selesai.</div>
        ${p.qa.map((q) => `<div class="qq"><b>❓ ${q.q}</b><div class="ja">✓ Jawaban ideal: ${q.a}</div></div>`).join('')}</div></div>`,
      `<button class="qbtn g" id="qs-p">‹ Sebelumnya</button><button class="qbtn" id="qs-n">${last ? '✓  Selesai walkthrough  ›' : 'Poin berikutnya  ›'}</button>`));
    document.querySelectorAll('.qpt').forEach((x) => x.onclick = () => { const i = +x.dataset.i; if (i <= maxp) { pi = i; walk(); } });
    $('#qs-p').onclick = () => { if (pi) { pi--; walk(); } else pick(); };
    $('#qs-n').onclick = () => { if (!last) { pi++; maxp = Math.max(maxp, pi); walk(); } else { toast('PJSM Walkthrough selesai — lanjut ke 3 Pilar', '✅'); setTimeout(pick, 1600); } };
  }
};

/* ============ SOP LEGO: Outlook → Power Automate → Teams Approvals → SOP LEGO Hub ============ */
DEMOS.soplego = function () {
  const J = (window.QSERRA_JOBS || []).filter((j) => j.code !== '0').slice(0, 8);
  const RIGS = ['BMS-02', 'BMS-03', 'BMS-05', 'BMS-06', 'BMS-07', 'BMS-08'];
  const S = { rig: 'BMS-05', sop: J[0].code, am: 'Budi Santoso', id: '' };
  const N = ['Outlook', 'Power Automate', 'Teams Approvals', 'SOP LEGO Hub'];
  const title = () => J.find((j) => j.code === S.sop).title;
  compose();
  function compose() {
    steps(N, 0);
    const b = appBody(`<div class="row" style="position:absolute;inset:22px 30px">
      <div class="col" style="flex:.55;display:flex;flex-direction:column;gap:18px"><div class="card"><div class="lbl">Rig</div>${seg('rig', RIGS, S.rig)}</div>
        <div class="card"><div class="lbl">Mandatory SOP</div><div class="seg" data-seg="sop">${J.map((j) => `<button class="${j.code === S.sop ? 'on' : ''}" data-v="${j.code}">${j.code}</button>`).join('')}</div></div>
        <div class="card"><div class="lbl">Approved by Area Manager</div><input type="text" id="sl-am" value="${S.am}"><div style="font-size:17px;color:#8b93a7;margin-top:10px">💡 Clear it to see the automatic rejection.</div></div></div>
      <div class="col" style="position:relative">${W('outlook.office.com · New message', `<div class="ow" style="grid-template-rows:48px 1fr"><div class="ohd">Outlook <div class="srch"></div></div>
        <div class="rp compose" style="overflow:auto"><div class="cl"><span>To</span><b>SOP LEGO Intake</b></div><div class="cl"><span>Subject</span><b id="sl-subj"></b></div>
          <div class="cbody" id="sl-body"></div><div class="catt"><i>PDF</i><span id="sl-att"></span></div>
          <div style="padding:18px 22px"><span class="obtn p" id="sl-send">Send</span><span class="obtn">Discard</span></div></div></div>`)}</div></div>`);
    const upd = () => { S.am = $('#sl-am').value.trim(); $('#sl-subj').textContent = `[SOP LEGO] ${S.rig} | ${S.sop} | ${title()}`;
      $('#sl-body').textContent = `Dengan hormat,\nBerikut kami kirimkan SOP untuk rig ${S.rig}.\n\nNo Dokumen Kontraktor: BMS/SOP/${S.sop.replace('.', '')}/2026\nRevisi: 2\nKeterangan: SOP terbaru\nApproved by Area Manager: ${S.am || '<isi nama Area Manager>'}\n\nTerima kasih.`;
      $('#sl-att').textContent = `SOP ${S.sop} ${title()} rev2.pdf · 1.8 MB`; };
    b.querySelectorAll('[data-seg] button').forEach((x) => x.addEventListener('click', () => setTimeout(upd)));
    wireSeg(b, S); $('#sl-am').oninput = upd; upd();
    $('#sl-send').onclick = () => { upd(); S.id = 'SUB-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + sid() + '-' + S.rig; toast('Email sent to SOP LEGO Intake'); flow(); };
  }
  async function flow() {
    steps(N, 1);
    const ok = S.am.length >= 3 && !/[<\[]/.test(S.am);
    const act = (id, ico, t, sub, ac, inner = '') => `<div class="act" id="${id}" style="--ac:${ac}"><div class="ah"><span class="ico">${ico}</span>${t}<small>${sub}</small><span class="st">•</span></div>${inner ? `<div class="ab">${inner}</div>` : ''}</div>`;
    const V = [['Rig', S.rig, true], ['SOP code', S.sop, true], ['Contractor PIC', 'sender = rig PIC', true], ['PDF attached', '1.8 MB (< 10 MB)', true], ['Area Manager', ok ? S.am : 'missing', ok]];
    appBody(W('make.powerautomate.com · SOP LEGO - Intake · Run history', `<div class="pa"><div class="pbar">⚡ SOP LEGO - Intake <span>· Run ${new Date().toLocaleString('en-GB')}</span></div><div class="run"><div class="lane">
      ${act('s1', '✉', 'When a new email arrives (V3)', 'Office 365 Outlook', '#0f6cbd')}<div class="arrow"></div>
      ${act('s2', '⟳', 'Do until — attachment scan ready', 'Safe Attachments', '#5c2d91')}<div class="arrow"></div>
      ${act('s3', '⚙', 'Validate submission', 'rig · SOP · PIC · PDF · Area Manager', '#0f6cbd', V.map((v) => `<div class="kv"><span>${v[0]}</span><b class="${v[2] ? 'g' : 'r'}">${v[1]}</b></div>`).join(''))}<div class="arrow"></div>
      <div class="branch"><div class="yes"><div class="bh">If valid</div>${act('y1', 'S', 'Create file — SOPs/BMS/' + S.rig, 'SharePoint', '#036c70')}${act('y2', 'L', 'Create item — SOPLEGO_Submissions (Pending)', 'SharePoint', '#036c70')}${act('y3', '✓', 'Start and wait for an approval', 'Approvals · first to respond', '#5b5fc7')}</div>
        <div class="no"><div class="bh">If invalid</div>${act('n1', '✉', 'Reply: pengajuan ditolak + alasan', 'Office 365 Outlook', '#c50f1f')}${act('n2', 'L', 'Log to SOPLEGO_MailLog', 'SharePoint', '#036c70')}</div></div>
      </div></div></div>`) + cap('The real intake: a <b>Power Automate</b> flow — no IT tickets, no extra license'));
    const mark = async (id, good = true, open = false) => { const a = $('#' + id); a.classList.add('on', good ? 'ok' : 'no'); a.querySelector('.st').textContent = good ? '✓' : '✕'; if (open) a.classList.add('open'); a.scrollIntoView({ block: 'center', behavior: 'smooth' }); await sleep(560); };
    await sleep(400); await mark('s1'); await mark('s2'); await mark('s3', ok, true); await sleep(900);
    if (ok) { await mark('y1'); await mark('y2'); await mark('y3'); toast('Approval sent to the rig Acknowledgers (Teams &amp; Outlook)', '📨'); await sleep(1200); teams(); }
    else { await mark('n1'); await mark('n2'); toast('Rejection reply sent: “Approved by Area Manager” is missing', '↩️');
      await sleep(1500); $('.cap').innerHTML = '<span id="sl-fix" style="cursor:pointer">‹ Tap here to fix and resend</span>'; $('#sl-fix').onclick = compose; }
  }
  function teams() {
    steps(N, 2);
    appBody(W('teams.microsoft.com · Chat · Power Automate', `<div class="tm"><div class="tb">Microsoft Teams</div><div class="tg"><div class="rail"></div>
      <div class="clist"><h3>Chat</h3><div class="ci on"><b>Power Automate</b><small>Approval request: SOP LEGO acknowledgement…</small></div><div class="ci"><b>Tim Acknowledger</b><small>Siap, sudah dicek.</small></div><div class="ci"><b>DWI Engineering</b><small>Rapat mingguan jam 09.00</small></div></div>
      <div class="chat"><div class="meta">Power Automate · ${at(0, Date.now())}</div><div class="acard"><div class="k">Approval request</div>
        <h2>SOP LEGO acknowledgement: ${S.sop} ${title()} - ${S.rig}</h2><div class="by">Requested by SOP LEGO Intake · Approve/Reject – first to respond</div>
        <dl><dt>Submission</dt><dd>${S.id}</dd><dt>Rig / company</dt><dd>${S.rig} · BMS</dd><dt>SOP</dt><dd>${S.sop} ${title()} · Rev. 2</dd><dt>Approved by AM</dt><dd>${S.am}</dd><dt>Received</dt><dd>${new Date().toLocaleString('en-GB')}</dd></dl>
        <a>Open the submitted SOP PDF(s)</a><div id="tm-act"><button class="tbtn p" id="tm-ok">Approve</button><button class="tbtn" id="tm-no">Reject</button></div></div></div></div></div>`)
      + cap('You are the <b>Acknowledger</b> — decide in one tap'));
    const done = (okd) => { $('#tm-act').innerHTML = `<div class="done" style="color:${okd ? '#92c353' : '#ef6b6b'}">${okd ? '✓ You approved this request' : '✕ You rejected this request'}</div>`; setTimeout(() => hub(okd), 1300); };
    $('#tm-ok').onclick = () => done(true); $('#tm-no').onclick = () => done(false);
  }
  function hub(okd) {
    steps(N, 3);
    const base = ['', '', 'x', '', 'p', '', 'g', '', '', '', 'p', '', '', 'g', '', '', '', '', 'x', '', '', 'p', '', '', '', 'g', '', '', '', '', '', '', '', '', 'g', '', '', '', '', '', 'p', '', '', '', '', '', '', ''];
    let k = 0; const cell = (r, j) => { const hit = r === S.rig && j.code === S.sop; const v = hit ? (okd ? 'g' : 'x') : base[k++ % base.length];
      return `<td class="c ${v ? 'c-' + v : ''} ${hit ? 'c-new' : ''}">${v === 'g' ? '✓' : v === 'x' ? '✗' : v === 'p' ? '…' : ''}</td>`; };
    appBody(`<div class="hub" style="border-radius:16px;overflow:hidden"><div class="side"><div class="br"><img src="media/logos/soplego.png"><div><b>SOP LEGO</b><small>PHR SOP File Hub</small></div></div>
      ${['Dashboard', 'SOP Library', 'Compliance Matrix', 'Email Templates', 'Rigs &amp; PICs', 'SOP Register', 'Mailbox Log'].map((m) => `<div class="mi ${m === 'Compliance Matrix' ? 'on' : ''}">${m}</div>`).join('')}</div>
      <div class="main"><h1>Compliance Matrix</h1><div class="sub">Which mandatory SOPs are acknowledged for each rig · company BMS</div>
        <div class="mx"><table><tr><th style="text-align:left">MANDATORY SOP</th>${RIGS.map((r) => `<th>${r}</th>`).join('')}</tr>
          ${J.map((j) => `<tr><td class="n">${j.code}&nbsp;&nbsp;${j.title}</td>${RIGS.map((r) => cell(r, j)).join('')}</tr>`).join('')}</table></div>
        <div style="margin-top:18px;font-size:17px;color:#8fa3c0">${okd ? `✓ ${S.sop} acknowledged for ${S.rig} — the contractor gets the “Verified” email automatically.` : `✗ ${S.sop} rejected for ${S.rig} — the contractor gets the remarks by email.`}
          &nbsp;&nbsp;<span id="sl-again" style="color:#38bdf8;cursor:pointer;font-weight:700">↺ Submit another</span></div></div></div>`);
    $('#sl-again').onclick = () => DEMOS.soplego();
    toast(okd ? `<b>${S.sop}</b> Verified for ${S.rig}` : 'Contractor notified with remarks', okd ? '✅' : '✕');
  }
};
