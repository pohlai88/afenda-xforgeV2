/**
 * Compile-time boundary contracts — included in `tsc --noEmit`, not Vitest.
 * Fails typecheck when Record/Dto drift apart.
 */
import type {
  OrbitCaseBoardDto,
  OrbitCaseBoardResult,
  OrbitCaseCommentDto,
  OrbitCaseCommentRecord,
  OrbitCaseDto,
  OrbitCaseRecord,
} from "./orbit-case.types";
import type { Serializable } from "./serializable";

type AssertEqual<T, U> = [T] extends [U]
  ? [U] extends [T]
    ? true
    : false
  : false;

type AssertTrue<T extends true> = T;

type _OrbitCaseDtoMatchesSerializableRecord = AssertTrue<
  AssertEqual<OrbitCaseDto, Serializable<OrbitCaseRecord>>
>;

type _OrbitCaseCommentDtoMatchesSerializableRecord = AssertTrue<
  AssertEqual<OrbitCaseCommentDto, Serializable<OrbitCaseCommentRecord>>
>;

type _OrbitCaseBoardDtoMatchesSerializableResult = AssertTrue<
  AssertEqual<OrbitCaseBoardDto, Serializable<OrbitCaseBoardResult>>
>;
