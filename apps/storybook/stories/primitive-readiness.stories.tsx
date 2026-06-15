import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@repo/design-system/components/ui/alert";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import { Checkbox } from "@repo/design-system/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@repo/design-system/components/ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/design-system/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/design-system/components/ui/dropdown-menu";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@repo/design-system/components/ui/field";
import { Input } from "@repo/design-system/components/ui/input";
import {
  RadioGroup,
  RadioGroupItem,
} from "@repo/design-system/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/ui/select";
import { Switch } from "@repo/design-system/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design-system/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design-system/components/ui/tabs";
import { Textarea } from "@repo/design-system/components/ui/textarea";
import type { Meta, StoryObj } from "@storybook/react";

import {
  layoutStoryParameters,
  matrixStoryParameters,
} from "../.storybook/essentials";
import { CheckCircle2Icon, ShieldCheckIcon } from "lucide-react";

const readinessRows = [
  ["Stories", "Every primitive has a matching Storybook story", "Ready"],
  ["Detector", "UI Craft detector returns zero findings", "Ready"],
  ["Tokens", "Operational primitives use semantic tokens", "Ready"],
  [
    "Source of truth",
    "Code tokens and components remain authoritative",
    "Ready",
  ],
] as const;

function PrimitiveReadiness() {
  return (
    <div className="grid w-[1040px] gap-6 bg-background p-6 text-foreground">
      <section className="grid gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheckIcon aria-hidden className="size-5 text-primary" />
          <h1 className="font-semibold text-2xl tracking-normal">
            Primitive readiness
          </h1>
        </div>
        <p className="max-w-3xl text-muted-foreground text-sm leading-5">
          Afenda primitives are hardened for dense operator workflows. Quiet
          surfaces carry the interface; visible states carry decisions.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="font-semibold text-base">Governance status</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gate</TableHead>
              <TableHead>Expectation</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {readinessRows.map(([gate, expectation, status]) => (
              <TableRow key={gate}>
                <TableCell className="font-medium">{gate}</TableCell>
                <TableCell className="text-muted-foreground">
                  {expectation}
                </TableCell>
                <TableCell>
                  <Badge className="gap-1.5" variant="outline">
                    <CheckCircle2Icon aria-hidden className="size-3" />
                    {status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section className="grid gap-4">
        <h2 className="font-semibold text-base">Forms state matrix</h2>
        <div className="grid grid-cols-2 gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="ready-name">Default input</FieldLabel>
              <Input id="ready-name" placeholder="Search records" />
              <FieldDescription>
                Neutral repeated operator action.
              </FieldDescription>
            </Field>
            <Field data-invalid="true">
              <FieldLabel htmlFor="ready-invalid">Invalid input</FieldLabel>
              <Input
                aria-describedby="ready-invalid-error"
                aria-invalid="true"
                id="ready-invalid"
                placeholder="Approval code"
              />
              <FieldError id="ready-invalid-error">
                Approval code is required.
              </FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="ready-disabled">Disabled input</FieldLabel>
              <Input
                disabled
                id="ready-disabled"
                placeholder="Locked by policy"
              />
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel>Selection controls</FieldLabel>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Checkbox aria-label="Audit enabled" defaultChecked />
                  Audit enabled
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Switch aria-label="Guard active" defaultChecked />
                  Guard active
                </div>
              </div>
            </Field>
            <Field>
              <FieldLabel>Risk level</FieldLabel>
              <RadioGroup className="flex gap-4" defaultValue="medium">
                <div className="flex items-center gap-2 text-sm">
                  <RadioGroupItem aria-label="Low risk" value="low" />
                  Low
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <RadioGroupItem aria-label="Medium risk" value="medium" />
                  Medium
                </div>
              </RadioGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="ready-select">Select state</FieldLabel>
              <Select defaultValue="ready">
                <SelectTrigger id="ready-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="pending">Pending review</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="font-semibold text-base">Overlays and menus</h2>
        <div className="flex flex-wrap gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open decision dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm approval</DialogTitle>
                <DialogDescription>
                  This verifies the selected tenant-scoped operation.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button>Confirm approval</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open action menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Record actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Open record</DropdownMenuItem>
              <DropdownMenuItem>Review evidence</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                Revoke access
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Command className="max-w-md border">
          <CommandInput placeholder="Search commands" />
          <CommandList>
            <CommandEmpty>No command found.</CommandEmpty>
            <CommandGroup heading="Tenant operations">
              <CommandItem>
                Open audit log
                <CommandShortcut>⌘A</CommandShortcut>
              </CommandItem>
              <CommandItem>
                Recheck grants
                <CommandShortcut>⌘G</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </section>

      <section className="grid gap-4">
        <h2 className="font-semibold text-base">Navigation and dense data</h2>
        <Tabs defaultValue="queue">
          <TabsList>
            <TabsTrigger value="queue">Queue</TabsTrigger>
            <TabsTrigger value="audit">Audit</TabsTrigger>
            <TabsTrigger disabled value="locked">
              Locked
            </TabsTrigger>
          </TabsList>
          <TabsContent className="rounded-md border p-3" value="queue">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Record</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Owner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {["Payroll review", "Company grant", "Policy evidence"].map(
                  (record, index) => (
                    <TableRow key={record}>
                      <TableCell className="font-medium">{record}</TableCell>
                      <TableCell>
                        {index === 1 ? "Needs review" : "Ready"}
                      </TableCell>
                      <TableCell>Operations</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent className="rounded-md border p-3" value="audit">
            Audit tab content keeps focus visible and state readable.
          </TabsContent>
        </Tabs>
      </section>

      <section className="grid gap-3">
        <h2 className="font-semibold text-base">Display and feedback</h2>
        <Alert>
          <ShieldCheckIcon aria-hidden className="size-4" />
          <AlertTitle>Ready for product surfaces</AlertTitle>
          <AlertDescription>
            Export only hardened primitives and proven reusable blocks. App
            cockpit compositions stay outside the shared design-system package.
          </AlertDescription>
        </Alert>
        <Textarea
          aria-label="Reduced motion note"
          defaultValue="Reduced motion keeps state changes understandable without decorative layout animation."
        />
      </section>
    </div>
  );
}

const meta = {
  title: "governance/Primitive Readiness",
  component: PrimitiveReadiness,
  tags: ["autodocs"],
  parameters: {
    ...layoutStoryParameters,
    layout: "centered",
  },
} satisfies Meta<typeof PrimitiveReadiness>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ReadinessMatrix: Story = {
  parameters: matrixStoryParameters,
};
