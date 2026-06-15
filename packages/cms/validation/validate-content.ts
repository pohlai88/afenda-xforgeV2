import path from "node:path";
import { ZodError } from "zod";
import { collections } from "../collections";
import { contentRoot } from "../loader/paths";
import {
  listLocaleDirectories,
  listMdxFilesInDirectory,
  readMdxFileFromPath,
} from "../loader/local-source";
import { DEFAULT_LOCALE, normalizeLocale } from "../locale";

export type ValidationError = {
  file: string;
  message: string;
};

export type ValidationResult =
  | { ok: true; fileCount: number }
  | { ok: false; errors: ValidationError[]; fileCount: number };

const formatZodError = (error: ZodError): string =>
  error.issues
    .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
    .join("; ");

const localeFromFilePath = (collection: string, file: string): string => {
  const relative = path.relative(path.join(contentRoot, collection), file);
  const [locale] = relative.split(path.sep);
  return normalizeLocale(locale ?? DEFAULT_LOCALE);
};

export const validateAllContent = async (): Promise<ValidationResult> => {
  const errors: ValidationError[] = [];
  let fileCount = 0;

  for (const config of Object.values(collections)) {
    const locales = await listLocaleDirectories(config.name);

    for (const locale of locales) {
      const directory = path.join(contentRoot, config.name, locale);
      const files = await listMdxFilesInDirectory(directory);

      for (const file of files) {
        fileCount += 1;
        const parsed = await readMdxFileFromPath(file);
        const fileLocale = localeFromFilePath(config.name, file);

        if (fileLocale !== locale) {
          errors.push({
            file,
            message: `Locale directory "${locale}" does not match file path`,
          });
          continue;
        }

        try {
          const frontmatter = config.schema.parse(parsed.data);

          if (
            "locale" in frontmatter &&
            typeof frontmatter.locale === "string" &&
            frontmatter.locale !== locale
          ) {
            errors.push({
              file,
              message: `Frontmatter locale "${frontmatter.locale}" does not match path locale "${locale}"`,
            });
            continue;
          }
        } catch (error) {
          const message =
            error instanceof ZodError
              ? formatZodError(error)
              : error instanceof Error
                ? error.message
                : "Unknown validation error";

          errors.push({ file, message });
        }
      }
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors, fileCount };
  }

  return { ok: true, fileCount };
};
