import state from "./state";
import { openPalette } from "./commandPalette";

// 4 tiles × 32 world units per tile
var STEP = 128;

export function openCapture() {
    if (state.captureWindow) return;
    state.captureGuard = false;
    state.captureWindow = ui.openWindow({
        classification: "vim-capture",
        x: -500,
        y: -500,
        width: 100,
        height: 40,
        title: "",
        widgets: [
            {
                type: "textbox",
                name: "captureInput",
                x: 2,
                y: 18,
                width: 96,
                height: 16,
                text: "",
                maxLength: 32,
                onChange: function (text) {
                    if (state.captureGuard) return;
                    processBuffer(text);
                }
            }
        ],
        onUpdate: function () {
            if (state.captureWindow && state.mode === "normal") {
                state.captureWindow.findWidget("captureInput").focus();
            }
        },
        onClose: function () {
            state.captureWindow = null;
            // Only reopen if the indicator is still alive — that means ESCAPE
            // closed this window, not the user toggling off the plugin.
            if (state.mode === "normal" && state.indicatorWindow) {
                context.setTimeout(openCapture, 1);
            }
        }
    });
}

export function closeCapture() {
    if (state.captureWindow) {
        state.captureWindow.close();
    }
}

function clearBuffer() {
    if (!state.captureWindow) return;
    state.captureGuard = true;
    state.captureWindow.findWidget("captureInput").text = "";
    state.captureGuard = false;
}

// Grammar: [count] command
// count  = [1-9][0-9]*
// Single-char: h j k l G r R + -
// Multi-char:  gg  zz
// Mode switch: :
function processBuffer(text) {
    if (!text) return;

    // Split into optional leading digits and everything after
    var match = text.match(/^(\d*)(.+)$/);
    if (!match) return; // only digits so far — wait

    var count = match[1] ? Math.max(1, parseInt(match[1], 10)) : 1;
    var cmd = match[2];

    if (cmd === "h") {
        scrollBy(-STEP * count, 0); clearBuffer();

    } else if (cmd === "j") {
        scrollBy(0, STEP * count); clearBuffer();

    } else if (cmd === "k") {
        scrollBy(0, -STEP * count); clearBuffer();

    } else if (cmd === "l") {
        scrollBy(STEP * count, 0); clearBuffer();

    } else if (cmd === "G") {
        jumpToEnd(); clearBuffer();

    } else if (cmd === "r") {
        rotateViewport(1); clearBuffer();

    } else if (cmd === "R") {
        rotateViewport(-1); clearBuffer();

    } else if (cmd === "+") {
        zoomViewport(-1); clearBuffer();

    } else if (cmd === "-") {
        zoomViewport(1); clearBuffer();

    } else if (cmd === ":") {
        // Fallback: textbox may capture Shift+; before the shortcut fires
        clearBuffer();
        openPalette();

    } else if (cmd === "g") {
        // Incomplete — wait for second g

    } else if (cmd === "gg") {
        jumpToStart(); clearBuffer();

    } else if (cmd === "z") {
        // Incomplete — wait for second z

    } else if (cmd === "zz") {
        centerMap(); clearBuffer();

    } else {
        // Unrecognised sequence — discard
        clearBuffer();
    }
}

function scrollBy(dx, dy) {
    var p = ui.mainViewport.getCentrePosition();
    ui.mainViewport.scrollTo({ x: p.x + dx, y: p.y + dy });
}

function jumpToStart() {
    ui.mainViewport.scrollTo({ x: 0, y: 0 });
}

function jumpToEnd() {
    var size = map.size;
    ui.mainViewport.scrollTo({ x: size.x * 32, y: size.y * 32 });
}

function centerMap() {
    var size = map.size;
    ui.mainViewport.scrollTo({
        x: Math.floor((size.x * 32) / 2),
        y: Math.floor((size.y * 32) / 2)
    });
}

function rotateViewport(dir) {
    ui.mainViewport.rotation = ((ui.mainViewport.rotation + dir) % 4 + 4) % 4;
}

function zoomViewport(dir) {
    ui.mainViewport.zoom = Math.max(0, Math.min(3, ui.mainViewport.zoom + dir));
}
