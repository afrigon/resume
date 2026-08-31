#!/bin/sh
# aube installs git dependencies as raw repository tarballs without running
# their prepare script, so the dist they are consumed from is never built.
# npm's install does run prepare; it happens in a copy outside node_modules
# because node refuses to strip types from .ts files under a node_modules
# path, then the built dist is copied back.
set -e

if command -v npm >/dev/null 2>&1; then
    npm_command="npm"
else
    npm_command="mise exec node@24 -- npm"
fi

for package in x3d x3d-react; do
    [ -d "node_modules/$package/dist" ] && continue
    build_dir="$(mktemp -d)"
    cp -R "node_modules/$package/." "$build_dir"
    (cd "$build_dir" && $npm_command install --no-audit --no-fund)
    cp -R "$build_dir/dist" "node_modules/$package/dist"
    rm -rf "$build_dir"
done
