import state from "./state";

var W = 200, H = 36, BOTTOM_BAR = 32;

function indicatorX() { return Math.floor((ui.width - W) / 2); }
function indicatorY() { return ui.height - H - BOTTOM_BAR; }

export function openIndicator() {
    if (state.indicatorWindow) return;
    state.enabled = true;
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
                x: 4,
                y: 20,
                width: 8,
                height: 14,
                text: ":",
                isVisible: false
            },
            {
                type: "label",
                name: "cmdDisplay",
                x: 18,
                y: 20,
                width: W - 20,
                height: 14,
                text: "",
                isVisible: false
            }
        ],
        onUpdate: function () {
            if (!state.enabled) return;
            var win = state.indicatorWindow;
            if (!win) return;
            var colonLabel = win.findWidget("colonLabel");
            var cmdDisplay = win.findWidget("cmdDisplay");

            if (state.mode === "command") {
                win.title = "-- COMMAND --";
                colonLabel.isVisible = true;
                cmdDisplay.isVisible = true;
                cmdDisplay.text = state.paletteText;
            } else {
                win.title = "-- NORMAL --";
                colonLabel.isVisible = false;
                cmdDisplay.isVisible = false;
            }
            win.x = indicatorX();
            win.y = indicatorY();
        },
        onClose: function () {
            var wasCommand = state.mode === "command";
            state.mode = "normal";
            state.paletteText = "";
            state.indicatorWindow = null;
            if (wasCommand) {
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
