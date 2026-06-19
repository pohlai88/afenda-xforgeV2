import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { createOrbitCaseOnDetailPage } from "./orbit-case";

export interface MorphPushDestinationCase {
  destinationLabel: string;
  urlPattern: RegExp;
}

export async function createCaseForMorphPush(
  page: Page,
  uniqueTitle: string
): Promise<void> {
  await createOrbitCaseOnDetailPage(page, uniqueTitle);
}

export async function pushCaseToDestination(
  page: Page,
  destinationLabel: string,
  fieldValues: Record<string, string> = {}
): Promise<void> {
  await expect(page.getByRole("heading", { name: "Push to module" })).toBeVisible(
    {
      timeout: 15_000,
    }
  );
  await page.getByLabel("Destination").click();
  await page.getByRole("option", { name: destinationLabel }).click();

  for (const [label, value] of Object.entries(fieldValues)) {
    await page.getByLabel(label, { exact: true }).fill(value);
  }

  await page.getByRole("button", { name: "Push" }).click();
  await expect(page.getByRole("heading", { name: "Links" })).toBeVisible({
    timeout: 15_000,
  });
}

export async function openMorphTargetAndVerifyOrigin(
  page: Page,
  destination: MorphPushDestinationCase,
  uniqueTitle: string
): Promise<void> {
  const targetLink = page.getByRole("link", {
    name: destination.destinationLabel,
  });
  await expect(targetLink).toBeVisible();
  await targetLink.click();
  await expect(page).toHaveURL(destination.urlPattern, {
    timeout: 15_000,
  });
  await expect(page.getByText("From Orbit Case")).toBeVisible();
  await expect(page.getByRole("link", { name: uniqueTitle })).toBeVisible();
}

export const MORPH_PUSH_DESTINATIONS: MorphPushDestinationCase[] = [
  {
    destinationLabel: "Budget Request",
    urlPattern: /\/orbit-case\/budget\/[^/]+$/,
  },
  {
    destinationLabel: "Meeting Request",
    urlPattern: /\/orbit-case\/meeting\/[^/]+$/,
  },
  {
    destinationLabel: "Approval Request",
    urlPattern: /\/orbit-case\/approval\/[^/]+$/,
  },
  {
    destinationLabel: "Purchase Request",
    urlPattern: /\/orbit-case\/purchase\/[^/]+$/,
  },
  {
    destinationLabel: "Lead Request",
    urlPattern: /\/orbit-case\/lead\/[^/]+$/,
  },
  {
    destinationLabel: "Complaint Request",
    urlPattern: /\/orbit-case\/complaint\/[^/]+$/,
  },
  {
    destinationLabel: "Risk Request",
    urlPattern: /\/orbit-case\/risk\/[^/]+$/,
  },
  {
    destinationLabel: "Project Request",
    urlPattern: /\/orbit-case\/project\/[^/]+$/,
  },
  {
    destinationLabel: "Investigation Request",
    urlPattern: /\/orbit-case\/investigation\/[^/]+$/,
  },
  {
    destinationLabel: "CAPA Request",
    urlPattern: /\/orbit-case\/capa\/[^/]+$/,
  },
  {
    destinationLabel: "Contract Review Request",
    urlPattern: /\/orbit-case\/contract-review\/[^/]+$/,
  },
];
