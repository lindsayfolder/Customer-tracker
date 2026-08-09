"use strict";

/* ---------- Storage ---------- */
const PEOPLE_KEY = "cyclecare_people_v1";
const ENTRIES_KEY = "cyclecare_entries_v1";
const DISMISS_KEY = "cyclecare_install_dismissed_v1";

function loadPeople() {
  try { return JSON.parse(localStorage.getItem(PEOPLE_KEY)) || []; }
  catch { return []; }
}
function savePeople(list) { localStorage.setItem(PEOPLE_KEY, JSON.stringify(list)); }

function loadEntries() {
  try { return JSON.parse(localStorage.getItem(ENTRIES_KEY)) || []; }
  catch { return []; }
}
function saveEntries(list) { localStorage.setItem(ENTRIES_KEY, JSON.stringify(list)); }

let people = loadPeople();
let entries = loadEntries();

/* ---------- Date helpers (UTC-anchored, avoids TZ drift) ---------- */
function pad(n) { return String(n).padStart(2, "0"); }
function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function parseISO(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}
function isoFromDate(d) {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}
function addDays(iso, n) {
  const d = parseISO(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return isoFromDate(d);
}
function daysBetween(isoA, isoB) {
  return Math.round((parseISO(isoB) - parseISO(isoA)) / 86400000);
}
function formatHuman(iso) {
  if (!iso) return "";
  const d = parseISO(iso);
  const now = new Date();
  const opts = { month: "short", day: "numeric" };
  if (d.getUTCFullYear() !== now.getFullYear()) opts.year = "numeric";
  return d.toLocaleDateString(undefined, opts);
}
function describeDays(n) {
  if (n === 0) return "today";
  if (n === 1) return "tomorrow";
  if (n > 1) return `in ${n} days`;
  if (n === -1) return "1 day late";
  return `${Math.abs(n)} days late`;
}

/* ---------- Utilities ---------- */
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}
const PALETTE = ["#6d28d9", "#db2777", "#059669", "#d97706", "#2563eb", "#dc2626", "#0891b2", "#7c3aed"];
function colorForIndex(i) { return PALETTE[i % PALETTE.length]; }
function initials(name) {
  return (name || "?").trim().split(/\s+/).slice(0, 2).map(w => w[0]).join("").toUpperCase() || "?";
}

let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

/* ---------- Stats ---------- */
function entriesForPerson(personId) {
  return entries.filter(e => e.personId === personId).sort((a, b) => a.start.localeCompare(b.start));
}

function computeStats(personId) {
  const sorted = entriesForPerson(personId);
  const starts = sorted.map(e => e.start);
  const cycleLens = [];
  for (let i = 1; i < starts.length; i++) cycleLens.push(daysBetween(starts[i - 1], starts[i]));
  const recent = cycleLens.slice(-6);
  const avgCycle = recent.length ? Math.round(recent.reduce((a, b) => a + b, 0) / recent.length) : null;
  const periodLens = sorted.filter(e => e.end).map(e => daysBetween(e.start, e.end) + 1);
  const avgPeriodLen = periodLens.length ? Math.round(periodLens.reduce((a, b) => a + b, 0) / periodLens.length) : null;
  const lastStart = starts.length ? starts[starts.length - 1] : null;
  const predictedNext = (lastStart && avgCycle) ? addDays(lastStart, avgCycle) : null;
  const variability = recent.length >= 2 ? Math.max(...recent) - Math.min(...recent) : null;
  const today = todayISO();
  const daysSinceLast = lastStart ? daysBetween(lastStart, today) : null;
  const daysUntilNext = predictedNext ? daysBetween(today, predictedNext) : null;
  return { sorted, cycleLens, avgCycle, avgPeriodLen, lastStart, predictedNext, variability, daysSinceLast, daysUntilNext };
}

/* ---------- State / Router ---------- */
let state = { view: "home", personId: null };

function navigate(view, personId) {
  state = { view, personId: personId || null };
  render();
  window.scrollTo(0, 0);
}

/* ---------- Rendering: Home ---------- */
function predictPillHtml(stats) {
  if (!stats.lastStart) return `<span class="predict-pill unknown">No periods logged yet</span>`;
  if (!stats.avgCycle) return `<span class="predict-pill unknown">${stats.daysSinceLast}d since last · log next to predict</span>`;
  const n = stats.daysUntilNext;
  let cls = "ok";
  if (n < 0) cls = "overdue";
  else if (n <= 3) cls = "soon";
  return `<span class="predict-pill ${cls}">Next: ${formatHuman(stats.predictedNext)} · ${describeDays(n)}</span>`;
}

