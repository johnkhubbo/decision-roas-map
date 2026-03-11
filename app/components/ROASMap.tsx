"use client";

import { useState } from "react";

const ROASMap = () => {
  const [fullPay, setFullPay] = useState(22000);
  const [paymentPlanPct, setPaymentPlanPct] = useState(50);
  const [refundRate, setRefundRate] = useState(3);
  const [adSpend, setAdSpend] = useState(5000);
  const [sales, setSales] = useState(10);

  const planValue = fullPay * 0.25;
  const fullPaySales = sales * (1 - paymentPlanPct / 100);
  const planSales = sales * (paymentPlanPct / 100);
  const grossCash = fullPaySales * fullPay + planSales * planValue;
  const refundDeduction = grossCash * (refundRate / 100);
  const netCash = grossCash - refundDeduction;
  const roas = adSpend > 0 ? (netCash / adSpend).toFixed(2) : "0.00";
  const roasNum = parseFloat(roas);

  const roasColor = roasNum >= 3 ? "#00ff87" : roasNum >= 1.5 ? "#ffd60a" : "#ff4d6d";
  const roasLabel = roasNum >= 3 ? "SCALE UP" : roasNum >= 1.5 ? "MAINTAIN" : "REDUCE SPEND";

  return (
    <div style={{
      fontFamily: "'Georgia', serif",
      background: "#0a0a0f",
      minHeight: "100vh",
      color: "#e8e0d5",
      padding: "40px 24px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background grid */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: "linear-gradient(rgba(255,214,10,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,214,10,0.03) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        pointerEvents: "none"
      }} />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "48px", position: "relative" }}>
        <div style={{
          fontSize: "11px", letterSpacing: "6px", color: "#ffd60a",
          textTransform: "uppercase", marginBottom: "12px", fontFamily: "'Georgia', serif"
        }}>
          Decision Framework
        </div>
        <h1 style={{
          fontSize: "clamp(28px, 5vw, 52px)", fontWeight: "normal",
          letterSpacing: "-1px", margin: 0, lineHeight: 1.1,
          fontFamily: "'Georgia', serif"
        }}>
          Decision-Making <span style={{ color: "#ffd60a", fontStyle: "italic" }}>ROAS</span> Map
        </h1>
        <div style={{ width: "60px", height: "1px", background: "#ffd60a", margin: "16px auto 0" }} />
      </div>

      {/* Flow Diagram */}
      <div style={{ maxWidth: "900px", margin: "0 auto 48px" }}>
        
        {/* Row 1: Inputs */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "8px", flexWrap: "wrap" }}>
          <FlowBox label="FULL PAYS" color="#ffd60a" icon="💰"
            desc="Full price, paid upfront" flex={1} />
          <FlowBox label="PAYMENT PLANS" color="#c77dff" icon="📅"
            desc="Worth ¼ of full price at 90 days" flex={1} />
          <FlowBox label="AD CLICKERS" color="#4cc9f0" icon="🖱️"
            desc="Anyone who clicked an ad — list or not" flex={1} />
        </div>

        {/* Arrow down */}
        <Arrow />

        {/* Row 2: 90-Day Rule */}
        <div style={{
          background: "rgba(255,214,10,0.06)",
          border: "1px solid rgba(255,214,10,0.3)",
          borderRadius: "12px", padding: "20px 24px",
          marginBottom: "8px", position: "relative"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <div style={{
              background: "#ffd60a", color: "#0a0a0f",
              fontSize: "11px", fontWeight: "bold", letterSpacing: "3px",
              padding: "4px 10px", borderRadius: "4px"
            }}>90-DAY RULE</div>
            <div style={{ fontSize: "15px", color: "#e8e0d5" }}>
              Collect cash at <strong style={{ color: "#ffd60a" }}>90 days</strong> — the attribution window for decision-making
            </div>
          </div>
          <div style={{ marginTop: "12px", display: "flex", gap: "24px", flexWrap: "wrap" }}>
            <Pill label="Full Pay" value={`$${fullPay.toLocaleString()}`} color="#ffd60a" />
            <Pill label="Plan Value @ 90d" value={`$${planValue.toLocaleString()}`} color="#c77dff" sub="(¼ of full price)" />
            <Pill label="Example Cash/Sale" value={`$${(fullPay * 0.75 + planValue * 0.25 * 2).toLocaleString()}`} color="#4cc9f0" sub="(50/50 split)" />
          </div>
        </div>

        <Arrow />

        {/* Row 3: Deductions */}
        <div style={{
          background: "rgba(255,77,109,0.06)",
          border: "1px solid rgba(255,77,109,0.3)",
          borderRadius: "12px", padding: "20px 24px",
          marginBottom: "8px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div style={{
              background: "#ff4d6d", color: "#fff",
              fontSize: "11px", fontWeight: "bold", letterSpacing: "3px",
              padding: "4px 10px", borderRadius: "4px"
            }}>DEDUCTIONS</div>
          </div>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px" }}>↩️</span>
              <span style={{ color: "#ff4d6d", fontWeight: "bold" }}>Refunds</span>
              <span style={{ color: "#aaa", fontSize: "13px" }}>— typical 2–3% off gross</span>
            </div>
            <div style={{
              fontSize: "13px", color: "#888",
              borderLeft: "1px solid #333", paddingLeft: "16px"
            }}>
              Only on sales attributed to ad traffic
            </div>
          </div>
        </div>

        <Arrow />

        {/* Row 4: The Formula */}
        <div style={{
          background: "rgba(76,201,240,0.06)",
          border: "2px solid rgba(76,201,240,0.4)",
          borderRadius: "12px", padding: "24px",
          marginBottom: "8px", textAlign: "center"
        }}>
          <div style={{ fontSize: "12px", letterSpacing: "4px", color: "#4cc9f0", marginBottom: "16px" }}>
            THE FORMULA
          </div>
          <div style={{
            fontSize: "clamp(13px, 2vw, 17px)",
            lineHeight: 2, color: "#e8e0d5"
          }}>
            <span style={{ color: "#4cc9f0", fontWeight: "bold", fontSize: "clamp(14px, 2.2vw, 19px)" }}>
              Decision-Making ROAS
            </span>
            {" = "}
            <span style={{ color: "#ffd60a" }}>(Full Pays × Full Price)</span>
            {" + "}
            <span style={{ color: "#c77dff" }}>(Plan Buyers × ¼ Price)</span>
            {" − "}
            <span style={{ color: "#ff4d6d" }}>Refunds</span>
            <br />
            <span style={{ color: "#888", fontSize: "clamp(12px, 1.8vw, 15px)" }}>
              ÷ Ad Spend{" "}
              <span style={{ color: "#555", fontSize: "12px" }}>
                [ all from cold traffic or ad clicks, regardless of list status ]
              </span>
            </span>
          </div>
        </div>

        <Arrow />

        {/* Row 5: Decision */}
        <div style={{
          background: `rgba(${roasNum >= 3 ? "0,255,135" : roasNum >= 1.5 ? "255,214,10" : "255,77,109"},0.08)`,
          border: `2px solid ${roasColor}`,
          borderRadius: "12px", padding: "24px",
          transition: "all 0.4s ease"
        }}>
          <div style={{ textAlign: "center", marginBottom: "8px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "4px", color: roasColor, marginBottom: "4px" }}>
              THE DECISION
            </div>
            <div style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: "bold", color: roasColor, letterSpacing: "-1px" }}>
              {roas}x ROAS
            </div>
            <div style={{
              display: "inline-block", background: roasColor, color: "#0a0a0f",
              fontSize: "12px", fontWeight: "bold", letterSpacing: "4px",
              padding: "6px 18px", borderRadius: "4px", marginTop: "8px"
            }}>
              {roasLabel}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Calculator */}
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px", padding: "32px"
        }}>
          <div style={{ fontSize: "11px", letterSpacing: "5px", color: "#888", marginBottom: "24px" }}>
            INTERACTIVE CALCULATOR
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px" }}>
            <Slider label="Full Price ($)" value={fullPay} min={1000} max={50000} step={500}
              onChange={setFullPay} color="#ffd60a" format={v => `$${v.toLocaleString()}`} />
            <Slider label="Payment Plan %" value={paymentPlanPct} min={0} max={100} step={5}
              onChange={setPaymentPlanPct} color="#c77dff" format={v => `${v}%`} />
            <Slider label="Refund Rate %" value={refundRate} min={0} max={10} step={0.5}
              onChange={setRefundRate} color="#ff4d6d" format={v => `${v}%`} />
            <Slider label="Ad Spend ($)" value={adSpend} min={100} max={50000} step={100}
              onChange={setAdSpend} color="#4cc9f0" format={v => `$${v.toLocaleString()}`} />
            <Slider label="Total Ad Sales" value={sales} min={1} max={100} step={1}
              onChange={setSales} color="#00ff87" format={v => `${v} sales`} />
          </div>

          {/* Summary */}
          <div style={{
            marginTop: "28px", paddingTop: "24px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "16px"
          }}>
            <SummaryItem label="Gross Cash" value={`$${grossCash.toLocaleString("en", { maximumFractionDigits: 0 })}`} />
            <SummaryItem label="Refund Deduction" value={`−$${refundDeduction.toLocaleString("en", { maximumFractionDigits: 0 })}`} color="#ff4d6d" />
            <SummaryItem label="Net Cash @ 90d" value={`$${netCash.toLocaleString("en", { maximumFractionDigits: 0 })}`} color="#ffd60a" />
            <SummaryItem label="Decision ROAS" value={`${roas}x`} color={roasColor} big />
          </div>
        </div>

        {/* Attribution Rule callout */}
        <div style={{
          marginTop: "20px",
          background: "rgba(76,201,240,0.04)",
          border: "1px solid rgba(76,201,240,0.15)",
          borderRadius: "10px", padding: "16px 20px",
          display: "flex", gap: "12px", alignItems: "flex-start"
        }}>
          <span style={{ fontSize: "18px", flexShrink: 0 }}>📌</span>
          <div style={{ fontSize: "13px", color: "#aaa", lineHeight: 1.7 }}>
            <strong style={{ color: "#4cc9f0" }}>Attribution Rule:</strong> Anyone who <em>clicked on an ad</em> and purchased is attributed — 
            regardless of whether they were already on your list. Cash collected from those people at 90 days 
            (less refunds) is your Decision-Making ROAS. Use 120–180 days only if you have access to capital.
          </div>
        </div>
      </div>
    </div>
  );
};

