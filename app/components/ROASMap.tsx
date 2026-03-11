"use client";

import { useState, useEffect, useRef } from "react";

const fmt = (n: number) => n?.toLocaleString("en-US", { maximumFractionDigits: 0 }) ?? "0";
const fmtX = (n: number) => (isNaN(n) || !isFinite(n) ? "—" : n.toFixed(2) + "x");

const EMPTY = {
  meta: "", youtube: "",
  htSales: "", htPlans: "",
  mtSales: "", mtPlans: "",
  upsellUnits: "",
  collection: "95",
};

function calcROAS(d: any) {
  const meta = +d.meta || 0, yt = +d.youtube || 0;
  const htS = +d.htSales || 0, htP = +d.htPlans || 0;
  const mtS = +d.mtSales || 0, mtP = +d.mtPlans || 0;
  const upsell = +d.upsellUnits || 0;
  const col = (+d.collection || 95) / 100;
  const spend = meta + yt;
  const htFull = Math.max(0, htS - htP), htPlan = Math.min(htP, htS);
  const mtFull = Math.max(0, mtS - mtP), mtPlan = Math.min(mtP, mtS);
  const gross = htFull * 30000 + htPlan * 7500 + mtFull * 20000 + mtPlan * 5000 + upsell * 49;
  const net = gross * col;
  const roas = spend > 0 ? net / spend : 0;
  return { spend, gross, net, roas, col };
}

function useAnimatedNumber(value: number) {
  const [display, setDisplay] = useState(value);
  const ref = useRef<number | null>(null);
  useEffect(() => {
    if (ref.current) cancelAnimationFrame(ref.current);
    const start = display, end = value, dur = 400, startTime = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - startTime) / dur, 1);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setDisplay(start + (end - start) * ease);
      if (t < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [value, display]);
  return display;
}

function InputField({ label, prefix, value, onChange, placeholder = "0" }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "0.08em", color: "#8892a4", textTransform: "uppercase" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {prefix && (
          <span style={{
            position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
            fontSize: "14px", color: "#64748b", fontFamily: "'DM Mono', monospace", pointerEvents: "none"
          }}>{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: prefix ? "12px 14px 12px 26px" : "12px 14px",
            background: "#f8fafc",
            border: "1.5px solid #e2e8f0",
            borderRadius: "10px",
            fontSize: "15px",
            fontFamily: "'DM Mono', monospace",
            color: "#0f172a",
            outline: "none",
            transition: "border-color 0.15s, box-shadow 0.15s",
            WebkitAppearance: "none",
          }}
          onFocus={e => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; e.target.style.background = "#fff"; }}
          onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; e.target.style.background = "#f8fafc"; }}
        />
      </div>
    </div>
  );
}