function renderHome() {
  document.getElementById("headerTitle").textContent = "Cycle Care";
  document.getElementById("backBtn").classList.add("hidden");
  document.getElementById("addPersonBtn").classList.remove("hidden");

  if (people.length === 0) {
    return `
      <div class="empty-state">
        <div class="big">🌸</div>
        <div><strong>Welcome to Cycle Care.</strong></div>
        <div>Add yourself and your daughters to start tracking periods privately on this device.</div>
        <div style="margin-top:16px;">
          <button class="btn btn-primary" onclick="openPersonModal()">+ Add a person</button>
        </div>
      </div>`;
  }

  const cards = people.map((p, i) => {
    const stats = computeStats(p.id);
    const color = p.color || colorForIndex(i);
    return `
      <div class="person-card" onclick="navigate('detail','${p.id}')">
        <div class="avatar" style="background:${color}">${initials(p.name)}</div>
        <div class="person-card-body">
          <div class="person-name">${escapeHtml(p.name)}</div>
          <div class="person-sub">${p.age != null && p.age !== "" ? `Age ${escapeHtml(p.age)}` : "Age not set"} · ${escapeHtml(p.relation || "Family")}</div>
          <div>${predictPillHtml(stats)}</div>
        </div>
        <button class="quick-log-btn" onclick="event.stopPropagation(); quickLogToday('${p.id}')">Log today</button>
      </div>`;
  }).join("");

  return `<div>${cards}</div>`;
}

function quickLogToday(personId) {
  const today = todayISO();
  const existing = entries.find(e => e.personId === personId && e.start === today);
  if (existing) { showToast("Already logged for today"); return; }
  const entry = { id: uid(), personId, start: today, end: null, flow: null, notes: "" };
  entries.push(entry);
  saveEntries(entries);
  render();
  showUndoToast(entry.id);
}

function showUndoToast(entryId) {
  const el = document.getElementById("toast");
  el.innerHTML = `Period logged for today &nbsp; <button style="background:none;border:none;color:#fbcfe8;font-weight:800;cursor:pointer;text-decoration:underline;" onclick="undoEntry('${entryId}')">Undo</button>`;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 4000);
}
function undoEntry(entryId) {
  entries = entries.filter(e => e.id !== entryId);
  saveEntries(entries);
  render();
  showToast("Removed");
}

/* ---------- Rendering: Detail ---------- */
function renderDetail() {
  const person = people.find(p => p.id === state.personId);
  if (!person) { navigate("home"); return ""; }
  document.getElementById("headerTitle").textContent = person.name;
  document.getElementById("backBtn").classList.remove("hidden");
  document.getElementById("addPersonBtn").classList.add("hidden");

  const idx = people.findIndex(p => p.id === person.id);
  const color = person.color || colorForIndex(idx);
  const stats = computeStats(person.id);

  let headline;
  if (!stats.lastStart) {
    headline = `Log your first period to start tracking.`;
  } else if (!stats.avgCycle) {
    headline = `${stats.daysSinceLast} day${stats.daysSinceLast === 1 ? "" : "s"} since last period started. Log the next one to get a prediction.`;
  } else {
    const n = stats.daysUntilNext;
    headline = `<span class="big-num">${formatHuman(stats.predictedNext)}</span> — ${describeDays(n)}`;
  }

  const statsGrid = (stats.avgCycle || stats.avgPeriodLen) ? `
    <div class="stats-grid">
      <div class="stat-box"><div class="label">Avg cycle</div><div class="value">${stats.avgCycle ? stats.avgCycle + " days" : "—"}</div></div>
      <div class="stat-box"><div class="label">Avg period length</div><div class="value">${stats.avgPeriodLen ? stats.avgPeriodLen + " days" : "—"}</div></div>
      <div class="stat-box"><div class="label">Cycles tracked</div><div class="value">${stats.cycleLens.length}</div></div>
      <div class="stat-box"><div class="label">Cycle variability</div><div class="value">${stats.variability != null ? "±" + Math.round(stats.variability / 2) + " days" : "—"}</div></div>
    </div>` : "";

  const history = stats.sorted.slice().reverse().map((e, i, arr) => {
    const prev = arr[i + 1]; // next older one, since reversed
    const gap = prev ? daysBetween(prev.start, e.start) : null;
    const dateRange = e.end ? `${formatHuman(e.start)} – ${formatHuman(e.end)}` : formatHuman(e.start);
    const meta = [e.flow, e.notes].filter(Boolean).map(escapeHtml).join(" · ");
    return `
      <div class="entry-row" onclick="openEntryModal('${e.id}')">
        <div>
          <div class="entry-dates">${dateRange}</div>
          ${meta ? `<div class="entry-meta">${meta}</div>` : ""}
        </div>
        ${gap != null ? `<div class="entry-gap">${gap}d cycle</div>` : ""}
      </div>`;
  }).join("");

  return `
    <div class="detail-head">
      <div class="avatar" style="background:${color}">${initials(person.name)}</div>
      <div>
        <h2>${escapeHtml(person.name)}</h2>
        <div class="person-sub">${person.age != null && person.age !== "" ? `Age ${escapeHtml(person.age)}` : "Age not set"} · ${escapeHtml(person.relation || "Family")}</div>
      </div>
      <button class="edit-link" onclick="openPersonModal('${person.id}')">Edit</button>
    </div>

    <div class="stats-card">
      <div class="stats-headline">${headline}</div>
      ${stats.variability != null && stats.variability > 7 ? `<div class="stats-note">Cycles have varied by up to ${stats.variability} days recently, so treat this as an estimate rather than a fixed date.</div>` : ""}
      ${statsGrid}
    </div>

    <div class="action-row">
      <button class="btn btn-primary" onclick="openEntryModal()">+ Log Period</button>
      <button class="btn btn-secondary" onclick="openShareModal('${person.id}')">Share</button>
    </div>

    <div class="section-title">History</div>
    ${history || `<div class="empty-state" style="padding:30px 10px;">No periods logged yet.</div>`}

    <div class="privacy-note">🔒 This data is stored only on this device. Nothing is uploaded anywhere — sharing only happens when you tap Share.</div>
  `;
}

