"use client";

import { useState } from "react";

const ROASMap = () => {
  const [fullPay, setFullPay] = useState(22000);
  const [paymentPlanPct, setPaymentPlanPct] = useState(50);
  const [refundRate, setRefundRate] = useState(3);
  const [defaultRate, setDefaultRate] = useState(5);
  const [adSpend, setAdSpend] = useState(5000);
  const [sales, setSales] = useState(10);

  const planValue = fullPay * 0.25;
  const fullPaySales = sales * (1 - paymentPlanPct / 100);
  const planSales = sales * (paymentPlanPct / 100);
  const planCash = planSales * planValue;
  const grossCash = fullPaySales * fullPay + planCash;
  const defaultDeduction = planCash * (defaultRate / 100);
  const refundDeduction = grossCash * (refundRate / 100);
  const netCash = grossCash - defaultDeduction - refundDeduction;
  const roas = adSpend > 0 ? (netCash / adSpend).toFixed(2) : "0.00";
  const roasNum = parseFloat(roas);

  const roasColor = roasNum >= 3 ? "#2bbfd5" : roasNum >= 1.5 ? "#55bdf8" : "#9a17bb";
  const roasLabel = roasNum >= 3 ? "SCALE UP" : roasNum >= 1.5 ? "MAINTAIN" : "REDUCE SPEND";

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
        padding: "60px 24px",
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
          color: "rgba(255,255,255,0.9)",
          maxWidth: "600px",
          margin: "0 auto",
          fontWeight: "400"
        }}>
          Make data-driven ad spend decisions based on 90-day cash attribution
        </p>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "-40px auto 0", padding: "0 24px 60px" }}>
        
        {/* Decision Card - Above the Fold */}
        <div style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "48px",
          marginBottom: "32px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          textAlign: "center"
        }}>
          <div style={{
            fontSize: "14px",
            letterSpacing: "2px",
            color: "#3768b5",
            fontWeight: "600",
            marginBottom: "16px",
            textTransform: "uppercase"
          }}>
            Your Decision
          </div>
          <div style={{
            fontSize: "clamp(48px, 8vw, 72px)",
            fontWeight: "800",
            color: roasColor,
            marginBottom: "16px",
            lineHeight: 1
          }}>
            {roas}x ROAS
          </div>
          <div style={{
            display: "inline-block",
            background: roasColor,
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

        {/* Calculator Card - Above the Fold */}
        <div style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "48px",
          marginBottom: "32px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
        }}>
          <h2 style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#111314",
            marginBottom: "32px",
            marginTop: 0
          }}>
            Interactive Calculator
          </h2>

          {/* Sliders Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "32px",
            marginBottom: "40px"
          }}>
            <Slider
              label="Full Price"
              value={fullPay}
              min={1000}
              max={50000}
              step={500}
              onChange={setFullPay}
              color="#3768b5"
              format={v => `$${v.toLocaleString()}`}
            />
            <Slider
              label="Payment Plan %"
              value={paymentPlanPct}
              min={0}
              max={100}
              step={5}
              onChange={setPaymentPlanPct}
              color="#55bdf8"
              format={v => `${v}%`}
            />
            <Slider
              label="Plan Default Rate %"
              value={defaultRate}
              min={0}
              max={20}
              step={0.5}
              onChange={setDefaultRate}
              color="#9a17bb"
              format={v => `${v}%`}
            />
            <Slider
              label="Refund Rate %"
              value={refundRate}
              min={0}
              max={10}
              step={0.5}
              onChange={setRefundRate}
              color="#9a17bb"
              format={v => `${v}%`}
            />
            <Slider
              label="Ad Spend"
              value={adSpend}
              min={100}
              max={50000}
              step={100}
              onChange={setAdSpend}
              color="#2bbfd5"
              format={v => `$${v.toLocaleString()}`}
            />
            <Slider
              label="Total Ad Sales"
              value={sales}
              min={1}
              max={100}
              step={1}
              onChange={setSales}
              color="#2bbfd5"
              format={v => `${v} sales`}
            />
          </div>

          {/* Summary Grid */}
          <div style={{
            borderTop: "2px solid #f6f6f6",
            paddingTop: "32px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "24px"
          }}>
            <MetricCard
              label="Gross Cash"
              value={`$${grossCash.toLocaleString("en", { maximumFractionDigits: 0 })}`}
              color="#111314"
            />
            <MetricCard
              label="Default Deduction"
              value={`−$${defaultDeduction.toLocaleString("en", { maximumFractionDigits: 0 })}`}
              color="#9a17bb"
            />
            <MetricCard
              label="Refund Deduction"
              value={`−$${refundDeduction.toLocaleString("en", { maximumFractionDigits: 0 })}`}
              color="#9a17bb"
            />
            <MetricCard
              label="Net Cash @ 90d"
              value={`$${netCash.toLocaleString("en", { maximumFractionDigits: 0 })}`}
              color="#3768b5"
              highlight
            />
          </div>
        </div>

        {/* Educational Content - Below the Fold */}
        <div style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "48px",
          marginBottom: "32px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
        }}>
          <h2 style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#111314",
            marginBottom: "32px",
            marginTop: 0
          }}>
            How It Works
          </h2>

          {/* The 3 Inputs */}
          <div style={{ marginBottom: "48px" }}>
            <h3 style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#3768b5",
              marginBottom: "24px"
            }}>
              The 3 Revenue Inputs
            </h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "24px"
            }}>
              <InfoBox
                icon="💰"
                title="Full Pays"
                description="Customers who paid the full price upfront"
                color="#3768b5"
              />
              <InfoBox
                icon="📅"
                title="Payment Plans"
                description="Worth ¼ of full price at 90 days"
                color="#55bdf8"
              />
              <InfoBox
                icon="🖱️"
                title="Ad Clickers"
                description="Anyone who clicked an ad — list or not"
                color="#2bbfd5"
              />
            </div>
          </div>

          {/* The 90-Day Rule */}
          <div style={{ marginBottom: "48px" }}>
            <h3 style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#3768b5",
              marginBottom: "16px"
            }}>
              The 90-Day Rule
            </h3>
            <div style={{
              background: "#f6f6f6",
              padding: "24px",
              borderRadius: "12px",
              borderLeft: "4px solid #55bdf8"
            }}>
              <p style={{
                fontSize: "16px",
                lineHeight: 1.7,
                color: "#111314",
                margin: 0
              }}>
                Collect cash at <strong style={{ color: "#3768b5" }}>90 days</strong> — the attribution window for decision-making. 
                This is real cash-in-hand, not future projections. You can extend to 120–180 days if you have access to capital.
              </p>
            </div>
          </div>

          {/* Deductions */}
          <div style={{ marginBottom: "48px" }}>
            <h3 style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#3768b5",
              marginBottom: "24px"
            }}>
              Deductions
            </h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "24px"
            }}>
              <InfoBox
                icon="⚠️"
                title="Payment Plan Defaults"
                description="Buyers who stop paying before completing their plan (typically 5%)"
                color="#9a17bb"
              />
              <InfoBox
                icon="↩️"
                title="Refunds"
                description="Typical 2–3% off gross revenue, applies to all sales"
                color="#9a17bb"
              />
            </div>
          </div>

          {/* The Formula */}
          <div style={{ marginBottom: "48px" }}>
            <h3 style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#3768b5",
              marginBottom: "16px"
            }}>
              The Formula
            </h3>
            <div style={{
              background: "linear-gradient(135deg, #2bbfd5 0%, #9a17bb 100%)",
              padding: "32px",
              borderRadius: "12px",
              textAlign: "center"
            }}>
              <div style={{
                fontSize: "clamp(16px, 3vw, 20px)",
                color: "#ffffff",
                lineHeight: 1.8,
                fontWeight: "500"
              }}>
                <strong style={{ fontSize: "clamp(18px, 3.5vw, 24px)" }}>Decision-Making ROAS</strong>
                <br />
                = (Full Pays × Full Price) + (Plan Buyers × ¼ Price) − Defaults − Refunds
                <br />
                <span style={{ fontSize: "clamp(14px, 2.5vw, 18px)", opacity: 0.9 }}>
                  ÷ Ad Spend
                </span>
              </div>
            </div>
          </div>

          {/* Attribution Rule */}
          <div style={{
            background: "#f6f6f6",
            padding: "24px",
            borderRadius: "12px",
            borderLeft: "4px solid #2bbfd5"
          }}>
            <div style={{
              display: "flex",
              gap: "16px",
              alignItems: "flex-start"
            }}>
              <span style={{ fontSize: "24px", flexShrink: 0 }}>📌</span>
              <div style={{ fontSize: "15px", lineHeight: 1.7, color: "#111314" }}>
                <strong style={{ color: "#3768b5" }}>Attribution Rule:</strong> Anyone who <em>clicked on an ad</em> and 
                purchased is attributed — regardless of whether they were already on your list. Cash collected from those 
                people at 90 days (less defaults and refunds) is your Decision-Making ROAS. Use 120–180 days only if you 
                have access to capital.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "12px",
      alignItems: "baseline"
    }}>
      <label style={{
        fontSize: "14px",
        fontWeight: "600",
        color: "#111314"
      }}>
        {label}
      </label>
      <span style={{
        fontSize: "18px",
        fontWeight: "700",
        color: color
      }}>
        {format(value)}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={e => onChange(parseFloat(e.target.value))}
      style={{
        width: "100%",
        height: "6px",
        borderRadius: "3px",
        appearance: "none",
        background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, #e0e0e0 ${((value - min) / (max - min)) * 100}%, #e0e0e0 100%)`,
        outline: "none",
        cursor: "pointer"
      }}
    />
    <style jsx>{`
      input[type="range"]::-webkit-slider-thumb {
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: ${color};
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      }
      input[type="range"]::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: ${color};
        cursor: pointer;
        border: none;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      }
    `}</style>
  </div>
);