function TierBlock({ title, price, salesVal, plansVal, onSales, onPlans }: any) {
  return (
    <div style={{
      background: "#fff",
      border: "1.5px solid #e2e8f0",
      borderRadius: "14px",
      padding: "18px",
      display: "flex", flexDirection: "column", gap: "14px"
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", letterSpacing: "-0.01em" }}>{title}</span>
        <span style={{
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          color: "#fff", fontSize: "12px", fontWeight: "700",
          padding: "3px 10px", borderRadius: "20px", letterSpacing: "0.02em"
        }}>${(price / 1000).toFixed(0)}k</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <InputField label="Sales" value={salesVal} onChange={onSales} />
        <InputField label="On Plans" value={plansVal} onChange={onPlans} />
      </div>
    </div>
  );
}

function ROASBadge({ roas }: any) {
  const animVal = useAnimatedNumber(isFinite(roas) ? roas : 0);
  const decision = roas >= 3 ? { label: "SCALE UP", bg: "linear-gradient(135deg, #10b981, #059669)", dot: "#34d399" }
    : roas >= 1.5 ? { label: "MAINTAIN", bg: "linear-gradient(135deg, #f59e0b, #d97706)", dot: "#fbbf24" }
    : { label: "REDUCE SPEND", bg: "linear-gradient(135deg, #ef4444, #dc2626)", dot: "#f87171" };

  return (
    <div style={{
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      borderRadius: "20px",
      padding: "28px 32px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      boxShadow: "0 20px 60px rgba(15,23,42,0.18), 0 4px 16px rgba(15,23,42,0.1)",
      flexWrap: "wrap", gap: "20px",
      position: "sticky", top: "16px", zIndex: 10
    }}>
      <div>
        <div style={{ fontSize: "11px", letterSpacing: "0.12em", color: "#64748b", fontWeight: "600", marginBottom: "6px" }}>
          DECISION-MAKING ROAS
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <span style={{
            fontSize: "clamp(42px, 6vw, 64px)",
            fontWeight: "800",
            fontFamily: "'DM Mono', monospace",
            background: "linear-gradient(135deg, #fff 40%, #a5b4fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1, letterSpacing: "-0.03em"
          }}>
            {animVal > 0 ? animVal.toFixed(2) : "—"}
          </span>
          {animVal > 0 && <span style={{ fontSize: "22px", color: "#6366f1", fontWeight: "700" }}>x</span>}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
        <div style={{
          background: decision.bg,
          padding: "8px 20px", borderRadius: "50px",
          fontSize: "12px", fontWeight: "800", letterSpacing: "0.1em",
          color: "#fff", whiteSpace: "nowrap",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)"
        }}>{decision.label}</div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: decision.dot }} />
          <span style={{ fontSize: "11px", color: "#64748b", letterSpacing: "0.05em" }}>
            {roas > 0 ? `${(roas >= 1 ? "+" : "")}${((roas - 1) * 100).toFixed(0)}% on ad spend` : "Enter data to calculate"}
          </span>
        </div>
      </div>
    </div>
  );
}

