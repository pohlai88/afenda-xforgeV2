import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afendaAccessibilityContract } from "../contracts/afenda-accessibility.contract";
import { afendaClassNamePolicyContract } from "../contracts/afenda-class-name-policy.contract";
import { afendaComponentContract } from "../contracts/afenda-component.contract";
import {
  AFENDA_AI_REQUIRED_CONTRACTS,
  afendaDesignSystemContract,
} from "../contracts/afenda-design-system.contract";
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

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const contractsDir = join(packageRoot, "contracts");
const packageJson = JSON.parse(
  readFileSync(join(packageRoot, "package.json"), "utf8")
) as {
  readonly exports?: Record<string, string>;
};

describe("afenda public contract serializability", () => {
  it("keeps exactly the 12 afenda contract files", () => {
    const contractFiles = readdirSync(contractsDir)
      .filter((file) => file.endsWith(".contract.ts"))
      .sort();

    expect(contractFiles).toEqual([...AFENDA_AI_REQUIRED_CONTRACTS].sort());
  });

  it("keeps public contract exports afenda-prefixed only", () => {
    const contractExports = Object.keys(packageJson.exports ?? {}).filter(
      (exportPath) => exportPath.startsWith("./contracts/")
    );

    expect(contractExports).toHaveLength(AFENDA_AI_REQUIRED_CONTRACTS.length);
    expect(
      contractExports.every((exportPath) =>
        exportPath.startsWith("./contracts/afenda-")
      )
    ).toBe(true);
  });

  it("keeps every required contract exported by package.json", () => {
    for (const filename of AFENDA_AI_REQUIRED_CONTRACTS) {
      const exportPath = `./contracts/${filename.replace(".contract.ts", "")}`;
      expect(packageJson.exports, exportPath).toHaveProperty(exportPath);
    }
  });

  it("keeps public contracts JSON-serializable and boundary-safe", () => {
    for (const contract of afendaContracts) {
      expect(() => assertSerializable(contract, contract.id)).not.toThrow();
      expect(JSON.parse(JSON.stringify(contract))).toEqual(contract);
    }
  });

  it("fails non-serializable contract values", () => {
    expect(() =>
      assertSerializable(
        {
          id: "afenda.invalid",
          parse() {
            return undefined;
          },
        },
        "afenda.invalid"
      )
    ).toThrow("afenda.invalid.parse is not JSON-serializable");
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
