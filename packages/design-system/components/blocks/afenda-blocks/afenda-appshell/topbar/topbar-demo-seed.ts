import type { TopbarContextOption, TopbarContextSwitcherProps } from "./topbar-types";

interface TopbarDemoProjectSeed {
  readonly id: string;
  readonly name: string;
  readonly subtitle: string;
}

interface TopbarDemoTeamSeed {
  readonly id: string;
  readonly name: string;
  readonly plan: string;
  readonly projects: readonly TopbarDemoProjectSeed[];
  readonly subtitle: string;
}

interface TopbarDemoDepartmentSeed {
  readonly id: string;
  readonly name: string;
  readonly subtitle: string;
  readonly teams: readonly TopbarDemoTeamSeed[];
}

interface TopbarDemoOrganizationSeed {
  readonly departments: readonly TopbarDemoDepartmentSeed[];
  readonly id: string;
  readonly name: string;
  readonly subtitle: string;
}

export interface TopbarDemoSelection {
  readonly departmentId: string;
  readonly organizationId: string;
  readonly projectId: string;
  readonly teamId: string;
}

const topbarDemoSeed = {
  selection: {
    departmentId: "dept-operations",
    organizationId: "org-vietnam-feed",
    projectId: "project-erp-rollout",
    teamId: "team-hanoi-hq",
  },
  organizations: [
    {
      id: "org-vietnam-feed",
      name: "Vietnam Feed",
      subtitle: "Enterprise tenant",
      departments: [
        {
          id: "dept-operations",
          name: "Operations",
          subtitle: "Core ERP",
          teams: [
            {
              id: "team-hanoi-hq",
              name: "Hanoi HQ",
              subtitle: "Primary team",
              plan: "Enterprise",
              projects: [
                {
                  id: "project-erp-rollout",
                  name: "ERP Rollout",
                  subtitle: "Q2 milestone",
                },
                {
                  id: "project-brand-studio",
                  name: "Brand Studio",
                  subtitle: "Theme QA",
                },
              ],
            },
            {
              id: "team-danang-ops",
              name: "Da Nang Ops",
              subtitle: "Regional hub",
              plan: "Growth",
              projects: [
                {
                  id: "project-logistics-hub",
                  name: "Logistics Hub",
                  subtitle: "Warehouse rollout",
                },
              ],
            },
          ],
        },
        {
          id: "dept-finance",
          name: "Finance",
          subtitle: "Ledger & compliance",
          teams: [
            {
              id: "team-finance-core",
              name: "Finance Core",
              subtitle: "Shared services",
              plan: "Enterprise",
              projects: [
                {
                  id: "project-close-automation",
                  name: "Close Automation",
                  subtitle: "Month-end pipeline",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "org-demo-sandbox",
      name: "Demo Org",
      subtitle: "Sandbox tenant",
      departments: [
        {
          id: "dept-preview",
          name: "Preview",
          subtitle: "Storybook lane",
          teams: [
            {
              id: "team-preview",
              name: "Preview Team",
              subtitle: "Design QA",
              plan: "Trial",
              projects: [
                {
                  id: "project-theme-qa",
                  name: "Theme QA",
                  subtitle: "Design review",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
} as const;

function findOrganization(
  organizationId: string
): TopbarDemoOrganizationSeed | undefined {
  return topbarDemoSeed.organizations.find(
    (organization) => organization.id === organizationId
  );
}

function findDepartment(
  organizationId: string,
  departmentId: string
): TopbarDemoDepartmentSeed | undefined {
  return findOrganization(organizationId)?.departments.find(
    (department) => department.id === departmentId
  );
}

function findTeam(
  organizationId: string,
  departmentId: string,
  teamId: string
): TopbarDemoTeamSeed | undefined {
  return findDepartment(organizationId, departmentId)?.teams.find(
    (team) => team.id === teamId
  );
}

function firstLinkedSelection(
  organization: TopbarDemoOrganizationSeed
): TopbarDemoSelection {
  const department = organization.departments[0];
  const team = department?.teams[0];
  const project = team?.projects[0];

  return {
    organizationId: organization.id,
    departmentId: department?.id ?? "",
    teamId: team?.id ?? "",
    projectId: project?.id ?? "",
  };
}

function toOption(entry: {
  readonly id: string;
  readonly name: string;
  readonly subtitle: string;
}): TopbarContextOption {
  return {
    id: entry.id,
    name: entry.name,
    subtitle: entry.subtitle,
  };
}

export function getTopbarDemoDefaultSelection(): TopbarDemoSelection {
  return { ...topbarDemoSeed.selection };
}

export function selectTopbarDemoOrganization(
  organizationId: string,
  current: TopbarDemoSelection
): TopbarDemoSelection {
  const organization = findOrganization(organizationId);

  if (!organization) {
    return current;
  }

  return firstLinkedSelection(organization);
}

export function selectTopbarDemoDepartment(
  organizationId: string,
  departmentId: string,
  current: TopbarDemoSelection
): TopbarDemoSelection {
  const department = findDepartment(organizationId, departmentId);
  const team = department?.teams[0];
  const project = team?.projects[0];

  return {
    organizationId,
    departmentId,
    teamId: team?.id ?? "",
    projectId: project?.id ?? "",
  };
}

export function selectTopbarDemoTeam(
  organizationId: string,
  departmentId: string,
  teamId: string,
  current: TopbarDemoSelection
): TopbarDemoSelection {
  const team = findTeam(organizationId, departmentId, teamId);
  const project = team?.projects[0];

  return {
    organizationId,
    departmentId,
    teamId,
    projectId: project?.id ?? "",
  };
}

export function selectTopbarDemoProject(
  organizationId: string,
  departmentId: string,
  teamId: string,
  projectId: string
): TopbarDemoSelection {
  return {
    organizationId,
    departmentId,
    teamId,
    projectId,
  };
}

export type TopbarDemoSelectionHandlers = {
  readonly onDepartmentChange: (departmentId: string) => void;
  readonly onOrganizationChange: (organizationId: string) => void;
  readonly onProjectChange: (projectId: string) => void;
  readonly onTeamChange: (teamId: string) => void;
};

export function resolveTopbarDemoSwitchers(
  selection: TopbarDemoSelection,
  handlers: TopbarDemoSelectionHandlers
): readonly TopbarContextSwitcherProps[] {
  const organization = findOrganization(selection.organizationId);
  const department = findDepartment(
    selection.organizationId,
    selection.departmentId
  );
  const team = findTeam(
    selection.organizationId,
    selection.departmentId,
    selection.teamId
  );

  if (!organization || !department || !team) {
    return [];
  }

  return [
    {
      activeOptionId: selection.organizationId,
      onOptionChange: (option) => {
        handlers.onOrganizationChange(option.id);
      },
      options: topbarDemoSeed.organizations.map(toOption),
      scope: "organization",
    },
    {
      activeOptionId: selection.departmentId,
      onOptionChange: (option) => {
        handlers.onDepartmentChange(option.id);
      },
      options: organization.departments.map(toOption),
      scope: "department",
    },
    {
      activeOptionId: selection.teamId,
      onOptionChange: (option) => {
        handlers.onTeamChange(option.id);
      },
      options: department.teams.map(toOption),
      scope: "team",
    },
    {
      activeOptionId: selection.projectId,
      onOptionChange: (option) => {
        handlers.onProjectChange(option.id);
      },
      options: team.projects.map(toOption),
      scope: "project",
    },
  ];
}
