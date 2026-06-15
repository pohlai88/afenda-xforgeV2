import { validateAllContent } from "../validation/validate-content";

const main = async (): Promise<void> => {
  const result = await validateAllContent();

  if (result.ok) {
    console.log(`Validated ${result.fileCount} MDX file(s).`);
    process.exit(0);
  }

  console.error(
    `CMS validation failed (${result.errors.length} error(s)):\n`
  );

  for (const error of result.errors) {
    console.error(`- ${error.file}\n  ${error.message}`);
  }

  process.exit(1);
};

main().catch((error: unknown) => {
  console.error(
    error instanceof Error ? error.message : "Unknown validation failure"
  );
  process.exit(1);
});
