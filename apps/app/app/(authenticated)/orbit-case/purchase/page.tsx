import type { OrbitMorphListPageProps } from "@/lib/orbit-morph-page-types";
import type { Metadata } from "next";
import { OrbitMorphListRoutePage } from "../components/orbit-morph-route-page";
import { generateMorphListMetadata } from "../components/orbit-morph-list-view";

export async function generateMetadata(): Promise<Metadata> {
  return generateMorphListMetadata("purchase");
}

export default function OrbitPurchaseListPage({
  searchParams,
}: OrbitMorphListPageProps) {
  return (
    <OrbitMorphListRoutePage searchParams={searchParams} segment="purchase" />
  );
}
