#!/bin/bash
# Run this from ~/Desktop/drsmart-website-template
# It fixes CSS import paths and replaces map functions in transform.ts

set -e
cd ~/Desktop/drsmart-website-template

echo "1. Fixing CSS import paths..."
sed -i '' "s|@/app/styles/conditions.css|@/styles/conditions.css|g" "app/conditions/[slug]/page.tsx"
sed -i '' "s|@/app/styles/procedures.css|@/styles/procedures.css|g" "app/procedures/[slug]/page.tsx"
sed -i '' "s|@/app/styles/packages.css|@/styles/packages.css|g" "app/packages/[slug]/page.tsx"
echo "   Done."

echo "2. Replacing map functions in lib/transform.ts..."
# Find the line where old clinicContext helper begins and delete everything from there to end
# Then append the new correct functions
CUTLINE=$(grep -n "function clinicContext\|export function mapCondition" lib/transform.ts | head -1 | cut -d: -f1)
if [ -z "$CUTLINE" ]; then
  echo "ERROR: Could not find cutline in transform.ts"
  exit 1
fi
echo "   Cutting from line $CUTLINE to end..."
head -n $((CUTLINE - 1)) lib/transform.ts > /tmp/transform_top.ts
cat /tmp/transform_top.ts ~/Downloads/15marchaftrenoonfiles/transform_additions.ts > lib/transform.ts
echo "   Done."

echo "3. Committing and pushing..."
git add -A
git commit -m "P15: fix CSS imports + rewrite mapCondition/mapProcedure/mapPackage"
git push
echo "All done! Vercel deploying..."
