import { useAuth } from "@/context/AuthContext";
import { ROLE_HIERARCHY, SUPERIOR_ROLES } from "@/lib/roles";
import { Star, Shield } from "lucide-react";

const HIERARCHY_DISPLAY = [
  { role: "Diretor Nacional", description: "Comando Máximo" },
  { role: "Diretor Nacional Adjunto", description: "2.º Comando" },
  { role: "Superintendente-Chefe", description: "Oficiais Superiores" },
  { role: "Superintendente", description: "Oficiais Superiores" },
  { role: "Intendente", description: "Oficiais" },
  { role: "Subintendente", description: "Oficiais" },
  { role: "Comissário", description: "Oficiais" },
  { role: "Subcomissário", description: "Oficiais Subalternos" },
  { role: "Chefe Coordenador", description: "Chefes" },
  { role: "Chefe Principal", description: "Chefes" },
  { role: "Chefe", description: "Chefes" },
  { role: "Agente Coordenador", description: "Agentes" },
  { role: "Agente Principal", description: "Agentes" },
  { role: "Agente", description: "Agentes" },
  { role: "Agente Provisório", description: "Recrutas" },
];

export default function Superiores() {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "hsl(var(--gold))" }}>
          <Star size={22} /> Área de Superiores
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
          Acesso restrito — Subcomissário ou superior
        </p>
      </div>

      {/* Current user card */}
      {currentUser && (
        <div className="psp-card p-5" style={{ borderColor: "hsl(var(--gold) / 0.3)", boxShadow: "var(--shadow-gold)" }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: "hsl(var(--gold) / 0.15)", border: "2px solid hsl(var(--gold) / 0.4)" }}>
              <Shield size={24} style={{ color: "hsl(var(--gold))" }} />
            </div>
            <div>
              <div className="text-xl font-bold" style={{ fontFamily: "Rajdhani, sans-serif", color: "hsl(var(--foreground))" }}>
                {currentUser.username}
              </div>
              <div className="rank-badge rank-badge-high mt-1">{currentUser.role}</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>Nível</div>
              <div className="text-3xl font-bold" style={{ fontFamily: "Rajdhani, sans-serif", color: "hsl(var(--gold))" }}>
                {ROLE_HIERARCHY[currentUser.role] ?? "—"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hierarchy table */}
      <div className="psp-card overflow-hidden">
        <div className="px-4 py-3" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
          <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: "hsl(var(--gold))", fontFamily: "Rajdhani, sans-serif" }}>
            Hierarquia de Comando
          </h2>
        </div>
        <div className="divide-y divide-border">
          {HIERARCHY_DISPLAY.map(({ role, description }) => {
            const level = ROLE_HIERARCHY[role] ?? 0;
            const isSup = SUPERIOR_ROLES.includes(role);
            const isCurrent = currentUser?.role === role;
            return (
              <div key={role} className="flex items-center justify-between px-4 py-3 table-row-hover"
                style={{ background: isCurrent ? "hsl(var(--gold) / 0.05)" : undefined }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 text-xs font-mono text-center"
                    style={{ color: isSup ? "hsl(var(--gold))" : "hsl(var(--muted-foreground))" }}>
                    {level}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ fontFamily: "Rajdhani, sans-serif", color: isCurrent ? "hsl(var(--gold))" : "hsl(var(--foreground))" }}>
                      {role}
                      {isCurrent && <span className="ml-2 text-xs" style={{ color: "hsl(var(--gold))" }}>← Você</span>}
                    </div>
                    <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{description}</div>
                  </div>
                </div>
                {isSup && (
                  <span className="rank-badge rank-badge-high text-[10px]">Comando</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