/* ---------- Render dispatch ---------- */
function render() {
  const app = document.getElementById("app");
  app.innerHTML = state.view === "detail" ? renderDetail() : renderHome();
}

document.getElementById("backBtn").addEventListener("click", () => navigate("home"));
document.getElementById("addPersonBtn").addEventListener("click", () => openPersonModal());

/* ---------- Modals ---------- */
function closeModal() { document.getElementById("modalRoot").innerHTML = ""; }

function openPersonModal(personId) {
  const editing = !!personId;
  const person = editing ? people.find(p => p.id === personId) : { name: "", age: "", relation: "Daughter", color: "" };
  const relations = ["Me", "Daughter", "Other"];

  document.getElementById("modalRoot").innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this) closeModal()">
      <div class="modal-sheet">
        <div class="modal-head">
          <h3>${editing ? "Edit Person" : "Add Person"}</h3>
          <button class="icon-btn small" onclick="closeModal()" style="color:#241b3a;background:#f4f0ff;">×</button>
        </div>
        <div class="field">
          <label>Name</label>
          <input type="text" id="f_name" value="${escapeHtml(person.name)}" placeholder="e.g. Maya" />
        </div>
        <div class="field-row">
          <div class="field">
            <label>Age</label>
            <input type="number" id="f_age" min="0" max="120" value="${escapeHtml(person.age)}" placeholder="e.g. 14" />
          </div>
          <div class="field">
            <label>Relation</label>
            <select id="f_relation">
              ${relations.map(r => `<option value="${r}" ${person.relation === r ? "selected" : ""}>${r}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="field">
          <label>Color</label>
          <div class="color-row" id="f_colorRow">
            ${PALETTE.map(c => `<div class="color-dot ${((person.color || PALETTE[people.length % PALETTE.length]) === c) ? "selected" : ""}" style="background:${c}" onclick="selectColor('${c}', event)"></div>`).join("")}
          </div>
          <input type="hidden" id="f_color" value="${person.color || colorForIndex(people.length)}" />
        </div>
        <button class="btn btn-primary btn-full" style="margin-bottom:8px;" onclick="savePerson(${editing ? `'${personId}'` : "null"})">Save</button>
        ${editing ? `<button class="btn btn-danger btn-full" onclick="deletePerson('${personId}')">Delete Person</button>` : ""}
      </div>
    </div>`;
}

function selectColor(c, evt) {
  document.getElementById("f_color").value = c;
  document.querySelectorAll("#f_colorRow .color-dot").forEach(d => d.classList.remove("selected"));
  evt.target.classList.add("selected");
}

function savePerson(personId) {
  const name = document.getElementById("f_name").value.trim();
  const age = document.getElementById("f_age").value;
  const relation = document.getElementById("f_relation").value;
  const color = document.getElementById("f_color").value;
  if (!name) { showToast("Please enter a name"); return; }

  if (personId) {
    people = people.map(p => p.id === personId ? { ...p, name, age, relation, color } : p);
  } else {
    people.push({ id: uid(), name, age, relation, color });
  }
  savePeople(people);
  closeModal();
  render();
  showToast("Saved");
}

function deletePerson(personId) {
  if (!confirm("Delete this person and all their logged periods? This can't be undone.")) return;
  people = people.filter(p => p.id !== personId);
  entries = entries.filter(e => e.personId !== personId);
  savePeople(people);
  saveEntries(entries);
  closeModal();
  navigate("home");
  showToast("Person deleted");
}

const FLOWS = ["Light", "Medium", "Heavy"];

function openEntryModal(entryId) {
  const editing = !!entryId;
  const entry = editing ? entries.find(e => e.id === entryId) : { start: todayISO(), end: "", flow: "", notes: "" };
  const personId = editing ? entry.personId : state.personId;

  document.getElementById("modalRoot").innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this) closeModal()">
      <div class="modal-sheet">
        <div class="modal-head">
          <h3>${editing ? "Edit Period" : "Log Period"}</h3>
          <button class="icon-btn small" onclick="closeModal()" style="color:#241b3a;background:#f4f0ff;">×</button>
        </div>
        <div class="field-row">
          <div class="field">
            <label>Start date</label>
            <input type="date" id="e_start" value="${entry.start}" />
          </div>
          <div class="field">
            <label>End date (optional)</label>
            <input type="date" id="e_end" value="${entry.end || ""}" />
          </div>
        </div>
        <div class="field">
          <label>Flow (optional)</label>
          <div class="chip-row" id="e_flowRow">
            ${FLOWS.map(f => `<div class="chip ${entry.flow === f ? "selected" : ""}" onclick="selectFlow('${f}')">${f}</div>`).join("")}
          </div>
          <input type="hidden" id="e_flow" value="${entry.flow || ""}" />
        </div>
        <div class="field">
          <label>Notes (optional)</label>
          <textarea id="e_notes" rows="2" placeholder="Cramps, mood, symptoms...">${escapeHtml(entry.notes || "")}</textarea>
        </div>
        <button class="btn btn-primary btn-full" style="margin-bottom:8px;" onclick="saveEntry(${editing ? `'${entryId}'` : "null"}, '${personId}')">Save</button>
        ${editing ? `<button class="btn btn-danger btn-full" onclick="deleteEntry('${entryId}')">Delete Entry</button>` : ""}
      </div>
    </div>`;
}

function selectFlow(f) {
  const current = document.getElementById("e_flow").value;
  const next = current === f ? "" : f;
  document.getElementById("e_flow").value = next;
  document.querySelectorAll("#e_flowRow .chip").forEach(c => c.classList.toggle("selected", c.textContent === next));
}

function saveEntry(entryId, personId) {
  const start = document.getElementById("e_start").value;
  const end = document.getElementById("e_end").value;
  const flow = document.getElementById("e_flow").value;
  const notes = document.getElementById("e_notes").value.trim();
  if (!start) { showToast("Please pick a start date"); return; }
  if (end && end < start) { showToast("End date can't be before start date"); return; }

  if (entryId) {
    entries = entries.map(e => e.id === entryId ? { ...e, start, end: end || null, flow: flow || null, notes } : e);
  } else {
    entries.push({ id: uid(), personId, start, end: end || null, flow: flow || null, notes });
  }
  saveEntries(entries);
  closeModal();
  render();
  showToast("Period saved");
}

function deleteEntry(entryId) {
  if (!confirm("Delete this logged period?")) return;
  entries = entries.filter(e => e.id !== entryId);
  saveEntries(entries);
  closeModal();
  render();
  showToast("Entry deleted");
}

/* ---------- Sharing ---------- */
function buildShareText(person, stats) {
  const lines = [`🌸 ${person.name}'s Cycle Care summary`];
  if (stats.lastStart) lines.push(`Last period started: ${formatHuman(stats.lastStart)}`);
  if (stats.avgCycle) lines.push(`Average cycle length: ${stats.avgCycle} days`);
  if (stats.avgPeriodLen) lines.push(`Average period length: ${stats.avgPeriodLen} days`);
  if (stats.predictedNext) {
    lines.push(`Predicted next period: ${formatHuman(stats.predictedNext)} (${describeDays(stats.daysUntilNext)})`);
  } else {
    lines.push(`Not enough history yet to predict the next period.`);
  }
  lines.push("");
  lines.push("Sent from the Cycle Care app");
  return lines.join("\n");
}

