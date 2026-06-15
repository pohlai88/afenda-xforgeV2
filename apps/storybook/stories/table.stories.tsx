import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design-system/components/ui/table";
import type { Meta, StoryObj } from "@storybook/react";

import {
  layoutStoryParameters,
  matrixStoryParameters,
} from "../.storybook/essentials";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
];

/**
 * Powerful table and datagrids built using TanStack Table.
 */
const meta = {
  title: "ui/Table",
  component: Table,
  tags: ["autodocs"],
  argTypes: {},
  parameters: layoutStoryParameters,
  render: (args) => (
    <Table {...args}>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice, index) => (
          <TableRow
            data-state={index === 1 ? "selected" : undefined}
            key={invoice.invoice}
          >
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the table.
 */
export const Default: Story = {};

export const DenseOperatorMatrix: Story = {
  parameters: matrixStoryParameters,
  render: () => (
    <div className="w-[760px]">
      <Table>
        <TableCaption>
          Sticky header, selected row, horizontal overflow.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Evidence ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Tenant</TableHead>
            <TableHead className="text-right">SLA</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            ["EV-1042", "Passed", "Mina", "Northwind", "2h"],
            ["EV-1043", "Pending", "Omar", "Contoso", "18m"],
            ["EV-1044", "Failed", "Iris", "Fabrikam", "0m"],
          ].map((row, index) => (
            <TableRow
              data-state={index === 1 ? "selected" : undefined}
              key={row[0]}
            >
              {row.slice(0, -1).map((cell) => (
                <TableCell key={cell}>{cell}</TableCell>
              ))}
              <TableCell className="text-right">{row.at(-1)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};
