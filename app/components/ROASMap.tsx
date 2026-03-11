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

const ROASMap = () => {
  const [activeView, setActiveView] = useState<"predictions" | "actuals">("predictions");
  const [pred, setPred] = useState({ ...EMPTY, meta: "3000", youtube: "2000", htSales: "6", htPlans: "3", mtSales: "4", mtPlans: "2", upsellUnits: "8" });
  const [act, setAct] = useState({ ...EMPTY });

  const predicted = calcROAS(pred);
  const actual = calcROAS(act);
  const actualsHasData = +act.meta > 0 || +act.youtube > 0 || +act.htSales > 0 || +act.mtSales > 0;

  const displayROAS = actualsHasData ? actual.roas : predicted.roas;
  const roasLabel = displayROAS >= 3 ? "SCALE UP" : displayROAS >= 1.5 ? "MAINTAIN" : "REDUCE SPEND";

  const animatedPredROAS = useAnimatedNumber(predicted.roas);
  const animatedActROAS = useAnimatedNumber(actual.roas);

  const variance = actualsHasData && predicted.roas > 0
    ? (((actual.roas - predicted.roas) / predicted.roas) * 100).toFixed(1)
    : "0.0";

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: "#f6f6f6",
      minHeight: "100vh",
      color: "#111314",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #2bbfd5 0%, #9a17bb 100%)",
        padding: "60px 24px 80px",
        textAlign: "center"
      }}>
        <h1 style={{
          fontSize: "clamp(32px, 5vw, 56px)",
          fontWeight: "700",
          color: "#ffffff",
          margin: "0 0 16px 0",
          lineHeight: 1.2,
        }}>
          Decision-Making ROAS Map
        </h1>
        <p style={{
          fontSize: "18px",
          color: "rgba(255,255,255,0.95)",
          maxWidth: "700px",
          margin: "0 auto",
          fontWeight: "400",
          lineHeight: 1.6
        }}>
          Track predicted vs actual performance at 90 days, then model what-if scenarios to optimize your funnel.
        </p>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1400px", margin: "-60px auto 0", padding: "0 24px 60px" }}>
        
        {/* Toggle Control */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "24px"
        }}>
          <div style={{
            display: "inline-flex",
            background: "#f6f6f6",
            borderRadius: "12px",
            padding: "4px",
            gap: "4px"
          }}>
            <button
              onClick={() => setActiveView("predictions")}
              style={{
                padding: "12px 48px",
                fontSize: "16px",
                fontWeight: "700",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontFamily: "inherit",
                background: activeView === "predictions" 
                  ? "linear-gradient(135deg, #2bbfd5 0%, #9a17bb 100%)" 
                  : "transparent",
                color: activeView === "predictions" ? "#ffffff" : "#666",
                boxShadow: activeView === "predictions" ? "0 2px 8px rgba(43, 191, 213, 0.3)" : "none"
              }}
            >
              Predictions
            </button>
            <button
              onClick={() => setActiveView("actuals")}
              style={{
                padding: "12px 48px",
                fontSize: "16px",
                fontWeight: "700",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontFamily: "inherit",
                background: activeView === "actuals" 
                  ? "linear-gradient(135deg, #2bbfd5 0%, #9a17bb 100%)" 
                  : "transparent",
                color: activeView === "actuals" ? "#ffffff" : "#666",
                boxShadow: activeView === "actuals" ? "0 2px 8px rgba(43, 191, 213, 0.3)" : "none"
              }}
            >
              Actuals
            </button>
          </div>
        </div>

        {/* Calculator Card */}
        <div style={{
          maxWidth: "1100px",
          margin: "0 auto 32px",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "48px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
        }}>
          {activeView === "predictions" && (
            <>
              <div style={{ marginBottom: "32px" }}>
                <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#111314", margin: "0 0 4px 0" }}>
                  Predictions
                </h2>
                <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                  Fill in before campaign launch
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", marginBottom: "32px" }}>
                {/* Left Column */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", color: "#3768b5", textTransform: "uppercase" }}>
                    Ad Spend
                  </div>
                  <InputField label="Meta Spend" prefix="$" value={pred.meta} onChange={(v: string) => setPred({...pred, meta: v})} />
                  <InputField label="YouTube Spend" prefix="$" value={pred.youtube} onChange={(v: string) => setPred({...pred, youtube: v})} />
                </div>

                {/* Right Column */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", color: "#3768b5", textTransform: "uppercase" }}>
                    Sales
                  </div>
                  <InputField label="High Ticket Sales ($30k)" value={pred.htSales} onChange={(v: string) => setPred({...pred, htSales: v})} />
                  <InputField label="High Ticket Payment Plans" value={pred.htPlans} onChange={(v: string) => setPred({...pred, htPlans: v})} />
                  <InputField label="Mid Ticket Sales ($20k)" value={pred.mtSales} onChange={(v: string) => setPred({...pred, mtSales: v})} />
                  <InputField label="Mid Ticket Payment Plans" value={pred.mtPlans} onChange={(v: string) => setPred({...pred, mtPlans: v})} />
                  <InputField label="Upsell Units ($49)" value={pred.upsellUnits} onChange={(v: string) => setPred({...pred, upsellUnits: v})} />
                </div>
              </div>

              {/* Summary + ROAS */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
                padding: "28px 0",
                borderTop: "2px solid #f6f6f6"
              }}>
                <MetricCard label="Ad Spend" value={`$${fmt(predicted.spend)}`} />
                <MetricCard label="Gross Revenue" value={`$${fmt(predicted.gross)}`} />
                <MetricCard label="Net @ 90d" value={`$${fmt(predicted.net)}`} highlight />
                <MetricCard label="ROAS" value={fmtX(animatedPredROAS)} highlight color="#6366f1" />
              </div>
            </>
          )}

          {activeView === "actuals" && (
            <>
              <div style={{ marginBottom: "32px" }}>
                <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#111314", margin: "0 0 4px 0" }}>
                  Actuals
                </h2>
                <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                  Fill in at 90 days from real data
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", marginBottom: "32px" }}>
                {/* Left Column */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", color: "#3768b5", textTransform: "uppercase" }}>
                    Ad Spend
                  </div>
                  <InputField label="Meta Spend" prefix="$" value={act.meta} onChange={(v: string) => setAct({...act, meta: v})} />
                  <InputField label="YouTube Spend" prefix="$" value={act.youtube} onChange={(v: string) => setAct({...act, youtube: v})} />
                </div>

                {/* Right Column */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", color: "#3768b5", textTransform: "uppercase" }}>
                    Sales
                  </div>
                  <InputField label="High Ticket Sales ($30k)" value={act.htSales} onChange={(v: string) => setAct({...act, htSales: v})} />
                  <InputField label="High Ticket Payment Plans" value={act.htPlans} onChange={(v: string) => setAct({...act, htPlans: v})} />
                  <InputField label="Mid Ticket Sales ($20k)" value={act.mtSales} onChange={(v: string) => setAct({...act, mtSales: v})} />
                  <InputField label="Mid Ticket Payment Plans" value={act.mtPlans} onChange={(v: string) => setAct({...act, mtPlans: v})} />
                  <InputField label="Upsell Units ($49)" value={act.upsellUnits} onChange={(v: string) => setAct({...act, upsellUnits: v})} />
                </div>
              </div>

              {/* Summary + ROAS */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
                padding: "28px 0",
                borderTop: "2px solid #f6f6f6"
              }}>
                <MetricCard label="Ad Spend" value={`$${fmt(actual.spend)}`} />
                <MetricCard label="Gross Revenue" value={`$${fmt(actual.gross)}`} />
                <MetricCard label="Net @ 90d" value={`$${fmt(actual.net)}`} highlight />
                <MetricCard label="ROAS" value={fmtX(animatedActROAS)} highlight color="#6366f1" />
              </div>
            </>
          )}
        </div>

        {/* Summary Bar */}
        <div style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "32px 48px",
          marginBottom: "32px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "16px"
          }}>
            <h2 style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#111314",
              margin: 0
            }}>
              Summary
            </h2>
            <div style={{
              display: "inline-block",
              background: "#55bdf8",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "700",
              letterSpacing: "2px",
              padding: "12px 32px",
              borderRadius: "8px"
            }}>
              {roasLabel}
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "24px"
          }}>
            <ComparisonMetric
              label="ROAS"
              predicted={fmtX(predicted.roas)}
              actual={fmtX(actual.roas)}
              hasActualData={actualsHasData}
            />
            <ComparisonMetric
              label="Total Ad Spend"
              predicted={`$${fmt(predicted.spend)}`}
              actual={`$${fmt(actual.spend)}`}
              hasActualData={actualsHasData}
            />
            <ComparisonMetric
              label="Net Revenue"
              predicted={`$${fmt(predicted.net)}`}
              actual={`$${fmt(actual.net)}`}
              hasActualData={actualsHasData}
            />
            <ComparisonMetric
              label="Variance"
              predicted="—"
              actual={actualsHasData ? `${variance}%` : "—"}
              hasActualData={actualsHasData}
              isVariance
            />
          </div>
        </div>

        {/* Rest of content remains the same - Educational section, etc. */}
        <div style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "48px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
        }}>
          <h2 style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#111314",
            marginBottom: "16px",
            marginTop: 0
          }}>
            How It Works
          </h2>
          <p style={{
            fontSize: "16px",
            lineHeight: 1.7,
            color: "#666",
            margin: 0
          }}>
            This calculator helps you make data-driven ad spend decisions based on 90-day cash attribution. Payment plans are worth 25% of tier price at 90 days. High Ticket = $30k, Mid Ticket = $20k, Upsell = $49.
          </p>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, highlight, color }: any) => (
  <div style={{
    padding: highlight ? "16px 20px" : "12px 16px",
    background: highlight ? "#f8fafc" : "transparent",
    borderRadius: "10px",
    border: highlight ? "2px solid #e2e8f0" : "none"
  }}>
    <div style={{
      fontSize: "11px",
      fontWeight: "600",
      color: "#8892a4",
      marginBottom: "6px",
      textTransform: "uppercase",
      letterSpacing: "0.08em"
    }}>
      {label}
    </div>
    <div style={{
      fontSize: highlight ? "28px" : "20px",
      fontWeight: "700",
      color: color || "#0f172a",
      fontFamily: highlight ? "'DM Mono', monospace" : "inherit"
    }}>
      {value}
    </div>
  </div>
);

const ComparisonMetric = ({ label, predicted, actual, hasActualData, isVariance }: any) => {
  const varianceNum = parseFloat(actual.replace("%", ""));
  const varianceColor = isVariance && hasActualData
    ? varianceNum > 0 ? "#2bbfd5" : varianceNum < 0 ? "#9a17bb" : "#666"
    : "#666";

  return (
    <div>
      <div style={{
        fontSize: "12px",
        color: "#888",
        marginBottom: "12px",
        textTransform: "uppercase",
        letterSpacing: "1px",
        fontWeight: "600"
      }}>
        {label}
      </div>
      <div style={{ display: "flex", gap: "16px", alignItems: "baseline" }}>
        <div>
          <div style={{ fontSize: "11px", color: "#999", marginBottom: "2px" }}>Pred</div>
          <div style={{ fontSize: "18px", fontWeight: "700", color: "#3768b5" }}>{predicted}</div>
        </div>
        <div>
          <div style={{ fontSize: "11px", color: "#999", marginBottom: "2px" }}>Actual</div>
          <div style={{
            fontSize: "18px",
            fontWeight: "700",
            color: hasActualData ? (isVariance ? varianceColor : "#111314") : "#ccc"
          }}>
            {actual}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROASMap;
