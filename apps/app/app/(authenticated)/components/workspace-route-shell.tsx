import { blockRecipe } from "@repo/design-system";
import { cn } from "@repo/design-system/lib/utils";
import { Header } from "./header";

interface WorkspaceRouteShellItem {
  readonly description: string;
  readonly label: string;
}

interface WorkspaceRouteShellProps {
  readonly description: string;
  readonly eyebrow: string;
  readonly items: readonly WorkspaceRouteShellItem[];
  readonly title: string;
}

export function WorkspaceRouteShell({
  description,
  eyebrow,
  items,
  title,
}: WorkspaceRouteShellProps) {
  return (
    <>
      <Header description={description} eyebrow={eyebrow} title={title} />
      <div className="grid gap-4 p-[var(--xforge-space-8)] md:grid-cols-3">
        {items.map((item) => (
          <section
            className={cn(
              blockRecipe("blockPanel", "blockPanelPadding"),
              "grid min-h-28 content-start gap-1"
            )}
            key={item.label}
          >
            <h2 className={blockRecipe("blockTitle")}>{item.label}</h2>
            <p className={blockRecipe("blockDescription")}>
              {item.description}
            </p>
          </section>
        ))}
      </div>
    </>
  );
}