function StatsRow({ spend, gross, net, col }: any) {
  const stats = [
    { label: "Ad Spend", value: `$${fmt(spend)}`, color: "#6366f1" },
    { label: "Gross Revenue", value: `$${fmt(gross)}`, color: "#8b5cf6" },
    { label: "Collection Rate", value: `${(col * 100).toFixed(0)}%`, color: "#f59e0b" },
    { label: "Net @ 90 Days", value: `$${fmt(net)}`, color: "#10b981" },
  ];
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px",
    }}>
      {stats.map(s => (
        <div key={s.label} style={{
          background: "#fff",
          border: "1.5px solid #e2e8f0",
          borderRadius: "12px",
          padding: "14px 16px",
        }}>
          <div style={{ fontSize: "10px", color: "#94a3b8", letterSpacing: "0.08em", fontWeight: "600", marginBottom: "6px" }}>
            {s.label.toUpperCase()}
          </div>
          <div style={{ fontSize: "16px", fontWeight: "800", color: s.color, fontFamily: "'DM Mono', monospace", letterSpacing: "-0.02em" }}>
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ROASCalculator() {
  const [tab, setTab] = useState("predictions");
  const [pred, setPred] = useState({ ...EMPTY, meta: "3000", youtube: "2000", htSales: "6", htPlans: "3", mtSales: "4", mtPlans: "2", upsellUnits: "8" });
  const [act, setAct] = useState(EMPTY);

  const data = tab === "predictions" ? pred : act;
  const setData = tab === "predictions" ? setPred : setAct;
  const upd = (key: string) => (val: string) => setData((d: any) => ({ ...d, [key]: val }));

  const { spend, gross, net, roas, col } = calcROAS(data);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f1f5f9",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      padding: "24px 16px 60px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500;700&display=swap');
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        * { box-sizing: border-box; }
      `}</style>

      {/* Page Title */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "0.15em", color: "#6366f1", fontWeight: "700", marginBottom: "8px" }}>
          90-DAY CASH ATTRIBUTION
        </div>
        <h1 style={{ margin: 0, fontSize: "clamp(22px, 4vw, 32px)", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.03em" }}>
          Decision-Making ROAS
        </h1>
      </div>

      <div style={{ maxWidth: "780px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* ROAS Hero */}
        <ROASBadge roas={roas} />

        {/* Tab Switcher */}
        <div style={{
          background: "#e2e8f0",
          borderRadius: "14px",
          padding: "4px",
          display: "grid", gridTemplateColumns: "1fr 1fr",
        }}>
          {["predictions", "actuals"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "12px",
              borderRadius: "11px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "700",
              letterSpacing: "0.01em",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s",
              background: tab === t ? "#fff" : "transparent",
              color: tab === t ? "#0f172a" : "#64748b",
              boxShadow: tab === t ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
            }}>
              {t === "predictions" ? "📊 Predictions" : "✅ Actuals"}
            </button>
          ))}
        </div>

        {/* Main Card */}
        <div style={{
          background: "#f8fafc",
          border: "1.5px solid #e2e8f0",
          borderRadius: "20px",
          padding: "24px",
          display: "flex", flexDirection: "column", gap: "20px",
          boxShadow: "0 4px 24px rgba(15,23,42,0.06)"
        }}>

          {/* Ad Spend */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
              <div style={{ width: "3px", height: "18px", background: "linear-gradient(180deg, #6366f1, #8b5cf6)", borderRadius: "2px" }} />
              <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", color: "#6366f1", textTransform: "uppercase" }}>Ad Spend</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <InputField label="Meta Spend" prefix="$" value={data.meta} onChange={upd("meta")} />
              <InputField label="YouTube Spend" prefix="$" value={data.youtube} onChange={upd("youtube")} />
            </div>
          </div>

          <div style={{ height: "1px", background: "#e2e8f0" }} />

          {/* Sales Tiers */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
              <div style={{ width: "3px", height: "18px", background: "linear-gradient(180deg, #8b5cf6, #a855f7)", borderRadius: "2px" }} />
              <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", color: "#8b5cf6", textTransform: "uppercase" }}>Sales Tiers</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <TierBlock title="High Ticket" price={30000}
                salesVal={data.htSales} plansVal={data.htPlans}
                onSales={upd("htSales")} onPlans={upd("htPlans")} />
              <TierBlock title="Mid Ticket" price={20000}
                salesVal={data.mtSales} plansVal={data.mtPlans}
                onSales={upd("mtSales")} onPlans={upd("mtPlans")} />
            </div>
          </div>

          <div style={{ height: "1px", background: "#e2e8f0" }} />

          {/* Upsells + Collection */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <div style={{ width: "3px", height: "18px", background: "linear-gradient(180deg, #10b981, #059669)", borderRadius: "2px" }} />
                <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", color: "#10b981", textTransform: "uppercase" }}>Upsell</span>
              </div>
              <div style={{
                background: "#fff", border: "1.5px solid #e2e8f0",
                borderRadius: "14px", padding: "18px",
                display: "flex", flexDirection: "column", gap: "14px"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>Add-on</span>
                  <span style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", fontSize: "12px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px" }}>$49</span>
                </div>
                <InputField label="Units Sold" value={data.upsellUnits} onChange={upd("upsellUnits")} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <div style={{ width: "3px", height: "18px", background: "linear-gradient(180deg, #f59e0b, #d97706)", borderRadius: "2px" }} />
                <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", color: "#f59e0b", textTransform: "uppercase" }}>Collection</span>
              </div>
              <div style={{
                background: "#fff", border: "1.5px solid #e2e8f0",
                borderRadius: "14px", padding: "18px",
                display: "flex", flexDirection: "column", gap: "14px", height: "calc(100% - 32px)"
              }}>
                <div>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>Cash Collection Rate</span>
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "3px" }}>Covers refunds, defaults & chargebacks</div>
                </div>
                <InputField label="Collection %" value={data.collection} onChange={upd("collection")} placeholder="95" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <StatsRow spend={spend} gross={gross} net={net} col={col} />

        {/* Attribution note */}
        <div style={{
          background: "#fff",
          border: "1.5px solid #e0e7ff",
          borderRadius: "12px",
          padding: "14px 18px",
          display: "flex", gap: "10px", alignItems: "flex-start"
        }}>
          <span style={{ fontSize: "16px", flexShrink: 0 }}>📌</span>
          <p style={{ margin: 0, fontSize: "12px", color: "#64748b", lineHeight: 1.7 }}>
            <strong style={{ color: "#6366f1" }}>Attribution:</strong> Anyone who clicked an ad and purchased is attributed — regardless of whether they were on your list. Payment plan buyers are worth <strong>¼ of full price</strong> at 90 days.
          </p>
        </div>
      </div>
    </div>
  );
}
