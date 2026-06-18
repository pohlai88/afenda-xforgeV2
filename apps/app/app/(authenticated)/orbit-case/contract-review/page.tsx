import type { OrbitMorphListPageProps } from "@/lib/orbit-morph-page-types";
import type { Metadata } from "next";
import { OrbitMorphListRoutePage } from "../_components/orbit-morph-route-page";
import { generateMorphListMetadata } from "../_components/orbit-morph-list-view";

export async function generateMetadata(): Promise<Metadata> {
  return generateMorphListMetadata("contract-review");
}

export default function OrbitContractReviewListPage({
  searchParams,
}: OrbitMorphListPageProps) {
  return (
    <OrbitMorphListRoutePage
      searchParams={searchParams}
      segment="contract-review"
    />
  );
}
