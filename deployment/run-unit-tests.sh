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

if [[ -n "${CODEBUILD_BUILD_ID}" ]]
then
  echo "Starting DynamoDb local"
  mkdir ./dynamodb_local
  cd ./dynamodb_local

  curl -O "https://s3-us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_latest.tar.gz"
  tar -xvzf dynamodb_local_latest.tar.gz; rm dynamodb_local_latest.tar.gz

  java -jar DynamoDBLocal.jar -port 9000 &
fi

echo "------------------------------------------------------------------------------"
echo "[Test] Drawio"
echo "------------------------------------------------------------------------------"
cd $source_dir/backend/functions/drawio
pipenv install --dev
pipenv run pytest --cov-report xml --cov .
echo "$(awk '{gsub(/<source>.*\/source\//, "<source>source/")}1' coverage.xml)" > coverage.xml

echo "------------------------------------------------------------------------------"
echo "[Test] Account Import Templates"
echo "------------------------------------------------------------------------------"
cd $source_dir/backend/functions/account-import-templates-api
npm run test:ci

echo "------------------------------------------------------------------------------"
echo "[Test] Cost Parser"
echo "------------------------------------------------------------------------------"
cd $source_dir/backend/functions/cost-parser
npm run test:ci

echo "------------------------------------------------------------------------------"
echo "[Test] Discovery"
echo "------------------------------------------------------------------------------"
cd $source_dir/backend/discovery/
npm run test:ci

echo "------------------------------------------------------------------------------"
echo "[Test] Graph API"
echo "------------------------------------------------------------------------------"
cd $source_dir/backend/functions/graph-api
npm run test:ci

echo "------------------------------------------------------------------------------"
echo "[Test] Search"
echo "------------------------------------------------------------------------------"
cd $source_dir/backend/functions/search-api
npm run test:ci

echo "------------------------------------------------------------------------------"
echo "[Test] Settings"
echo "------------------------------------------------------------------------------"
cd $source_dir/backend/functions/settings
npm run test:ci

echo "------------------------------------------------------------------------------"
echo "[Test] UI"
echo "------------------------------------------------------------------------------"
cd $source_dir/frontend/
npm run test:ci