function isIOS() { return /iP(hone|ad|od)/.test(navigator.userAgent); }

function openShareModal(personId) {
  const person = people.find(p => p.id === personId);
  const stats = computeStats(personId);
  const text = buildShareText(person, stats);
  const encoded = encodeURIComponent(text);
  const subject = encodeURIComponent(`${person.name}'s Cycle Care summary`);
  const smsHref = isIOS() ? `sms:&body=${encoded}` : `sms:?body=${encoded}`;

  document.getElementById("modalRoot").innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this) closeModal()">
      <div class="modal-sheet">
        <div class="modal-head">
          <h3>Share with ${escapeHtml(person.name)}</h3>
          <button class="icon-btn small" onclick="closeModal()" style="color:#241b3a;background:#f4f0ff;">×</button>
        </div>
        <div class="share-text-box">${escapeHtml(text)}</div>
        <button class="btn btn-primary btn-full" style="margin-bottom:8px;" onclick="nativeShare('${personId}')">📤 Share via Messages / Email / Apps</button>
        <a class="btn btn-secondary btn-full" style="margin-bottom:8px; display:block; text-align:center; text-decoration:none; box-sizing:border-box;" href="${smsHref}">Text message</a>
        <a class="btn btn-secondary btn-full" style="margin-bottom:8px; display:block; text-align:center; text-decoration:none; box-sizing:border-box;" href="mailto:?subject=${subject}&body=${encoded}">Email</a>
        <button class="btn btn-ghost btn-full" onclick="copyShareText('${personId}')">Copy text</button>
      </div>
    </div>`;
}

async function nativeShare(personId) {
  const person = people.find(p => p.id === personId);
  const stats = computeStats(personId);
  const text = buildShareText(person, stats);
  if (navigator.share) {
    try {
      await navigator.share({ title: `${person.name}'s Cycle Care summary`, text });
    } catch (err) {
      if (err && err.name !== "AbortError") showToast("Couldn't open share sheet");
    }
  } else {
    showToast("Sharing isn't supported in this browser — try Copy text instead");
  }
}

