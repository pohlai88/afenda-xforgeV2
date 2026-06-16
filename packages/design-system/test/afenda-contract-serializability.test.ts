import { describe, expect, it } from "vitest";
import { afendaAccessibilityContract } from "../contracts/afenda-accessibility.contract";
import { afendaClassNamePolicyContract } from "../contracts/afenda-class-name-policy.contract";
import { afendaComponentContract } from "../contracts/afenda-component.contract";
import { afendaDesignSystemContract } from "../contracts/afenda-design-system.contract";
import { afendaExampleContract } from "../contracts/afenda-example.contract";
import { afendaExportContract } from "../contracts/afenda-export.contract";
import { afendaMotionContract } from "../contracts/afenda-motion.contract";
import { afendaRecipeContract } from "../contracts/afenda-recipe.contract";
import { afendaSlotContract } from "../contracts/afenda-slot.contract";
import { afendaStateContract } from "../contracts/afenda-state.contract";
import { afendaTokenContract } from "../contracts/afenda-token.contract";
import { afendaVariantContract } from "../contracts/afenda-variant.contract";

const afendaContracts = [
  afendaAccessibilityContract,
  afendaClassNamePolicyContract,
  afendaComponentContract,
  afendaDesignSystemContract,
  afendaExampleContract,
  afendaExportContract,
  afendaMotionContract,
  afendaRecipeContract,
  afendaSlotContract,
  afendaStateContract,
  afendaTokenContract,
  afendaVariantContract,
] as const;

describe("afenda public contract serializability", () => {
  it("keeps public contracts JSON-serializable and boundary-safe", () => {
    for (const contract of afendaContracts) {
      expect(() => assertSerializable(contract, contract.id)).not.toThrow();
      expect(JSON.parse(JSON.stringify(contract))).toEqual(contract);
    }
  });
});

function assertSerializable(value: unknown, path: string): void {
  const valueType = typeof value;

  if (
    value === undefined ||
    valueType === "function" ||
    valueType === "symbol" ||
    valueType === "bigint"
  ) {
    throw new TypeError(`${path} is not JSON-serializable`);
  }

  if (value === null || valueType !== "object") {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      assertSerializable(item, `${path}[${index}]`);
    });
    return;
  }

  for (const [key, item] of Object.entries(value)) {
    assertSerializable(item, `${path}.${key}`);
  }
}
