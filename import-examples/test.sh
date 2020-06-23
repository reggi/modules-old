node ./js-no-pkg/index.js && 
echo "js-no-pkg ✅"

npm -C ./js-pkg-tilde -s install && node ./js-pkg-tilde/index.js &&
echo "js-pkg-tilde ✅"

npm -C ./js-pkg-tilde-nested -s install && node ./js-pkg-tilde-nested/index.js &&
echo "js-pkg-tilde-nested ✅"

node --experimental-modules ./mjs-no-pkg/index.mjs &&
echo "mjs-no-pkg ✅"

npm -C ./mjs-pkg-tilde -s install && node --experimental-modules ./mjs-pkg-tilde/index.mjs &&
echo "mjs-pkg-tilde ✅"

npm -C ./mjs-pkg-tilde-nested -s install && node --experimental-modules ./mjs-pkg-tilde-nested/index.mjs &&
echo "mjs-pkg-tilde-nested ✅"
