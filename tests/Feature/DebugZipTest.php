<?php

namespace Tests\Feature;

use Tests\TestCase;

class DebugZipTest extends TestCase
{
  public function test_zip_archive_exists()
  {
    error_log("Checking ZipArchive...");
    if (class_exists(\ZipArchive::class)) {
      $this->assertTrue(true);
      error_log("ZipArchive EXISTS");
    } else {
      error_log("ZipArchive MISSING");
      $this->fail("ZipArchive class is missing in PHPUnit environment.");
    }
  }
}
