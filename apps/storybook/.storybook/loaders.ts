/**
 * Afenda Storybook loader policy:
 * - Prefer args and local fixtures for story data.
 * - Use loaders only when a story must demonstrate async loading behavior.
 * - Keep loaders deterministic; do not fetch live APIs from stories.
 * - Keep global loaders out of preview.tsx unless every story needs the data.
 */
export type AfendaLoadedData = Record<string, unknown>;

type StoryLoader<TLoaded extends AfendaLoadedData> = () =>
  | Promise<TLoaded>
  | TLoaded;

export function afendaStaticLoader<TLoaded extends AfendaLoadedData>(
  loaded: TLoaded
): StoryLoader<TLoaded> {
  return async () => loaded;
}

export function afendaAsyncFixtureLoader<TLoaded extends AfendaLoadedData>(
  loaded: TLoaded,
  options: { delayMs?: number } = {}
): StoryLoader<TLoaded> {
  return async () => {
    const delayMs = options.delayMs ?? 0;

    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    return loaded;
  };
}
