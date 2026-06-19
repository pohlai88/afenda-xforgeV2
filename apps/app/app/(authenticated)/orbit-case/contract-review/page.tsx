import type { OrbitMorphListPageProps } from "@/lib/orbit-morph-page-types";
import { createOrbitMorphPilotListPage } from "../_components/orbit-morph-pilot-list-page";

const { Page, generateMetadata } = createOrbitMorphPilotListPage("contract-review");

export { generateMetadata };

export default function OrbitContractReviewListPage(props: OrbitMorphListPageProps) {
  return <Page {...props} />;
}
