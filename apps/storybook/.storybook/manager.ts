import { addons } from "storybook/manager-api";
import { create, themes } from "storybook/theming";

addons.setConfig({
  navSize: 260,
  bottomPanelHeight: 220,
  rightPanelWidth: 340,
  enableShortcuts: true,
  showToolbar: true,
  theme: create({
    ...themes.light,
    brandTitle: "Afenda Storybook",
    brandUrl: "/",
  }),
});
