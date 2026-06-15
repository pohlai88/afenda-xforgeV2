export const keys = () => {
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret === "") {
    throw new Error("CRON_SECRET must not be empty when set");
  }

  return {
    CRON_SECRET: cronSecret,
  };
};
