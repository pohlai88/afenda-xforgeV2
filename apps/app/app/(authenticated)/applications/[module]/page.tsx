import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RouteSections } from "../../components/route-sections";

const applicationModules = {
  crm: {
    title: "CRM",
    description: "Customer relationships, accounts, and activity records.",
    items: ["Accounts", "Contacts", "Activity"],
  },
  sales: {
    title: "Sales",
    description: "Pipeline, opportunities, quotes, and revenue work.",
    items: ["Pipeline", "Quotes", "Revenue"],
  },
  procurement: {
    title: "Procurement",
    description: "Requests, suppliers, purchases, and approvals.",
    items: ["Requests", "Suppliers", "Purchases"],
  },
  inventory: {
    title: "Inventory",
    description: "Stock, locations, movements, and fulfillment signals.",
    items: ["Stock", "Locations", "Movements"],
  },
  manufacturing: {
    title: "Manufacturing",
    description: "Production planning, work orders, and shop-floor status.",
    items: ["Plans", "Work orders", "Status"],
  },
  hrm: {
    title: "HRM",
    description: "People, roles, membership, and workforce operations.",
    items: ["People", "Roles", "Teams"],
  },
  finance: {
    title: "Finance",
    description: "Controls, approvals, payments, and finance records.",
    items: ["Controls", "Payments", "Records"],
  },
  projects: {
    title: "Projects",
    description: "Project boards, delivery work, and execution tracking.",
    items: ["Boards", "Delivery", "Tracking"],
  },
} as const;

type ApplicationModuleId = keyof typeof applicationModules;

function resolveApplicationModule(module: string) {
  return applicationModules[module as ApplicationModuleId];
}

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly module: string }>;
}): Promise<Metadata> {
  const { module } = await params;
  const applicationModule = resolveApplicationModule(module);

  return {
    title: applicationModule?.title ?? "Application",
    description: applicationModule?.description,
  };
}

export default async function ApplicationModulePage({
  params,
}: {
  readonly params: Promise<{ readonly module: string }>;
}) {
  const { module } = await params;
  const applicationModule = resolveApplicationModule(module);

  if (!applicationModule) {
    notFound();
  }

  return (
    <RouteSections
      description={applicationModule.description}
      eyebrow={`Applications / ${applicationModule.title}`}
      items={applicationModule.items.map((item) => ({
        label: item,
        description: `${applicationModule.title} ${item.toLowerCase()} workspace.`,
      }))}
      title={applicationModule.title}
    />
  );
}
