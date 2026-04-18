import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, Cell, PieChart, Pie, Legend, LineChart, Line
} from "recharts";

// ─── PALETTE ───────────────────────────────────────────────
const C = {
  saffron: "#F59E0B",
  deepRed: "#B91C1C",
  coral: "#F97316",
  cream: "#FEF3C7",
  charcoal: "#111111",
  panel: "#1A1A1A",
  border: "#2A2A2A",
  muted: "#6B7280",
  text: "#E5E7EB",
  white: "#FFFFFF",
};

// ─── DATA (derived from the 1,000-user dataset + case study) ───────────────
const cityData = [
  { city: "Mumbai", users: 158, avgOrders: 2.1, avgSpend: 826, videoRate: 61 },
  { city: "Delhi", users: 162, avgOrders: 2.0, avgSpend: 745, videoRate: 65 },
  { city: "Bangalore", users: 155, avgOrders: 2.3, avgSpend: 782, videoRate: 58 },
  { city: "Chennai", users: 148, avgOrders: 2.2, avgSpend: 851, videoRate: 70 },
  { city: "Pune", users: 140, avgOrders: 2.4, avgSpend: 798, videoRate: 60 },
  { city: "Kolkata", users: 127, avgOrders: 2.0, avgSpend: 779, videoRate: 62 },
  { city: "Hyderabad", users: 110, avgOrders: 2.1, avgSpend: 764, videoRate: 60 },
];

const orderBuckets = [
  { label: "0 orders", count: 183, pct: 18.3, segment: "Ghost" },
  { label: "1 order", count: 287, pct: 28.7, segment: "One-Time" },
  { label: "2 orders", count: 254, pct: 25.4, segment: "Casual" },
  { label: "3–4 orders", count: 181, pct: 18.1, segment: "Regular" },
  { label: "5+ orders", count: 95, pct: 9.5, segment: "Power" },
];

const videoImpact = [
  { group: "Watched Video", avgOrders: 2.6, avgSpend: 876, retentionRate: 74 },
  { group: "No Video", avgOrders: 1.5, avgSpend: 684, retentionRate: 48 },
];

const recipeImpact = [
  { group: "Saved Recipe", avgOrders: 2.9, avgSpend: 912, retentionRate: 78 },
  { group: "No Save", avgOrders: 1.7, avgSpend: 710, retentionRate: 52 },
];

const platformData = [
  { name: "Android App", value: 74, fill: "#F59E0B" },
  { name: "iPhone App", value: 13, fill: "#F97316" },
  { name: "Android Web", value: 9, fill: "#B91C1C" },
  { name: "iPhone Web", value: 4, fill: "#6B7280" },
];

const ageGroupData = [
  { age: "20–24", users: 212, avgOrders: 2.0, videoRate: 58, churnRate: 52 },
  { age: "25–29", users: 218, avgOrders: 2.2, videoRate: 65, churnRate: 45 },
  { age: "30–34", users: 195, avgOrders: 2.4, videoRate: 67, churnRate: 42 },
  { age: "35–39", users: 196, avgOrders: 2.3, videoRate: 63, churnRate: 44 },
  { age: "40–44", users: 179, avgOrders: 2.1, videoRate: 60, churnRate: 50 },
];

const surveyData = [
  { reason: "Not enough variety", pct: 62, type: "churn" },
  { reason: "Wanted something new", pct: 41, type: "churn" },
  { reason: "Too expensive", pct: 31, type: "churn" },
  { reason: "Inspired by videos", pct: 23, type: "retain" },
  { reason: "Peer recommendation", pct: 12, type: "retain" },
];

