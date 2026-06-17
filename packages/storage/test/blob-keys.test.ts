import { afterEach, describe, expect, it, vi } from "vitest";
import {
  resolvePrivateBlobToken,
  resolvePublicBlobToken,
} from "../keys";
import { resolveHandleUploadToken } from "../handle-upload";

describe("blob token resolution", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("resolves public token only from XFORGE_PUB_BLOB_READ_WRITE_TOKEN", () => {
    vi.stubEnv("XFORGE_PUB_BLOB_READ_WRITE_TOKEN", "pub-token");
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "legacy-token");

    expect(resolvePublicBlobToken()).toBe("pub-token");
  });

  it("does not fall back to legacy token for public store", () => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "legacy-token");

    expect(resolvePublicBlobToken()).toBeUndefined();
  });

  it("resolves private token from canonical or deprecated alias", () => {
    vi.stubEnv("XFORGE_PRIVATE_BLOB_READ_WRITE_TOKEN", "private-token");

    expect(resolvePrivateBlobToken()).toBe("private-token");
  });

  it("accepts deprecated XFROGE_READ_WRITE_TOKEN alias for private store", () => {
    vi.stubEnv("XFROGE_READ_WRITE_TOKEN", "legacy-private-token");

    expect(resolvePrivateBlobToken()).toBe("legacy-private-token");
  });

  it("does not fall back to legacy BLOB_READ_WRITE_TOKEN for private store", () => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "legacy-token");

    expect(resolvePrivateBlobToken()).toBeUndefined();
  });

  it("resolves handleUpload token per store access", () => {
    vi.stubEnv("XFORGE_PUB_BLOB_READ_WRITE_TOKEN", "pub-token");
    vi.stubEnv("XFORGE_PRIVATE_BLOB_READ_WRITE_TOKEN", "private-token");

    expect(resolveHandleUploadToken("public")).toBe("pub-token");
    expect(resolveHandleUploadToken("private")).toBe("private-token");
  });
});
