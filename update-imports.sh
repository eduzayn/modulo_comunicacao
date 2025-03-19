#!/bin/bash

# Update Button imports
find src -type f -name "*.tsx" -exec sed -i 's/@\/components\/ui\/Button/@\/components\/ui\/button/g' {} +
find src -type f -name "*.tsx" -exec sed -i 's/@\/components\/ui\/button.tsx/@\/components\/ui\/button/g' {} +

# Update Card imports
find src -type f -name "*.tsx" -exec sed -i 's/@\/components\/ui\/Card/@\/components\/ui\/card/g' {} +
find src -type f -name "*.tsx" -exec sed -i 's/@\/components\/ui\/card.tsx/@\/components\/ui\/card/g' {} +

# Update Input imports
find src -type f -name "*.tsx" -exec sed -i 's/@\/components\/ui\/Input/@\/components\/ui\/input/g' {} +
find src -type f -name "*.tsx" -exec sed -i 's/@\/components\/ui\/input.tsx/@\/components\/ui\/input/g' {} + 