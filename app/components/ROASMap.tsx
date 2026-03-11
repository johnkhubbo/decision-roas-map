"use client";

import { useState } from "react";

const ROASMap = () => {
  // Predictions Column
  const [predMetaSpend, setPredMetaSpend] = useState(3000);
  const [predYouTubeSpend, setPredYouTubeSpend] = useState(2000);
  const [predSales20k, setPredSales20k] = useState(4);
  const [predSales30k, setPredSales30k] = useState(6);
  const [predPaymentPlanBuyers, setPredPaymentPlanBuyers] = useState(5);
  const [predUpsellUnits, setPredUpsellUnits] = useState(8);
  const [predCashCollectionRate, setPredCashCollectionRate] = useState(95);

  // Actuals Column
  const [actMetaSpend, setActMetaSpend] = useState(0);
  const [actYouTubeSpend, setActYouTubeSpend] = useState(0);
  const [actSales20k, setActSales20k] = useState(0);
  const [actSales30k, setActSales30k] = useState(0);
  const [actPaymentPlanBuyers, setActPaymentPlanBuyers] = useState(0);
  const [actUpsellUnits, setActUpsellUnits] = useState(0);
  const [actCashCollectionRate, setActCashCollectionRate] = useState(95);

  // Scenario Planner Sliders
  const [scenarioCTR, setScenarioCTR] = useState(2);
  const [scenarioRegConversion, setScenarioRegConversion] = useState(40);
  const [scenarioSalesConversion, setScenarioSalesConversion] = useState(15);
  const [scenarioUpgradeRate, setScenarioUpgradeRate] = useState(60);
  const [scenarioUpsellRate, setScenarioUpsellRate] = useState(80);
  const [scenarioCashCollection, setScenarioCashCollection] = useState(95);

  // Calculate ROAS for a given set of inputs
  const calculateROAS = (
    metaSpend: number,
    youtubeSpend: number,
    sales20k: number,
    sales30k: number,
    paymentPlanBuyers: number,
    upsellUnits: number,
    cashCollectionRate: number
  ) => {
    const totalSales = sales20k + sales30k;
    if (totalSales === 0) return { roas: "0.00", netRevenue: 0, grossRevenue: 0, totalAdSpend: 0 };

    // Split payment plan buyers proportionally across tiers
    const sales20kRatio = sales20k / totalSales;
    const sales30kRatio = sales30k / totalSales;
    const paymentPlan20k = Math.round(paymentPlanBuyers * sales20kRatio);
    const paymentPlan30k = paymentPlanBuyers - paymentPlan20k;

    // Full pay buyers = total sales - payment plan buyers at each tier
    const fullPay20k = sales20k - paymentPlan20k;
    const fullPay30k = sales30k - paymentPlan30k;

    // Revenue calculations
    const fullPayRevenue = fullPay20k * 20000 + fullPay30k * 30000;
    const paymentPlanRevenue = paymentPlan20k * 5000 + paymentPlan30k * 7500; // 25% of tier price
    const upsellRevenue = upsellUnits * 49;
    const grossRevenue = fullPayRevenue + paymentPlanRevenue + upsellRevenue;
    const netRevenue = grossRevenue * (cashCollectionRate / 100);

    const totalAdSpend = metaSpend + youtubeSpend;
    const roas = totalAdSpend > 0 ? (netRevenue / totalAdSpend).toFixed(2) : "0.00";

    return { roas, netRevenue, grossRevenue, totalAdSpend };
  };

  const predicted = calculateROAS(
    predMetaSpend,
    predYouTubeSpend,
    predSales20k,
    predSales30k,
    predPaymentPlanBuyers,
    predUpsellUnits,
    predCashCollectionRate
  );

  const actualsHasData = actMetaSpend > 0 || actYouTubeSpend > 0 || actSales20k > 0 || actSales30k > 0;

  const actual = calculateROAS(
    actMetaSpend,
    actYouTubeSpend,
    actSales20k,
    actSales30k,
    actPaymentPlanBuyers,
    actUpsellUnits,
    actCashCollectionRate
  );

  // Variance calculation
  const variance = actualsHasData && parseFloat(predicted.roas) > 0
    ? (((parseFloat(actual.roas) - parseFloat(predicted.roas)) / parseFloat(predicted.roas)) * 100).toFixed(1)
    : "0.0";

  // Decision logic: use actual if available, otherwise predicted
  const displayROAS = actualsHasData ? parseFloat(actual.roas) : parseFloat(predicted.roas);
  const roasLabel = displayROAS >= 3 ? "SCALE UP" : displayROAS >= 1.5 ? "MAINTAIN" : "REDUCE SPEND";

  // Scenario Planner: use actuals as baseline, fall back to predictions
  const baselineMetaSpend = actualsHasData ? actMetaSpend : predMetaSpend;
  const baselineYouTubeSpend = actualsHasData ? actYouTubeSpend : predYouTubeSpend;
  const baselineSales20k = actualsHasData ? actSales20k : predSales20k;
  const baselineSales30k = actualsHasData ? actSales30k : predSales30k;
  const baselinePaymentPlanBuyers = actualsHasData ? actPaymentPlanBuyers : predPaymentPlanBuyers;
  const baselineUpsellUnits = actualsHasData ? actUpsellUnits : predUpsellUnits;

  // Scenario calculations (simplified - adjust volumes based on sliders)
  const scenarioTotalAdSpend = baselineMetaSpend + baselineYouTubeSpend;
  const scenarioTotalSales = Math.round((baselineSales20k + baselineSales30k) * (scenarioSalesConversion / 15)); // Scale based on sales conversion
  const scenarioSales30k = Math.round(scenarioTotalSales * (scenarioUpgradeRate / 100));
  const scenarioSales20k = scenarioTotalSales - scenarioSales30k;
  const scenarioPaymentPlanBuyers = Math.round(baselinePaymentPlanBuyers * (scenarioSalesConversion / 15));
  const scenarioUpsellUnits = Math.round(scenarioTotalSales * (scenarioUpsellRate / 100));

  const scenario = calculateROAS(
    baselineMetaSpend,
    baselineYouTubeSpend,
    scenarioSales20k,
    scenarioSales30k,
    scenarioPaymentPlanBuyers,
    scenarioUpsellUnits,
    scenarioCashCollection
  );

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
      <div style={{ maxWidth: "1400px", margin: "-40px auto 0", padding: "0 24px 60px" }}>
        
        {/* How It Works Section */}
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

          {/* The Formula */}
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
              = Net Revenue @ 90 Days ÷ Total Ad Spend
              <br />
              <span style={{ fontSize: "clamp(14px, 2.5vw, 18px)", opacity: 0.9 }}>
                (Payment plans worth 25% • Cash collection applied to gross)
              </span>
            </div>
          </div>
        </div>

        {/* Predictions & Actuals Section */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "24px"
          }}>
            {/* Predictions Column */}
            <CalculatorColumn
              title="Predictions"
              subtitle="Fill in before campaign launch"
              metaSpend={predMetaSpend}
              setMetaSpend={setPredMetaSpend}
              youtubeSpend={predYouTubeSpend}
              setYouTubeSpend={setPredYouTubeSpend}
              sales20k={predSales20k}
              setSales20k={setPredSales20k}
              sales30k={predSales30k}
              setSales30k={setPredSales30k}
              paymentPlanBuyers={predPaymentPlanBuyers}
              setPaymentPlanBuyers={setPredPaymentPlanBuyers}
              upsellUnits={predUpsellUnits}
              setUpsellUnits={setPredUpsellUnits}
              cashCollectionRate={predCashCollectionRate}
              setCashCollectionRate={setPredCashCollectionRate}
              roas={predicted.roas}
              roasLabel="Predicted ROAS"
            />

            {/* Actuals Column */}
            <CalculatorColumn
              title="Actuals"
              subtitle="Fill in at 90 days from real data"
              metaSpend={actMetaSpend}
              setMetaSpend={setActMetaSpend}
              youtubeSpend={actYouTubeSpend}
              setYouTubeSpend={setActYouTubeSpend}
              sales20k={actSales20k}
              setSales20k={setActSales20k}
              sales30k={actSales30k}
              setSales30k={setActSales30k}
              paymentPlanBuyers={actPaymentPlanBuyers}
              setPaymentPlanBuyers={setActPaymentPlanBuyers}
              upsellUnits={actUpsellUnits}
              setUpsellUnits={setActUpsellUnits}
              cashCollectionRate={actCashCollectionRate}
              setCashCollectionRate={setActCashCollectionRate}
              roas={actual.roas}
              roasLabel="Actual ROAS"
            />
          </div>
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
              predicted={predicted.roas + "x"}
              actual={actual.roas + "x"}
              hasActualData={actualsHasData}
            />
            <ComparisonMetric
              label="Total Ad Spend"
              predicted={`$${predicted.totalAdSpend.toLocaleString()}`}
              actual={`$${actual.totalAdSpend.toLocaleString()}`}
              hasActualData={actualsHasData}
            />
            <ComparisonMetric
              label="Net Revenue"
              predicted={`$${Math.round(predicted.netRevenue).toLocaleString()}`}
              actual={`$${Math.round(actual.netRevenue).toLocaleString()}`}
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

          {actualsHasData && (
            <div style={{
              marginTop: "24px",
              paddingTop: "24px",
              borderTop: "1px solid #f6f6f6",
              display: "flex",
              gap: "32px",
              flexWrap: "wrap"
            }}>
              <div>
                <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>Meta Spend</div>
                <div style={{ fontSize: "18px", fontWeight: "700", color: "#3768b5" }}>
                  ${actMetaSpend.toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>YouTube Spend</div>
                <div style={{ fontSize: "18px", fontWeight: "700", color: "#9a17bb" }}>
                  ${actYouTubeSpend.toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scenario Planner */}
        <div style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "48px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
        }}>
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#111314",
              marginBottom: "8px",
              marginTop: 0
            }}>
              Scenario Planner
            </h2>
            <p style={{
              fontSize: "14px",
              color: "#666",
              margin: 0
            }}>
              Sandbox tool: adjust conversion levers to see impact on ROAS (uses {actualsHasData ? "actuals" : "predictions"} as baseline)
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "32px",
            marginBottom: "32px"
          }}>
            <Slider
              label="Click-Through Rate (%)"
              value={scenarioCTR}
              min={0.5}
              max={10}
              step={0.1}
              onChange={setScenarioCTR}
              color="#3768b5"
              format={v => `${v.toFixed(1)}%`}
            />
            <Slider
              label="Registration Conversion (%)"
              value={scenarioRegConversion}
              min={10}
              max={80}
              step={1}
              onChange={setScenarioRegConversion}
              color="#55bdf8"
              format={v => `${v}%`}
            />
            <Slider
              label="Sales Conversion (%)"
              value={scenarioSalesConversion}
              min={5}
              max={40}
              step={1}
              onChange={setScenarioSalesConversion}
              color="#2bbfd5"
              format={v => `${v}%`}
            />
            <Slider
              label="Upgrade Rate (to $30k tier) (%)"
              value={scenarioUpgradeRate}
              min={0}
              max={100}
              step={5}
              onChange={setScenarioUpgradeRate}
              color="#9a17bb"
              format={v => `${v}%`}
            />
            <Slider
              label="Upsell Take Rate (%)"
              value={scenarioUpsellRate}
              min={0}
              max={100}
              step={5}
              onChange={setScenarioUpsellRate}
              color="#9a17bb"
              format={v => `${v}%`}
            />
            <Slider
              label="Cash Collection Rate (%)"
              value={scenarioCashCollection}
              min={70}
              max={100}
              step={1}
              onChange={setScenarioCashCollection}
              color="#3768b5"
              format={v => `${v}%`}
            />
          </div>

          <div style={{
            background: "#f6f6f6",
            padding: "32px",
            borderRadius: "12px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "14px", color: "#666", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "2px" }}>
              Scenario ROAS
            </div>
            <div style={{ fontSize: "48px", fontWeight: "800", color: "#111314" }}>
              {scenario.roas}x
            </div>
            <div style={{ fontSize: "16px", color: "#666", marginTop: "8px" }}>
              Net Revenue: ${Math.round(scenario.netRevenue).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Column component for Predictions/Actuals
const CalculatorColumn = ({
  title,
  subtitle,
  metaSpend,
  setMetaSpend,
  youtubeSpend,
  setYouTubeSpend,
  sales20k,
  setSales20k,
  sales30k,
  setSales30k,
  paymentPlanBuyers,
  setPaymentPlanBuyers,
  upsellUnits,
  setUpsellUnits,
  cashCollectionRate,
  setCashCollectionRate,
  roas,
  roasLabel
}: any) => (
  <div style={{
    background: "#ffffff",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
  }}>
    <div style={{ marginBottom: "24px" }}>
      <h3 style={{
        fontSize: "22px",
        fontWeight: "700",
        color: "#111314",
        marginBottom: "4px",
        marginTop: 0
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: "13px",
        color: "#666",
        margin: 0
      }}>
        {subtitle}
      </p>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <SectionLabel label="Ad Spend" />
      <NumberInput label="Meta spend ($)" value={metaSpend} onChange={setMetaSpend} />
      <NumberInput label="YouTube spend ($)" value={youtubeSpend} onChange={setYouTubeSpend} />

      <SectionLabel label="Sales" />
      <NumberInput label="Sales at $20,000 tier" value={sales20k} onChange={setSales20k} />
      <NumberInput label="Sales at $30,000 tier" value={sales30k} onChange={setSales30k} />
      <NumberInput label="Buyers on payment plans (total count)" value={paymentPlanBuyers} onChange={setPaymentPlanBuyers} />

      <SectionLabel label="Upsells" />
      <NumberInput label="Upsell units sold ($49 each)" value={upsellUnits} onChange={setUpsellUnits} />

      <SectionLabel label="Cash Collection" />
      <NumberInput label="Cash Collection Rate (%)" value={cashCollectionRate} onChange={setCashCollectionRate} max={100} />
    </div>

    <div style={{
      marginTop: "32px",
      paddingTop: "24px",
      borderTop: "2px solid #f6f6f6",
      textAlign: "center"
    }}>
      <div style={{
        fontSize: "12px",
        color: "#888",
        marginBottom: "8px",
        textTransform: "uppercase",
        letterSpacing: "2px"
      }}>
        {roasLabel}
      </div>
      <div style={{
        fontSize: "36px",
        fontWeight: "800",
        color: "#111314"
      }}>
        {roas}x
      </div>
    </div>
  </div>
);

const SectionLabel = ({ label }: { label: string }) => (
  <div style={{
    fontSize: "14px",
    fontWeight: "700",
    color: "#3768b5",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginTop: "8px"
  }}>
    {label}
  </div>
);

const NumberInput = ({ label, value, onChange, max }: any) => (
  <div>
    <label style={{
      display: "block",
      fontSize: "13px",
      color: "#666",
      marginBottom: "6px"
    }}>
      {label}
    </label>
    <input
      type="number"
      value={value}
      onChange={e => onChange(parseFloat(e.target.value) || 0)}
      min={0}
      max={max}
      style={{
        width: "100%",
        padding: "10px 12px",
        fontSize: "16px",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        fontFamily: "inherit",
        outline: "none"
      }}
      onFocus={(e) => e.target.style.borderColor = "#55bdf8"}
      onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
    />
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