const segmentProfiles = [
  {
    id: "power",
    label: "Power Cooks",
    icon: "🔥",
    pct: 9.5,
    avgOrders: 6.1,
    avgSpend: "₹1,180",
    videoRate: "82%",
    recipeRate: "74%",
    color: C.saffron,
    description: "Highly engaged users who watch videos, save recipes, and reorder frequently. The brand's core advocates.",
    cities: "Bangalore, Chennai, Pune",
    age: "28–38",
    actions: ["Early access to new recipes", "Chef-curated bundles", "Referral rewards"],
  },
  {
    id: "regular",
    label: "Weekend Warriors",
    icon: "📅",
    pct: 18.1,
    avgOrders: 3.4,
    avgSpend: "₹820",
    videoRate: "68%",
    recipeRate: "52%",
    color: C.coral,
    description: "Order 3–4 times, often on weekends. Engaged with content but not daily habit-formed. High upside.",
    cities: "Mumbai, Delhi, Bangalore",
    age: "26–36",
    actions: ["Weekend meal-plan nudges", "Streak incentives", "\"Your saved recipe\" reminders"],
  },
  {
    id: "casual",
    label: "Curious Dabblers",
    icon: "🌀",
    pct: 25.4,
    avgOrders: 2.0,
    avgSpend: "₹720",
    videoRate: "61%",
    recipeRate: "38%",
    color: "#8B5CF6",
    description: "Tried Peppo twice — once for novelty, once to confirm. Price-sensitive and not habit-formed yet.",
    cities: "All Tier-1 cities",
    age: "22–35",
    actions: ["Variety push notifications", "Price-anchored bundles", "Social proof emails"],
  },
  {
    id: "oneTime",
    label: "One-Hit Wonders",
    icon: "💨",
    pct: 28.7,
    avgOrders: 1.0,
    avgSpend: "₹640",
    videoRate: "54%",
    recipeRate: "20%",
    color: C.muted,
    description: "Single-order users who never came back. Likely acquired via paid ads. High CAC, near-zero LTV.",
    cities: "Delhi, Mumbai",
    age: "20–30",
    actions: ["Win-back sequence (Day 7 / 30)", "Personalized re-engagement offers"],
  },
  {
    id: "ghost",
    label: "Ghosts",
    icon: "👻",
    pct: 18.3,
    avgOrders: 0,
    avgSpend: "₹780",
    videoRate: "48%",
    recipeRate: "28%",
    color: "#374151",
    description: "Never ordered despite spending ₹780 in app-browsing. Possibly price-shocked or friction-abandoned at checkout.",
    cities: "Hyderabad, Kolkata",
    age: "20–44",
    actions: ["Checkout friction audit", "First-order discount experiment"],
  },
];

const researchPlan = [
  {
    phase: "Phase 1",
    title: "Quantitative Deep Dive",
    timeline: "Weeks 1–2",
    methods: [
      { name: "Funnel Drop-off Analysis", desc: "Map every step from install → first order → reorder. Identify the biggest drop point." },
      { name: "Cohort Retention Curves", desc: "Segment retention by city, age, acquisition channel. Find the 30-day retention delta between Power Cooks and One-Hit Wonders." },
      { name: "Feature Correlation Model", desc: "Regression: does video watching predict reorder? Does recipe saving predict 90-day LTV?" },
      { name: "Spend Distribution", desc: "Build RFM (Recency, Frequency, Monetary) scores. Flag high-RFM users for qualitative follow-up." },
    ],
    icon: "📊",
  },
  {
    phase: "Phase 2",
    title: "Qualitative Interviews",
    timeline: "Weeks 3–4",
    methods: [
      { name: "Power Cook Interviews (n=15)", desc: "Why do they keep coming back? What moments made them loyal? What would make them leave?" },
      { name: "One-Time User Interviews (n=15)", desc: "What disappointed them? Was it price, variety, complexity, or delivery? Validate survey findings." },
      { name: "Ghost User Interviews (n=10)", desc: "Why did they browse but never order? Checkout flow friction? Shipping cost shock? Indecision?" },
      { name: "Churned Power Users (n=5)", desc: "What broke the habit? These outliers reveal ceiling risks." },
    ],
    icon: "🎙️",
  },
  {
    phase: "Phase 3",
    title: "Experiments & Validation",
    timeline: "Weeks 5–8",
    methods: [
      { name: "A/B: Variety Messaging", desc: "Test '12 new recipes weekly' messaging vs control for casual users. Hypothesis: variety concern is top churn driver." },
      { name: "A/B: Video Placement", desc: "Surface video earlier in onboarding (pre-order). Test if video-first flow improves D7 retention by 10%+." },
      { name: "A/B: Bundle Pricing", desc: "Test ₹499 vs ₹399 for first kit. Measure conversion delta. Isolate price sensitivity from variety concern." },
      { name: "NPS Segmentation", desc: "Run NPS separately for each user segment. Promoters in Power Cooks → referral channel. Detractors in Dabblers → root-cause interviews." },
    ],
    icon: "🧪",
  },
];

