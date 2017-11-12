if (global.TNS_WEBPACK) {
    // registers tns-core-modules UI framework modules
    require("bundle-entry-points");

    // register application modules
    global.registerModule("nativescript-pro-ui/sidedrawer",
        () => require("../node_modules/nativescript-pro-ui/sidedrawer"));

    global.registerModule("shared/my-drawer/MyDrawer", () => require("./shared/my-drawer/MyDrawer"));
    global.registerModule("views/startseite/startseite-page", () => require("./startseite/startseite"));
    global.registerModule("views/divesite/divesite-divesite", () => require("./divesite/divesite-page"));
    global.registerModule("views/divelogs/divelogs-page", () => require("./divelogs/divelogs-page"));
    global.registerModule("views/divebuddies/divebuddies-page", () => require("./divebuddies/divebuddies-page"));
    global.registerModule("views/events/events-page", () => require("./events/events-page"));
    global.registerModule("views/equipment/equipment-page", () => require("./equipment/equipment-page"));
    global.registerModule("views/certification/certification-page", () => require("./certification/certification-page"));
    global.registerModule("views/florafauna/florafauna-page", () => require("./florafauna/florafauna-page"));
    global.registerModule("views/einstellungen/einstellungen-page", () => require("./einstellungen/einstellungen-page"));
}
