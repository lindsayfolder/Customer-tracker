import { useState, useEffect } from "react";

const QUICK_INTERVALS = [
  { label: "3 Days", days: 3 },
  { label: "5 Days", days: 5 },
  { label: "Weekly", days: 7 },
  { label: "10 Days", days: 10 },
  { label: "2 Weeks", days: 14 },
  { label: "3 Weeks", days: 21 },
  { label: "Monthly", days: 30 },
  { label: "2 Months", days: 60 },
  { label: "Custom", days: null },
];

const SAMPLE_CUSTOMERS = [
  {
    id: "1", name: "Tony Reyes", phone: "917-555-0123", company: "Reyes Deli",
    orders: "Turkey sandwich platters, coffee supply", lastContact: "2026-04-13",
    intervalDays: 30, notes: "Prefers calls in the morning. Big order around holidays.",
  },
  {
    id: "2", name: "Maria Chen", phone: "646-555-0287", company: "Chen Flowers",
    orders: "Weekly fresh bouquets, seasonal arrangements", lastContact: "2026-05-06",
    intervalDays: 7, notes: "Very punctual. Sends referrals often.",
  },
  {
    id: "3", name: "Danny Russo", phone: "718-555-0044", company: "Russo Auto",
    orders: "Engine parts, oil supply", lastContact: "2026-05-01",
    intervalDays: 10, notes: "Call on Tuesdays — closed Mondays.",
  },
];

function intervalLabel(days) {
  const match = QUICK_INTERVALS.find(q => q.days === days && q.days !== null);
  if (match) return match.label;
  return `Every ${days} day${days === 1 ? "" : "s"}`;
}

function daysUntilDue(lastContact, intervalDays) {
  if (!lastContact || !intervalDays) return 0;
  const last = new Date(lastContact);
  const due = new Date(last);
  due.setDate(due.getDate() + intervalDays);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
}

function statusInfo(days) {
  if (days < 0) return { label: `${Math.abs(days)}d overdue`, color: "#ef4444", bg: "#fef2f2", dot: "#ef4444" };
  if (days === 0) return { label: "Due today", color: "#f59e0b", bg: "#fffbeb", dot: "#f59e0b" };
  if (days <= 3) return { label: `Due in ${days}d`, color: "#f59e0b", bg: "#fffbeb", dot: "#f59e0b" };
  return { label: `Due in ${days}d`, color: "#10b981", bg: "#f0fdf4", dot: "#10b981" };
}

