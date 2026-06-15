import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@repo/design-system/components/ui/navigation-menu";
import type { Meta, StoryObj } from "@storybook/react";

/**
 * A collection of links for navigating websites.
 */
const meta = {
  title: "ui/NavigationMenu",
  component: NavigationMenu,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            href="/overview"
          >
            Overview
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
            Documentation
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-96 list-none p-2">
              <li>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  href="/api-reference"
                >
                  API Reference
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  href="/getting-started"
                >
                  Getting Started
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  href="/guides"
                >
                  Guides
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            href="https://www.google.com"
            target="_blank"
          >
            External
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof NavigationMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the navigation menu.
 */
export const Default: Story = {};
