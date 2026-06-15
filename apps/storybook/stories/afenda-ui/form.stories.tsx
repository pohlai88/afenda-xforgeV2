import { useForm } from "react-hook-form"
import type { Meta, StoryObj } from "@storybook/react"

import { Button } from "@repo/design-system/components/afenda-ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/design-system/components/afenda-ui/form"
import { Input } from "@repo/design-system/components/afenda-ui/input"

const meta = {
  title: "Afenda UI/Form",
  component: FormItem,
  subcomponents: {
    Form,
    FormField,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
  },
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof FormItem>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const form = useForm({
      defaultValues: {
        email: "mina.chai@northwind.local",
        employeeId: "TH-PAY-01842",
        approver: "payroll.lead@northwind.local",
      },
    })

    return (
      <div className="min-h-[560px] bg-surface-canvas p-6 text-[13px] text-text-primary">
        <section className="mx-auto grid max-w-5xl gap-5 rounded-xl border border-border-default bg-surface-raised p-5 shadow-panel">
          <div className="flex items-center justify-between border-border-subtle border-b pb-3">
            <div>
              <h3 className="font-semibold text-[15px]">
                Payroll correction request
              </h3>
              <p className="text-text-secondary text-xs">
                Tenant: Northwind APAC · record PAY-2026-06-OFF
              </p>
            </div>
            <span className="rounded-md bg-surface-muted px-2 py-1 font-mono text-text-secondary text-xs">
              Autosaved 09:42
            </span>
          </div>
          <Form {...form}>
            <form className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operator email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Used for audit notifications and approval routing.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payroll employee ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Matches the payroll ledger.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="approver"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary approver</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Required above THB 50,000.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border-subtle bg-surface-muted px-3 py-2">
                <p className="text-text-secondary text-xs">
                  Request remains in draft until policy checks pass.
                </p>
                <Button type="submit">Save correction</Button>
              </div>
            </form>
          </Form>
        </section>
      </div>
    )
  },
}
