# openrct2-plugin-vim

Adds Vim-style modal keybindings to OpenRCT2.

## How it works

In **Normal mode**, an off-screen hidden window with a focused textbox captures all keypresses. This allows the full Vim motion language: count prefixes, multi-key sequences, and anything else that can be expressed as a character stream.

In **Command mode**, the mode indicator bar stretches to full width and transforms into a `:` command input — no new window is spawned.

## Normal mode

### Navigation

| Key | Action |
|---|---|
| `h` | Scroll left |
| `j` | Scroll down |
| `k` | Scroll up |
| `l` | Scroll right |
| `[count]h/j/k/l` | Scroll N tiles (e.g. `5j` scrolls 5 tiles down) |
| `gg` | Jump to map start (0, 0) |
| `G` | Jump to map end |
| `zz` | Jump to map centre |

### Viewport

| Key | Action |
|---|---|
| `r` | Rotate viewport left |
| `R` | Rotate viewport right |
| `+` | Zoom in |
| `-` | Zoom out |

### Mode switching

| Key | Action |
|---|---|
| `:` | Enter Command mode |

## Command mode

Press `:` to open the command palette. Type a command and press `ENTER` or click **Execute**. Press `ESCAPE` to cancel.

| Command | Action |
|---|---|
| `:pause` | Pause the game |
| `:unpause` | Unpause the game |
| `:goto <x> <y>` | Jump viewport to world coordinates |
| `:wq` | Save and quit (opens save dialog) |
| `:q` / `:qa` | Quit (opens save dialog) |
| `:help` | Show command list in-game |

Commands support a `!` suffix (e.g. `:q!`) for force variants.

## Installation

1. Run `npm install`
2. Confirm the OpenRCT2 path in `package.json` (default: `C:/Users/Marino/Documents/OpenRCT2`)
3. Run `npm run build`

The plugin is copied automatically to your OpenRCT2 plugin directory on each build.

## Development

```
npm run build        # build once
npm run watch build  # rebuild on file change
```

Source files are in `src/`. Hot-reloading works if `enable_hot_reloading = true` is set in OpenRCT2's `config.ini`.

## Toggling the plugin

Close the mode indicator window (click its X button) to disable the plugin entirely. This also shuts down the off-screen capture window so normal keyboard behaviour is restored.

To re-enable, open the **Map** (or top toolbar) menu → **Vim Keys**.

## Known limitations

- The normal mode capture window aggressively holds keyboard focus, which will conflict with native game rename dialogs and similar text inputs while active.
- The `SHIFT+;` shortcut for `:` is registered as a fallback in case the capture textbox does not intercept it first.
- `:q!` / `:qa!` cannot bypass the native save dialog — the OpenRCT2 plugin API does not expose a force-quit without prompt.
