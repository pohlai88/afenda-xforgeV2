import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/design-system/components/ui/form";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "storybook/test";
import { useForm } from "react-hook-form";
import { object, string, type infer as zInfer } from "zod";

import { interactionStoryParameters } from "../.storybook/essentials";

const formSchema = object({
  username: string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const onSubmitMock = fn();

function ProfileFormStory() {
  const form = useForm<zInfer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  return (
    <Form {...form}>
      <form
        className="space-y-8"
        onSubmit={form.handleSubmit((values) => onSubmitMock(values))}
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <input
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="username"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <button
          className="rounded bg-primary px-4 py-2 text-primary-foreground"
          type="submit"
        >
          Submit
        </button>
      </form>
    </Form>
  );
}

/**
 * Building forms with React Hook Form and Zod.
 */
const meta = {
  title: "ui/Form",
  component: ProfileFormStory,
  tags: ["autodocs"],
} satisfies Meta<typeof ProfileFormStory>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the form.
 */
export const Default: Story = {};

export const FilledForm: Story = {
  parameters: interactionStoryParameters,
  tags: ["interaction"],
  play: async ({ canvas, userEvent }) => {
    onSubmitMock.mockClear();
    await userEvent.type(canvas.getByLabelText("Username"), "example-user");
    await userEvent.click(canvas.getByRole("button", { name: "Submit" }));
    await expect(onSubmitMock).toHaveBeenCalledWith({
      username: "example-user",
    });
  },
};

export const ValidationError: Story = {
  parameters: interactionStoryParameters,
  tags: ["interaction"],
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Submit" }));

    await expect(
      canvas.getByText("Username must be at least 2 characters.")
    ).toBeInTheDocument();
  },
};
