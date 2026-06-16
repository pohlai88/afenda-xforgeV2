import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@repo/design-system/design-system";
import type { Meta, StoryObj } from "@storybook/react";
import { FileTextIcon, HomeIcon } from "lucide-react";

import { layoutStoryParameters } from "../../.storybook/essentials";

const meta = {
  title: "Afenda UI/Sidebar",
  tags: ["autodocs", "afenda-ui", "primitive"],
  component: Sidebar,
  parameters: { ...layoutStoryParameters, layout: "fullscreen" },
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <SidebarProvider className="min-h-[420px]">
      <Sidebar className="border-border-default border-r" collapsible="none">
        <SidebarHeader>
          <div className="px-2 py-1 font-medium text-[13px] text-text-primary">
            Afenda Ops
          </div>
        </SidebarHeader>
        <SidebarContent className="overflow-auto" tabIndex={0}>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <HomeIcon />
                    <span>Overview</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <FileTextIcon />
                    <span>Audit records</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="flex flex-1 items-center justify-center bg-canvas text-[13px] text-text-secondary">
        App shell content
      </main>
    </SidebarProvider>
  ),
};
