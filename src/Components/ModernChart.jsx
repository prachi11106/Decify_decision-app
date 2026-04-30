import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell, LabelList,
} from "recharts";

/* Custom tooltip */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--line)",
      borderRadius: 10,
      padding: "10px 14px",
      boxShadow: "var(--sh-md)",
      fontFamily: "var(--f-body)",
      minWidth: 140,
    }}>
      <p style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em" }}>
        {label}
      </p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.fill || p.color }} />
          <span style={{ color: "var(--ink-2)" }}>{p.name}:</span>
          <span style={{ color: "var(--ink)", fontWeight: 700 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

/* Bar colors — gradient from dark rose to light */
const BAR_COLORS = [
  "#896C6C", "#9E7E7E", "#B49090",
  "#896C6C", "#9E7E7E", "#B49090",
];

export default function ModernChart({ data, total }) {
  if (!data || data.length === 0) return null;

  /* Find max for highlight */
  const maxOptions = Math.max(...data.map(d => d.options));

  return (
    <div className="chart-card">

      {/* Header */}
      <div className="chart-header">
        <span className="chart-title">Recent Decisions</span>
        <span className="pill pill--rose">{total} total</span>
      </div>

      {/* Legend */}
      <div className="chart-legend">
        <div className="chart-legend-item">
          <div className="chart-legend-dot" style={{ background: "#896C6C" }} />
          <span>Options per decision</span>
        </div>
        <div className="chart-legend-item">
          <div className="chart-legend-dot" style={{ background: "var(--ok)", opacity: 0.7 }} />
          <span>Most complex</span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          margin={{ top: 18, right: 8, left: -18, bottom: 4 }}
          barCategoryGap="35%"
        >
          <defs>
            {data.map((_, i) => (
              <linearGradient key={i} id={`bar-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={BAR_COLORS[i % BAR_COLORS.length]} stopOpacity={1} />
                <stop offset="100%" stopColor={BAR_COLORS[i % BAR_COLORS.length]} stopOpacity={0.5} />
              </linearGradient>
            ))}
            <linearGradient id="bar-grad-winner" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="var(--ok)" stopOpacity={0.9} />
              <stop offset="100%" stopColor="var(--ok)" stopOpacity={0.4} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--line)"
          />

          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "var(--ink-3)", fontFamily: "var(--f-body)" }}
            axisLine={false}
            tickLine={false}
            tickMargin={8}
          />

          <YAxis
            tick={{ fontSize: 11, fill: "var(--ink-3)", fontFamily: "var(--f-body)" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            tickMargin={4}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--rose-lt)", radius: 6 }} />

          <Bar dataKey="options" name="Options" radius={[6, 6, 0, 0]} maxBarSize={64}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={
                  entry.options === maxOptions
                    ? "url(#bar-grad-winner)"
                    : `url(#bar-grad-${i})`
                }
              />
            ))}
            <LabelList
              dataKey="options"
              position="top"
              style={{
                fontSize: 11,
                fontWeight: 700,
                fill: "var(--ink-3)",
                fontFamily: "var(--f-body)",
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Bottom note */}
      <p style={{
        fontSize: 11,
        color: "var(--ink-4)",
        marginTop: 12,
        textAlign: "center",
        fontStyle: "italic",
        fontFamily: "var(--f-head)",
      }}>
        Each bar = one decision. Height = number of options considered.
      </p>
    </div>
  );
}