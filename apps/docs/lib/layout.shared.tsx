import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "Starter Kit",
    },
    links: [
      {
        text: "Support",
        url: "mailto:support@example.com",
      },
    ],
  };
}
