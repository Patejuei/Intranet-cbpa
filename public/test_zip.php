<?php
echo "<h3>PHP Zip Diagnostic</h3>";
echo "PHP Version: " . phpversion() . "<br>";
echo "Server Software: " . $_SERVER['SERVER_SOFTWARE'] . "<br>";
echo "Loaded Configuration File: " . php_ini_loaded_file() . "<br>";

echo "<h4>Checking Extension</h4>";
if (extension_loaded('zip')) {
  echo "Extension 'zip' IS loaded.<br>";
} else {
  echo "Extension 'zip' is NOT loaded.<br>";
}

echo "<h4>Checking Class</h4>";
if (class_exists('ZipArchive')) {
  echo "Class 'ZipArchive' exists.<br>";
  try {
    $zip = new ZipArchive();
    echo "Successfully instantiated new ZipArchive() object.<br>";
    echo "Object class: " . get_class($zip) . "<br>";
  } catch (Throwable $e) {
    echo "CRITICAL: Failed to instantiate ZipArchive: " . $e->getMessage() . "<br>";
  }
} else {
  echo "CRITICAL: Class 'ZipArchive' does NOT exist.<br>";
}

echo "<h4>All Loaded Extensions</h4>";
echo "<pre>" . print_r(get_loaded_extensions(), true) . "</pre>";
