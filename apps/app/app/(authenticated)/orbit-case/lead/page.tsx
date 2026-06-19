import type { OrbitMorphListPageProps } from "@/lib/orbit-morph-page-types";
import { createOrbitMorphPilotListPage } from "../_components/orbit-morph-pilot-list-page";

const { Page, generateMetadata } = createOrbitMorphPilotListPage("lead");

export { generateMetadata };

export default function OrbitLeadListPage(props: OrbitMorphListPageProps) {
  return <Page {...props} />;
}
