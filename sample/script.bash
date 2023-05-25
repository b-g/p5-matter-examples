#!/usr/bin/env bash

# Author: Ron Eros Mandic (@ron-mandic)
# Repository: b-g/p5-matter-examples
# Path: sample/script.bash
# Last reviewed: 2023-05-25 15:20 CEST (by @ron-mandic)

# Info: The script should be executed from the root directory of the project.
# Info: post-commit is not available in .git/hooks by default. It needs to be both verified and created manually.

# ------------------------------------------------------------------------------------------
# A VARIABLES ------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------
NC='\033[0m'
GREEN='\033[0;32m'
LIGHT_BLUE='\033[1;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'

GIT_HOOKS_DIR=".git/hooks"
FILE_EXTENSION_ORIGINAL="sample"
FILE_EXTENSION_CUSTOM="bash.sample"

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
    echo -e "\n\n# ./sample/script.bash - Last created: $date" >> $file
}

# ------------------------------------------------------------------------------------------
# B GUARD CLAUSES --------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------
if [ ! -f "./sample/pre-commit.$FILE_EXTENSION_CUSTOM" ] || [ ! -f "./sample/post-commit.$FILE_EXTENSION_CUSTOM" ]; then
    echo
    error "script.bash: The current directory does not contain the associated pre-commit.$FILE_EXTENSION_CUSTOM and / or post-commit.$FILE_EXTENSION_CUSTOM files."
    error "script.bash: Please refer to the README.md for more information. Exiting script ...\n"
    exit 1
fi

# ------------------------------------------------------------------------------------------
# C MAIN PROGRAM ---------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------
cd $GIT_HOOKS_DIR
echo "This custom script takes care of installing two custom git hooks pre-commit and post-commit for you."
echo -e "Please note that the script should always be executed from the root directory of the project.\n"

if [ -f "./pre-commit" ] && [ ! -f "./post-commit" ]; then
    rm pre-commit
    warning "Old pre-commit file removed."
elif [ ! -f "./pre-commit" ] && [ -f "./post-commit" ]; then
    rm post-commit
    warning "Old post-commit file removed."
elif [ ! -f "./pre-commit" ] && [ ! -f "./post-commit" ]; then
    warning "Neither pre-commit nor post-commit exist. First time installing, huh?"
elif [ -f "./pre-commit" ] && [ -f "./post-commit" ]; then
    rm pre-commit
    rm post-commit
    warning "Both pre-commit and post-commit will be overwritten."
fi

info "Creating new pre-commit and post-commit files ..."

cp ../../sample/*.$FILE_EXTENSION_CUSTOM .
for file in *.$FILE_EXTENSION_CUSTOM; do
    mv "$file" "${file%.$FILE_EXTENSION_CUSTOM}"
done

chmod +x pre-commit
chmod +x post-commit

label pre-commit
label post-commit

success "\nscript.bash: Git hooks installed successfully! \n"

cd ../../

