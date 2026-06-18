import { listMorphSlicesWithSystemDefaults } from "../../contract/morph-destination-manifest";
import { registerPushDestination } from "./push-destination-registry";
import { registerPushTemplate } from "./template-registry";

let registered = false;

export const ensureSystemPushDefaults = (): void => {
  if (registered) {
    return;
  }

  for (const slice of listMorphSlicesWithSystemDefaults()) {
    const templateId = `${slice.destinationId}-template`;

    registerPushDestination({
      id: slice.destinationId,
      label: slice.label,
      templateId,
      requiredCapabilities: [slice.capability],
      visibleToRoles: [...slice.visibleToRoles],
    });

    registerPushTemplate({
      id: templateId,
      destinationId: slice.destinationId,
      label: slice.label,
      fields: [...slice.templateFields],
    });
  }

  registered = true;
};