const FlowBox = ({ label, color, icon, desc, flex }: { 
  label: string; 
  color: string; 
  icon: string; 
  desc: string; 
  flex: number;
}) => (
  <div style={{
    flex, minWidth: "160px",
    background: `rgba(${color === "#ffd60a" ? "255,214,10" : color === "#c77dff" ? "199,125,255" : "76,201,240"},0.07)`,
    border: `1px solid ${color}44`,
    borderRadius: "10px", padding: "16px",
    display: "flex", flexDirection: "column", gap: "6px"
  }}>
    <div style={{ fontSize: "22px" }}>{icon}</div>
    <div style={{ fontSize: "11px", letterSpacing: "3px", color, fontWeight: "bold" }}>{label}</div>
    <div style={{ fontSize: "12px", color: "#888", lineHeight: 1.5 }}>{desc}</div>
  </div>
);

const Arrow = () => (
  <div style={{ textAlign: "center", fontSize: "20px", color: "#444", margin: "4px 0" }}>↓</div>
);

const Pill = ({ label, value, color, sub }: { 
  label: string; 
  value: string; 
  color: string; 
  sub?: string;
}) => (
  <div>
    <div style={{ fontSize: "11px", color: "#666", letterSpacing: "2px", marginBottom: "2px" }}>{label}</div>
    <div style={{ fontSize: "18px", fontWeight: "bold", color }}>{value}</div>
    {sub && <div style={{ fontSize: "11px", color: "#555" }}>{sub}</div>}
  </div>
);

const Slider = ({ label, value, min, max, step, onChange, color, format }: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  color: string;
  format: (value: number) => string;
}) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
      <span style={{ fontSize: "11px", letterSpacing: "2px", color: "#777" }}>{label}</span>
      <span style={{ fontSize: "13px", fontWeight: "bold", color }}>{format(value)}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={e => onChange(parseFloat(e.target.value))}
      style={{ width: "100%", accentColor: color, cursor: "pointer" }} />
  </div>
);

const SummaryItem = ({ label, value, color = "#e8e0d5", big }: {
  label: string;
  value: string;
  color?: string;
  big?: boolean;
}) => (
  <div>
    <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#555", marginBottom: "4px" }}>{label}</div>
    <div style={{ fontSize: big ? "26px" : "16px", fontWeight: "bold", color }}>{value}</div>
  </div>
);

export default ROASMap;
