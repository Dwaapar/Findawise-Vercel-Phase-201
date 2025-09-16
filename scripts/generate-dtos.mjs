#!/usr/bin/env node
import fs from "fs";
import path from "path";

const repoRoot = path.resolve(process.cwd());
const sharedDir = path.join(repoRoot, "shared");

const targetArg = process.argv[2];
const tableFiles = fs
  .readdirSync(sharedDir)
  .filter((file) => file.endsWith("Tables.ts"))
  .filter((file) => (targetArg ? file === targetArg : true));

const PRIORITY_FIELDS = [
  "id",
  "name",
  "title",
  "slug",
  "status",
  "state",
  "type",
  "category",
  "key",
  "code",
  "identifier",
  "modelId",
  "ruleId",
  "sessionId",
  "neuronId",
  "userId",
  "offerId",
  "destinationId",
  "archetypeId",
  "planId",
  "journeyId",
  "campaignId",
  "vertical",
  "region",
  "country",
  "market",
  "language",
  "locale",
  "segment",
  "audience",
  "channel",
  "priority",
  "severity",
  "level",
  "stage",
  "createdAt",
  "updatedAt",
  "description",
  "summary",
  "email",
  "phone",
  "version",
  "provider",
  "integrationId",
  "teamId",
  "role",
  "goalId",
  "toolId",
  "widgetId",
  "componentId",
  "pipelineId",
  "department",
  "budget",
  "amount",
  "metric",
  "eventType",
  "workflowId",
  "funnelId",
  "offerType",
  "productId",
  "sku",
  "appId",
  "tenantId",
  "groupId",
  "tag",
  "label",
  "quizType",
  "analyticsType",
  "source",
  "providerId",
  "environment",
  "levelName",
  "module",
  "service",
  "queue",
  "stack",
  "bucket",
  "topic",
];

const ALWAYS_INCLUDE = new Set(["id", "createdAt", "updatedAt"]);
const MAX_FIELDS = 8;
const MIN_FIELDS = 3;

const toCamelCase = (value) => value.charAt(0).toLowerCase() + value.slice(1);

const unique = (arr) => Array.from(new Set(arr));

const splitIdentifier = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean);

const singularizeWord = (word) => {
  if (word.endsWith("ies")) {
    return `${word.slice(0, -3)}y`;
  }
  if (word.endsWith("ses")) {
    return word.slice(0, -2);
  }
  if (word.endsWith("s") && !word.endsWith("ss")) {
    return word.slice(0, -1);
  }
  return word;
};

const toPascalCaseFromWords = (words) =>
  words.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");

const createTypeName = (tableConst) => {
  const words = splitIdentifier(tableConst);
  if (!words.length) {
    return toPascalCaseFromWords([tableConst]);
  }
  const lastIndex = words.length - 1;
  words[lastIndex] = singularizeWord(words[lastIndex]);
  return toPascalCaseFromWords(words);
};

const createFilePrefix = (fileName) => {
  const base = fileName.replace(/Tables\.ts$/, "");
  const words = splitIdentifier(base);
  return toPascalCaseFromWords(words);
};

const extractColumns = (content, tableConst) => {
  const marker = `export const ${tableConst} = pgTable`;
  const startIndex = content.indexOf(marker);
  if (startIndex === -1) {
    console.warn(`Could not find columns for ${tableConst}`);
    return [];
  }
  const lines = content.slice(startIndex).split("\n");
  const columns = [];
  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith("});") || trimmed.startsWith("},") || trimmed.startsWith(")")) {
      break;
    }
    const match = line.match(/^\s*(\w+):/);
    if (match) {
      columns.push(match[1]);
    }
  }
  return columns;
};

const buildDtoKeys = (columns) => {
  if (!columns.length) {
    return [];
  }
  const columnSet = new Set(columns);
  const prioritized = [];
  for (const field of PRIORITY_FIELDS) {
    if (columnSet.has(field)) {
      prioritized.push(field);
    }
  }
  const ordered = unique(prioritized);
  if (!ordered.includes("id") && columnSet.has("id")) {
    ordered.unshift("id");
  }
  if (!ordered.length) {
    ordered.push(columns[0]);
  }
  while (ordered.length < MIN_FIELDS && ordered.length < columns.length) {
    const next = columns.find((column) => !ordered.includes(column));
    if (!next) {
      break;
    }
    ordered.push(next);
  }
  let limited = ordered.slice(0, MAX_FIELDS);
  for (const field of ALWAYS_INCLUDE) {
    if (columnSet.has(field) && !limited.includes(field)) {
      limited.push(field);
    }
  }
  limited = unique(limited);
  return limited;
};

const ensureDrizzleImport = (content, needsInsert) => {
  const regex = /import \{([^}]+)\} from "drizzle-orm";/;
  if (regex.test(content)) {
    return content.replace(regex, (_, specifiers) => {
      const parts = specifiers
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);
      const set = new Set(parts);
      set.add("InferSelectModel");
      if (needsInsert) {
        set.add("InferInsertModel");
      }
      const ordered = Array.from(set).sort((a, b) => a.localeCompare(b));
      return `import { ${ordered.join(", ")} } from "drizzle-orm";`;
    });
  }
  const importLine = `import { ${needsInsert ? "InferInsertModel, " : ""}InferSelectModel } from "drizzle-orm";`;
  const lines = content.split("\n");
  let insertIndex = 0;
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].startsWith("import ")) {
      insertIndex = i + 1;
      continue;
    }
    if (lines[i].trim() === "") {
      insertIndex = i + 1;
      continue;
    }
    break;
  }
  lines.splice(insertIndex, 0, importLine);
  return lines.join("\n");
};

