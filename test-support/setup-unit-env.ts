/** Runs before every unit test file — keep side effects minimal for speed. */
process.env.NODE_ENV = "test";
process.env.SKIP_ENV_VALIDATION = "true";
