#!/bin/bash
#
# This assumes all of the OS-level configuration has been completed and git repo has already been cloned
#
# This script should be run from the repo's deployment directory
# cd deployment
# ./build-s3-dist.sh source-bucket-base-name solution-name version-code
#
# Paramenters:
#  - source-bucket-base-name: Name for the S3 bucket location where the template will source the Lambda
#    code from. The template will append '-[region_name]' to this bucket name.
#    For example: ./build-s3-dist.sh solutions my-solution v1.0.0
#    The template will then expect the source code to be located in the solutions-[region_name] bucket
#
#  - solution-name: name of the solution for consistency
#
#  - version-code: version of the package
set -euo pipefail
# Check to see if input has been provided:
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ]; then
    echo "Please provide the base source bucket name, trademark approved solution name and version where the lambda code will eventually reside."
    echo "For example: ./build-s3-dist.sh solutions trademarked-solution-name v1.0.0 docker-tag123"
    exit 1
fi

# Get reference for all important folders
template_dir="$PWD"
template_dist_dir="$template_dir/global-s3-assets"
build_dist_dir="$template_dir/regional-s3-assets"
source_dir="$template_dir/../source"
nested_stack_template_dir="$source_dir/cfn/templates"

auditDeps () {
   npx better-npm-audit audit --production
   OUTPUT=$?
   if [[ $OUTPUT -eq 0 ]];
   then
       echo dependencies are fine
       return 0
   else
       echo You have vulnerabilies in your package
       exit -1
   fi
}

echo "------------------------------------------------------------------------------"
echo "[Packing] Creating Directories"
echo "------------------------------------------------------------------------------"
echo "rm -rf $template_dist_dir && mkdir -p $template_dist_dir"
rm -rf $template_dist_dir && mkdir -p $template_dist_dir
echo "rm -rf $build_dist_dir && mkdir -p $build_dist_dir"
rm -rf $build_dist_dir && mkdir -p $build_dist_dir

