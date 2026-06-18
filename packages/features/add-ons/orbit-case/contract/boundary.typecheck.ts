/**
 * Compile-time boundary contracts — included in `tsc --noEmit`, not Vitest.
 * Fails typecheck when Record/Dto drift apart.
 */
import type {
  OrbitCaseActivityDto,
  OrbitCaseActivityRecord,
  OrbitCaseBoardColumn,
  OrbitCaseBoardDto,
  OrbitCaseCommentDto,
  OrbitCaseCommentRecord,
  OrbitCaseDto,
  OrbitCaseRecord,
  OrbitObjectLinkDto,
  OrbitObjectLinkRecord,
} from "./orbit-case.types";

type AssertEqual<T, U> = [T] extends [U]
  ? [U] extends [T]
    ? true
    : false
  : false;

type AssertTrue<T extends true> = T;

type IsoDateRecord<T> = {
  [K in keyof T]: T[K] extends Date
    ? string
    : T[K] extends Date | null
      ? string | null
      : T[K];
};

type _OrbitCaseDtoMatchesRecord = AssertTrue<
  AssertEqual<OrbitCaseDto, IsoDateRecord<OrbitCaseRecord>>
>;

type _OrbitCaseCommentDtoMatchesRecord = AssertTrue<
  AssertEqual<OrbitCaseCommentDto, IsoDateRecord<OrbitCaseCommentRecord>>
>;

type _OrbitCaseBoardDtoMatchesResult = AssertTrue<
  AssertEqual<
    OrbitCaseBoardDto,
    {
      columns: {
        status: OrbitCaseBoardColumn["status"];
        cases: OrbitCaseDto[];
      }[];
    }
  >
>;

type _OrbitCaseActivityDtoMatchesRecord = AssertTrue<
  AssertEqual<
    Omit<OrbitCaseActivityDto, "summary">,
    IsoDateRecord<OrbitCaseActivityRecord>
  >
>;

type _OrbitObjectLinkDtoMatchesRecord = AssertTrue<
  AssertEqual<OrbitObjectLinkDto, IsoDateRecord<OrbitObjectLinkRecord>>
>;