function CustomerCard({ customer, onTap, onCheckin }) {
  const days = daysUntilDue(customer.lastContact, customer.intervalDays);
  const status = statusInfo(days);
  return (
    <div onClick={() => onTap(customer)} style={{
      background: "#fff", borderRadius: "14px",
      border: "1.5px solid #f1f5f9",
      padding: "16px 18px", marginBottom: "10px", cursor: "pointer",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      transition: "transform 0.15s, box-shadow 0.15s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "700", fontSize: "16px", color: "#0f172a" }}>{customer.name}</div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "1px" }}>{customer.company}</div>
        </div>
        <div style={{
          background: status.bg, color: status.color,
          borderRadius: "20px", padding: "3px 10px",
          fontSize: "11px", fontWeight: "700", whiteSpace: "nowrap", marginLeft: "10px",
          display: "flex", alignItems: "center", gap: "5px",
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: status.dot, display: "inline-block" }} />
          {status.label}
        </div>
      </div>
      <div style={{ marginTop: "10px", fontSize: "12px", color: "#94a3b8", display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
        <span>🔁 {intervalLabel(customer.intervalDays)}</span>
        <span>📞 {customer.phone}</span>
        <span>🗓 {customer.lastContact || "Never"}</span>
      </div>
      <button onClick={e => { e.stopPropagation(); onCheckin(customer.id); }} style={{
        marginTop: "12px", background: "#0f172a", color: "#fff",
        border: "none", borderRadius: "8px", padding: "7px 16px",
        fontSize: "12px", fontWeight: "700", cursor: "pointer",
      }}>
        ✓ Mark Contacted Today
      </button>
    </div>
  );
}

function FrequencyPicker({ value, onChange }) {
  const isCustom = !QUICK_INTERVALS.find(q => q.days === value && q.days !== null);
  const [showCustom, setShowCustom] = useState(isCustom);
  const [customVal, setCustomVal] = useState(isCustom ? String(value) : "");

  function selectQuick(days) {
    if (days === null) {
      setShowCustom(true);
    } else {
      setShowCustom(false);
      onChange(days);
    }
  }

  function applyCustom() {
    const n = parseInt(customVal, 10);
    if (n > 0) onChange(n);
  }

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
        {QUICK_INTERVALS.map(q => {
          const isSelected = q.days !== null ? value === q.days && !showCustom : showCustom;
          return (
            <button key={q.label} onClick={() => selectQuick(q.days)} style={{
              padding: "6px 13px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
              cursor: "pointer", transition: "all 0.15s",
              background: isSelected ? "#0f172a" : "#f8fafc",
              color: isSelected ? "#fff" : "#64748b",
              border: isSelected ? "1.5px solid #0f172a" : "1.5px solid #e2e8f0",
            }}>{q.label}</button>
          );
        })}
      </div>
      {showCustom && (
        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "4px" }}>
          <input
            type="number" min="1" max="365"
            value={customVal}
            onChange={e => setCustomVal(e.target.value)}
            placeholder="e.g. 45"
            style={{ flex: 1, border: "1.5px solid #e2e8f0", borderRadius: "9px", padding: "9px 13px", fontSize: "14px", color: "#0f172a", outline: "none" }}
          />
          <span style={{ fontSize: "13px", color: "#64748b", whiteSpace: "nowrap" }}>days</span>
          <button onClick={applyCustom} style={{
            background: "#0f172a", color: "#fff", border: "none",
            borderRadius: "9px", padding: "9px 16px", fontSize: "13px",
            fontWeight: "700", cursor: "pointer",
          }}>Set</button>
        </div>
      )}
      {value && (
        <div style={{ marginTop: "8px", fontSize: "12px", color: "#10b981", fontWeight: "600" }}>
          ✓ Follow up {intervalLabel(value).toLowerCase()}
        </div>
      )}
    </div>
  );
}

function Modal({ customer, onClose, onSave, onDelete, isNew, onAddReminder }) {
  const [data, setData] = useState({ ...customer });
  const [reminderAdded, setReminderAdded] = useState(false);

  async function handleAddReminder() {
    await onAddReminder(data);
    setReminderAdded(true);
  }

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      zIndex: 100, backdropFilter: "blur(4px)",
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "#fff", borderRadius: "20px 20px 0 0",
        width: "100%", maxWidth: "600px", maxHeight: "92vh",
        overflowY: "auto", padding: "28px 24px 48px",
        animation: "slideUp 0.2s ease",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
          <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>
            {isNew ? "New Customer" : "Edit Customer"}
          </div>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", fontSize: "18px", color: "#64748b" }}>×</button>
        </div>

        {[
          { label: "Full Name", key: "name", placeholder: "e.g. Tony Reyes" },
          { label: "Phone Number", key: "phone", placeholder: "e.g. 917-555-0123" },
          { label: "Company", key: "company", placeholder: "e.g. Reyes Deli" },
          { label: "What They Usually Order / Buy", key: "orders", placeholder: "e.g. Weekly coffee supply, sandwich platters" },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "5px" }}>{f.label}</label>
            <input value={data[f.key] || ""} onChange={e => setData(d => ({ ...d, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
              style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: "9px", padding: "10px 13px", fontSize: "14px", color: "#0f172a", outline: "none", boxSizing: "border-box" }} />
          </div>
        ))}

        <div style={{ marginBottom: "14px" }}>
          <label style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "5px" }}>Last Contact Date</label>
          <input type="date" value={data.lastContact || ""} onChange={e => setData(d => ({ ...d, lastContact: e.target.value }))}
            style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: "9px", padding: "10px 13px", fontSize: "14px", color: "#0f172a", outline: "none", boxSizing: "border-box" }} />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "8px" }}>Follow-up Frequency</label>
          <FrequencyPicker value={data.intervalDays} onChange={days => setData(d => ({ ...d, intervalDays: days }))} />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "5px" }}>Personal Notes</label>
          <textarea value={data.notes || ""} onChange={e => setData(d => ({ ...d, notes: e.target.value }))}
            placeholder="Preferences, tips, things to remember..."
            rows={3} style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: "9px", padding: "10px 13px", fontSize: "14px", color: "#0f172a", outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
        </div>

        <button onClick={handleAddReminder} style={{
          width: "100%", marginBottom: "10px",
          background: reminderAdded ? "#f0fdf4" : "#f8fafc",
          color: reminderAdded ? "#10b981" : "#0f172a",
          border: reminderAdded ? "1.5px solid #bbf7d0" : "1.5px solid #e2e8f0",
          borderRadius: "10px", padding: "12px",
          fontSize: "14px", fontWeight: "600", cursor: "pointer",
        }}>
          {reminderAdded ? "✓ Reminder Added to Phone!" : "🔔 Add Recurring Reminder to Phone"}
        </button>

        <button onClick={() => onSave(data)} style={{
          width: "100%", background: "#0f172a", color: "#fff", border: "none",
          borderRadius: "10px", padding: "14px", fontSize: "15px",
          fontWeight: "700", cursor: "pointer", marginBottom: "10px",
          fontFamily: "'Fraunces', Georgia, serif",
        }}>Save Customer</button>

        {!isNew && (
          <button onClick={() => onDelete(customer.id)} style={{
            width: "100%", background: "transparent", color: "#ef4444",
            border: "1.5px solid #fecaca", borderRadius: "10px", padding: "12px",
            fontSize: "14px", fontWeight: "600", cursor: "pointer",
          }}>Delete Customer</button>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [toast, setToast] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const result = await window.storage.get("customers_v2");
        if (result && result.value) {
          setCustomers(JSON.parse(result.value));
        } else {
          setCustomers(SAMPLE_CUSTOMERS);
        }
      } catch {
        setCustomers(SAMPLE_CUSTOMERS);
      }
    }
    load();
  }, []);

  async function persist(list) {
    try { await window.storage.set("customers_v2", JSON.stringify(list)); } catch {}
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function saveCustomer(data) {
    let updated;
    if (!data.id) {
      updated = [{ ...data, id: Date.now().toString() }, ...customers];
    } else {
      updated = customers.map(c => c.id === data.id ? data : c);
    }
    setCustomers(updated);
    persist(updated);
    setSelected(null);
    setShowAdd(false);
    showToast("Customer saved ✓");
  }

  function deleteCustomer(id) {
    const updated = customers.filter(c => c.id !== id);
    setCustomers(updated);
    persist(updated);
    setSelected(null);
    showToast("Customer removed");
  }

  function checkIn(id) {
    const today = new Date().toISOString().split("T")[0];
    const updated = customers.map(c => c.id === id ? { ...c, lastContact: today } : c);
    setCustomers(updated);
    persist(updated);
    showToast("Marked as contacted today ✓");
  }

  async function addReminder(customer) {
    const days = customer.intervalDays || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + days);
    const iso = startDate.toISOString().split("T")[0] + "T09:00:00";
    const label = intervalLabel(days);

    let rrule = `RRULE:FREQ=DAILY;INTERVAL=${days}`;
    let freq = "daily";
    let humanReadable = `Every ${days} days`;

    if (days === 7) { rrule = "RRULE:FREQ=WEEKLY"; freq = "weekly"; humanReadable = "Every week"; }
    else if (days === 14) { rrule = "RRULE:FREQ=WEEKLY;INTERVAL=2"; freq = "weekly"; humanReadable = "Every 2 weeks"; }
    else if (days === 30) { rrule = "RRULE:FREQ=MONTHLY"; freq = "monthly"; humanReadable = "Every month"; }

    try {
      await window.dispatchEvent(new CustomEvent("claude:create_reminder", {
        detail: {
          title: `Follow up with ${customer.name} (${customer.company})`,
          dueDate: iso,
          recurrence: { rrule, frequency: freq, humanReadableFrequency: humanReadable },
          notes: `Orders: ${customer.orders || "—"}\nPhone: ${customer.phone || "—"}`,
        }
      }));
    } catch {}
    showToast(`🔔 Reminder set: ${humanReadable}`);
  }

  const today = new Date().toISOString().split("T")[0];

  const sorted = [...customers].sort((a, b) =>
    daysUntilDue(a.lastContact, a.intervalDays) - daysUntilDue(b.lastContact, b.intervalDays)
  );

  const filtered = sorted.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase());
    const days = daysUntilDue(c.lastContact, c.intervalDays);
    if (filter === "Overdue") return matchSearch && days < 0;
    if (filter === "Due Soon") return matchSearch && days >= 0 && days <= 3;
    return matchSearch;
  });

  const overdueCount = customers.filter(c => daysUntilDue(c.lastContact, c.intervalDays) < 0).length;
  const dueSoonCount = customers.filter(c => { const d = daysUntilDue(c.lastContact, c.intervalDays); return d >= 0 && d <= 3; }).length;

  const blank = { id: null, name: "", phone: "", company: "", orders: "", lastContact: today, intervalDays: 30, notes: "" };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        input::placeholder, textarea::placeholder { color: #cbd5e1; }
        input[type=number]::-webkit-inner-spin-button { opacity: 1; }
      `}</style>

      {toast && (
        <div style={{
          position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)",
          background: "#0f172a", color: "#fff", borderRadius: "30px",
          padding: "10px 20px", fontSize: "13px", fontWeight: "600",
          zIndex: 200, animation: "fadeIn 0.2s ease", whiteSpace: "nowrap",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}>{toast}</div>
      )}

      <div style={{ background: "#0f172a", padding: "32px 24px 0" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "28px", fontWeight: "900", color: "#f8fafc" }}>
            Customer Tracker
          </div>
          <div style={{ fontSize: "13px", color: "#475569", marginTop: "3px", marginBottom: "20px" }}>
            {customers.length} customers
            {overdueCount > 0 && <span style={{ color: "#f87171" }}> · {overdueCount} overdue</span>}
            {dueSoonCount > 0 && <span style={{ color: "#f59e0b" }}> · {dueSoonCount} due soon</span>}
          </div>

          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍  Search by name or company..."
            style={{ width: "100%", background: "#1e293b", border: "none", borderRadius: "10px", padding: "11px 16px", fontSize: "14px", color: "#f1f5f9", outline: "none", marginBottom: "12px" }} />

          <div style={{ display: "flex", gap: "6px", paddingBottom: "16px" }}>
            {["All", "Overdue", "Due Soon"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "5px 13px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                whiteSpace: "nowrap", cursor: "pointer",
                background: filter === f ? "#f8fafc" : "transparent",
                color: filter === f ? "#0f172a" : "#64748b",
                border: filter === f ? "none" : "1px solid #1e293b",
              }}>{f}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px 24px 100px" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", color: "#94a3b8", padding: "60px 0", fontSize: "14px" }}>
            {customers.length === 0 ? "No customers yet. Tap + to add one!" : "No customers match this filter."}
          </div>
        )}
        {filtered.map(c => (
          <CustomerCard key={c.id} customer={c} onTap={setSelected} onCheckin={checkIn} />
        ))}
      </div>

      <button onClick={() => setShowAdd(true)} style={{
        position: "fixed", bottom: "28px", right: "24px",
        background: "#0f172a", color: "#fff", border: "none",
        borderRadius: "50px", padding: "14px 22px",
        fontSize: "15px", fontWeight: "700", cursor: "pointer",
        boxShadow: "0 4px 24px rgba(15,23,42,0.35)",
        fontFamily: "'Fraunces', Georgia, serif",
      }}>+ Add Customer</button>

      {selected && (
        <Modal customer={selected} onClose={() => setSelected(null)}
          onSave={saveCustomer} onDelete={deleteCustomer}
          isNew={false} onAddReminder={addReminder} />
      )}
      {showAdd && (
        <Modal customer={blank} onClose={() => setShowAdd(false)}
          onSave={saveCustomer} onDelete={() => {}}
          isNew={true} onAddReminder={addReminder} />
      )}
    </div>
  );
}
