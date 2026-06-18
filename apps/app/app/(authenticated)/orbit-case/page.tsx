import { getOrganizationRole } from "@repo/auth/cms";
import { requireOrg } from "@repo/auth/server";
import type { OrbitCaseBoardDto, OrbitCaseDto } from "@repo/orbit-case";
import {
  toOrbitCaseBoardDto,
  toOrbitCaseCalendarDto,
  toOrbitCaseDto,
  toOrbitCaseTimelineDto,
} from "@repo/orbit-case";
import type { Metadata } from "next";
import { Header } from "../_components/header";
import { OrbitCaseWorkspace } from "./_components/orbit-case-workspace";
import { getCachedOrbitCaseWorkspace } from "@/lib/orbit-case-cached-reads";

const title = "Orbit Case";
const description =
  "Universal work items — capture attention first, push to governed modules when ready.";

export const metadata: Metadata = {
  title,
  description,
};

export default async function OrbitCasePage() {
  const { orgId, userId } = await requireOrg();
  const role = await getOrganizationRole(userId, orgId);
  const [cases, board, calendar, timeline] =
    await getCachedOrbitCaseWorkspace(orgId);

  const initialCases: OrbitCaseDto[] = cases.map(toOrbitCaseDto);
  const initialBoard: OrbitCaseBoardDto = toOrbitCaseBoardDto(board);

  return (
    <>
      <Header
        description={description}
        eyebrow="Work / Orbit Case"
        title={title}
      />
      <OrbitCaseWorkspace
        initialBoard={initialBoard.columns}
        initialCalendar={toOrbitCaseCalendarDto(calendar)}
        initialCases={initialCases}
        initialTimeline={toOrbitCaseTimelineDto(timeline)}
        showRegistryLink={role === "owner"}
      />
    </>
  );
}
