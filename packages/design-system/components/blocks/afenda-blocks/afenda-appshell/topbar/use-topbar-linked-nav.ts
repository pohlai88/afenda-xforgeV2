"use client";

import { useCallback, useMemo, useState } from "react";
import {
  getTopbarDemoDefaultSelection,
  resolveTopbarDemoSwitchers,
  selectTopbarDemoDepartment,
  selectTopbarDemoOrganization,
  selectTopbarDemoProject,
  selectTopbarDemoTeam,
  type TopbarDemoSelection,
} from "./topbar-demo-seed";
import type { TopbarContextSwitcherProps } from "./topbar-types";

export function useTopbarLinkedNav(
  initialSelection: TopbarDemoSelection = getTopbarDemoDefaultSelection()
) {
  const [selection, setSelection] = useState(initialSelection);

  const onOrganizationChange = useCallback((organizationId: string) => {
    setSelection((current) => selectTopbarDemoOrganization(organizationId, current));
  }, []);

  const onDepartmentChange = useCallback((departmentId: string) => {
    setSelection((current) =>
      selectTopbarDemoDepartment(current.organizationId, departmentId, current)
    );
  }, []);

  const onTeamChange = useCallback((teamId: string) => {
    setSelection((current) =>
      selectTopbarDemoTeam(
        current.organizationId,
        current.departmentId,
        teamId,
        current
      )
    );
  }, []);

  const onProjectChange = useCallback((projectId: string) => {
    setSelection((current) =>
      selectTopbarDemoProject(
        current.organizationId,
        current.departmentId,
        current.teamId,
        projectId
      )
    );
  }, []);

  const switchers = useMemo(
    () =>
      resolveTopbarDemoSwitchers(selection, {
        onDepartmentChange,
        onOrganizationChange,
        onProjectChange,
        onTeamChange,
      }),
    [
      onDepartmentChange,
      onOrganizationChange,
      onProjectChange,
      onTeamChange,
      selection,
    ]
  );

  return {
    selection,
    switchers,
    selectDepartment: onDepartmentChange,
    selectOrganization: onOrganizationChange,
    selectProject: onProjectChange,
    selectTeam: onTeamChange,
  };
}

export type TopbarLinkedNav = {
  readonly selection: TopbarDemoSelection;
  readonly selectDepartment: (departmentId: string) => void;
  readonly selectOrganization: (organizationId: string) => void;
  readonly selectProject: (projectId: string) => void;
  readonly selectTeam: (teamId: string) => void;
  readonly switchers: readonly TopbarContextSwitcherProps[];
};
