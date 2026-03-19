import state from "./state";

export function openPalette() {
    if (!state.enabled) return;
    if (state.mode === "command") return;
    state.paletteText = "";
    state.mode = "command";
}

export function closePalette() {
    if (!state.enabled) return;
    state.mode = "normal";
    state.paletteText = "";
    if (state.indicatorWindow) {
        state.indicatorWindow.findWidget("cmdInput").text = "";
    }
}

export function executeCommand(raw) {
    var input = (raw || "").trim();
    if (!input) return;
    var parts = input.split(/\s+/);
    var cmdRaw = parts[0];
    var force = cmdRaw[cmdRaw.length - 1] === "!";
    var cmd = (force ? cmdRaw.slice(0, -1) : cmdRaw).toLowerCase();

    if (cmd === "pause") {
        context.paused = true;
    } else if (cmd === "unpause") {
        context.paused = false;
    } else if (cmd === "goto" && parts.length >= 3) {
        var x = parseInt(parts[1], 10);
        var y = parseInt(parts[2], 10);
        if (!isNaN(x) && !isNaN(y)) {
            ui.mainViewport.scrollTo({ x: x, y: y });
        } else {
            ui.showError("openrct2-plugin-vim", "Usage: goto <x> <y>");
        }
    } else if (cmd === "wq") {
        context.executeAction("loadorquit", { mode: 0, savePromptMode: 1 });
    } else if (cmd === "q" || cmd === "qa") {
        context.executeAction("loadorquit", { mode: 0, savePromptMode: 1 });
    } else if (cmd === "help") {
        ui.showError("openrct2-plugin-vim help", "Commands: pause | unpause | goto <x> <y> | wq[!] | q[!] | qa[!] | help");
    } else {
        ui.showError("openrct2-plugin-vim", "Unknown command: " + input);
    }
}