const MetricCard = ({ label, value, color, highlight }: {
  label: string;
  value: string;
  color: string;
  highlight?: boolean;
}) => (
  <div style={{
    background: highlight ? "#f6f6f6" : "transparent",
    padding: highlight ? "20px" : "12px 0",
    borderRadius: highlight ? "12px" : "0",
    border: highlight ? "2px solid #3768b5" : "none"
  }}>
    <div style={{
      fontSize: "12px",
      fontWeight: "600",
      color: "#888",
      marginBottom: "8px",
      textTransform: "uppercase",
      letterSpacing: "1px"
    }}>
      {label}
    </div>
    <div style={{
      fontSize: highlight ? "28px" : "24px",
      fontWeight: "700",
      color: color
    }}>
      {value}
    </div>
  </div>
);

const InfoBox = ({ icon, title, description, color }: {
  icon: string;
  title: string;
  description: string;
  color: string;
}) => (
  <div style={{
    background: "#f6f6f6",
    padding: "24px",
    borderRadius: "12px",
    borderTop: `4px solid ${color}`
  }}>
    <div style={{ fontSize: "32px", marginBottom: "12px" }}>{icon}</div>
    <h4 style={{
      fontSize: "16px",
      fontWeight: "700",
      color: "#111314",
      marginBottom: "8px",
      marginTop: 0
    }}>
      {title}
    </h4>
    <p style={{
      fontSize: "14px",
      lineHeight: 1.6,
      color: "#666",
      margin: 0
    }}>
      {description}
    </p>
  </div>
);

export default ROASMap;
