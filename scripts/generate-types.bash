#!/bin/bash

# Author: Ron Eros Mandic (@ron-mandic)
# Repository: b-g/p5-matter-examples
# Path: ./sample/generate-types.bash
# Last reviewed: 2023-06-20 17:19 CEST (by @ron-mandic)

# ------------------------------------------------------------------------------------------
# A VARIABLES ------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------
# vgl. https://stackoverflow.com/a/28938235
NC='\033[0m'
GREEN='\033[1;32m'
LIGHT_BLUE='\033[1;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'

LIBRARIES_DIR="./libraries"
NPM_URL_TYPES_MATTER_JS="https://www.npmjs.com/package/@types/matter-js"
NPM_URL_TYPES_P5_JS="https://www.npmjs.com/package/@types/p5"

success() {
    local message=$1
    echo -e "${GREEN}${message}${NC}"
}
info() {
    local message=$1
    echo -e "${LIGHT_BLUE}${message}${NC}"
}
warning() {
    local message=$1
    echo -e "${YELLOW}${message}${NC}"
}
error() {
    local message=$1
    echo -e "${RED}${message}${NC}"
}

version_local() {
    local file_path="$1"
    local version

    if [[ -f "$file_path" ]]; then
        version=$(head "$file_path" | grep -oE "[0-9]+\.[0-9]+\.[0-9]+")

        if [[ -n "$version" ]]; then
            echo "$version"
        fi
    fi
}

version_remote() {
    local url="$1"
    local version

    html=$(curl -s "$url")
    version=$(echo "$html" | grep -o '"version":"[^"]*' | sed 's/"version":"//' | head -n 1)

    echo "$version"
}

install_types() {
    package=$1
    version=$2

    npm --save-dev install "@types/$package@$version" 2>/dev/null

    if [ $? -ne 0 ]; then
        npm --save-dev install "@types/$package"
    fi
}

function label() {
    local file=$1
    local date=$(date)
    # Append current date and time (e.g Do 25 Mai 2023 14:07:51 CEST) to the file without overwriting it
    echo -e "\n\n// ./sample/generate-types.bash - Last created: $date" >> $file
}

# ------------------------------------------------------------------------------------------
# B INFO -----------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------
# info "Info: Shell and script environment"
# echo "\$0: $0" # The filename of the current script
# echo "\$\$: $$" # The process ID of the current shell
# echo "\$SHELL: $SHELL" # The current shell

# ------------------------------------------------------------------------------------------
# C PROGRAM --------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------
echo -e "\n"

# --- a) Delete old type declaration files in the @types directory for a rebuild
if [ -d "@types" ]; then
    rm -r "@types"
fi

# --------------------------------------------- 001 ---------------------------------------------
# see https://stackoverflow.com/a/677212
# --- b) Try to install the type declaration files for the classes in the ./classes directory
if ! command -v npx &> /dev/null; then
    error "Error: npx could not be found. Exiting script ...\n"
    exit 1
else
    info "1. Create type declaration files in @types ..."
    # bash: ./classes/*.js      Only files in the current directory
    # zsh:  ./classes/**/*.js   Only files in the current directory and subdirectories

    # Premise: The JavaScript files in the ./classes directory already exist since we checked for them earlier in the guard clause (see c)
    # Result: The type declaration files (*.d.ts) will be created in the new ./@types directory
    npx -p typescript tsc ./classes/*.js --declaration --allowJs --emitDeclarationOnly --outDir ./@types
fi

# Guard clause #1
if [[ -z $(find ./@types -name "*.d.ts" 2>/dev/null) ]]; then
    warning "Warning: No type declaration files (*.d.ts) in the @types directory. Exiting script ...\n"
    exit 1
fi

# --------------------------------------------- 002 ---------------------------------------------
# --- d) Merge all type declaration files into one single index.d.ts file
info "2. Create index.d.ts in @types ..."
cat ./@types/*.d.ts > ./@types/index.d.ts
# Add a label to the index.d.ts file with the current date and time
label ./@types/index.d.ts
cd @types

# --------------------------------------------- 003 ---------------------------------------------
# --- e) Now delete all rudimentary type declaration files except the index.d.ts file
info "3. Clean up individual type declaration files ..."
find . -type f -name "*.d.ts" ! -name "index.d.ts" -exec rm {} + #-delete
cd ..

# --------------------------------------------- 004 ---------------------------------------------
# --- f) Move index.d.ts into the new ./@types/classes directory
info "4. Create a new subdirectory called ./@types/classes ..."
mkdir ./@types/classes
mv ./@types/index.d.ts ./@types/classes/index.d.ts

# Guard clause #2
if ! command -v npm &> /dev/null; then
    error "Error: npm could not be found. Exiting script ...\n"
    exit 1
fi

# --------------------------------------------- 005 ---------------------------------------------
# --- g) Install the type declaration files for other libraries
info "5. Install and extract type declaration files for p5.js and matter.js ...\n"

# matter.js
VERSION_MATTER_JS=$(version_local "$FILE_PATH_MATTER_JS")
info "\n5.1. Downloading @types/matter-js ..."
if [[ -z "$VERSION_MATTER_JS" ]]; then
    npm --save-dev install @types/matter-js
else
    install_types "matter-js" "$VERSION_MATTER_JS"
fi

# p5.js
VERSION_P5_JS=$(version_local "$FILE_PATH_P5_JS")
info "\n5.2. Downloading @types/p5 ..."
if [[ -z "$VERSION_P5_JS" ]]; then
    npm --save-dev install @types/p5
else
    install_types "p5" "$VERSION_P5_JS"
fi

# Guard clause #3
if ! [ -d "node_modules" ]; then
    warning "Warning: There is no node_modules folder and thus there will be no @types folder"
    warning "Warning: Please make sure that the folder is preserved during the script. Exiting script ...\n"
    exit 1
else
    cd node_modules/@types
fi

# --- h) Move the type declaration files for other libraries into the new ./@types directory
if [ -d "p5" ]; then
    # Premise: The JavaScript files in the ./classes directory already exist since we checked for them earlier in the guard clause
    # Result: @types/p5 will and can be created along side @types/classes
    # mkdir ../../@types/p5
    cp -r p5 ../../@types/p5
fi

if [ -d "matter-js" ]; then
    # Premise: The JavaScript files in the ./classes directory already exist since we checked for them earlier in the guard clause
    # Result: @types/matter-js will and can be created along side @types/classes and @types/p5
    # mkdir ../../@types/matter-js
    cp -r matter-js ../../@types/matter-js
fi
cd ../../

# --------------------------------------------- 006 ---------------------------------------------
success "\n6. Success: Installation was completed"
echo -e "\n"