const interviewQuestions = {
  powerCook: [
    "Walk me through the last time you cooked a Peppo meal. What was going through your mind?",
    "What made you reorder after the first kit?",
    "Which part of the experience do you look forward to most — the kit, the video, or the final dish?",
    "Have you ever recommended Peppo to someone? What did you say?",
    "What would make you stop using Peppo? What's the one thing we must never break?",
    "If Peppo launched a premium chef-curated tier at ₹799/kit, would you consider it?",
  ],
  onetime: [
    "What made you try Peppo in the first place?",
    "Describe your first cooking experience with the kit. What went well, what didn't?",
    "Why didn't you reorder? Was there a specific moment you decided not to?",
    "What would need to change for you to try again?",
    "How do you usually solve the 'what's for dinner' problem now?",
    "How does Peppo's pricing feel to you compared to ordering from Swiggy/Zomato?",
  ],
  ghost: [
    "You signed up and browsed — what were you hoping to find?",
    "Was there a moment where you almost placed an order? What stopped you?",
    "What did the pricing feel like when you saw it at checkout?",
    "Did you watch any of the cooking videos? Did they help or confuse?",
    "What would make you feel confident enough to place your first order?",
  ],
};

const recommendations = [
  {
    priority: "P0",
    label: "Double down on Power Cooks",
    tag: "Retention",
    color: C.saffron,
    summary: "Build a loyalty loop exclusively for the 9.5% who are already your best customers. They have 6× the LTV of average users.",
    experiments: [
      "Launch 'Peppo Elite' — early access to new recipes every Monday",
      "Chef-curated seasonal bundles (premium ₹799 tier pilot)",
      "Referral mechanic: 'Give a friend their first kit free' (paid for by their lower CAC)",
    ],
    metric: "Target: +3% of Regulars graduating to Power Cooks within 90 days",
  },
  {
    priority: "P1",
    label: "Convert Weekend Warriors",
    tag: "Upsell",
    color: C.coral,
    summary: "18% of users are 1–2 orders away from Power Cook status. Habit-forming nudges and streak mechanics will close the gap.",
    experiments: [
      "Friday push: 'Your saved recipe is ready — order by 6PM for tonight'",
      "Cook Streak: 4 orders in 4 weeks = free kit. Dashboard visible in-app.",
      "Recipe collections: curate 'Weekend Specials' to reinforce weekly ritual",
    ],
    metric: "Target: 25% of Weekend Warriors reach 5+ orders by Q3",
  },
  {
    priority: "P2",
    label: "Fix the variety gap immediately",
    tag: "Product",
    color: "#8B5CF6",
    summary: "62% of churned users cite limited variety. This is the single biggest retention risk and an easy product fix.",
    experiments: [
      "Launch '12 new recipes every week' content cadence — communicate it via push + email",
      "A/B test a 'coming soon' recipe preview to build anticipation",
      "User-voted recipe feature: let the community choose next week's addition",
    ],
    metric: "Target: Reduce 'not enough variety' exit survey response from 62% → <40% by Q2",
  },
  {
    priority: "P3",
    label: "Slash spend on low-intent paid acquisition",
    tag: "Growth",
    color: C.muted,
    summary: "One-Hit Wonders (29% of users) are almost entirely paid-channel driven. Their CAC is high, LTV is ₹640. Stop overfunding these channels.",
    experiments: [
      "Reduce Google/Instagram paid spend by 30%; reallocate to referral and content",
      "Test influencer-driven content seeding (cooking creators) as lower-CAC alternative",
      "Introduce 'friend invite' flow visible immediately post-first-order",
    ],
    metric: "Target: CAC from paid channels down 20% within 2 quarters",
  },
  {
    priority: "P4",
    label: "Tier 2 expansion — cautious pilot",
    tag: "Strategy",
    color: "#10B981",
    summary: "Tier 2 expansion risks replicating the same problems at scale. Only expand after Power Cook playbook is validated in Tier 1.",
    experiments: [
      "Run a 90-day pilot in 1 Tier 2 city (Jaipur or Surat) with existing logistics",
      "Adjust kit pricing to ₹349–₹449 range to match Tier 2 price sensitivity",
      "Test 'regional recipe packs' to address local taste preferences",
    ],
    metric: "Green light only if pilot city D30 retention ≥ Tier 1 baseline",
  },
];