const ensureDtoHelperImport = (content) => {
  if (content.includes("pickDTOFields")) {
    return content;
  }
  const lines = content.split("\n");
  let lastImportIndex = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].startsWith("import ")) {
      lastImportIndex = i;
    } else if (lines[i].trim() === "") {
      continue;
    } else {
      break;
    }
  }
  lines.splice(lastImportIndex + 1, 0, 'import { pickDTOFields } from "./dtoHelpers";');
  return lines.join("\n");
};

const processFile = (fileName) => {
  const filePath = path.join(sharedDir, fileName);
  const original = fs.readFileSync(filePath, "utf8");
  let content = original;

  const selectInfo = new Map();

  const selectMatches = content.matchAll(
    /export type (\w+) = (?:InferSelectModel<typeof (\w+)>|typeof (\w+)\.\$inferSelect);/g,
  );
  for (const match of selectMatches) {
    const [, typeName, newStyleTable, legacyTable] = match;
    const tableConst = newStyleTable ?? legacyTable;
    if (tableConst) {
      selectInfo.set(typeName, tableConst);
    }
  }

  content = content.replace(/export type (\w+) = typeof (\w+)\.\$inferSelect;/g, (_, typeName, tableConst) => {
    selectInfo.set(typeName, tableConst);
    return `export type ${typeName} = InferSelectModel<typeof ${tableConst}>;`;
  });

  const insertTables = new Set();

  const insertMatches = content.matchAll(
    /export type (\w+) = (?:InferInsertModel<typeof (\w+)>|typeof (\w+)\.\$inferInsert);/g,
  );
  for (const match of insertMatches) {
    const [, , newStyleTable, legacyTable] = match;
    const tableConst = newStyleTable ?? legacyTable;
    if (tableConst) {
      insertTables.add(tableConst);
    }
  }

  content = content.replace(/export type (\w+) = typeof (\w+)\.\$inferInsert;/g, (_, typeName, tableConst) => {
    insertTables.add(tableConst);
    return `export type ${typeName} = InferInsertModel<typeof ${tableConst}>;`;
  });

  content = content.replace(/export type Insert(\w+) = z\.infer<[^>]+>;/g, (match, typeName) => {
    const tableConst = selectInfo.get(typeName);
    if (!tableConst) {
      console.warn(`Skipping insert replacement for ${typeName} in ${fileName}`);
      return match;
    }
    insertTables.add(tableConst);
    return `export type Insert${typeName} = InferInsertModel<typeof ${tableConst}>;`;
  });

  const tableMatches = [...content.matchAll(/export const (\w+) = pgTable/g)];
  const tableNames = tableMatches.map(([, name]) => name);
  const existingTables = new Set(selectInfo.values());
  const newTypeDefs = [];
  const filePrefix = createFilePrefix(fileName);

  for (const tableConst of tableNames) {
    if (existingTables.has(tableConst)) {
      continue;
    }
    const baseTypeName = createTypeName(tableConst);
    let typeName = filePrefix ? `${filePrefix}${baseTypeName}` : baseTypeName;
    while (selectInfo.has(typeName)) {
      typeName = `${typeName}Model`;
    }
    selectInfo.set(typeName, tableConst);
    insertTables.add(tableConst);
    existingTables.add(tableConst);
    newTypeDefs.push(
      `export type ${typeName} = InferSelectModel<typeof ${tableConst}>;`,
      `export type Insert${typeName} = InferInsertModel<typeof ${tableConst}>;`,
    );
  }

  content = ensureDrizzleImport(content, insertTables.size > 0);
  content = ensureDtoHelperImport(content);

  const dtoBlocks = [];

  for (const [typeName, tableConst] of selectInfo.entries()) {
    const columns = extractColumns(original, tableConst);
    const dtoKeys = buildDtoKeys(columns);
    if (!dtoKeys.length) {
      continue;
    }
    const camel = toCamelCase(typeName);
    const arrayName = `${camel}DTOKeys`;
    const keyList = dtoKeys.map((key) => `"${key}"`).join(", ");
    const interfaceName = `${typeName}DTO`;
    const functionName = `to${typeName}DTO`;
    const block = `const ${arrayName} = [${keyList}] as const;

export interface ${interfaceName}
  extends Pick<${typeName}, (typeof ${arrayName})[number]> {}

export const ${functionName} = (${camel}: ${typeName}): ${interfaceName} =>
  pickDTOFields(${camel}, ${arrayName});`;
    dtoBlocks.push(block);
  }

  const typeExportInsert = newTypeDefs.length ? `${newTypeDefs.join("\n")}\n\n` : "";
  const dtoSection = `${typeExportInsert}// DTOs\n${dtoBlocks.join("\n\n\n")}\n`;

  content = content.replace(/\s*$/, "");
  if (content.includes("// DTOs")) {
    content = content.replace(/\/\/ DTOs[\s\S]*$/, dtoSection);
  } else {
    content = `${content}\n\n${dtoSection}`;
  }

  fs.writeFileSync(filePath, `${content}\n`);
};

for (const file of tableFiles) {
  processFile(file);
}
