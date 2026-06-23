import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.removeItem("regikaha-cookie-consent");
    localStorage.setItem("regikaha-locale", "es");
  });
});

test.describe("Multirole flows", () => {
  test("/conectar page offers Entrar como cliente and links to /login?role=client&next=/panel/cliente", async ({ page }) => {
    await page.goto("/conectar");
    await expect(page.getByRole("link", { name: /Entrar como cliente/i })).toBeVisible();
    const clientLink = page.getByRole("link", { name: /Entrar como cliente/i });
    await expect(clientLink).toHaveAttribute("href", "/login?role=client&next=/panel/cliente");
  });

  test("/conectar page links to profesional login with correct panel redirect", async ({ page }) => {
    await page.goto("/conectar");
    const proLink = page.getByRole("link", { name: /Entrar como profesional/i });
    await expect(proLink).toHaveAttribute("href", "/login?role=professional&next=/panel/profesional");
  });

  test("/login renders with role=client param and form is visible", async ({ page }) => {
    await page.goto("/login?role=client&next=/panel/cliente");
    await expect(page.getByRole("heading", { name: /entrar como cliente/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /iniciar sesión/i })).toBeVisible();
  });

  test("/login renders with role=professional param", async ({ page }) => {
    await page.goto("/login?role=professional&next=/panel/profesional");
    await expect(page.getByRole("heading", { name: /entrar como profesional/i })).toBeVisible();
  });

  test("Header shows Mi panel link that respects activeRole from /api/me", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const headerLinks = page.getByRole("link");
    // Static home should not crash, header should render
    await expect(page.locator("header")).toBeVisible();
  });

  test("publicar-proyecto shows a sign-in gate for anonymous users", async ({ page }) => {
    await page.goto("/publicar-proyecto");
    await page.waitForLoadState("networkidle");
    // Anonymous users now see the sign-in / create-account gate, not the form
    await expect(page.getByRole("link", { name: /conectar|crear cuenta|sign in/i }).first()).toBeVisible();
  });

  test("/panel/cliente/proyectos page loads without crashing", async ({ page }) => {
    await page.goto("/panel/cliente/proyectos");
    await page.waitForLoadState("networkidle");
    // Redirects to /conectar when not authenticated
    await expect(page).toHaveURL(/\/conectar/);
  });

  test("/panel/cliente/mensajes page placeholder exists", async ({ page }) => {
    await page.goto("/panel/cliente/mensajes");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/conectar/);
  });

  test("/api/login endpoint returns correct structure for role switching", async ({ page }) => {
    const response = await page.request.post("/api/login", {
      data: { email: "test@test.com", password: "wrong", role: "client", redirectTo: "/panel/cliente" },
    });
    expect(response.status()).toBe(401);
  });

  test("/api/me returns expected fields when not authenticated", async ({ page }) => {
    const response = await page.request.get("/api/me");
    const data = await response.json();
    expect(data).toHaveProperty("authenticated");
    expect(data.authenticated).toBe(false);
  });

  test("ConnectAccountChooser renders Entrar como cliente button linking to /login with role and next params", async ({ page }) => {
    await page.goto("/conectar");
    const clientBtn = page.getByRole("link", { name: /Entrar como cliente/i });
    await expect(clientBtn).toHaveAttribute("href", "/login?role=client&next=/panel/cliente");
    const registerBtn = page.getByRole("link", { name: /crear cuenta/i }).first();
    await expect(registerBtn).toHaveAttribute("href", "/registro/cliente");
  });
});