async function copyShareText(personId) {
  const person = people.find(p => p.id === personId);
  const stats = computeStats(personId);
  const text = buildShareText(person, stats);
  try {
    await navigator.clipboard.writeText(text);
    showToast("Copied to clipboard");
  } catch {
    showToast("Couldn't copy — select and copy manually");
  }
}

/* ---------- Install banner ---------- */
let deferredInstallPrompt = null;

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function initInstallBanner() {
  if (isStandalone() || localStorage.getItem(DISMISS_KEY)) return;
  document.getElementById("installBanner").classList.remove("hidden");
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
});

document.getElementById("installDismissBtn").addEventListener("click", () => {
  localStorage.setItem(DISMISS_KEY, "1");
  document.getElementById("installBanner").classList.add("hidden");
});

document.getElementById("installHowBtn").addEventListener("click", openInstallHelp);

function openInstallHelp() {
  document.getElementById("modalRoot").innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this) closeModal()">
      <div class="modal-sheet">
        <div class="modal-head">
          <h3>Add to your phone</h3>
          <button class="icon-btn small" onclick="closeModal()" style="color:#241b3a;background:#f4f0ff;">×</button>
        </div>
        ${deferredInstallPrompt ? `<button class="btn btn-primary btn-full" style="margin-bottom:14px;" onclick="triggerInstall()">Install now</button>` : ""}
        <div class="install-steps">
          <h4>📱 iPhone / iPad (Safari)</h4>
          <ol>
            <li>Tap the Share icon (square with an arrow) in Safari's toolbar.</li>
            <li>Scroll down and tap "Add to Home Screen".</li>
            <li>Tap "Add" — the app icon appears on your home screen.</li>
          </ol>
          <h4>🤖 Android (Chrome)</h4>
          <ol>
            <li>Tap the ⋮ menu in the top right of Chrome.</li>
            <li>Tap "Install app" or "Add to Home screen".</li>
            <li>Confirm — the app icon appears on your home screen.</li>
          </ol>
          <p style="margin-top:12px; color:#6b6280;">Once installed, it opens like a normal app and works fully offline. Send this same page's link to your daughter's phone so she can install it too — her data stays private on her own device.</p>
        </div>
      </div>
    </div>`;
}

async function triggerInstall() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  closeModal();
}

/* ---------- Service worker ---------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}

/* ---------- Init ---------- */
initInstallBanner();
render();
