type MockFn = typeof import("vitest").vi.fn;

/** Minimal drizzle-shaped stub for insert/delete unit tests (e.g. cron keep-alive). */
export const createInsertDeleteDatabaseMock = (mockFn: MockFn) => {
  const returning = mockFn(async () => [{ id: 1 }]);
  const values = mockFn(() => ({ returning }));
  const insert = mockFn(() => ({ values }));
  const where = mockFn(async () => undefined);
  const deleteMock = mockFn(() => ({ where }));

  return {
    database: {
      delete: deleteMock,
      insert,
    },
    returning,
    values,
    insert,
    where,
    deleteMock,
  };
};

/** Minimal drizzle-shaped stub for update unit tests (e.g. endpoint health). */
export const createUpdateDatabaseMock = (mockFn: MockFn) => {
  const where = mockFn();
  const set = mockFn(() => ({ where }));
  const update = mockFn(() => ({ set }));

  return {
    database: {
      update,
    },
    update,
    set,
    where,
  };
};
