import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, join, relative } from "node:path";
import ts from "typescript";

const COMPONENT_EXTENSION_PATTERN = /\.tsx$/;
const LOCAL_VOCABULARY_NAME_PATTERN =
  /^(colors|variants|tones|densities|sizes|[A-Za-z0-9]*(?:Color|Variant|Tone|Density|Size)Values|Color|Variant|Tone|Density|Size)$/;
const API_PROP_NAMES = new Set(["color", "variant", "tone", "density", "size"]);

export function createComponentApiAuditRegistry(root = process.cwd()) {
  const contractsDir = join(root, "packages", "design-system", "contracts");
  const variantContractSource = readIfExists(
    join(contractsDir, "afenda-variant.contract.ts")
  );

  const tones = extractStringArray(variantContractSource, "AFENDA_TONES");
  const densities = extractStringArray(
    variantContractSource,
    "AFENDA_DENSITIES"
  );
  const sizes = extractStringArray(variantContractSource, "AFENDA_SIZES");
  const actionVariants = extractStringArray(
    variantContractSource,
    "AFENDA_ACTION_VARIANTS"
  );
  const structuralVariants = extractStringArray(
    variantContractSource,
    "AFENDA_STRUCTURAL_VARIANTS"
  );
  const componentSizeVariants = extractStringArray(
    variantContractSource,
    "AFENDA_COMPONENT_SIZE_VARIANTS"
  );
  const textColorVariants = extractStringArray(
    variantContractSource,
    "AFENDA_TEXT_COLOR_VARIANTS"
  );

  return {
    colors: new Set(textColorVariants),
    densities: new Set(densities),
    sizes: new Set([...sizes, ...componentSizeVariants]),
    tones: new Set(tones),
    variants: new Set([...actionVariants, ...structuralVariants]),
  };
}

export function auditAfendaUiComponentApi({
  registry,
  root = process.cwd(),
  source,
  path,
}) {
  const findings = [];
  const sourceFile = parseTsxSource(path, source);
  const normalizedPath = normalizePath(relative(root, path));
  const facts = collectComponentApiFacts(sourceFile);

  if (facts.exportedComponentNames.size > 0 && facts.dataSlots.length === 0) {
    findings.push(
      createFinding(
        "missing-data-slot",
        normalizedPath,
        `${basename(path)} exports component wrappers but does not expose data-slot.`
      )
    );
  }

  if (!facts.usesRecipe) {
    findings.push(
      createFinding(
        "component-without-recipe",
        normalizedPath,
        `${basename(path)} must compose styling through recipe(...).`
      )
    );
  }

  for (const declaration of facts.localVocabularyDeclarations) {
    findings.push(
      createFinding(
        "local-vocabulary-declaration",
        normalizedPath,
        `${declaration} must reference contract-owned component API vocabulary.`
      )
    );
  }

  for (const prop of facts.apiPropValues) {
    const allowedValues = allowedValuesForProp(prop.name, registry);
    if (allowedValues.has(prop.value)) {
      continue;
    }

    findings.push(
      createFinding(
        "ungoverned-component-api",
        normalizedPath,
        `${prop.name}="${prop.value}" is not registered for component API vocabulary.`
      )
    );
  }

  return findings;
}

export function auditAfendaUiComponentDirectory({
  componentDir = join(
    process.cwd(),
    "packages",
    "design-system",
    "components",
    "afenda-ui"
  ),
  registry = createComponentApiAuditRegistry(process.cwd()),
  root = process.cwd(),
} = {}) {
  if (!existsSync(componentDir)) {
    return [
      createFinding(
        "missing-component-directory",
        normalizePath(relative(root, componentDir)),
        "Missing packages/design-system/components/afenda-ui directory."
      ),
    ];
  }

  return readdirSync(componentDir)
    .filter((file) => COMPONENT_EXTENSION_PATTERN.test(file))
    .flatMap((file) => {
      const path = join(componentDir, file);
      return auditAfendaUiComponentApi({
        path,
        registry,
        root,
        source: readFileSync(path, "utf8"),
      });
    });
}

export function formatComponentApiAuditFinding(finding) {
  return `[${finding.rule}] ${finding.path}: ${finding.message}`;
}

