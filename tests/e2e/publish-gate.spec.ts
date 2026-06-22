import { test, expect } from "@playwright/test";

// Publicar un anuncio (proyecto o subcontrata) sin sesión debe quedar bloqueado
// tanto en la API como en la interfaz.
test.describe("publish gate", () => {
  test("API rejects anonymous project publish with 401", async ({ request }) => {
    const res = await request.post("/api/projects", {
      data: {
        email: "anon@example.com",
        description: "Reforma de baño completa en una vivienda",
        country: "ES",
        city: "Madrid",
        categoryId: "reformas",
        acceptsPreEstimate: true,
      },
    });
    expect(res.status()).toBe(401);
  });

  test("API rejects anonymous B2B publish with 401", async ({ request }) => {
    const res = await request.post("/api/b2b-projects", {
      data: {
        email: "anon@example.com",
        description: "Necesitamos subcontrata de electricidad para obra",
        country: "ES",
        city: "Madrid",
        requiredSpecialty: "electricidad",
      },
    });
    expect(res.status()).toBe(401);
  });

  test("publish page shows a sign-in prompt to anonymous visitors", async ({ page }) => {
    await page.goto("/publicar-proyecto");
    await expect(page.getByRole("link", { name: /conectar|sign in|se connecter|accedi|entrar|anmelden|inloggen/i }).first()).toBeVisible();
  });
});
