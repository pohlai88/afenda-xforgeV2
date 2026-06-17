import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { AFENDA_AI_REQUIRED_CONTRACTS } from "../contracts/afenda-design-system.contract";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const contractsDir = join(packageRoot, "contracts");
const contractFilenamePattern = /^(.+)\.contract\.ts$/;
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

  it("keeps contract modules isolated from implementation imports", () => {
    for (const filename of AFENDA_AI_REQUIRED_CONTRACTS) {
      const source = readFileSync(join(contractsDir, filename), "utf8");

      expect(source, filename).not.toMatch(/^import\s/m);
      expect(source, filename).not.toMatch(
        /^\s*export\s+.*\sfrom\s+["'][^"']*\.\./m
      );
      expect(source, filename).not.toMatch(
        /^\s*(?:import|export)\s+.*\sfrom\s+["'][^"']*(components|governance|lib|styles|tokens)\//m
      );
    }
  });

  it("keeps public contracts JSON-serializable and boundary-safe", async () => {
    for (const contractModule of await loadAfendaContractModules()) {
      const contracts = Object.entries(contractModule)
        .filter(
          ([name]) => name.startsWith("afenda") && name.endsWith("Contract")
        )
        .map(([, value]) => value);

      for (const contract of contracts) {
        if (!isContractObject(contract)) {
          throw new TypeError("afenda contract export must include string id");
        }

        expect(() => assertSerializable(contract, contract.id)).not.toThrow();
        expect(JSON.parse(JSON.stringify(contract))).toEqual(contract);
      }
    }
  });

  it("keeps every runtime contract export JSON-serializable", async () => {
    for (const contractModule of await loadAfendaContractModules()) {
      for (const [name, value] of Object.entries(contractModule)) {
        if (!isRuntimeContractExport(name)) {
          continue;
        }

        expect(() => assertSerializable(value, name)).not.toThrow();
        expect(JSON.parse(JSON.stringify(value))).toEqual(value);
      }
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

function loadAfendaContractModules() {
  return Promise.all(
    AFENDA_AI_REQUIRED_CONTRACTS.map((filename) => {
      const moduleName = filename.match(contractFilenamePattern)?.[1];
      if (!moduleName) {
        throw new TypeError(`Invalid afenda contract filename: ${filename}`);
      }

      return import(`../contracts/${moduleName}.contract.ts`) as Promise<
        Record<string, unknown>
      >;
    })
  );
}

function isRuntimeContractExport(name: string): boolean {
  return (
    name.startsWith("AFENDA_") ||
    (name.startsWith("afenda") && name.endsWith("Contract"))
  );
}

function isContractObject(value: unknown): value is { readonly id: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string"
  );
}

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
