#! /bin/bash

# Adds @ts-nocheck to the top of all the openapi generated files.
# https://github.com/OpenAPITools/openapi-generator/issues/8961

TARGET=./src/gen/api/

SED_COMMAND='1s;^;// @ts-nocheck\n;'
if [ "$(uname)" != "Darwin" ]; then
  sed -i "$SED_COMMAND" $TARGET**/*.ts
else
  sed -i '' "$SED_COMMAND" $TARGET**/*.ts
fi
