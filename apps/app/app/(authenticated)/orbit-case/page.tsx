import { requireOrg } from "@repo/auth/server";
import type { OrbitCaseBoardDto, OrbitCaseDto } from "@repo/orbit-case";
import { toOrbitCaseBoardDto, toOrbitCaseDto } from "@repo/orbit-case";
import { getOrbitCaseBoard, listOrbitCases } from "@repo/orbit-case/server";
import type { Metadata } from "next";
import { Header } from "../components/header";
import { OrbitCaseWorkspace } from "./components/orbit-case-workspace";

const title = "Orbit Case";
const description =
  "Universal work items — capture attention first, push to governed modules when ready.";

export const metadata: Metadata = {
  title,
  description,
};

export default async function OrbitCasePage() {
  const { orgId } = await requireOrg();
  const [cases, board] = await Promise.all([
    listOrbitCases(orgId),
    getOrbitCaseBoard(orgId),
  ]);

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
        initialCases={initialCases}
      />
    </>
  );
}
