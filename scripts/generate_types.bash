#!/usr/bin/env bash

# Author: Ron Eros Mandic (@ron-mandic)
# Repository: b-g/p5-matter-examples
# Path: ./sample/generate_types.bash
# Last reviewed: 2023-06-16 19:53 CEST (by @ron-mandic)

# ------------------------------------------------------------------------------------------
# A VARIABLES ------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------
# vgl. https://stackoverflow.com/a/28938235
NC='\033[0m'
GREEN='\033[0;32m'
LIGHT_BLUE='\033[1;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'

LIBRARIES_DIR="./libraries"

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

version() {
    local file_path="$1"
    local version

    if [[ -f "$file_path" ]]; then
        version=$(head "$file_path" | grep -oE "[0-9]+\.[0-9]+\.[0-9]+")

        if [[ -n "$version" ]]; then
            echo "$version"
        fi
    fi
}

function label() {
    local file=$1
    local date=$(date)
    # Append current date and time (e.g Do 25 Mai 2023 14:07:51 CEST) to the file without overwriting it
    echo -e "\n\n# ./sample/generate_types.bash - Last created: $date" >> $file
}

alias quit="exit 1"

# ------------------------------------------------------------------------------------------
# B INFO -----------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------
info "Info: Shell and script environment"
echo "\$0: $0" # The filename of the current script
echo "\$\$: $$" # The process ID of the current shell
echo "\$SHELL: $SHELL" # The current shell

# ------------------------------------------------------------------------------------------
# C GUARD CLAUSES --------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------
# a Check if the script will be run in a shell other than sh
SH_LOCATION="$(which sh)"
if [ "$SHELL" = "$SH_LOCATION" ]; then
    error "\nError: This script is not compatible with the $SH_LOCATION shell. Exiting script ...\n"
    quit

# b Check if ./classes directory exists
elif [[ ! -d "classes" ]]; then
    error "\nError: There is no directory called ./classes"
    error "Error: npx cannout run later without the JavaScript source files (error TS6053)\n"
    quit

# c Check if there are even any JavaScript files in the ./classes directory
elif [[ -z $(find ./classes -name "*.js" 2>/dev/null) ]]; then
    error "\nError: There are no JavaScript files in the ./classes directory"
    error "Error: npx cannout run later without the JavaScript source files (error TS6053)\n"
    quit

# d Check if the root directory is capable of running npm and other Node.js commands
elif [[ ! -f package.json || ! -f package-lock.json ]]; then
    error "\nError: There is no package.json or package-lock.json file. They are later required for npm and npx"
    info "Info: Please run 'npm init' first and try again\n"
    quit
else
    # ------------------------------------------------------------------------------------------
    # D PROGRAM --------------------------------------------------------------------------------
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
        quit
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
        quit
    fi

    # --------------------------------------------- 002 ---------------------------------------------
    # --- d) Merge all type declaration files into one single index.d.ts file
    info "2. Create index.d.ts in @types ..."
    cat ./@types/*.d.ts > ./@types/index.d.ts
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
        quit
    fi

    # --------------------------------------------- 005 ---------------------------------------------
    # --- g) Install the type declaration files for other libraries
    info "5. Install and extract type declaration files for p5.js and matter.js ...\n"

    # matter.js
    if ! [[ -f "$LIBRARIES_DIR/matter.js" ]]; then
        npm --save-dev install @types/matter-js
    else
        FILE_PATH_MATTER_JS=$(find "$LIBRARIES_DIR" -name "matter.js" 2>/dev/null)
        VERSION_MATTER_JS=$(version "$FILE_PATH_MATTER_JS")

        if [[ -z "$VERSION_MATTER_JS" ]]; then
            npm --save-dev install @types/matter-js
        else
            npm --save-dev install @types/matter-js@"$VERSION_MATTER_JS"

            # Only if the latest version is not available yet
            if [ $? -ne 0 ]; then
                error "\nError: There was an error installing the type declarations for matter.js due to version $VERSION_MATTER_JS"
                warning "Warning: Installing the latest available version instead ..."
                npm --save-dev install @types/matter-js
            fi
        fi
    fi

    # p5.js
    if ! [[ -f "$LIBRARIES_DIR/p5.js" ]]; then
        npm --save-dev install @types/p5
    else
        FILE_PATH_P5_JS=$(find "$LIBRARIES_DIR" -name "p5.js" 2>/dev/null)
        VERSION_P5_JS=$(version "$FILE_PATH_P5_JS")

        if [[ -z "$VERSION_P5_JS" ]]; then
            npm --save-dev install @types/p5
        else
            npm --save-dev install @types/p5@"$VERSION_P5_JS"

            # Only if the latest version is not available yet
            if [ $? -ne 0 ]; then
                error "\Error: There was an error installing the type declarations for p5.js due to version $VERSION_P5_JS"
                warning "Warning: Installing the latest available version instead ..."
                npm --save-dev install @types/p5
            fi
        fi
    fi

    # Guard clause #3
    if ! [ -d "node_modules" ]; then
        warning "Warning: There is no node_modules folder and thus there will be no @types folder"
        warning "Warning: Please make sure that the folder is preserved during the script. Exiting script ...\n"
        quit
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
    success "\nSuccess: Installation was completed"
    echo -e "\n"
fi