echo "------------------------------------------------------------------------------"
echo "[Packing] Custom Resource Template"
echo "------------------------------------------------------------------------------"
echo "cp $template_dir/*.template $template_dist_dir/"
echo "copy yaml templates and rename"
cp $template_dir/*.yaml $template_dist_dir/
cd $template_dist_dir
# Rename all *.yaml to *.template
for f in *.yaml; do
    mv -- "$f" "${f%.yaml}.template"
done

# command that will work on both Linux and MacOS
sedi () {
    sed --version >/dev/null 2>&1 && sed -i -- "$@" || sed -i "" "$@"
}

cd ..
echo "Updating code source bucket in template with $1"
replace="s|<BUCKET_NAME>|$1|g"
echo "sed -i $replace $template_dist_dir/*.template"
sedi $replace $template_dist_dir/*.template
replace="s|<SOLUTION_NAME>|$2|g"
echo "sed -i $replace $template_dist_dir/*.template"
sedi $replace $template_dist_dir/*.template
replace="s|<VERSION>|$3|g"
echo "sed -i $replace $template_dist_dir/*.template"
sedi $replace $template_dist_dir/*.template
replace="s|<IMAGE_VERSION>|$4|g"
echo "sed -i $replace $template_dist_dir/*.template"
sedi $replace $template_dist_dir/*.template

echo "------------------------------------------------------------------------------"
echo "[Packing] Nested Stack Templates"
echo "------------------------------------------------------------------------------"
echo "cp $nested_stack_template_dir/*.yaml $template_dist_dir"
cp $nested_stack_template_dir/*.yaml $template_dist_dir
# echo "cp $source_dir/backend/functions/api/templates/*.yaml $build_dist_dir"
# cp $source_dir/backend/funcitons/api/templates/*.yaml $build_dist_dir
cd $template_dist_dir

# Rename all *.yaml to *.template
for f in *.yaml; do
    mv -- "$f" "${f%.yaml}.template"
done

echo "cp $nested_stack_template_dir/*.yaml $build_dist_dir"
cp $nested_stack_template_dir/*.yaml $build_dist_dir
# echo "cp $source_dir/backend/functions/api/templates/*.yaml $build_dist_dir"
# cp $source_dir/backend/funcitons/api/templates/*.yaml $build_dist_dir
cd $build_dist_dir

# Rename all *.yaml to *.template
for f in *.yaml; do
    mv -- "$f" "${f%.yaml}.template"
done

echo "cp $nested_stack_template_dir/*.yaml $build_dist_dir"
cp $nested_stack_template_dir/*.yaml $build_dist_dir
# echo "cp $source_dir/backend/functions/api/templates/*.yaml $build_dist_dir"
# cp $source_dir/backend/funcitons/api/templates/*.yaml $build_dist_dir
cd $build_dist_dir

# Rename all *.yaml to *.template
for f in *.yaml; do
    mv -- "$f" "${f%.yaml}.template"
done

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Layers"
echo "------------------------------------------------------------------------------"
cd $source_dir/backend/functions/lambda-layers
for i in `ls -d */ | sed 's#/##'` ; do
  pip install -r $i/requirements.txt -t $i/python/
  cd $i
  zip  -q  -r9 ../$i.zip ./python
  cd ..
done
cp ./*.zip $build_dist_dir/

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Secured Edge Lambda"
echo "------------------------------------------------------------------------------"
cd $source_dir/backend/functions/secured-edge
mkdir dist && zip -q -r9 dist/create_regional_edge_lambda.zip create_regional_edge_lambda.py
cp ./dist/create_regional_edge_lambda.zip $build_dist_dir/create_regional_edge_lambda.zip

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Cleanup Bucket Lambda"
echo "------------------------------------------------------------------------------"
cd $source_dir/backend/functions/cleanup-bucket
rm -rf dist && mkdir dist
pip install --target ./package -r requirements.txt
cd package
zip -q -r9 ${OLDPWD}/dist/cleanup-bucket.zip * -x requirements.txt
cd -
zip -g dist/cleanup-bucket.zip cleanup_bucket.py
cp ./dist/cleanup-bucket.zip $build_dist_dir/cleanup-bucket.zip

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Cleanup ECR Lambda"
echo "------------------------------------------------------------------------------"
cd $source_dir/backend/functions/cleanup-ecr
rm -rf dist
mkdir dist && zip -q -r9 dist/cleanup-ecr.zip cleanup_ecr.py
cp ./dist/cleanup-ecr.zip $build_dist_dir/cleanup-ecr.zip

echo "[Rebuild] Drawio Lambda"
echo "------------------------------------------------------------------------------"
cd $source_dir/backend/functions/drawio
rm -rf dist && mkdir -p dist
zip -q -r9 dist/drawio.zip main.py type_definitions.py
cp ./dist/drawio.zip $build_dist_dir/drawio.zip

echo "------------------------------------------------------------------------------"
echo "[Rebuild] API"
echo "------------------------------------------------------------------------------"
cd $source_dir/backend/functions/api

auditDeps
npm run build
cp ./dist/api.zip $build_dist_dir/api.zip

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Gremlin Resolver"
echo "------------------------------------------------------------------------------"
cd $source_dir/backend/functions/graph-api

auditDeps
npm run build
cp ./dist/graph-api.zip $build_dist_dir/graph-api.zip

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Search"
echo "------------------------------------------------------------------------------"
cd $source_dir/backend/functions/search
auditDeps
npm run build
cp ./dist/search.zip $build_dist_dir/search.zip

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Settings"
echo "------------------------------------------------------------------------------"
cd $source_dir/backend/functions/settings
auditDeps
npm run build
cp ./dist/settings.zip $build_dist_dir/settings.zip

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Setup"
echo "------------------------------------------------------------------------------"
cd $source_dir/backend/functions/setup
auditDeps
npm run build
cp ./dist/setup.zip $build_dist_dir/setup.zip

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Cost-Parser"
echo "------------------------------------------------------------------------------"
cd $source_dir/backend/functions/cost-parser
auditDeps
npm run build
cp ./dist/cost.zip $build_dist_dir/cost.zip

echo "------------------------------------------------------------------------------"
echo "[Rebuild] CUR-Setup"
echo "------------------------------------------------------------------------------"
cd $source_dir/backend/functions/cur-setup
auditDeps
npm run build
cp ./dist/cur-setup.zip $build_dist_dir/cur-setup.zip

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Upload GraphQL Schema"
echo "------------------------------------------------------------------------------"
cp $source_dir/backend/graphql/schema/perspective-api.graphql $build_dist_dir/perspective-api.graphql

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Discovery"
echo "------------------------------------------------------------------------------"
cd $source_dir/backend/discovery
auditDeps
npm run build
cp ./dist/discovery.zip $build_dist_dir/discovery.zip

echo "------------------------------------------------------------------------------"
echo "[Rebuild] UI"
echo "------------------------------------------------------------------------------"
cd $source_dir/frontend
auditDeps
#npm run test
npm run build
cp ./build/ui.zip $build_dist_dir/ui.zip
