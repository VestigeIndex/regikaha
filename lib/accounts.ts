export type AccountRole = "client" | "professional" | "company" | "subcontractor" | "admin";

export const accountRoles: AccountRole[] = ["client", "professional", "company", "subcontractor", "admin"];

export const roleLabels: Record<AccountRole, string> = {
  client: "Cliente",
  professional: "Profesional",
  company: "Empresa o constructora",
  subcontractor: "Subcontrata",
  admin: "Admin",
};

export const rolePanelPaths: Record<AccountRole, string> = {
  client: "/panel/cliente",
  professional: "/panel/profesional",
  company: "/panel/empresa",
  subcontractor: "/panel/subcontrata",
  admin: "/admin",
};

export const registrationPaths: Record<Exclude<AccountRole, "admin">, string> = {
  client: "/registro/cliente",
  professional: "/registro/profesional",
  company: "/registro/empresa",
  subcontractor: "/registro/subcontrata",
};

export function normalizeRole(value: unknown, fallback: AccountRole = "client"): AccountRole {
  const role = String(value || "").trim().toLowerCase();
  return (accountRoles as string[]).includes(role) ? (role as AccountRole) : fallback;
}

export function panelPathForRole(value: unknown): string {
  return rolePanelPaths[normalizeRole(value)];
}

export function safeInternalPath(value: unknown, fallback: string): string {
  const path = String(value || "").trim();
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\") || /[\u0000-\u001f]/.test(path)) {
    return fallback;
  }
  return path;
}

export const roleBillingPaths: Partial<Record<AccountRole, string>> = {
  professional: "/panel/profesional/facturacion",
  company: "/panel/empresa/facturacion",
  subcontractor: "/panel/subcontrata/facturacion",
};

export function isPanelPathAllowed(role: AccountRole, pathname: string): boolean {
  if (pathname === "/panel") return true;
  if (role === "admin") return false;
  const roleRoot = rolePanelPaths[role];
  if (pathname === roleRoot || pathname.startsWith(`${roleRoot}/`)) return true;
  if (role === "professional") {
    return ["/panel/solicitudes", "/panel/oportunidades", "/panel/saldo", "/panel/preferencias", "/panel/perfil", "/panel/servicios", "/panel/resenas", "/panel/herramientas"]
      .some((path) => pathname === path || pathname.startsWith(`${path}/`));
  }
  if (role === "company" || role === "subcontractor") {
    return pathname === "/panel/herramientas" || pathname.startsWith("/panel/herramientas/");
  }
  return false;
}

export function initialsFromUser(user: { name?: string | null; email?: string | null }) {
  const name = String(user.name || "").trim();
  if (name) {
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }
  return String(user.email || "RK").slice(0, 2).toUpperCase();
}
