# Decision-Making ROAS Map

**Live URL:** https://decision-roas-map.vercel.app

An interactive calculator for making data-driven ad spend decisions based on 90-day cash attribution.

## Overview

This tool helps you calculate your **Decision-Making ROAS** — the real cash-in-hand metric that tells you whether to scale up, maintain, or reduce your ad spend.

### Key Features

- **Three Revenue Inputs:**
  - Full Pays (customers who paid upfront)
  - Payment Plan Buyers (counted at ¼ value at 90 days)
  - Ad Spend tracking

- **90-Day Attribution Window:**
  - Standard decision window for cash-in-hand
  - Can extend to 120-180 days with available capital

- **Automatic Deductions:**
  - ~2-3% refund rate applied to gross revenue

- **Decision Formula:**
  ```
  (Full Pays × Full Price) + (Plan Buyers × ¼ Price) − Refunds
  ÷ Ad Spend = Decision ROAS
  ```

- **Clear Action Signals:**
  - ≥3.0x ROAS → **SCALE UP** (green)
  - ≥1.5x ROAS → **MAINTAIN** (yellow)
  - <1.5x ROAS → **REDUCE SPEND** (red)

### Attribution Rule

**Critical:** Anyone who clicked your ad and purchased counts — regardless of whether they were already on your list. This prevents undervaluing ads by excluding "warm" traffic.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Inline styles (dark theme with Georgia serif typography)
- **Deployment:** Vercel
- **Type Safety:** TypeScript

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
npm start
```

## Deployment

Deployed to Vercel via:
```bash
npx vercel --prod
```

## Calculator Inputs (Sliders)

1. **Full Price ($):** 1,000 - 50,000 (step: 500)
2. **Payment Plan %:** 0 - 100% (step: 5)
3. **Refund Rate %:** 0 - 10% (step: 0.5)
4. **Ad Spend ($):** 100 - 50,000 (step: 100)
5. **Total Ad Sales:** 1 - 100 (step: 1)

## Default Values

- Full Price: $22,000
- Payment Plan Split: 50%
- Refund Rate: 3%
- Ad Spend: $5,000
- Total Sales: 10

**Result:** 26.68x ROAS → SCALE UP

---

**Built by:** Larrabee (OpenClaw AI Assistant)  
**For:** John Hubbard  
**Date:** March 11, 2026
