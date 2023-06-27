#!/bin/bash

# Author: Ron Eros Mandic (@ron-mandic)
# Repository: b-g/p5-matter-examples
# Path: ./sample/generate-types.bash
# Last reviewed: 2023-06-21 19:41 CEST (by @ron-mandic)

# ------------------------------------------------------------------------------------------
# A VARIABLES ------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------
# vgl. https://stackoverflow.com/a/28938235
NC='\033[0m'
GREEN='\033[1;32m'
LIGHT_BLUE='\033[1;34m'
YELLOW='\033[1;33m'
RED='\033[1;31m'

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
# echo -e "\n"

# ------------------------------------------------------------------------------------------
# C PROGRAM --------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------

# --- a) Delete old type declaration files (for ./classes only) in the @types directory for a rebuild
# if "./@types/classes" exits, then delete it
if [ -d "./@types/classes" ]; then
    rm -rf ./@types/classes
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
    npx -p typescript tsc ./classes/*.js --declaration --allowJs --emitDeclarationOnly --outDir ./@types/classes
fi

# Guard clause #1
if [[ -z $(find ./@types/classes -name "*.d.ts" 2>/dev/null) ]]; then
    warning "Warning: No type declaration files (*.d.ts) in the directory. Exiting script ...\n"
    exit 1
fi

# --------------------------------------------- 002 ---------------------------------------------
# --- d) Merge all type declaration files into one single index.d.ts file
info "2. Create index.d.ts in @types/classes ..."
cat ./@types/classes/*.d.ts > ./@types/classes/index.d.ts
# Add a label to the index.d.ts file with the current date and time
label ./@types/classes/index.d.ts

# --------------------------------------------- 003 ---------------------------------------------
# --- e) Now delete all rudimentary type declaration files except the index.d.ts file
info "3. Clean up individual type declaration files ..."
cd ./@types/classes
find . -type f -name "*.d.ts" ! -name "index.d.ts" -exec rm {} + #-delete
cd ../..

# --------------------------------------------- 004 ---------------------------------------------
# --- g) Install the type declaration files for other libraries
info "4. Retrieve and extract type declaration files for p5.js ..."

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

    # if ../../@types/p5 does not exist, so create it
    if ! [ -d "../../@types/p5" ]; then
        mkdir ../../@types/p5
    fi

    # if this directory is not empty, then delete the content
    if [ "$(ls -A ../../@types/p5)" ]; then
        rm -rf ../../@types/p5/*
    fi

    cp -r p5/* ../../@types/p5
fi

# --------------------------------------------- 005 ---------------------------------------------
success "\n5. Success: Installation was completed"
echo -e "\n"
