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
launch_wizard_dist_dir="$template_dir/launch-wizard-assets"
source_dir="$template_dir/../source"
nested_stack_template_dir="$source_dir/cfn/templates"

# command that will work on both Linux and MacOS
sedi () {
    sed --version >/dev/null 2>&1 && sed -i -- "$@" || sed -i "" "$@"
}

echo "------------------------------------------------------------------------------"
echo "[Packing] Creating Directories"
echo "------------------------------------------------------------------------------"

rm -rf "$template_dist_dir" && mkdir -p "$template_dist_dir"
rm -rf "$build_dist_dir" && mkdir -p "$build_dist_dir"
rm -rf "$launch_wizard_dist_dir" && mkdir -p "$launch_wizard_dist_dir"

echo "------------------------------------------------------------------------------"
echo "[Packing] Nested Stack Templates"
echo "------------------------------------------------------------------------------"

cp "$nested_stack_template_dir"/*.template "$build_dist_dir"
cd "$build_dist_dir"
sedi "s|<BUCKET_NAME>|${1}|g; s|<SOLUTION_NAME>|${2}|g; s|<VERSION>|${3}|g; s|<IMAGE_VERSION>|${4}|g" main.template
sedi "s|<VERSION>|${3}|g;" org-global-resources.template

echo "------------------------------------------------------------------------------"
echo "[Packing] Main Distribution Template"
echo "------------------------------------------------------------------------------"

cp "${build_dist_dir}/main.template" "${template_dist_dir}/workload-discovery-on-aws.template"

echo "------------------------------------------------------------------------------"
echo "[Packing] Launch Wizard Assets"
echo "------------------------------------------------------------------------------"

cp "${template_dir}/../launch-wizard-config.json" "${launch_wizard_dist_dir}/launch-wizard-config.json"
cp "${source_dir}/launch-wizard/launch-wizard-metadata.json" "${launch_wizard_dist_dir}/launch-wizard-metadata.json"
cd "${source_dir}/launch-wizard/helpPanels"
zip -q -r9 "${launch_wizard_dist_dir}/helpPanels.zip" .
cd "${template_dir}"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Upload GraphQL Schema"
echo "------------------------------------------------------------------------------"
cp "${source_dir}/backend/graphql/schema/perspective-api.graphql" "${build_dist_dir}/perspective-api.graphql"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Upload AppSync JS resolvers"
echo "------------------------------------------------------------------------------"
cp "${source_dir}/backend/graphql/resolvers/default.js" "${build_dist_dir}/default-resolver.js"

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
rm -rf dist && mkdir dist
zip -q -r9 dist/cleanup-ecr.zip cleanup_ecr.py
cp ./dist/cleanup-ecr.zip "${build_dist_dir}/cleanup-ecr.zip"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Identity Provider Custom Resource"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/backend/functions/identity-provider"
rm -rf dist && mkdir dist
zip -q -r9 dist/identity-provider.zip identity_provider.py
cp ./dist/identity-provider.zip "${build_dist_dir}/identity-provider.zip"

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
npm run build
cp ./dist/account-import-templates-api.zip "${build_dist_dir}/account-import-templates-api.zip"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Application Monitoring API"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/backend/functions/application-monitoring"
npm run build
cp ./dist/application-monitoring.zip "${build_dist_dir}/application-monitoring.zip"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Gremlin Resolver"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/backend/functions/graph-api"
npm run build
cp ./dist/graph-api.zip "${build_dist_dir}/graph-api.zip"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] opensearch-setup"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/backend/functions/opensearch-setup"
npm run build
cp ./dist/opensearch-setup.zip "${build_dist_dir}/opensearch-setup.zip"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Search API"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/backend/functions/search-api"
npm run build
cp ./dist/search-api.zip "${build_dist_dir}/search-api.zip"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Settings"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/backend/functions/settings"
npm run build
cp ./dist/settings.zip "${build_dist_dir}/settings.zip"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Cost-Parser"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/backend/functions/cost-parser"
npm run build
cp ./dist/cost.zip "${build_dist_dir}/cost.zip"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] CUR-Notification"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/backend/functions/cur-notification"
npm run build
cp ./dist/cur-notification.zip "${build_dist_dir}/cur-notification.zip"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] CUR-Setup"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/backend/functions/cur-setup"
npm run build
cp ./dist/cur-setup.zip "${build_dist_dir}/cur-setup.zip"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Metrics Uuid Custom Resource"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/backend/functions/metrics-uuid"
rm -rf dist && mkdir dist
zip -q -r9 dist/metrics_uuid.zip metrics_uuid.py
cp ./dist/metrics_uuid.zip "${build_dist_dir}/metrics_uuid.zip"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Remove AppInsights Custom Resource"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/backend/functions/remove-appinsights"
rm -rf dist && mkdir dist
zip -q -r9 dist/remove_appinsights.zip remove_appinsights.py
cp ./dist/remove_appinsights.zip "${build_dist_dir}/remove_appinsights.zip"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Metrics"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/backend/functions/metrics"
npm run build
cp ./dist/metrics.zip "${build_dist_dir}/metrics.zip"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Metrics Subscription Filter"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/backend/functions/metrics-subscription-filter"
npm run build
cp ./dist/metrics-subscription-filter.zip "${build_dist_dir}/metrics-subscription-filter.zip"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Export to myApplication"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/backend/functions/myapplications"
npm run build
cp ./dist/myapplications.zip "${build_dist_dir}/myapplications.zip"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] Discovery"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/backend/discovery"
npm run build
cp ./dist/discovery.zip "${build_dist_dir}/discovery.zip"

echo "------------------------------------------------------------------------------"
echo "[Rebuild] UI"
echo "------------------------------------------------------------------------------"
cd "${source_dir}/frontend"
npm run build
cp ./dist/ui.zip "${build_dist_dir}/ui.zip"
