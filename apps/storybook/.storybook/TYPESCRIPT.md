# Storybook TypeScript

Afenda Storybook uses CSF3 with TypeScript. Use `satisfies` for meta and story objects so required args, custom args, decorators, loaders, and play functions stay type-safe.

## Default Pattern

```ts
import type { Meta, StoryObj } from "@storybook/react"

import { Button } from "@repo/design-system/components/afenda-ui/button"

const meta = {
  title: "Afenda UI/Button",
  component: Button,
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default = {
  args: {
    children: "Save record",
  },
} satisfies Story
```

## Custom Args

Use custom args only when the story controls composition that is not part of the component API.

```ts
import type {
  AfendaStoryArgs,
  AfendaStoryMeta,
  AfendaStory,
} from "../../.storybook/types"

type StoryArgs = AfendaStoryArgs<
  typeof Button,
  {
    iconName?: "plus" | "search"
  }
>

const meta = {
  component: Button,
  render: ({ iconName: _iconName, ...args }) => <Button {...args} />,
} satisfies AfendaStoryMeta<StoryArgs>

export default meta

type Story = AfendaStory<typeof meta>
```

## Rules

- Prefer `const meta = { ... } satisfies Meta<typeof Component>`.
- Prefer `export const Name = { ... } satisfies Story`.
- Avoid `const meta: Meta<typeof Component> = ...` unless a Storybook type issue requires it.
- Avoid `export const Name: Story = ...` for new stories; it weakens inference compared with `satisfies Story`.
- Use `React.ComponentProps<typeof Component> & CustomArgs` for custom args.
- Keep story data in `args`; use loaders only for deterministic async fixtures.
- Import test helpers from `storybook/test`, not `@storybook/test`.

## Existing Story Migration

The current story set still contains older `export const Name: Story = ...` declarations. They are valid, but new stories should use `satisfies Story`. Convert existing files opportunistically when editing the related story.
