#!/bin/bash
#
# This assumes all of the OS-level configuration has been completed and git repo has already been cloned
#
# This script should be run from the repo's deployment directory
# cd deployment
# ./build-s3-dist.sh source-bucket-base-name solution-name version-code
#
# Parameters:
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
   npm_config_yes=true npx better-npm-audit audit --production
   OUTPUT=$?
   if [[ "$OUTPUT" -eq 0 ]];
   then
       echo dependencies are fine
       return 0
   else
       echo You have vulnerabilies in your package
       return 1
   fi
}

# command that will work on both Linux and MacOS
sedi () {
    sed --version >/dev/null 2>&1 && sed -i -- "$@" || sed -i "" "$@"
}

echo "------------------------------------------------------------------------------"
echo "[Packing] Creating Directories"
echo "------------------------------------------------------------------------------"

rm -rf "$template_dist_dir" && mkdir -p "$template_dist_dir"
rm -rf "$build_dist_dir" && mkdir -p "$build_dist_dir"

echo "------------------------------------------------------------------------------"
echo "[Packing] Nested Stack Templates"
echo "------------------------------------------------------------------------------"

cp "$nested_stack_template_dir"/*.template "$build_dist_dir"
cd "$build_dist_dir"
sedi "s|<BUCKET_NAME>|${1}|g; s|<SOLUTION_NAME>|${2}|g; s|<VERSION>|${3}|g; s|<IMAGE_VERSION>|${4}|g" main.template

echo "------------------------------------------------------------------------------"
echo "[Packing] Main Distribution Template"
echo "------------------------------------------------------------------------------"

cp "${build_dist_dir}/main.template" "${template_dist_dir}/workload-discovery-on-aws.template"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Layers"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/backend/functions/lambda-layers"
for i in $(ls -d -- */ | sed 's#/##') ; do
  mkdir "${i}/python"
  [ -f "$i/$i.py" ] && cp "${i}/${i}.py" "${i}/python"
  [ -f "$i/requirements.txt" ] && pip install -r "${i}/requirements.txt" -t "${i}/python/"
  cd "$i"
  zip  -q  -r9 "../${i}.zip" ./python
  cd ..
  rm -rf "${i}/python"
done
cp ./*.zip "${build_dist_dir}/"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Cleanup Bucket Lambda"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/backend/functions/cleanup-bucket"
rm -rf dist && mkdir dist
zip -q -r9 dist/cleanup-bucket.zip cleanup_bucket.py
cp ./dist/cleanup-bucket.zip "${build_dist_dir}/cleanup-bucket.zip"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Codebuild Runner Custom Resource"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/backend/functions/run-codebuild-project"
rm -rf dist && mkdir dist
zip -q -r9 dist/run-codebuild-project.zip run_codebuild.py
cp ./dist/run-codebuild-project.zip "${build_dist_dir}/run-codebuild-project.zip"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Cleanup ECR Lambda"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/backend/functions/cleanup-ecr"
mkdir "python"
cp "../cleanup-ecr.py" "python"
pip install -r "requirements.txt" -t "python"
cd python
zip  -q  -r9 "../cleanup-ecr.zip" ./python
cd -
rm -rf "python"
cp ./cleanup-ecr.zip "${build_dist_dir}/cleanup-ecr.zip"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Drawio Lambda"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/backend/functions/drawio"
rm -rf dist && mkdir -p dist
zip -q -r9 dist/drawio.zip main.py type_definitions.py
cp ./dist/drawio.zip "${build_dist_dir}/drawio.zip"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Account Import Template API"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/backend/functions/account-import-templates-api"

auditDeps
npm run build
cp ./dist/account-import-templates-api.zip "${build_dist_dir}/account-import-templates-api.zip"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Gremlin Resolver"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/backend/functions/graph-api"

auditDeps
npm run build
cp ./dist/graph-api.zip "${build_dist_dir}/graph-api.zip"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] opensearch-setup"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/backend/functions/opensearch-setup"
auditDeps
npm run build
cp ./dist/opensearch-setup.zip "${build_dist_dir}/opensearch-setup.zip"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Search API"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/backend/functions/search-api"
auditDeps
npm run build
cp ./dist/search-api.zip "${build_dist_dir}/search-api.zip"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Settings"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/backend/functions/settings"
auditDeps
npm run build
cp ./dist/settings.zip "${build_dist_dir}/settings.zip"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Cost-Parser"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/backend/functions/cost-parser"
auditDeps
npm run build
cp ./dist/cost.zip "${build_dist_dir}/cost.zip"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] CUR-Setup"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/backend/functions/cur-setup"
auditDeps
npm run build
cp ./dist/cur-setup.zip "${build_dist_dir}/cur-setup.zip"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Upload GraphQL Schema"
echo "------------------------------------------------------------------------------"
cp "${source_dir}/backend/graphql/schema/perspective-api.graphql" "${build_dist_dir}/perspective-api.graphql"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Discovery"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/backend/discovery"
auditDeps
npm run build
cp ./dist/discovery.zip "${build_dist_dir}/discovery.zip"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] UI"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/frontend"
auditDeps
#npm run test
npm run build
cp ./build/ui.zip "${build_dist_dir}/ui.zip"
