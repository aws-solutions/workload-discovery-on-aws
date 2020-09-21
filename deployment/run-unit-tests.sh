#!/bin/bash
#
# This assumes all of the OS-level configuration has been completed and git repo has already been cloned
#
# This script should be run from the repo's deployment directory
# cd deployment
# ./run-unit-tests.sh
#

# Get reference for all important folders
template_dir="$PWD"
source_dir="$template_dir/../source"

echo "------------------------------------------------------------------------------"
echo "[Test] API"
echo "------------------------------------------------------------------------------"
cd $source_dir/backend/functions/api
npm test

echo "------------------------------------------------------------------------------"
echo "[Test] Search"
echo "------------------------------------------------------------------------------"
cd $source_dir/backend/functions/search
npm test

echo "------------------------------------------------------------------------------"
echo "[Test] Discovery"
echo "------------------------------------------------------------------------------"
cd $source_dir/backend/discovery/
npm test

echo "------------------------------------------------------------------------------"
echo "[Test] UI"
echo "------------------------------------------------------------------------------"
cd $source_dir/frontend/
npm test