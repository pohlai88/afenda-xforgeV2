import type { OrbitMorphListPageProps } from "@/lib/orbit-morph-page-types";
import { createOrbitMorphPilotListPage } from "../_components/orbit-morph-pilot-list-page";

const { Page, generateMetadata } = createOrbitMorphPilotListPage("investigation");

export { generateMetadata };

export default function OrbitInvestigationListPage(props: OrbitMorphListPageProps) {
  return <Page {...props} />;
}
