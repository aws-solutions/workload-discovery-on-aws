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

# echo "------------------------------------------------------------------------------"
# echo "[Packing] Templates"
# echo "------------------------------------------------------------------------------"
# echo "cp $source_template_dir/cfn/templates/*.yaml $dist_template_dir/"
# cp $source_template_dir/*.yaml $dist_template_dir/
# echo "copy yaml templates and rename"
# cp $source_template_dir/*.yaml $dist_template_dir/
# cd $dist_template_dir
# # aws cloudformation package --template-file "$template" --s3-bucket "$BUCKET" --s3-prefix "${project}/${version}" --output-template-file packaged.template

# # Rename all *.yaml to *.template
# for f in *.yaml; do 
#     mv -- "$f" "${f%.yaml}.template"
# done

# echo "------------------------------------------------------------------------------"
# echo "[Packing] Build Script"
# echo "------------------------------------------------------------------------------"
# echo "cp $source_template_dir/build-s3-dist.sh $dist_template_dir"
# cp $source_template_dir/build-s3-dist.sh $dist_template_dir
# echo "cp $source_template_dir/run-unit-tests.sh $dist_template_dir"
# cp $source_template_dir/run-unit-tests.sh $dist_template_dir

# echo "------------------------------------------------------------------------------"
# echo "[Packing] Create GitHub (open-source) zip file"
# echo "------------------------------------------------------------------------------"
# echo "cd $dist_dir"
# cd $dist_dir
# echo "zip -q -r9 ../$1.zip *"
# zip -q -r9 ../$1.zip *
# echo "Clean up open-source folder"
# echo "rm -rf *"
# rm -rf *
# echo "mv ../$1.zip ."
# mv ../$1.zip .
# echo "Completed building $1.zip dist"
echo "installing handy little lib called gitzip to create a zip based on our .gitignore"
npm i -g gitzip
echo "moving to root to generate zip file"
cd ../
echo "generating the zip using gitzip and ensuring exclusions are ignored as they do not need to be in GitHub"
gitzip -d $dist_dir/$1.zip -x .taskcat.yml buildspec.yml .viperlight* aws-perspective-params.json taskcat-bucket-management.sh taskcat-buildspec.yaml
