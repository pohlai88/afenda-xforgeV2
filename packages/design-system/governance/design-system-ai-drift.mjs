import { existsSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import ts from "typescript";

const tsStringPattern = /["']([^"']+)["']/g;
const jsxTagPattern = /<([A-Z][A-Za-z0-9]*)\b/g;
const localComponentPattern =
  /\b(?:function|const|class)\s+([A-Z][A-Za-z0-9]*)\b/g;
const namedImportPattern =
  /import\s+\{([^}]+)\}\s+from\s+["']([^"']+)["']/g;
const localVocabularyPattern =
  /\bconst\s+(?:variants|tones|states|densities|[A-Za-z0-9]*(?:Variant|Tone|State|Density)Values)\s*=\s*\[/g;
const recipeCallPattern = /\b(recipe|blockRecipe)\(\s*["']([^"']+)["']/g;
const dataSlotPattern = /data-slot\s*=\s*["']([^"']+)["']/g;
const variantDataPattern = /data-\[(variant|tone)=([^\]]+)\]/g;
const semanticTailwindPattern =
  /\b(?:bg|text|border|ring)-\[(?:#|var\()[^\]]+\]/g;
const rawHexPattern = /#[0-9a-fA-F]{3,8}\b/g;
const quotedLegacySemanticPattern =
  /(?:["'])(positive|danger|destructive|negative)(?:["'])/g;
const classLegacySemanticPattern =
  /\b(?:bg|text|border|ring|status)-(positive|danger|destructive|negative)\b/g;
const propLegacySemanticPattern =
  /\b(?:tone|variant)\s*=\s*["'](positive|danger|destructive|negative)["']/g;
const exampleTagPattern = /\b(?:copyPasteExample|aiExample|example)\b/;
const privateDesignSystemImportPattern =
  /@repo\/design-system\/(?:components\/(?:ui|afenda-ui|blocks)|contracts\/(?!afenda-))/g;

export const DESIGN_SYSTEM_AI_DRIFT_RULES = {
  dynamicRecipeId: "dynamic-recipe-id",
  dynamicSlotId: "dynamic-slot-id",
  dynamicVariantValue: "dynamic-variant-value",
  localVocabularyDeclaration: "local-vocabulary-declaration",
  privateImport: "private-import",
  rawSemanticTailwind: "raw-semantic-tailwind",
  staleExample: "stale-example",
  ungovernedVariant: "ungoverned-variant",
  unknownComponentName: "unknown-component-name",
  unknownRecipe: "unknown-recipe",
  unknownSlot: "unknown-slot",
  unregisteredSemanticAlias: "unregistered-semantic-alias",
};

export function createDesignSystemAiDriftRegistry(root = process.cwd()) {
  const contractsDir = join(root, "packages", "design-system", "contracts");
  const recipePath = join(
    root,
    "packages",
    "design-system",
    "components",
    "afenda-ui",
    "recipes.ts"
  );
  const blockRecipePath = join(
    root,
    "packages",
    "design-system",
    "components",
    "blocks",
    "block-recipes.ts"
  );
  const designSystemContractPath = join(
    contractsDir,
    "afenda-design-system.contract.ts"
  );
  const componentContractPath = join(contractsDir, "afenda-component.contract.ts");
  const slotContractPath = join(contractsDir, "afenda-slot.contract.ts");
  const variantContractPath = join(contractsDir, "afenda-variant.contract.ts");
  const afendaUiIndexPath = join(
    root,
    "packages",
    "design-system",
    "components",
    "afenda-ui",
    "index.ts"
  );
  const blockIndexPath = join(
    root,
    "packages",
    "design-system",
    "components",
    "blocks",
    "index.ts"
  );

  const contractSource = readIfExists(designSystemContractPath);
  const componentContractSource = readIfExists(componentContractPath);
  const slotContractSource = readIfExists(slotContractPath);
  const variantContractSource = readIfExists(variantContractPath);

  const primitiveComponentIds = extractStringArray(
    componentContractSource,
    "AFENDA_PRIMITIVE_COMPONENT_IDS"
  );
  const blockComponentIds = extractStringArray(
    componentContractSource,
    "AFENDA_BLOCK_COMPONENT_IDS"
  );
  const publicComponentExports = [
    ...extractBarrelExportNames(readIfExists(afendaUiIndexPath)),
    ...extractBarrelExportNames(readIfExists(blockIndexPath)),
  ];
  const internalComponentIdentities = extractStringArray(
    componentContractSource,
    "AFENDA_INTERNAL_COMPONENT_IDS"
  );
  const recipeIds = extractObjectKeys(readIfExists(recipePath), "afendaRecipe");
  const blockRecipeIds = extractObjectKeys(
    readIfExists(blockRecipePath),
    "afendaBlockRecipe"
  );
  const tones = extractStringArray(variantContractSource, "AFENDA_TONES");
  const actionVariants = extractStringArray(
    variantContractSource,
    "AFENDA_ACTION_VARIANTS"
  );
  const structuralVariants = extractStringArray(
    variantContractSource,
    "AFENDA_STRUCTURAL_VARIANTS"
  );
  const forbiddenSemanticAliases = extractObjectStringArrays(
    variantContractSource,
    "AFENDA_FORBIDDEN_VARIANT_ALIASES"
  );
  const hardFailRules = extractStringArray(
    contractSource,
    "AFENDA_AI_HARD_FAIL_RULES"
  );
  const slotPatternSources = extractStringArray(
    slotContractSource,
    "AFENDA_SLOT_IDENTITY_PATTERN_REGISTRY"
  );
  const exactSlots = new Set([
    ...primitiveComponentIds,
    "alert-description",
    "alert-title",
    "progress-indicator",
  ]);

  return {
    actionVariants: new Set(actionVariants),
    blockComponentIds: new Set(blockComponentIds),
    blockRecipeIds: new Set(blockRecipeIds),
    componentIds: new Set([
      ...primitiveComponentIds,
      ...blockComponentIds,
      ...publicComponentExports,
      ...internalComponentIdentities,
    ]),
    contractVersion: extractConstString(
      contractSource,
      "AFENDA_DESIGN_SYSTEM_CONTRACT_VERSION"
    ),
    exactSlots,
    forbiddenSemanticAliases,
    hardFailRules: new Set(hardFailRules),
    recipeIds: new Set(recipeIds),
    slotPatterns: slotPatternSources.map((pattern) => new RegExp(pattern)),
    variants: new Set([...actionVariants, ...structuralVariants]),
    tones: new Set(tones),
  };
}

export function scanDesignSystemAiDriftSource({
  requirePublicDesignSystemImports = false,
  ...options
}) {
  return scanDesignSystemAiDriftFindings({
    requirePublicDesignSystemImports,
    ...options,
  }).map(formatFinding);
}

export function scanDesignSystemAiDriftFindings({
  path,
  registry,
  root = process.cwd(),
  source,
  requirePublicDesignSystemImports = false,
  requireExampleVersion = false,
}) {
  const findingCollector = createFindingCollector();
  const normalizedPath = normalizePath(relative(root, path));
  const astFacts = collectDesignSystemAstFacts(
    parseDesignSystemSource({ path, source })
  );
  const localComponents =
    astFacts?.localComponents ??
    new Set([...source.matchAll(localComponentPattern)].map((match) => match[1]));
  const externalComponents =
    astFacts?.externalComponents ?? extractExternalImportNames(source);
  const isStory = normalizedPath.endsWith(".stories.tsx");
  const requiresStaticExampleValues =
    isStory && (requireExampleVersion || exampleTagPattern.test(source));

  const jsxComponents =
    astFacts?.jsxComponents ??
    [...source.matchAll(jsxTagPattern)].map((match) => ({ name: match[1] }));

  for (const { name } of jsxComponents) {
    if (
      shouldCheckComponentName(name, localComponents, externalComponents) &&
      !registry.componentIds.has(name)
    ) {
      findingCollector.push(
        createHardFailFinding(
          DESIGN_SYSTEM_AI_DRIFT_RULES.unknownComponentName,
          normalizedPath,
          `Unknown component <${name} /> is not in the component identity registry.`
        )
      );
    }
  }

  const recipeCalls =
    astFacts?.recipeCalls ??
    [...source.matchAll(recipeCallPattern)].map((match) => ({
      helper: match[1],
      name: match[2],
    }));

  for (const { helper, name } of recipeCalls) {
    const registrySet =
      helper === "blockRecipe" ? registry.blockRecipeIds : registry.recipeIds;
    if (!registrySet.has(name)) {
      findingCollector.push(
        createHardFailFinding(
          DESIGN_SYSTEM_AI_DRIFT_RULES.unknownRecipe,
          normalizedPath,
          `${helper}("${name}") is not in the recipe identity registry.`
        )
      );
    }
  }

  for (const { helper, text } of astFacts?.dynamicRecipeCalls ?? []) {
    findingCollector.push(
      createHardFailFinding(
        DESIGN_SYSTEM_AI_DRIFT_RULES.dynamicRecipeId,
        normalizedPath,
        `${helper}(${text}) must use literal recipe ids from the recipe identity registry.`
      )
    );
  }

  const dataSlots =
    astFacts?.dataSlots ??
    [...source.matchAll(dataSlotPattern)].map((match) => ({ slot: match[1] }));

  for (const { slot } of dataSlots) {
    if (!isKnownSlot(slot, registry)) {
      findingCollector.push(
        createHardFailFinding(
          DESIGN_SYSTEM_AI_DRIFT_RULES.unknownSlot,
          normalizedPath,
          `data-slot="${slot}" is not registered by the slot identity contract.`
        )
      );
    }
  }

  for (const slot of astFacts?.templateDataSlots ?? []) {
    if (!doesTemplateSampleMatchSlotRegistry(slot.sample, registry)) {
      findingCollector.push(
        createHardFailFinding(
          DESIGN_SYSTEM_AI_DRIFT_RULES.dynamicSlotId,
          normalizedPath,
          `${slot.text} must match a slot pattern from the slot identity contract.`
        )
      );
    }
  }

  for (const slot of astFacts?.propertyDataSlots ?? []) {
    const values = astFacts.propertyStringValues.get(slot.property) ?? [];
    if (values.length === 0 || values.some((value) => !isKnownSlot(value, registry))) {
      findingCollector.push(
        createHardFailFinding(
          DESIGN_SYSTEM_AI_DRIFT_RULES.dynamicSlotId,
          normalizedPath,
          `${slot.text} must resolve to data-slot values owned by the slot identity contract.`
        )
      );
    }
  }

  for (const slot of astFacts?.dynamicDataSlots ?? []) {
    findingCollector.push(
      createHardFailFinding(
        DESIGN_SYSTEM_AI_DRIFT_RULES.dynamicSlotId,
        normalizedPath,
        `${slot.text} must use a literal or registered-template data-slot value.`
      )
    );
  }

  if (astFacts?.localVocabularyDeclarations.length) {
    for (const declaration of astFacts.localVocabularyDeclarations) {
      findingCollector.push(
        createHardFailFinding(
          DESIGN_SYSTEM_AI_DRIFT_RULES.localVocabularyDeclaration,
          normalizedPath,
          `${declaration} must import or reference contract vocabularies.`
        )
      );
    }
  } else if (!astFacts && localVocabularyPattern.test(source)) {
    findingCollector.push(
      createHardFailFinding(
        DESIGN_SYSTEM_AI_DRIFT_RULES.localVocabularyDeclaration,
        normalizedPath,
        "Local vocabulary arrays must import or reference contract vocabularies."
      )
    );
  }

  if (requirePublicDesignSystemImports) {
    const privateImports =
      astFacts?.imports
        .map((entry) => entry.specifier)
        .filter((specifier) => isPrivateDesignSystemImport(specifier)) ??
      [...source.matchAll(privateDesignSystemImportPattern)].map((match) => match[0]);

    for (const specifier of privateImports) {
      findingCollector.push(
        createHardFailFinding(
          DESIGN_SYSTEM_AI_DRIFT_RULES.privateImport,
          normalizedPath,
          `${specifier} bypasses the public design-system surface.`
        )
      );
    }
  }

  for (const prop of astFacts?.variantProps ?? []) {
    const known = prop.axis === "tone" ? registry.tones : registry.variants;
    if (prop.value) {
      if (known.has(prop.value)) {
        continue;
      }

      if (isForbiddenSemanticAlias(prop.value, registry)) {
        findingCollector.push(
          createHardFailFinding(
            DESIGN_SYSTEM_AI_DRIFT_RULES.unregisteredSemanticAlias,
            normalizedPath,
            `${prop.name}="${prop.value}" uses a forbidden semantic alias.`
          )
        );
      } else if (prop.name.startsWith("data-")) {
        findingCollector.push(
          createHardFailFinding(
            DESIGN_SYSTEM_AI_DRIFT_RULES.ungovernedVariant,
            normalizedPath,
            `${prop.name}="${prop.value}" is not registered in the variant identity contract.`
          )
        );
      }
    } else if (requiresStaticExampleValues) {
      findingCollector.push(
        createHardFailFinding(
          DESIGN_SYSTEM_AI_DRIFT_RULES.dynamicVariantValue,
          normalizedPath,
          `${prop.name}={${prop.text}} must use a literal contract variant value in AI/example surfaces.`
        )
      );
    }
  }

  for (const match of source.matchAll(quotedLegacySemanticPattern)) {
    findingCollector.push(
      createHardFailFinding(
        DESIGN_SYSTEM_AI_DRIFT_RULES.unregisteredSemanticAlias,
        normalizedPath,
        `"${match[1]}" is a forbidden semantic alias.`
      )
    );
  }

  for (const match of source.matchAll(classLegacySemanticPattern)) {
    findingCollector.push(
      createHardFailFinding(
        DESIGN_SYSTEM_AI_DRIFT_RULES.unregisteredSemanticAlias,
        normalizedPath,
        `${match[0]} uses a forbidden semantic alias.`
      )
    );
  }

  for (const match of source.matchAll(propLegacySemanticPattern)) {
    findingCollector.push(
      createHardFailFinding(
        DESIGN_SYSTEM_AI_DRIFT_RULES.unregisteredSemanticAlias,
        normalizedPath,
        `${match[0]} uses a forbidden semantic alias.`
      )
    );
  }

  for (const segment of astFacts?.classNameSegments ?? []) {
    for (const aliasMatch of segment.matchAll(classLegacySemanticPattern)) {
      findingCollector.push(
        createHardFailFinding(
          DESIGN_SYSTEM_AI_DRIFT_RULES.unregisteredSemanticAlias,
          normalizedPath,
          `${aliasMatch[0]} uses a forbidden semantic alias.`
        )
      );
    }
  }

  for (const match of source.matchAll(variantDataPattern)) {
    const [, axis, value] = match;
    const known = axis === "tone" ? registry.tones : registry.variants;
    if (!known.has(value)) {
      findingCollector.push(
        createHardFailFinding(
          DESIGN_SYSTEM_AI_DRIFT_RULES.ungovernedVariant,
          normalizedPath,
          `data-[${axis}=${value}] is not registered in the variant identity contract.`
        )
      );
    }
  }

  for (const match of source.matchAll(semanticTailwindPattern)) {
    findingCollector.push(
      createHardFailFinding(
        DESIGN_SYSTEM_AI_DRIFT_RULES.rawSemanticTailwind,
        normalizedPath,
        `${match[0]} bypasses token and recipe ownership.`
      )
    );
  }

  for (const match of source.matchAll(rawHexPattern)) {
    findingCollector.push(
      createHardFailFinding(
        DESIGN_SYSTEM_AI_DRIFT_RULES.rawSemanticTailwind,
        normalizedPath,
        `${match[0]} is a raw hex value outside token ownership.`
      )
    );
  }

  if (
    isStory &&
    (requireExampleVersion || exampleTagPattern.test(source)) &&
    !source.includes(`afendaContractVersion: "${registry.contractVersion}"`)
  ) {
    findingCollector.push(
      createHardFailFinding(
        DESIGN_SYSTEM_AI_DRIFT_RULES.staleExample,
        normalizedPath,
        `Storybook example must declare afendaContractVersion: "${registry.contractVersion}".`
      )
    );
  }

  return findingCollector.findings;
}

function parseDesignSystemSource({ path, source }) {
  if (!/\.(ts|tsx)$/.test(path)) {
    return undefined;
  }

  const scriptKind = path.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  return ts.createSourceFile(
    path,
    source,
    ts.ScriptTarget.Latest,
    true,
    scriptKind
  );
}

function collectDesignSystemAstFacts(sourceFile) {
  if (!sourceFile) {
    return undefined;
  }

  const facts = {
    classNameSegments: [],
    dataSlots: [],
    dynamicDataSlots: [],
    dynamicRecipeCalls: [],
    externalComponents: new Set(),
    imports: [],
    jsxComponents: [],
    localComponents: new Set(),
    localVocabularyDeclarations: [],
    propertyDataSlots: [],
    propertyStringValues: new Map(),
    recipeCalls: [],
    templateDataSlots: [],
    variantProps: [],
  };

  const visit = (node) => {
    if (ts.isImportDeclaration(node)) {
      collectImportFacts(node, facts);
    }

    if (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) {
      const name = node.name?.text;
      if (name && isPascalCase(name)) {
        facts.localComponents.add(name);
      }
    }

    if (ts.isVariableDeclaration(node)) {
      collectVariableFacts(node, facts);
    }

    if (ts.isEnumDeclaration(node) && isLocalVocabularyName(node.name.text)) {
      facts.localVocabularyDeclarations.push(`enum ${node.name.text}`);
    }

    if (ts.isCallExpression(node)) {
      collectRecipeCallFacts(node, facts, sourceFile);
    }

    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      collectJsxFacts(node, facts, sourceFile);
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return facts;
}

function collectImportFacts(node, facts) {
  const specifier = extractStaticString(node.moduleSpecifier);
  if (!specifier) {
    return;
  }

  const names = [];
  const importClause = node.importClause;
  if (importClause?.name) {
    names.push(importClause.name.text);
  }

  if (importClause?.namedBindings) {
    if (ts.isNamespaceImport(importClause.namedBindings)) {
      names.push(importClause.namedBindings.name.text);
    }

    if (ts.isNamedImports(importClause.namedBindings)) {
      for (const element of importClause.namedBindings.elements) {
        names.push(element.name.text);
      }
    }
  }

  facts.imports.push({ names, specifier });

  if (specifier.startsWith(".") || specifier.startsWith("@repo/design-system")) {
    return;
  }

  for (const name of names) {
    if (isPascalCase(name)) {
      facts.externalComponents.add(name);
    }
  }
}

function collectVariableFacts(node, facts) {
  if (ts.isIdentifier(node.name) && isPascalCase(node.name.text)) {
    const initializer = unwrapExpression(node.initializer);
    if (
      initializer &&
      (ts.isArrowFunction(initializer) ||
        ts.isFunctionExpression(initializer) ||
        ts.isCallExpression(initializer))
    ) {
      facts.localComponents.add(node.name.text);
    }
  }

  if (!ts.isIdentifier(node.name) || !node.initializer) {
    return;
  }

  const initializer = unwrapExpression(node.initializer);
  const name = node.name.text;

  if (
    isLocalVocabularyName(name) &&
    initializer &&
    (ts.isArrayLiteralExpression(initializer) ||
      ts.isObjectLiteralExpression(initializer))
  ) {
    facts.localVocabularyDeclarations.push(`const ${name}`);
  }

  collectPropertyStringValues(initializer, facts);
}

function collectPropertyStringValues(expression, facts) {
  const initializer = unwrapExpression(expression);
  if (!initializer || !ts.isArrayLiteralExpression(initializer)) {
    return;
  }

  for (const element of initializer.elements) {
    const object = unwrapExpression(element);
    if (!object || !ts.isObjectLiteralExpression(object)) {
      continue;
    }

    for (const property of object.properties) {
      if (!ts.isPropertyAssignment(property)) {
        continue;
      }

      const name = getPropertyNameText(property.name);
      const value = extractStaticString(property.initializer);
      if (!(name && value)) {
        continue;
      }

      if (!facts.propertyStringValues.has(name)) {
        facts.propertyStringValues.set(name, []);
      }
      facts.propertyStringValues.get(name).push(value);
    }
  }
}

function collectRecipeCallFacts(node, facts, sourceFile) {
  if (!ts.isIdentifier(node.expression)) {
    return;
  }

  const helper = node.expression.text;
  if (!(helper === "recipe" || helper === "blockRecipe")) {
    return;
  }

  for (const argument of node.arguments) {
    const name = extractStaticString(argument);
    if (name) {
      facts.recipeCalls.push({ helper, name });
    } else {
      facts.dynamicRecipeCalls.push({
        helper,
        text: argument.getText(sourceFile),
      });
    }
  }
}

function collectJsxFacts(node, facts, sourceFile) {
  const name = getJsxTagName(node.tagName);
  if (name && isPascalCase(name)) {
    facts.jsxComponents.push({ name });
  }

  for (const property of node.attributes.properties) {
    if (!ts.isJsxAttribute(property)) {
      continue;
    }

    const attributeName = property.name.getText(sourceFile);
    if (attributeName === "data-slot") {
      collectDataSlotFact(property, facts, sourceFile);
      continue;
    }

    if (attributeName === "className") {
      facts.classNameSegments.push(
        ...extractStaticClassNameSegments(property.initializer)
      );
      continue;
    }

    const axis = getVariantAxis(attributeName);
    if (axis) {
      const value = readJsxAttributeValue(property.initializer, sourceFile);
      facts.variantProps.push({
        axis,
        name: attributeName,
        text: value.text,
        value: value.kind === "static" ? value.value : undefined,
      });
    }
  }
}

function collectDataSlotFact(property, facts, sourceFile) {
  const value = readJsxAttributeValue(property.initializer, sourceFile);
  if (value.kind === "static") {
    facts.dataSlots.push({ slot: value.value });
    return;
  }

  if (value.kind === "template") {
    facts.templateDataSlots.push(value);
    return;
  }

  if (value.kind === "property") {
    facts.propertyDataSlots.push(value);
    return;
  }

  facts.dynamicDataSlots.push(value);
}

function readJsxAttributeValue(initializer, sourceFile) {
  if (!initializer) {
    return { kind: "dynamic", text: "true" };
  }

  if (ts.isStringLiteral(initializer)) {
    return { kind: "static", text: initializer.text, value: initializer.text };
  }

  if (!ts.isJsxExpression(initializer) || !initializer.expression) {
    return { kind: "dynamic", text: initializer.getText(sourceFile) };
  }

  const expression = unwrapExpression(initializer.expression);
  const staticValue = extractStaticString(expression);
  if (staticValue) {
    return { kind: "static", text: expression.getText(sourceFile), value: staticValue };
  }

  const template = extractTemplateSample(expression, sourceFile);
  if (template) {
    return template;
  }

  if (ts.isPropertyAccessExpression(expression)) {
    return {
      kind: "property",
      property: expression.name.text,
      text: expression.getText(sourceFile),
    };
  }

  return { kind: "dynamic", text: expression.getText(sourceFile) };
}

function extractStaticClassNameSegments(initializer) {
  if (!initializer) {
    return [];
  }

  if (ts.isStringLiteral(initializer)) {
    return [initializer.text];
  }

  if (ts.isJsxExpression(initializer) && initializer.expression) {
    return extractStaticStringSegments(initializer.expression);
  }

  return [];
}

function extractStaticStringSegments(expression) {
  const node = unwrapExpression(expression);
  if (!node) {
    return [];
  }

  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return [node.text];
  }

  if (ts.isTemplateExpression(node)) {
    return [
      node.head.text,
      ...node.templateSpans.map((span) => span.literal.text),
    ].filter(Boolean);
  }

  if (ts.isCallExpression(node)) {
    return node.arguments.flatMap((argument) => extractStaticStringSegments(argument));
  }

  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.flatMap((element) => extractStaticStringSegments(element));
  }

  if (ts.isObjectLiteralExpression(node)) {
    return node.properties.flatMap((property) => {
      if (ts.isPropertyAssignment(property)) {
        return extractStaticStringSegments(property.initializer);
      }
      if (ts.isShorthandPropertyAssignment(property)) {
        return [];
      }
      const name = getPropertyNameText(property.name);
      return name ? [name] : [];
    });
  }

  if (ts.isConditionalExpression(node)) {
    return [
      ...extractStaticStringSegments(node.whenTrue),
      ...extractStaticStringSegments(node.whenFalse),
    ];
  }

  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    return [
      ...extractStaticStringSegments(node.left),
      ...extractStaticStringSegments(node.right),
    ];
  }

  return [];
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

function extractTemplateSample(expression, sourceFile) {
  const node = unwrapExpression(expression);
  if (!node || !ts.isTemplateExpression(node)) {
    return undefined;
  }

  const sample = [
    node.head.text,
    ...node.templateSpans.flatMap((span) => ["x", span.literal.text]),
  ].join("");

  return {
    kind: "template",
    sample,
    text: node.getText(sourceFile),
  };
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

function getJsxTagName(tagName) {
  return ts.isIdentifier(tagName) ? tagName.text : undefined;
}

function getVariantAxis(attributeName) {
  if (attributeName === "tone" || attributeName === "data-tone") {
    return "tone";
  }

  if (attributeName === "variant" || attributeName === "data-variant") {
    return "variant";
  }

  return undefined;
}

function getPropertyNameText(name) {
  if (!name) {
    return undefined;
  }

  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }

  return undefined;
}

function isPascalCase(name) {
  return /^[A-Z][A-Za-z0-9]*$/.test(name);
}

function isLocalVocabularyName(name) {
  return /^(variants|tones|states|densities)$/.test(name) ||
    /^[A-Za-z0-9]*(?:Variant|Tone|State|Density)Values$/.test(name) ||
    /^(Variant|Tone|State|Density)$/.test(name);
}

function isForbiddenSemanticAlias(value, registry) {
  return Object.values(registry.forbiddenSemanticAliases ?? {}).some((aliases) =>
    aliases.includes(value)
  );
}

function doesTemplateSampleMatchSlotRegistry(sample, registry) {
  return isKnownSlot(sample, registry);
}

function isPrivateDesignSystemImport(specifier) {
  privateDesignSystemImportPattern.lastIndex = 0;
  return privateDesignSystemImportPattern.test(specifier);
}

export function extractStringArray(source, name) {
  const body = extractConstBody(source, name, "[", "]");
  return body ? [...body.matchAll(tsStringPattern)].map((match) => match[1]) : [];
}

export function extractObjectKeys(source, name) {
  const body = extractConstBody(source, name, "{", "}");
  if (!body) {
    return [];
  }

  return [...body.matchAll(/^\s*([A-Za-z][A-Za-z0-9_]*)\s*:/gm)].map(
    (match) => match[1]
  );
}

export function extractObjectStringArrays(source, name) {
  const body = extractConstBody(source, name, "{", "}");
  const result = {};
  if (!body) {
    return result;
  }

  for (const match of body.matchAll(/^\s*([A-Za-z][A-Za-z0-9_]*)\s*:\s*\[([^\]]*)\]/gm)) {
    result[match[1]] = [...match[2].matchAll(tsStringPattern)].map(
      (valueMatch) => valueMatch[1]
    );
  }
  return result;
}

export function extractBarrelExportNames(source) {
  return [...source.matchAll(/export\s+(?:type\s+)?\{([^}]+)\}/g)]
    .flatMap((match) => match[1].split(","))
    .map((entry) => entry.trim())
    .filter((entry) => entry && !entry.startsWith("type "))
    .map((entry) => entry.split(/\s+as\s+/)[0].trim())
    .filter((entry) => /^[A-Z]/.test(entry));
}

function shouldCheckComponentName(name, localComponents, externalComponents) {
  if (
    localComponents.has(name) ||
    externalComponents.has(name) ||
    name.endsWith("Icon")
  ) {
    return false;
  }

  return /(Action|Bar|Block|Card|Chart|Dialog|Header|Footer|Metric|Panel|Shell|Sidebar|Table|Timeline|Toolbar|Topbar)$/.test(
    name
  );
}

function extractExternalImportNames(source) {
  const names = new Set();

  for (const match of source.matchAll(namedImportPattern)) {
    const [, namedImports, specifier] = match;
    if (
      specifier.startsWith(".") ||
      specifier.startsWith("@repo/design-system")
    ) {
      continue;
    }

    for (const entry of namedImports.split(",")) {
      const name = entry.trim().split(/\s+as\s+/).pop()?.trim();
      if (name && /^[A-Z]/.test(name)) {
        names.add(name);
      }
    }
  }

  return names;
}

function isKnownSlot(slot, registry) {
  return (
    registry.exactSlots.has(slot) ||
    registry.slotPatterns.some((pattern) => pattern.test(slot))
  );
}

function extractConstString(source, name) {
  return source.match(
    new RegExp(`export\\s+const\\s+${escapeRegExp(name)}\\s*=\\s*["']([^"']+)["']`)
  )?.[1];
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

function createHardFailFinding(rule, path, message) {
  return {
    message,
    path,
    rule,
    severity: "error",
  };
}

function createFindingCollector() {
  const findings = [];
  const keys = new Set();

  return {
    findings,
    push(finding) {
      const key = `${finding.rule}:${finding.path}:${finding.message}`;
      if (keys.has(key)) {
        return;
      }

      keys.add(key);
      findings.push(finding);
    },
  };
}

function formatFinding(finding) {
  return `[${finding.rule}] ${finding.path}: ${finding.message}`;
}

function readIfExists(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

function normalizePath(path) {
  return path.replace(/\\/g, "/");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
