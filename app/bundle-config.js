if (global.TNS_WEBPACK) {
    // registers tns-core-modules UI framework modules
    require("bundle-entry-points");

    // register application modules
    global.registerModule("nativescript-pro-ui/sidedrawer",
        () => require("../node_modules/nativescript-pro-ui/sidedrawer"));

    global.registerModule("shared/my-drawer/MyDrawer", () => require("./shared/my-drawer/MyDrawer"));
    global.registerModule("startseite/startseite-page", () => require("./startseite/startseite"));
    global.registerModule("divesite/divesite-divesite", () => require("./divesite/divesite-page"));
    global.registerModule("divelogs/divelogs-page", () => require("./divelogs/divelogs-page"));
    global.registerModule("divebuddies/divebuddies-page", () => require("./divebuddies/divebuddies-page"));
    global.registerModule("events/events-page", () => require("./events/events-page"));
    global.registerModule("equipment/equipment-page", () => require("./equipment/equipment-page"));
    global.registerModule("certification/certification-page", () => require("./certification/certification-page"));
    global.registerModule("florafauna/florafauna-page", () => require("./florafauna/florafauna-page"));
    global.registerModule("einstellungen/einstellungen-page", () => require("./einstellungen/einstellungen-page"));
}
