#!/bin/bash
#
# This assumes all of the OS-level configuration has been completed and git repo has already been cloned
#
# This script should be run from the repo's deployment directory
# cd deployment
# ./build-s3-dist.sh solution-name
#
# Paramenters:
#  - solution-name: name of the solution for consistency

# Check to see if input has been provided:
set -euo pipefail

if [ -z "$1" ]; then
    echo "Please provide the trademark approved solution name for the open source package."
    echo "For example: ./build-s3-dist.sh trademarked-solution-name"
    exit 1
fi

# Get reference for all important folders
source_template_dir="$PWD"
dist_dir="$source_template_dir/open-source"
dist_template_dir="$dist_dir/deployment"
source_dir="$source_template_dir/../source"

echo "------------------------------------------------------------------------------"
echo "[Init] Clean old open-source folder"
echo "------------------------------------------------------------------------------"
echo "rm -rf $dist_dir"
rm -rf $dist_dir
echo "mkdir -p $dist_dir"
mkdir -p $dist_dir
echo "mkdir -p $dist_template_dir"
mkdir -p $dist_template_dir

echo "installing handy little lib called gitzip to create a zip based on our .gitignore"
npm i -g gitzip
echo "moving to root to generate zip file"
cd ../
echo "generating the zip using gitzip and ensuring exclusions are ignored as they do not need to be in GitHub"
gitzip -d $dist_dir/$1.zip \
      -x "codescan-*.sh" \
      -x "buildspec.yml" \
      -x ".viperlight*" \
      -x "internal" \
      -x "build-tools" \
      -x "sonar-project.properties" \
      -x "solution-manifest.yaml" \
      -x "docs" \
      -x "launch-wizard-config.json" \
      -x "source/launch-wizard" \
      -x ".nightswatch" \
      -x "Config"
