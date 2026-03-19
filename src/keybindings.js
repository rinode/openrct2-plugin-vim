import state from "./state";
import { openPalette, closePalette, executeCommand } from "./commandPalette";

export function registerKeybindings() {
    ui.registerShortcut({
        id: "vim.colon",
        text: "Vim: open command palette",
        bindings: ["SHIFT+;"],
        callback: function () {
            if (!state.enabled) return;
            if (state.mode !== "normal") return;
            if (state.captureWindow) {
                state.captureGuard = true;
                state.captureWindow.findWidget("captureInput").text = "";
                state.captureGuard = false;
            }
            openPalette();
        }
    });

    ui.registerShortcut({
        id: "vim.enter",
        text: "Vim: execute command",
        bindings: ["RETURN"],
        callback: function () {
            if (!state.enabled) return;
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
            if (!state.enabled) return;
            if (state.mode !== "command") return;
            if (state.indicatorWindow) {
                state.indicatorWindow.close();
            }
        }
    });
}
