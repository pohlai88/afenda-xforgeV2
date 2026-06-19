import type { OrbitMorphListPageProps } from "@/lib/orbit-morph-page-types";
import { createOrbitMorphPilotListPage } from "../_components/orbit-morph-pilot-list-page";

const { Page, generateMetadata } = createOrbitMorphPilotListPage("risk");

export { generateMetadata };

export default function OrbitRiskListPage(props: OrbitMorphListPageProps) {
  return <Page {...props} />;
}
