import { test } from "./helpers/fixtures";
import {
  createCaseForMorphPush,
  MORPH_PUSH_DESTINATIONS,
  openMorphTargetAndVerifyOrigin,
  pushCaseToDestination,
} from "./helpers/orbit-case-push";

test.describe("Orbit Case push @orbit-case", () => {
  test.setTimeout(90_000);

  for (const destination of MORPH_PUSH_DESTINATIONS) {
    test(`pushes case to ${destination.destinationLabel} and opens target with origin`, async ({
      page,
      uniqueTitle,
    }) => {
      await test.step("Create case", async () => {
        await createCaseForMorphPush(page, uniqueTitle);
      });

      await test.step(`Push to ${destination.destinationLabel}`, async () => {
        await pushCaseToDestination(page, destination.destinationLabel);
      });

      await test.step(`Open ${destination.destinationLabel} and verify origin`, async () => {
        await openMorphTargetAndVerifyOrigin(
          page,
          destination,
          uniqueTitle
        );
      });
    });
  }
});
