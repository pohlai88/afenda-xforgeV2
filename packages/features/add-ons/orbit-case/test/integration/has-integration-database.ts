export const hasIntegrationDatabase = (): boolean =>
  Boolean(process.env.DATABASE_URL ?? process.env.DIRECT_URL);
