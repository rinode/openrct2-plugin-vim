import state from "./state";
import { openPalette } from "./commandPalette";

var STEP = 128;

export function openCapture() {
    if (state.captureWindow) return;
    state.captureGuard = false;
    var focusTick = 2;
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
                    if (!state.enabled) return;
                    if (state.captureGuard) return;
                    processBuffer(text);
                }
            }
        ],
        onUpdate: function () {
            if (!state.enabled) return;
            if (!state.captureWindow) return;
            if (state.mode === "command") {
                state.captureWindow.findWidget("captureInput").focus();
            } else {
                focusTick++;
                if (focusTick >= 3) {
                    focusTick = 0;
                    state.captureWindow.findWidget("captureInput").focus();
                }
            }
        },
        onClose: function () {
            state.captureWindow = null;
            if (state.enabled) {
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

function processBuffer(text) {
    if (state.mode === "command") {
        state.paletteText = text;
        return;
    }
    if (!text) return;
    if (/^\d+$/.test(text)) return;

    var match = text.match(/^(\d*)(.+)$/);
    if (!match) return;

    var count = match[1] ? Math.max(1, parseInt(match[1], 10)) : 1;
    var cmd = match[2];

    if (cmd === "h") {
        scrollByScreen(1, 0, count); clearBuffer();
    } else if (cmd === "j") {
        scrollByScreen(0, 1, count); clearBuffer();
    } else if (cmd === "k") {
        scrollByScreen(0, -1, count); clearBuffer();
    } else if (cmd === "l") {
        scrollByScreen(-1, 0, count); clearBuffer();
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
        clearBuffer();
        openPalette();
    } else if (cmd === "g") {
        // wait for gg
    } else if (cmd === "gg") {
        jumpToStart(); clearBuffer();
    } else if (cmd === "z") {
        // wait for zz
    } else if (cmd === "zz") {
        centerMap(); clearBuffer();
    } else {
        clearBuffer();
    }
}

function scrollByScreen(sdx, sdy, count) {
    var r = ui.mainViewport.rotation;
    var dx, dy;
    switch (r) {
        case 1: dx = -sdy; dy =  sdx; break;
        case 2: dx = -sdx; dy = -sdy; break;
        case 3: dx =  sdy; dy = -sdx; break;
        default: dx =  sdx; dy =  sdy; break;
    }
    scrollBy(dx * STEP * count, dy * STEP * count);
}

function scrollBy(dx, dy) {
    var p = ui.mainViewport.getCentrePosition();
    ui.mainViewport.scrollTo({ x: p.x + dx, y: p.y + dy, z: 0 });
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
