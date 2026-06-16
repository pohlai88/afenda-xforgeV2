import { registerPushDestination } from "./push-destination-registry";
import { registerPushTemplate } from "./template-registry";

let registered = false;

export const ensureSystemPushDefaults = (): void => {
  if (registered) {
    return;
  }

  registerPushDestination({
    id: "budget-request",
    label: "Budget Request",
    templateId: "budget-request-template",
    requiredCapabilities: ["budget"],
    visibleToRoles: ["owner", "editor"],
  });

  registerPushTemplate({
    id: "budget-request-template",
    destinationId: "budget-request",
    label: "Budget Request",
    fields: [
      {
        key: "title",
        label: "Title",
        type: "text",
        required: true,
      },
      {
        key: "amount",
        label: "Amount",
        type: "text",
        required: false,
      },
    ],
  });

  registered = true;
};
