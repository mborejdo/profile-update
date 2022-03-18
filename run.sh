#! /bin/bash

docker run -e REPO="mborejdo" -e API_TOKEN_GITHUB=${API_TOKEN_GITHUB}  --rm -v $(pwd)/data:/github/workspace/data/ --workdir /github/workspace/data/ mborejdo/action-rusty "deno run -A --quiet ./index.ts"
