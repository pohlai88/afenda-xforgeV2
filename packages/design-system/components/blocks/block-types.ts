const supportedBlockTypes = [
  "pageHeader",
  "statsStrip",
  "filterBar",
  "dataTable",
  "emptyPanel",
  "runtimeState",
  "bulkActionBar",
] as const;

type BlockType = (typeof supportedBlockTypes)[number];

export { supportedBlockTypes };
export type { BlockType };
