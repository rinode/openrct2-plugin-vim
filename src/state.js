var state = {
    mode: "normal",         // "normal" | "command"
    indicatorWindow: null,  // Window handle for mode indicator
    paletteWindow: null,    // Window handle for command palette
    paletteText: "",        // Tracks textbox content while palette is open
    captureWindow: null,    // Off-screen textbox window for normal mode input
    captureGuard: false     // Prevents onChange re-entry when clearing the buffer
};

export default state;
