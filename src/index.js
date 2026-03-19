/// <reference path="C:/Program Files/OpenRCT2/bin/openrct2.d.ts" />

import { openIndicator } from "./indicator";
import { openCapture } from "./capture";
import { registerKeybindings } from "./keybindings";

function main() {
    openIndicator();
    openCapture();
    registerKeybindings();
    ui.registerMenuItem("Vim Keys", function () {
        openIndicator();
        openCapture();
    });
    console.log("[openrct2-plugin-vim] loaded");
}

registerPlugin({
    name: "openrct2-plugin-vim",
    version: "0.2.0",
    licence: "MIT",
    authors: [""],
    type: "local",
    main: main
});
