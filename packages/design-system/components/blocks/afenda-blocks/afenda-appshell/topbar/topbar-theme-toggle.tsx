"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { blockRecipe } from "../../../block-recipes";
import { Button } from "../../../../afenda-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../afenda-ui/dropdown-menu";
import { recipe } from "../../../../afenda-ui/recipes";
import { cn } from "../../../../../lib/utils";
import {
  topbarActionIconClass,
  topbarIconButtonClass,
  topbarThemeMoonIconClass,
  topbarThemeSunIconClass,
} from "./topbar-recipes";

const themeOptions = [
  { icon: SunIcon, label: "Light", value: "light" },
  { icon: MoonIcon, label: "Dark", value: "dark" },
  { icon: MonitorIcon, label: "System", value: "system" },
] as const;

export function TopbarThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-haspopup="menu"
          aria-label="Toggle theme"
          className={cn(
            blockRecipe("blockToolbar"),
            topbarIconButtonClass,
            "relative"
          )}
          data-slot="app-topbar-theme-toggle"
          size="icon-sm"
          type="button"
          variant="quiet"
        >
          <SunIcon aria-hidden="true" className={cn(topbarThemeSunIconClass)} />
          <MoonIcon
            aria-hidden="true"
            className={cn(topbarThemeMoonIconClass)}
          />
          <span className={cn(recipe("visuallyHidden"))}>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themeOptions.map(({ icon: Icon, label, value }) => (
          <DropdownMenuItem key={value} onClick={() => setTheme(value)}>
            <Icon className={cn(topbarActionIconClass)} />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
