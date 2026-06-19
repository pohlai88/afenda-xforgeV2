import type { OrbitMorphListPageProps } from "@/lib/orbit-morph-page-types";
import { createOrbitMorphPilotListPage } from "../_components/orbit-morph-pilot-list-page";

const { Page, generateMetadata } = createOrbitMorphPilotListPage("project");

export { generateMetadata };

export default function OrbitProjectListPage(props: OrbitMorphListPageProps) {
  return <Page {...props} />;
}
