import type { Meta, StoryObj } from "@storybook/react";
import type * as React from "react";

export type AfendaStoryMeta<TComponentOrProps> = Meta<TComponentOrProps>;

export type AfendaStory<TMeta> = StoryObj<TMeta>;

export type AfendaStoryArgs<
  TComponent extends React.ElementType,
  TCustomArgs extends Record<string, unknown> = Record<string, never>,
> = React.ComponentProps<TComponent> & TCustomArgs;
