"use strict";

let {OS: {File, Path, Constants}} = Components.utils.import("resource://gre/modules/osfile.jsm", {});
let {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});

// Ensure that we have a profile but that the OS.File worker is not launched
add_task(function* init() {
  do_get_profile();
  yield File.resetWorker();
});

function getCount(histogram) {
  if (histogram == null) {
    return 0;
  }

  let total = 0;
  for (let i of histogram.counts) {
    total += i;
  }
  return total;
}

// Ensure that launching the OS.File worker adds data to the relevant
// histograms
add_task(function* test_startup() {
  let LAUNCH = "OSFILE_WORKER_LAUNCH_MS";
  let READY = "OSFILE_WORKER_READY_MS";

  let before = Services.telemetry.histogramSnapshots;

  // Launch the OS.File worker
  yield File.getCurrentDirectory();

  let after = Services.telemetry.histogramSnapshots;


  do_print("Ensuring that we have recorded measures for histograms");
  do_check_eq(getCount(after[LAUNCH]), getCount(before[LAUNCH]) + 1);
  do_check_eq(getCount(after[READY]), getCount(before[READY]) + 1);

  do_print("Ensuring that launh <= ready");
  do_check_true(after[LAUNCH].sum <= after[READY].sum);
});

// Ensure that calling writeAtomic adds data to the relevant histograms
add_task(function* test_writeAtomic() {
  let LABEL = "OSFILE_WRITEATOMIC_JANK_MS";

  let before = Services.telemetry.histogramSnapshots;

  // Perform a write.
  let path = Path.join(Constants.Path.profileDir, "test_osfile_telemetry.tmp");
  yield File.writeAtomic(path, LABEL, { tmpPath: path + ".tmp" } );

  let after = Services.telemetry.histogramSnapshots;

  do_check_eq(getCount(after[LABEL]), getCount(before[LABEL]) + 1);
});

function run_test() {
  run_next_test();
}