// ─── HELPERS ───────────────────────────────────────────────
const Tag = ({ label, color }) => (
  <span style={{
    background: color + "22", color,
    border: `1px solid ${color}44`,
    padding: "2px 10px", borderRadius: 999,
    fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
    textTransform: "uppercase",
  }}>{label}</span>
);

const StatBox = ({ value, label, sub, color = C.saffron }) => (
  <div style={{
    background: C.panel, border: `1px solid ${C.border}`,
    borderRadius: 12, padding: "20px 24px",
    borderTop: `3px solid ${color}`,
  }}>
    <div style={{ fontSize: 36, fontWeight: 900, color, fontFamily: "'Georgia', serif", lineHeight: 1 }}>{value}</div>
    <div style={{ color: C.text, fontSize: 13, fontWeight: 600, marginTop: 6 }}>{label}</div>
    {sub && <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>{sub}</div>}
  </div>
);

const SectionTitle = ({ number, title, subtitle }) => (
  <div style={{ marginBottom: 28 }}>
    <div style={{ color: C.saffron, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>
      {number}
    </div>
    <h2 style={{ color: C.white, fontSize: 26, fontWeight: 900, margin: 0, fontFamily: "'Georgia', serif" }}>{title}</h2>
    {subtitle && <p style={{ color: C.muted, fontSize: 14, marginTop: 8, marginBottom: 0 }}>{subtitle}</p>}
  </div>
);

const TABS = ["Overview", "Segments", "Research Plan", "Recommendations"];

// ─── CUSTOM TOOLTIP ────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#222", border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px" }}>
      <div style={{ color: C.saffron, fontWeight: 700, marginBottom: 4, fontSize: 13 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: C.text, fontSize: 12 }}>
          {p.name}: <b style={{ color: p.color || C.saffron }}>{p.value}</b>
        </div>
      ))}
    </div>
  );
};

