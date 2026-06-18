"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { cn } from "../lib/utils";
import { Button } from "./afenda-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./afenda-ui/dropdown-menu";
import { recipe } from "./afenda-ui/recipes";
import {
  modeToggleMoonIconClass,
  modeToggleSunIconClass,
} from "./mode-toggle-recipes";

const themes = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

export const ModeToggle = ({
  buttonClassName,
}: {
  readonly buttonClassName?: string;
}) => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn("shrink-0", buttonClassName)}
          size="icon"
          variant="quiet"
        >
          <SunIcon className={cn(modeToggleSunIconClass)} />
          <MoonIcon className={cn(modeToggleMoonIconClass)} />
          <span className={cn(recipe("visuallyHidden"))}>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {themes.map(({ label, value }) => (
          <DropdownMenuItem key={value} onClick={() => setTheme(value)}>
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
