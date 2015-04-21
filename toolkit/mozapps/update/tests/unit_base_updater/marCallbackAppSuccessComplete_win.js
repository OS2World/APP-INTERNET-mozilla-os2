/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/
 */

/* Replace app binary complete MAR file patch apply success test */

function run_test() {
  setupTestCommon();
  gTestFiles = gTestFilesCompleteSuccess;
  gTestDirs = gTestDirsCompleteSuccess;
  setupUpdaterTest(FILE_COMPLETE_MAR, false, false);

  gCallbackBinFile = "exe0.exe";

  runUpdate(0, STATE_SUCCEEDED);
}

function checkUpdateApplied() {
  checkFilesAfterUpdateSuccess();
  checkCallbackAppLog();
}