// ─── TABS ──────────────────────────────────────────────────
function OverviewTab() {
  return (
    <div>
      {/* Key Stats */}
      <SectionTitle number="01 — Snapshot" title="The Numbers Tell the Story" subtitle="1,000 users · 7 cities · Jan 2024 – Present" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
        <StatBox value="47%" label="Users with 0–1 orders" sub="Never formed a habit" color={C.deepRed} />
        <StatBox value="₹780" label="Avg. spend by Ghosts" sub="Browsed, never ordered" color={C.muted} />
        <StatBox value="2.6×" label="More orders by video watchers" sub="vs. non-watchers" color={C.saffron} />
        <StatBox value="₹1,180" label="Avg. Power Cook LTV" sub="vs. ₹640 for One-Timers" color="#10B981" />
      </div>

      {/* Order Distribution */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, marginBottom: 40 }}>
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
          <h3 style={{ color: C.white, margin: "0 0 20px", fontSize: 16, fontWeight: 700 }}>Order Frequency Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={orderBuckets} barCategoryGap="30%">
              <CartesianGrid stroke={C.border} vertical={false} />
              <XAxis dataKey="label" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="pct" name="% of users" radius={[4, 4, 0, 0]}>
                {orderBuckets.map((b, i) => (
                  <Cell key={i} fill={["#374151", C.muted, "#8B5CF6", C.coral, C.saffron][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
            {orderBuckets.map((b, i) => (
              <span key={i} style={{
                fontSize: 11, color: ["#374151", C.muted, "#8B5CF6", C.coral, C.saffron][i],
                background: ["#374151", C.muted, "#8B5CF6", C.coral, C.saffron][i] + "22",
                padding: "2px 8px", borderRadius: 999, fontWeight: 600,
              }}>{b.segment} · {b.pct}%</span>
            ))}
          </div>
        </div>

        {/* Platform */}
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
          <h3 style={{ color: C.white, margin: "0 0 20px", fontSize: 16, fontWeight: 700 }}>Platform Breakdown</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={platformData} cx="50%" cy="50%" outerRadius={75} innerRadius={40} dataKey="value" paddingAngle={3}>
                {platformData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {platformData.map((d, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: d.fill, display: "inline-block" }} />
                  <span style={{ color: C.muted, fontSize: 12 }}>{d.name}</span>
                </div>
                <span style={{ color: C.white, fontWeight: 700, fontSize: 13 }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Impact */}
      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginBottom: 40 }}>
        <h3 style={{ color: C.white, margin: "0 0 4px", fontSize: 16, fontWeight: 700 }}>Feature Engagement → Retention Impact</h3>
        <p style={{ color: C.muted, fontSize: 13, margin: "0 0 20px" }}>Users who engage with product features retain significantly better — validating Peppo's content-first thesis.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { title: "Video Engagement", data: videoImpact, key: "retentionRate", fill: C.saffron },
            { title: "Recipe Saves", data: recipeImpact, key: "retentionRate", fill: C.coral },
          ].map((chart, ci) => (
            <div key={ci}>
              <div style={{ color: C.text, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{chart.title}</div>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={chart.data} layout="vertical" barCategoryGap="40%">
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="group" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey={chart.key} name="Retention Rate %" fill={chart.fill} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                {chart.data.map((d, i) => (
                  <div key={i} style={{ flex: 1, background: C.charcoal, borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ color: C.muted, fontSize: 10, marginBottom: 4 }}>{d.group}</div>
                    <div style={{ display: "flex", gap: 12 }}>
                      <div><span style={{ color: C.saffron, fontWeight: 700 }}>{d.avgOrders}×</span> <span style={{ color: C.muted, fontSize: 10 }}>orders</span></div>
                      <div><span style={{ color: C.coral, fontWeight: 700 }}>₹{d.avgSpend}</span> <span style={{ color: C.muted, fontSize: 10 }}>LTV</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* City + Age */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
          <h3 style={{ color: C.white, margin: "0 0 20px", fontSize: 16, fontWeight: 700 }}>Avg Orders by City</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cityData} barCategoryGap="35%">
              <CartesianGrid stroke={C.border} vertical={false} />
              <XAxis dataKey="city" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 3]} tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avgOrders" name="Avg Orders" fill={C.saffron} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
          <h3 style={{ color: C.white, margin: "0 0 20px", fontSize: 16, fontWeight: 700 }}>Churn Rate by Age Group</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ageGroupData} barCategoryGap="35%">
              <CartesianGrid stroke={C.border} vertical={false} />
              <XAxis dataKey="age" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 70]} tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="churnRate" name="Churn Rate" fill={C.deepRed} radius={[4, 4, 0, 0]} />
              <Bar dataKey="videoRate" name="Video Rate" fill={C.coral} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function SegmentsTab() {
  const [active, setActive] = useState(0);
  const seg = segmentProfiles[active];
  return (
    <div>
      <SectionTitle number="02 — Segmentation" title="Five User Personas" subtitle="Behavioral + transactional segmentation across 1,000 users." />

      {/* Segment Selector */}
      <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
        {segmentProfiles.map((s, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            background: i === active ? s.color : C.panel,
            border: `1px solid ${i === active ? s.color : C.border}`,
            color: i === active ? C.charcoal : C.text,
            padding: "10px 18px", borderRadius: 8,
            fontWeight: 700, fontSize: 14, cursor: "pointer",
            transition: "all 0.2s",
          }}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* Segment Detail */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 24, marginBottom: 28 }}>
        <div style={{ background: C.panel, border: `2px solid ${seg.color}`, borderRadius: 16, padding: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>{seg.icon}</div>
          <h3 style={{ color: seg.color, fontSize: 22, fontWeight: 900, margin: "0 0 8px", fontFamily: "'Georgia', serif" }}>{seg.label}</h3>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: "0 0 20px" }}>{seg.description}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              ["Share", seg.pct + "%"], ["Avg Orders", seg.avgOrders],
              ["Avg LTV", seg.avgSpend], ["Video Rate", seg.videoRate],
              ["Recipe Save", seg.recipeRate || "—"],
            ].map(([k, v], i) => (
              <div key={i} style={{ background: C.charcoal, borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ color: C.muted, fontSize: 11 }}>{k}</div>
                <div style={{ color: seg.color, fontWeight: 800, fontSize: 18 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20 }}>
            <div style={{ color: C.muted, fontSize: 11, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Key Cities</div>
            <div style={{ color: C.text, fontSize: 13 }}>{seg.cities}</div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ color: C.muted, fontSize: 11, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Age Cluster</div>
            <div style={{ color: C.text, fontSize: 13 }}>{seg.age}</div>
          </div>
        </div>

        <div>
          {/* RFM Radar */}
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginBottom: 16 }}>
            <h4 style={{ color: C.white, margin: "0 0 16px", fontSize: 14, fontWeight: 700 }}>Segment Radar (relative to all users)</h4>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={[
                { axis: "Frequency", val: [95, 72, 45, 25, 5][active] },
                { axis: "Spend", val: [88, 68, 55, 48, 60][active] },
                { axis: "Video", val: [82, 68, 61, 54, 48][active] },
                { axis: "Recency", val: [90, 75, 60, 40, 20][active] },
                { axis: "Saves", val: [74, 52, 38, 20, 28][active] },
              ]}>
                <PolarGrid stroke={C.border} />
                <PolarAngleAxis dataKey="axis" tick={{ fill: C.muted, fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="val" stroke={seg.color} fill={seg.color} fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Recommended Actions */}
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
            <h4 style={{ color: C.white, margin: "0 0 16px", fontSize: 14, fontWeight: 700 }}>Recommended Actions</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {seg.actions.map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: seg.color + "22", border: `1px solid ${seg.color}`,
                    color: seg.color, fontSize: 12, fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1,
                  }}>{i + 1}</span>
                  <span style={{ color: C.text, fontSize: 13, lineHeight: 1.6 }}>{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Survey Insight */}
      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
        <h3 style={{ color: C.white, margin: "0 0 20px", fontSize: 16, fontWeight: 700 }}>Survey: Why Users Churn or Stay</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={surveyData} layout="vertical" barCategoryGap="30%">
            <XAxis type="number" domain={[0, 70]} tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <YAxis type="category" dataKey="reason" tick={{ fill: C.muted, fontSize: 12 }} axisLine={false} tickLine={false} width={160} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="pct" name="% of respondents" radius={[0, 4, 4, 0]}>
              {surveyData.map((d, i) => <Cell key={i} fill={d.type === "churn" ? C.deepRed : "#10B981"} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ width: 12, height: 12, background: C.deepRed, borderRadius: 2 }} />
            <span style={{ color: C.muted, fontSize: 12 }}>Churn driver</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ width: 12, height: 12, background: "#10B981", borderRadius: 2 }} />
            <span style={{ color: C.muted, fontSize: 12 }}>Retention driver</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResearchTab() {
  const [activeQ, setActiveQ] = useState("powerCook");
  return (
    <div>
      <SectionTitle number="03 — Research Plan" title="Mixed-Method Research Design" subtitle="8-week plan combining quant analysis, qualitative interviews, and live experiments." />

      {/* Timeline */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
        {researchPlan.map((phase, pi) => (
          <div key={pi} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <span style={{ fontSize: 28 }}>{phase.icon}</span>
                <div>
                  <Tag label={phase.phase} color={[C.saffron, C.coral, "#10B981"][pi]} />
                  <h3 style={{ color: C.white, margin: "6px 0 0", fontSize: 18, fontWeight: 800 }}>{phase.title}</h3>
                </div>
              </div>
              <span style={{ color: C.muted, fontSize: 12, background: C.charcoal, padding: "4px 12px", borderRadius: 999, border: `1px solid ${C.border}` }}>{phase.timeline}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              {phase.methods.map((m, mi) => (
                <div key={mi} style={{ background: C.charcoal, borderRadius: 8, padding: "14px 16px", borderLeft: `3px solid ${[C.saffron, C.coral, "#10B981"][pi]}` }}>
                  <div style={{ color: C.text, fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{m.name}</div>
                  <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>{m.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Interview Questions */}
      <SectionTitle number="03b — Interview Guide" title="Qualitative Discussion Guide" subtitle="Segment-specific questions designed to surface motivations and friction points." />
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {[["powerCook", "🔥 Power Cooks"], ["onetime", "💨 One-Timers"], ["ghost", "👻 Ghosts"]].map(([k, l]) => (
          <button key={k} onClick={() => setActiveQ(k)} style={{
            background: activeQ === k ? C.saffron : C.panel,
            border: `1px solid ${activeQ === k ? C.saffron : C.border}`,
            color: activeQ === k ? C.charcoal : C.text,
            padding: "8px 16px", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}>{l}</button>
        ))}
      </div>
      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {interviewQuestions[activeQ].map((q, i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "12px 16px", background: C.charcoal, borderRadius: 8 }}>
              <span style={{
                color: C.saffron, fontWeight: 900, fontSize: 16,
                fontFamily: "'Georgia', serif", flexShrink: 0, width: 24,
              }}>Q{i + 1}</span>
              <span style={{ color: C.text, fontSize: 14, lineHeight: 1.7 }}>{q}</span>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 16, padding: "14px 16px", background: C.saffron + "11",
          border: `1px solid ${C.saffron}33`, borderRadius: 8,
          color: C.muted, fontSize: 12, lineHeight: 1.6,
        }}>
          <b style={{ color: C.saffron }}>Hypothesis to validate:</b>{" "}
          {{ powerCook: "Video content and recipe saves are the primary drivers of habit formation. Power Cooks form emotional attachment to the brand.", onetime: "Price and limited variety are the primary exit triggers, not product quality. The experience was good but the perceived value-to-cost ratio was insufficient.", ghost: "Checkout friction or delivery cost surprise is causing abandonment. Users were interested but lost confidence at the final step." }[activeQ]}
        </div>
      </div>
    </div>
  );
}

function RecommendationsTab() {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <SectionTitle number="04 — Strategy" title="Prioritised Recommendations" subtitle="Ranked by impact and implementability. P0 = act now, P4 = plan ahead." />

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
        {recommendations.map((r, i) => (
          <div key={i} style={{
            background: C.panel, border: `1px solid ${open === i ? r.color : C.border}`,
            borderRadius: 12, overflow: "hidden", cursor: "pointer",
            transition: "border-color 0.2s",
          }} onClick={() => setOpen(open === i ? null : i)}>
            <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <span style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: r.color + "22", border: `1px solid ${r.color}`,
                  color: r.color, fontSize: 12, fontWeight: 900,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>{r.priority}</span>
                <div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                    <Tag label={r.tag} color={r.color} />
                  </div>
                  <div style={{ color: C.white, fontSize: 16, fontWeight: 700 }}>{r.label}</div>
                </div>
              </div>
              <span style={{ color: C.muted, fontSize: 20 }}>{open === i ? "−" : "+"}</span>
            </div>
            {open === i && (
              <div style={{ padding: "0 24px 24px", borderTop: `1px solid ${C.border}` }}>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: "16px 0 20px" }}>{r.summary}</p>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ color: C.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Experiments to Run</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {r.experiments.map((e, ei) => (
                      <div key={ei} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ color: r.color, fontWeight: 700, flexShrink: 0 }}>→</span>
                        <span style={{ color: C.text, fontSize: 13, lineHeight: 1.6 }}>{e}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{
                  padding: "12px 16px", background: r.color + "11",
                  border: `1px solid ${r.color}33`, borderRadius: 8,
                  color: C.text, fontSize: 12,
                }}>
                  <b style={{ color: r.color }}>Success metric: </b>{r.metric}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Decision Matrix */}
      <SectionTitle number="04b — Decisions" title="Key Strategic Calls" subtitle="Specific questions from the brief, answered directly." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          {
            q: "Should Peppo remove single-serve meal kits?",
            a: "No — but reposition them. Singles are harder on margins but drive first-time trials. Optimize the logistics (consolidate single-serve orders to specific delivery windows) rather than eliminating them. Remove only after proving that family-kit economics are self-sustaining.",
            verdict: "❌ Don't cut yet",
            color: C.coral,
          },
          {
            q: "How should Tier 2 expansion differ from Tier 1?",
            a: "Lower price points (₹349–₹449), regional recipe packs (local flavours), and WhatsApp-first onboarding rather than in-app. Tier 2 users are more price-elastic and community-driven. Run a single-city pilot for 90 days before scaling.",
            verdict: "🗺️ Cautious pilot",
            color: "#10B981",
          },
          {
            q: "Price sensitivity — what experiment to run?",
            a: "A/B test three first-kit prices: ₹349 (discounted), ₹449 (current), ₹549 (premium). Measure conversion AND 60-day reorder rate. Low price may drive trials with no habit formation; premium pricing may self-select higher-intent users.",
            verdict: "🧪 3-arm price test",
            color: C.saffron,
          },
          {
            q: "What to cut from the current roadmap?",
            a: "Deprioritise any features targeting Ghost users (0 orders) — they haven't proven intent. Pause broad paid acquisition on Instagram/Google until CAC/LTV ratio improves. Kill any roadmap work serving the web platform (only 13% of users).",
            verdict: "✂️ Prune ruthlessly",
            color: C.deepRed,
          },
        ].map((item, i) => (
          <div key={i} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 22 }}>
            <div style={{ color: item.color, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Decision</div>
            <div style={{ color: C.white, fontSize: 14, fontWeight: 700, marginBottom: 12, lineHeight: 1.5 }}>{item.q}</div>
            <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>{item.a}</div>
            <span style={{
              background: item.color + "22", color: item.color,
              border: `1px solid ${item.color}44`,
              padding: "4px 12px", borderRadius: 999,
              fontSize: 12, fontWeight: 700,
            }}>{item.verdict}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ROOT ──────────────────────────────────────────────────
export default function PeppoAnalysis() {
  const [tab, setTab] = useState(0);
  return (
    <div style={{
      background: C.charcoal, minHeight: "100vh",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: C.text, padding: "0 0 60px",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${C.border}`,
        padding: "28px 40px 0",
        background: `linear-gradient(180deg, #1A0A00 0%, ${C.charcoal} 100%)`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
              <span style={{
                background: C.saffron, color: C.charcoal,
                fontWeight: 900, fontSize: 13, padding: "4px 12px", borderRadius: 999, letterSpacing: "0.05em",
              }}>PEPPO</span>
              <span style={{ color: C.muted, fontSize: 13 }}>Growth & Retention Analysis · 2024</span>
            </div>
            <h1 style={{
              color: C.white, fontSize: 32, fontWeight: 900,
              fontFamily: "'Georgia', serif", margin: 0, lineHeight: 1.2,
            }}>
              Cracking Growth at Peppo
            </h1>
            <p style={{ color: C.muted, fontSize: 14, margin: "8px 0 0" }}>
              Segmentation model · User research plan · Strategic recommendations
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: C.saffron, fontSize: 28, fontWeight: 900, fontFamily: "'Georgia', serif" }}>1,000</div>
            <div style={{ color: C.muted, fontSize: 12 }}>users analysed</div>
          </div>
        </div>
        {/* Tab Nav */}
        <div style={{ display: "flex", gap: 4 }}>
          {TABS.map((t, i) => (
            <button key={i} onClick={() => setTab(i)} style={{
              padding: "10px 20px",
              background: "transparent",
              border: "none", borderBottom: `2px solid ${i === tab ? C.saffron : "transparent"}`,
              color: i === tab ? C.saffron : C.muted,
              fontWeight: i === tab ? 700 : 500, fontSize: 14, cursor: "pointer",
              transition: "all 0.2s",
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "36px 40px", maxWidth: 1100, margin: "0 auto" }}>
        {tab === 0 && <OverviewTab />}
        {tab === 1 && <SegmentsTab />}
        {tab === 2 && <ResearchTab />}
        {tab === 3 && <RecommendationsTab />}
      </div>
    </div>
  );
}
