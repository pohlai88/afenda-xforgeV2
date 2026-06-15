import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import type { Meta, StoryObj } from "@storybook/react";
import { BellRing } from "lucide-react";

const notifications = [
  {
    title: "Your call has been confirmed.",
    description: "1 hour ago",
  },
  {
    title: "You have a new message!",
    description: "1 hour ago",
  },
  {
    title: "Your subscription is expiring soon!",
    description: "2 hours ago",
  },
];

/**
 * Displays a card with header, content, and footer.
 */
const meta = {
  title: "ui/Card",
  component: Card,
  subcomponents: {
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {
    className: "w-96",
  },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {notifications.map((notification) => (
          <div className="flex items-center gap-4" key={notification.title}>
            <BellRing className="size-6" />
            <div>
              <p>{notification.title}</p>
              <p className="text-muted-foreground">{notification.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <button className="hover:underline" type="button">
          Close
        </button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

type NotificationItem = {
  title: string
  description: string
}

function NotificationCard({
  className,
  description,
  items,
  title,
}: {
  className?: string
  description: string
  items: NotificationItem[]
  title: string
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {items.map((notification) => (
          <div className="flex items-center gap-4" key={notification.title}>
            <BellRing className="size-6" />
            <div>
              <p>{notification.title}</p>
              <p className="text-muted-foreground">{notification.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <button className="hover:underline" type="button">
          Close
        </button>
      </CardFooter>
    </Card>
  )
}

/**
 * The default form of the card.
 */
export const Default: Story = {};

export const Empty: Story = {
  render: () => (
    <NotificationCard
      className="w-96"
      description="You have no unread messages."
      items={[]}
      title="Notifications"
    />
  ),
};

export const OneItem: Story = {
  render: () => (
    <NotificationCard
      className="w-96"
      description="You have 1 unread message."
      items={[notifications[0]]}
      title="Notifications"
    />
  ),
};
