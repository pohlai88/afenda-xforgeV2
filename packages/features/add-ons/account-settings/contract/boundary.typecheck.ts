/**
 * Compile-time boundary contracts — included in `tsc --noEmit`, not Vitest.
 * Fails typecheck when Record/Dto drift apart.
 */
import type {
  ActiveSessionDto,
  ActiveSessionRecord,
  UserPreferencesDto,
  UserPreferencesRecord,
  UserProfileDto,
  UserProfileRecord,
} from "./account-settings.types";

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

type _UserProfileDtoMatchesRecord = AssertTrue<
  AssertEqual<UserProfileDto, IsoDateRecord<UserProfileRecord>>
>;

type _UserPreferencesDtoMatchesRecord = AssertTrue<
  AssertEqual<UserPreferencesDto, IsoDateRecord<UserPreferencesRecord>>
>;

type _ActiveSessionDtoMatchesRecord = AssertTrue<
  AssertEqual<ActiveSessionDto, IsoDateRecord<ActiveSessionRecord>>
>;
