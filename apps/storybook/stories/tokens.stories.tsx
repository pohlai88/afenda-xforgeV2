import { AFENDA_COLOR_USAGE_POLICY } from "@repo/design-system/tokens/token-usage.policy";
import tokens from "@repo/design-system/tokens/tokens.json";
import type { Meta, StoryObj } from "@storybook/react";

const tokenGroups = [
  {
    description: "90% of the interface. Quiet surfaces, type, and structure.",
    names: ["canvas", "raised", "surface", "ink", "muted", "line"],
    title: "Foundation",
  },
  {
    description: "Identity and true primary intent. Not a success color.",
    names: ["brandPrimary", "brandDark", "brandSoft"],
    title: "Brand",
  },
  {
    description: "Low-frequency expression for onboarding and storytelling.",
    names: ["bark", "doe", "pink"],
    title: "Warmth",
  },
  {
    description: "Operational decisions only.",
    names: ["info", "warning", "critical", "success"],
    title: "Status",
  },
] as const;

function TokenReference() {
  return (
    <div className="grid w-[860px] gap-8">
      <section className="grid gap-2">
        <p className="font-semibold text-lg">Afenda Mindful Operator</p>
        <p className="max-w-2xl text-muted-foreground text-sm">
          Quiet Interfaces, Loud Decisions. Neutrals do the work. Brand creates
          memory. Status creates decisions. Warmth creates humanity.
        </p>
      </section>
      {tokenGroups.map((group) => (
        <section className="grid gap-3" key={group.title}>
          <div>
            <h2 className="font-semibold text-base">{group.title}</h2>
            <p className="text-muted-foreground text-xs">{group.description}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {group.names.map((name) => (
              <ColorTokenCard
                key={name}
                name={name}
                value={tokens.color[name]}
              />
            ))}
          </div>
        </section>
      ))}
      <section className="grid gap-3">
        <h2 className="font-semibold text-base">
          Light and dark surface stack
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <SurfaceStack mode="light" />
          <SurfaceStack mode="dark" />
        </div>
      </section>
      <section className="grid gap-3">
        <h2 className="font-semibold text-base">Usage policy</h2>
        <div className="grid gap-3 rounded-lg border bg-card p-4">
          <PolicyRow
            label="Warmth allowed"
            values={AFENDA_COLOR_USAGE_POLICY.warmth.allowed}
          />
          <PolicyRow
            label="Warmth forbidden"
            values={AFENDA_COLOR_USAGE_POLICY.warmth.forbidden}
          />
          <PolicyRow
            label="Brand"
            values={[AFENDA_COLOR_USAGE_POLICY.brand.rule]}
          />
          <PolicyRow
            label="Status"
            values={[AFENDA_COLOR_USAGE_POLICY.status.rule]}
          />
        </div>
      </section>
    </div>
  );
}

function ColorTokenCard({ name, value }: { name: string; value: string }) {
  return (
    <div className="rounded-md border bg-card p-3">
      <div
        aria-hidden
        className="mb-3 h-12 rounded-md border"
        style={{ backgroundColor: value }}
      />
      <div className="font-medium text-sm">{name}</div>
      <div className="text-muted-foreground text-xs">{value}</div>
    </div>
  );
}

function SurfaceStack({ mode }: { mode: "dark" | "light" }) {
  const colors = tokens.primitive.color[mode];

  return (
    <div className="grid gap-2 rounded-lg border bg-card p-3">
      <div className="font-medium text-sm">{mode}</div>
      {[
        ["canvas", colors.canvas],
        ["surface", colors.surface],
        ["raised", colors.raised],
        ["text", colors.ink],
      ].map(([name, value]) => (
        <div className="flex items-center gap-2" key={name}>
          <span
            aria-hidden
            className="size-5 rounded border"
            style={{ backgroundColor: value }}
          />
          <span className="font-medium text-xs">{name}</span>
          <span className="text-muted-foreground text-xs">{value}</span>
        </div>
      ))}
    </div>
  );
}

function PolicyRow({
  label,
  values,
}: {
  label: string;
  values: readonly string[];
}) {
  return (
    <div className="grid gap-1">
      <div className="font-medium text-sm">{label}</div>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <span
            className="rounded-md border bg-muted px-2 py-1 text-muted-foreground text-xs"
            key={value}
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: "Foundations/Tokens",
  component: TokenReference,
  tags: ["autodocs", "foundations"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof TokenReference>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Reference: Story = {};
