import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RouteSections } from "../../components/route-sections";

const systemAreas = {
  notifications: {
    title: "Notifications",
    description: "Alerts, mentions, subscriptions, and operator updates.",
    items: ["Alerts", "Mentions", "Subscriptions"],
  },
  approvals: {
    title: "Approvals",
    description: "Approval queues, sign-off work, and control gates.",
    items: ["Queues", "Sign-offs", "Control gates"],
  },
  administration: {
    title: "Administration",
    description: "Account security, tenant policy, and system settings.",
    items: ["Security", "Policy", "Settings"],
  },
} as const;

type SystemAreaId = keyof typeof systemAreas;

function resolveSystemArea(area: string) {
  return systemAreas[area as SystemAreaId];
}

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly area: string }>;
}): Promise<Metadata> {
  const { area } = await params;
  const systemArea = resolveSystemArea(area);

  return {
    title: systemArea?.title ?? "System",
    description: systemArea?.description,
  };
}

export default async function SystemAreaPage({
  params,
}: {
  readonly params: Promise<{ readonly area: string }>;
}) {
  const { area } = await params;
  const systemArea = resolveSystemArea(area);

  if (!systemArea) {
    notFound();
  }

  return (
    <RouteSections
      description={systemArea.description}
      eyebrow={`System / ${systemArea.title}`}
      items={systemArea.items.map((item) => ({
        label: item,
        description: `${systemArea.title} ${item.toLowerCase()} workspace.`,
      }))}
      title={systemArea.title}
    />
  );
}
