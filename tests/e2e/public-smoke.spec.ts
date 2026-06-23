import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.removeItem("regikaha-cookie-consent");
    localStorage.setItem("regikaha-locale", "es");
  });
});

test("home uses the RegiKaha brand and has no visible release placeholders", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  await expect(page.getByRole("link", { name: /RegiKaha.*inicio/i }).first()).toBeVisible();
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/Cargando|Preparando|Coming soon/i);
  expect(errors.filter((error) => !error.includes("favicon"))).toEqual([]);
});

test("cookie preferences can reject, reopen and configure optional categories", async ({ page }) => {
  await page.goto("/");
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: /Rechazar opcionales/i }).click();
  await expect(dialog).toBeHidden();
  await page.getByRole("button", { name: /Preferencias de cookies/i }).click({ force: true });
  await expect(dialog).toBeVisible();
  const analytics = dialog.getByRole("checkbox").first();
  await analytics.check();
  await dialog.getByRole("button", { name: /Guardar preferencias/i }).click();
  const consent = await page.evaluate(() => JSON.parse(localStorage.getItem("regikaha-cookie-consent") || "{}"));
  expect(consent).toMatchObject({ necessary: true, analytics: true, maps: false, marketing: false });
});

test("trust and coverage routes render meaningful server content", async ({ page }) => {
  for (const path of ["/seguridad", "/verificacion", "/paises", "/legal/dpa", "/legal/politica-contenido"]) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("body")).not.toContainText(/Cargando|Preparando|Coming soon/i);
  }
});

test("mobile pages do not overflow horizontally", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile viewport only");
  for (const path of ["/", "/buscar", "/precios", "/seguridad"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${path} horizontal overflow`).toBeLessThanOrEqual(1);
  }
});