function collectComponentApiFacts(sourceFile) {
  const facts = {
    apiPropValues: [],
    dataSlots: [],
    exportedComponentNames: new Set(),
    localVocabularyDeclarations: [],
    usesRecipe: false,
  };

  const visit = (node) => {
    if (ts.isExportDeclaration(node)) {
      collectNamedExportFacts(node, facts);
    }

    if (hasExportModifier(node)) {
      collectExportedDeclarationFacts(node, facts);
    }

    if (ts.isCallExpression(node)) {
      if (ts.isIdentifier(node.expression) && node.expression.text === "recipe") {
        facts.usesRecipe = true;
      }
      collectApiPropValuesFromCall(node, facts);
    }

    if (ts.isVariableDeclaration(node)) {
      collectLocalVocabularyFacts(node, facts);
    }

    if (
      ts.isEnumDeclaration(node) &&
      LOCAL_VOCABULARY_NAME_PATTERN.test(node.name.text)
    ) {
      facts.localVocabularyDeclarations.push(`enum ${node.name.text}`);
    }

    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      collectJsxFacts(node, facts, sourceFile);
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return facts;
}

function collectNamedExportFacts(node, facts) {
  if (!node.exportClause || !ts.isNamedExports(node.exportClause)) {
    return;
  }

  for (const element of node.exportClause.elements) {
    const name = element.name.text;
    if (isPascalCase(name)) {
      facts.exportedComponentNames.add(name);
    }
  }
}

function collectExportedDeclarationFacts(node, facts) {
  if (!("name" in node) || !node.name || !ts.isIdentifier(node.name)) {
    return;
  }

  if (isPascalCase(node.name.text)) {
    facts.exportedComponentNames.add(node.name.text);
  }
}

function collectApiPropValuesFromCall(node, facts) {
  if (!ts.isIdentifier(node.expression) || node.arguments.length === 0) {
    return;
  }

  if (!node.expression.text.endsWith("Variants")) {
    return;
  }

  const firstArgument = unwrapExpression(node.arguments[0]);
  if (!firstArgument || !ts.isObjectLiteralExpression(firstArgument)) {
    return;
  }

  collectApiPropValuesFromObject(firstArgument, facts);
}

function collectLocalVocabularyFacts(node, facts) {
  if (!ts.isIdentifier(node.name) || !node.initializer) {
    return;
  }

  const initializer = unwrapExpression(node.initializer);
  if (
    LOCAL_VOCABULARY_NAME_PATTERN.test(node.name.text) &&
    initializer &&
    (ts.isArrayLiteralExpression(initializer) ||
      ts.isObjectLiteralExpression(initializer))
  ) {
    facts.localVocabularyDeclarations.push(`const ${node.name.text}`);
  }
}

function collectJsxFacts(node, facts, sourceFile) {
  for (const property of node.attributes.properties) {
    if (!ts.isJsxAttribute(property)) {
      continue;
    }

    const name = property.name.getText(sourceFile);
    if (name === "data-slot") {
      facts.dataSlots.push(name);
      continue;
    }

    if (!API_PROP_NAMES.has(name)) {
      continue;
    }

    const value = readStaticJsxAttributeValue(property.initializer);
    if (value) {
      facts.apiPropValues.push({ name, value });
    }
  }
}

function collectApiPropValuesFromObject(object, facts) {
  for (const property of object.properties) {
    if (!ts.isPropertyAssignment(property)) {
      continue;
    }

    const name = getPropertyNameText(property.name);
    if (!name || !API_PROP_NAMES.has(name)) {
      continue;
    }

    const value = extractStaticString(property.initializer);
    if (value) {
      facts.apiPropValues.push({ name, value });
    }
  }
}

function allowedValuesForProp(name, registry) {
  if (name === "color") {
    return registry.colors;
  }
  if (name === "tone") {
    return registry.tones;
  }
  if (name === "density") {
    return registry.densities;
  }
  if (name === "size") {
    return registry.sizes;
  }
  return registry.variants;
}

function readStaticJsxAttributeValue(initializer) {
  if (!initializer) {
    return undefined;
  }

  if (ts.isStringLiteral(initializer)) {
    return initializer.text;
  }

  if (!ts.isJsxExpression(initializer) || !initializer.expression) {
    return undefined;
  }

  return extractStaticString(initializer.expression);
}

function parseTsxSource(path, source) {
  return ts.createSourceFile(
    path,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );
}

function extractStringArray(source, name) {
  const body = extractConstBody(source, name, "[", "]");
  return body ? [...body.matchAll(/["']([^"']+)["']/g)].map((match) => match[1]) : [];
}

function extractConstBody(source, name, open, close) {
  const start = source.indexOf(`const ${name}`);
  const exportStart = source.indexOf(`export const ${name}`);
  const declarationStart =
    start === -1 ? exportStart : exportStart === -1 ? start : Math.min(start, exportStart);
  if (declarationStart === -1) {
    return undefined;
  }

  const openIndex = source.indexOf(open, declarationStart);
  if (openIndex === -1) {
    return undefined;
  }

  let depth = 0;
  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index];
    if (char === open) {
      depth += 1;
    }
    if (char === close) {
      depth -= 1;
      if (depth === 0) {
        return source.slice(openIndex + 1, index);
      }
    }
  }

  return undefined;
}

function extractStaticString(expression) {
  const node = unwrapExpression(expression);
  if (!node) {
    return undefined;
  }

  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }

  return undefined;
}

function unwrapExpression(expression) {
  let current = expression;
  while (
    current &&
    (ts.isParenthesizedExpression(current) ||
      ts.isAsExpression(current) ||
      ts.isTypeAssertionExpression(current) ||
      ts.isSatisfiesExpression(current) ||
      ts.isNonNullExpression(current))
  ) {
    current = current.expression;
  }

  return current;
}

function getPropertyNameText(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name)) {
    return name.text;
  }
  return undefined;
}

function hasExportModifier(node) {
  return Boolean(
    ts.canHaveModifiers(node) &&
      ts.getModifiers(node)?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
  );
}

function isPascalCase(name) {
  return /^[A-Z][A-Za-z0-9]*$/.test(name);
}

function createFinding(rule, path, message) {
  return {
    message,
    path,
    rule,
    severity: "error",
  };
}

function readIfExists(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

function normalizePath(path) {
  return path.replace(/\\/g, "/");
}
