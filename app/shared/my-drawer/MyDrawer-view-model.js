const observableModule = require("data/observable");

/* ***********************************************************
 * Keep data that is displayed in your app drawer in the MyDrawer custom component view model.
 *************************************************************/
function MyDrawerViewModel(selectedPage) {
    const viewModel = observableModule.fromObject({
        /* ***********************************************************
         * Use the MyDrawer view model to initialize the properties data values.
         * The navigationItems property is initialized here and is data bound to <ListView> in the MyDrawer view file.
         * Add, remove or edit navigationItems to change what is displayed in the app drawer list.
         *************************************************************/
        navigationItems: [{
                title: "Startseite",
                name: "startseite",
                route: "views/startseite/startseite-page",
                icon: "\uf015",
                isSelected: selectedPage === "Startseite"
            },
            {
                title: "Dive Sites",
                name: "divesite",
                route: "views/divesite/divesite-page",
                icon: "\uf1ea",
                isSelected: selectedPage === "Divesite"
            },
            {
                title: "Dive Buddies",
                name: "divebuddies",
                route: "views/divebuddies/divebuddies-page",
                icon: "\uf002",
                isSelected: selectedPage === "Divebuddies"
            },
            {
                title: "Dive Logs",
                name: "divelogs",
                route: "views/divelogs/divelogs-page",
                icon: "\uf005",
                isSelected: selectedPage === "Divelogs"
            },
            {
                title: "Events",
                name: "events",
                route: "views/events/events-page",
                icon: "\uf005",
                isSelected: selectedPage === "Events"
            },
            {
                title: "Equipment",
                name: "equipment",
                route: "views/equipment/equipment-page",
                icon: "\uf005",
                isSelected: selectedPage === "Equipment"
            },
            {
                title: "Certification",
                name: "certification",
                route: "views/certification/certification-page",
                icon: "\uf005",
                isSelected: selectedPage === "Certification"
            },
            {
                title: "Flora and Fauna",
                name: "florafauna",
                route: "views/florafauna/florafauna-page",
                icon: "\uf005",
                isSelected: selectedPage === "Flora and Fauna"
            },
            {
                title: "Einstellungen",
                name: "einstellungen",
                route: "views/einstellungen/einstellungen-page",
                icon: "\uf013",
                isSelected: selectedPage === "Einstellungen"
            }
        ]
    });

    return viewModel;
}

module.exports = MyDrawerViewModel;
