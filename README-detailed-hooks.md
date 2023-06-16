# Git Hooks

## Scope

- `.git/hooks/pre-commit`
- `.git/hooks/post-commit`

## Features

### pre-commit

- [x] Shell environment scan
- [x] Single-file generation for custom classes
- [x] Content-aware shell execution
- [x] User-aware prompts before deleting large files
- [x] Version-aware installation of declaration files for libraries
- [x] Tested compatibility with shell environments
  - [] sh (macOS)
  - [x] bash (macOS)
  - [x] zsh (macOS)
  - [] Git Bash (Windows)
- [x] Tested compatibility with operating systems
  - [] Windows
  - [] Linux
  - [x] macOS

### post-commit

- [x] Shell environment scan
- [x] Tested compatibility with shell environments
  - [] sh (macOS)
  - [x] bash (macOS)
  - [x] zsh (macOS)
  - [] Git Bash (Windows)
- [x] Tested compatibility with operating systems
  - [] Windows
  - [] Linux
  - [x] macOS

## Installation

Please keep in mind that both the existing `pre-commit` and `post-commit` hooks are overwritten once you run `npm run hooks` from the root of your project. If you have already created your own hooks, please make sure to back them up before running the following command.

```bash
$ npm run hooks
```

## Usage

### CLI

Please make sure that you have added all files that do not belong to the class files manually via the command `git add .`. Otherwise, these files will not be added to the commit.

```bash
$ git commit -am "<message>"
```

### Source control (VSCode)

You can also just use the source control tab in VSCode to commit your changes. Enter your commit message and press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to commit. Compatibility may currently vary widely among operating systems.

### GUI

You can also just use a GUI like [GitHub Desktop](https://desktop.github.com) to commit your changes. Enter your commit message and press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to commit. Compatibility may currently vary widely among operating systems.

## Sources

[8.3 Customizing Git - Git Hooks (git-scm.com)](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
