import type { ReactNode } from "react";
import {
  AfendaAppFooter,
  AfendaAppShell,
  AfendaAppSidebar,
} from "@repo/design-system";
import type { Meta, StoryObj } from "@storybook/react";

import { layoutStoryParameters } from "../../.storybook/essentials";
import {
  storyAppShellFooterLinks,
  storyAppShellSidebarNavDescriptor,
  storyAppShellUser,
} from "./afenda-appshell.fixtures";
import { storyAppShellSidebarNavIconRegistry } from "./afenda-appshell.registry";

const meta = {
  title: "Blocks/Foundation/App Shell",
  tags: ["autodocs", "block"],
  parameters: {
    ...layoutStoryParameters,
    layout: "fullscreen",
    afendaLayout: "fullscreen",
    viewport: { defaultViewport: "desktop" },
    docs: {
      description: {
        component:
          "Bento-grid application shell: full-width topbar and footer, sidebar in the middle row, and content with header, left rail, main, and right rail. Navigation and footer content are supplied by the host app or story fixtures — not embedded demo catalogs.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function StoryAppShell({
  children,
  pathname = "/dashboard",
}: {
  readonly children?: ReactNode;
  readonly pathname?: string;
}) {
  return (
    <AfendaAppShell
      footer={
        <AfendaAppFooter
          copyrightHolder="Afenda"
          links={storyAppShellFooterLinks}
        />
      }
      sidebar={
        <AfendaAppSidebar
          navDescriptor={storyAppShellSidebarNavDescriptor}
          navIconRegistry={storyAppShellSidebarNavIconRegistry}
          pathname={pathname}
          user={storyAppShellUser}
        />
      }
    >
      {children}
    </AfendaAppShell>
  );
}

export const BentoLayoutDefault: Story = {
  name: "Bento Layout",
  parameters: {
    docs: {
      description: {
        story:
          "Shell with story-local navigation fixtures and placeholder layout regions.",
      },
    },
  },
  render: () => <StoryAppShell />,
};

export const BentoLayoutWithMainOverride: Story = {
  name: "Bento Layout + Main Override",
  parameters: {
    docs: {
      description: {
        story: "Shell with custom main content while keeping layout rails.",
      },
    },
  },
  render: () => (
    <StoryAppShell>
      <div className="grid min-h-48 place-items-center text-text-secondary text-sm">
        Custom main slot
      </div>
    </StoryAppShell>
  ),
};
