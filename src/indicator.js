import state from "./state";

var NORMAL_W = 200, CMD_W = 300, H = 36, BOTTOM_BAR = 32;

function normalX() { return Math.floor((ui.width - NORMAL_W) / 2); }
function cmdX() { return Math.floor((ui.width - CMD_W) / 2); }
function indicatorY() { return ui.height - H - BOTTOM_BAR; }

export function openIndicator() {
    if (state.indicatorWindow) return;
    state.enabled = true;
    state.indicatorWindow = ui.openWindow({
        classification: "vim-indicator",
        x: normalX(),
        y: indicatorY(),
        width: NORMAL_W,
        height: H,
        title: "",
        widgets: [
            {
                type: "label",
                name: "modeLabel",
                x: 4,
                y: 2,
                width: NORMAL_W - 8,
                height: 14,
                text: "-- NORMAL --"
            },
            {
                type: "label",
                name: "colonLabel",
                x: 4,
                y: 20,
                width: 12,
                height: 14,
                text: ":",
                isVisible: false
            },
            {
                type: "label",
                name: "cmdInput",
                x: 18,
                y: 20,
                width: CMD_W - 22,
                height: 14,
                text: "",
                isVisible: false
            }
        ],
        onUpdate: function () {
            if (!state.enabled) return;
            var win = state.indicatorWindow;
            if (!win) return;
            var modeLabel = win.findWidget("modeLabel");
            var colonLabel = win.findWidget("colonLabel");
            var cmdInput = win.findWidget("cmdInput");

            if (state.mode === "command") {
                win.x = cmdX();
                win.y = indicatorY();
                win.width = CMD_W;
                modeLabel.isVisible = false;
                colonLabel.isVisible = true;
                cmdInput.isVisible = true;
                cmdInput.text = state.paletteText;
            } else {
                win.x = normalX();
                win.y = indicatorY();
                win.width = NORMAL_W;
                modeLabel.isVisible = true;
                modeLabel.text = "-- NORMAL --";
                colonLabel.isVisible = false;
                cmdInput.isVisible = false;
            }
        },
        onClose: function () {
            state.enabled = false;
            state.mode = "normal";
            state.paletteText = "";
            state.indicatorWindow = null;
            context.setTimeout(function () {
                if (state.captureWindow) {
                    state.captureWindow.close();
                }
            }, 1);
        }
    });
}

export function updateIndicator() {}
