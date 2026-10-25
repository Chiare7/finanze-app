import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";

function dataDaSeriale(valore) {
  return new Date(Math.round((valore - 25569) * 86400000));
}

export function aggregaPerMese(rows) {
  const mesi = {};
  for (const r of rows) {
    const data = dataDaSeriale(r[1]);
    if (isNaN(data)) continue;
    const chiave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
    if (!mesi[chiave]) mesi[chiave] = { mese: chiave, entrate: 0, uscite: 0 };

    const valore = Number(r[3]) || 0;
    const tipo = r[4];
    if (tipo === "Entrata" || tipo === "Dai_miei") mesi[chiave].entrate += valore;
    else if (tipo === "Uscita" || tipo === "Investimento" || tipo === "Ai_miei") mesi[chiave].uscite += valore;
  }
  return Object.values(mesi)
    .sort((a, b) => a.mese.localeCompare(b.mese))
    .map((m) => ({ ...m, saldo: m.entrate - m.uscite }));
}

const euro = (v) =>
  Number(v).toLocaleString("it-IT", { style: "currency", currency: "EUR" });

function TooltipCustom({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const entrate = payload.find((p) => p.dataKey === "entrate")?.value ?? 0;
  const uscite = payload.find((p) => p.dataKey === "uscite")?.value ?? 0;
  const saldo = entrate - uscite;
  return (
    <div style={{
      background: "#0f172a", color: "#f8fafc", padding: "10px 14px",
      borderRadius: 10, fontSize: 13, boxShadow: "0 4px 16px rgba(0,0,0,.25)",
    }}>
      <strong>{label}</strong>
      <div style={{ color: "#4ade80" }}>Entrate: {euro(entrate)}</div>
      <div style={{ color: "#f87171" }}>Uscite: {euro(uscite)}</div>
      <div style={{ marginTop: 4, borderTop: "1px solid #334155", paddingTop: 4 }}>
        Saldo: <strong style={{ color: saldo >= 0 ? "#4ade80" : "#f87171" }}>{euro(saldo)}</strong>
      </div>
    </div>
  );
}

export default function GraficoMensile({ rows }) {
  const dati = aggregaPerMese(rows);
  const totEntrate = dati.reduce((s, d) => s + d.entrate, 0);
  const totUscite = dati.reduce((s, d) => s + d.uscite, 0);

  return (
    <div style={{
      background: "#ffffff", borderRadius: 16, padding: 20, marginTop: 16,
      boxShadow: "0 1px 3px rgba(0,0,0,.08), 0 8px 24px rgba(0,0,0,.06)",
      fontFamily: "system-ui, sans-serif",
    }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 18 }}>Andamento mensile</h2>
      <div style={{ display: "flex", gap: 24, color: "#64748b", fontSize: 14, marginBottom: 12 }}>
        <span>Entrate totali: <strong style={{ color: "#16a34a" }}>{euro(totEntrate)}</strong></span>
        <span>Uscite totali: <strong style={{ color: "#dc2626" }}>{euro(totUscite)}</strong></span>
      </div>

      <div style={{ width: "100%", height: 420 }}>
        <ResponsiveContainer>
          <ComposedChart data={dati} barGap={4}>
            <defs>
              <linearGradient id="gradEntrate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#16a34a" />
              </linearGradient>
              <linearGradient id="gradUscite" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="mese" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
            <Tooltip content={<TooltipCustom />} cursor={{ fill: "#f1f5f9" }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 13 }} />
            <Bar dataKey="entrate" name="Entrate" fill="url(#gradEntrate)" radius={[8, 8, 0, 0]} maxBarSize={28} />
            <Bar dataKey="uscite" name="Uscite" fill="url(#gradUscite)" radius={[8, 8, 0, 0]} maxBarSize={28} />
            <Line dataKey="saldo" name="Saldo" stroke="#6366f1" strokeWidth={3}
              dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }} activeDot={{ r: 6 }} type="monotone" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}