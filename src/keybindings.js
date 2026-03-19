import state from "./state";
import { openPalette, closePalette, executeCommand } from "./commandPalette";

// h/j/k/l, gg, G, zz, r, R, +, - are all handled by the capture window buffer.
// Only shortcuts that can't be captured by a textbox live here.

export function registerKeybindings() {
    // Fallback for : in case the capture textbox doesn't catch Shift+;
    ui.registerShortcut({
        id: "vim.colon",
        text: "Vim: open command palette",
        bindings: ["SHIFT+;"],
        callback: function () {
            if (state.mode !== "normal") return;
            openPalette();
        }
    });

    ui.registerShortcut({
        id: "vim.enter",
        text: "Vim: execute command",
        bindings: ["RETURN"],
        callback: function () {
            if (state.mode !== "command") return;
            executeCommand(state.paletteText);
            closePalette();
        }
    });

    ui.registerShortcut({
        id: "vim.escape",
        text: "Vim: cancel command",
        bindings: ["ESCAPE"],
        callback: function () {
            if (state.mode === "command") {
                closePalette();
            }
        }
    });
}
