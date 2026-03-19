import state from "./state";

var W = 200, H = 36, BOTTOM_BAR = 32;

function indicatorX() { return Math.floor((ui.width - W) / 2); }
function indicatorY() { return ui.height - H - BOTTOM_BAR; }

export function openIndicator() {
    if (state.indicatorWindow) return;
    state.enabled = true;
    var prevMode = null;
    state.indicatorWindow = ui.openWindow({
        classification: "vim-indicator",
        x: indicatorX(),
        y: indicatorY(),
        width: W,
        height: H,
        title: "-- NORMAL --",
        widgets: [
            {
                type: "label",
                name: "colonLabel",
                x: 2,
                y: 18,
                width: 8,
                height: 14,
                text: ":",
                isVisible: false
            },
            {
                type: "textbox",
                name: "cmdInput",
                x: 10,
                y: 16,
                width: W - 20,
                height: 16,
                text: "",
                maxLength: 256,
                isVisible: false,
                onChange: function (text) {
                    state.paletteText = text;
                }
            }
        ],
        onUpdate: function () {
            if (!state.enabled) return;
            var win = state.indicatorWindow;
            if (!win) return;
            var colonLabel = win.findWidget("colonLabel");
            var cmdInput = win.findWidget("cmdInput");

            if (state.mode === "command") {
                win.title = "-- COMMAND --";
                win.x = indicatorX();
                win.y = indicatorY();
                colonLabel.isVisible = true;
                cmdInput.isVisible = true;
                if (prevMode !== "command") {
                    cmdInput.text = "";
                    cmdInput.focus();
                    prevMode = "command";
                }
            } else {
                win.title = "-- NORMAL --";
                win.x = indicatorX();
                win.y = indicatorY();
                colonLabel.isVisible = false;
                cmdInput.isVisible = false;
                prevMode = "normal";
            }
        },
        onClose: function () {
            var wasCommand = state.mode === "command";
            state.mode = "normal";
            state.paletteText = "";
            state.indicatorWindow = null;
            if (wasCommand) {
                // Escape (or X) closed the window while in command mode — reopen in normal mode.
                context.setTimeout(openIndicator, 1);
            } else {
                state.enabled = false;
                context.setTimeout(function () {
                    if (state.captureWindow) state.captureWindow.close();
                }, 1);
            }
        }
    });
}
