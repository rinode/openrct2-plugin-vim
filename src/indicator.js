import state from "./state";
import { closeCapture } from "./capture";

var NORMAL_W = 200, H = 36, BOTTOM_BAR = 32;

function normalX() { return Math.floor((ui.width - NORMAL_W) / 2); }
function indicatorY() { return ui.height - H - BOTTOM_BAR; }

export function openIndicator() {
    if (state.indicatorWindow) return;
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
                type: "textbox",
                name: "cmdInput",
                x: 18,
                y: 18,
                width: 100, // resized dynamically in onUpdate
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
            var win = state.indicatorWindow;
            if (!win) return;
            var modeLabel = win.findWidget("modeLabel");
            var colonLabel = win.findWidget("colonLabel");
            var cmdInput = win.findWidget("cmdInput");

            if (state.mode === "command") {
                win.x = 0;
                win.y = indicatorY();
                win.width = ui.width;
                modeLabel.isVisible = false;
                colonLabel.isVisible = true;
                cmdInput.isVisible = true;
                cmdInput.width = ui.width - 22;
                cmdInput.focus();
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
            state.indicatorWindow = null;
            state.mode = "normal";
            state.paletteText = "";
            closeCapture();
        }
    });
}

// Kept for compatibility — onUpdate now handles all visual state
export function updateIndicator() {}
