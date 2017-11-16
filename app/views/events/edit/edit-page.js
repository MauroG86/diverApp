var frameModule = require("ui/frame");
var observableModule = require("data/observable")
var observableArray = require("data/observable-array");
var ModalPicker = require("nativescript-modal-datetimepicker").ModalDatetimepicker;
var dialogs = require("ui/dialogs");
var valueList = require("nativescript-drop-down").ValueList;

var page;
var event;
var eventsList;
var newEvent;
var pageData;
var picker = new ModalPicker();
var isNewEvent;
var divesiteItemSource;

var types = new observableArray.ObservableArray(["Tauchen", "Club", "Event"]);

function validateEvent() {
    if (newEvent.name === "" || newEvent.type === "" || newEvent.divesite === undefined
        || newEvent.time === "" || newEvent.date === "" || newEvent.comment === "") {
        return false;
    }
    return true;
}

exports.onNavigatingTo = function(args) {
    if (args.isBackNavigation) {
        return;
    }

    page = args.object;
    
    isNewEvent = page.navigationContext.newEvent;
    eventsList = page.navigationContext.eventsList;
    event = page.navigationContext.event;

    var divesitesDD = page.getViewById("divesitesDD");
    divesiteItemSource = new valueList();

    var selectedDivesite = 0;
    var allDiveSites = eventsList.getAllDivesites();
    divesiteItemSource.push({ value: null, display: "<Nichts ausgewählt>" });
    for (var i = 0; i < allDiveSites.length; i++) {
        divesiteItemSource.push({ value: allDiveSites[i].id, display: allDiveSites[i].name });
        if (!isNewEvent && event.divesite !== null && event.divesite.id === allDiveSites[i].id) {
            selectedDivesite = i + 1;        
        }    
    }

    divesitesDD.items = divesiteItemSource;

    if (isNewEvent) {
        newEvent = {
            id: 0,
            name: "",
            type: "",
            time: "",
            date: "",
            divesite: undefined,
            comment: "",
            participants: [],
            creator: eventsList.getProfileID(),
            canceled: false,
            canceledDate: null
        }
        pageData = new observableModule.fromObject({
            event: newEvent,
            types: types,
            cancelVisible: "collapse",
            isNewEvent: true
        });
    } else {
        newEvent = {
            id: event.id,
            name: event.name,
            type: event.type,
            time: event.time,
            date: event.date,
            divesite: event.divesite,
            comment: event.comment,
            participants: event.participants,
            creator: event.creator,
            canceled: event.canceled,
            canceledDate: event.canceledDate
        }

        pageData = new observableModule.fromObject({
            event: newEvent,
            types: types,
            selectedType: types.indexOf(event.type),
            selectedDivesite: selectedDivesite,
            cancelVisible: "visible",
            isNewEvent: false
        });  

    }

    page.bindingContext = pageData;
}

exports.typeChanged = function(args) {
    newEvent.type = types.getItem(args.newIndex);
}

exports.divesiteChanged = function(args) {
    newEvent.divesite = eventsList.getDiveSiteByID(divesiteItemSource.getValue(args.newIndex));
}

exports.discardChanges = function() {
    if (isNewEvent) {
        frameModule.topmost().goBack();
        return;      
    }
    navigationOptions = {
        moduleName: "views/events/details/details-page",
        context: { event: event, eventsList: eventsList },
        backstackVisible: false
    }
    frameModule.topmost().navigate(navigationOptions);
}

exports.saveChanges = function() {
    if (!validateEvent()) {
        dialogs.alert("Nicht alle erforderlichen Felder ausgefüllt.");
        return;
    }
    if (isNewEvent) {
        eventsList.add(newEvent);    
    } else {
        eventsList.update(newEvent);
    }
    navigationOptions = {
        moduleName: "views/events/details/details-page",
        context: { event: newEvent, eventsList: eventsList },
        backstackVisible: false
    }
    frameModule.topmost().navigate(navigationOptions);
}


exports.selectDate = function() {
    picker.pickDate({
        title: "Bitte Datum auswählen:",
        theme: "light",
        minDate: new Date(),
        startingDate: new Date()
    }).then((result) => {
        newEvent.date = result.day + "." + result.month + "." + result.year;
        var dateField = page.getViewById("dateField");
        dateField.text = newEvent.date;
    }).catch((error) => {
        console.log("Error: " + error);
    });
};

exports.selectTime = function() {
    picker.pickTime({})
        .then((result) => {
            newEvent.time = result.hour + ":" + result.minute;
            var timeField = page.getViewById("timeField");
            timeField.text = newEvent.time;
        })
        .catch((error) => {
            console.log("Error: " + error);
        });
};

exports.cancelEvent = function() {
    event.canceled = true;
    var date = new Date();
    var canceledDate = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
    event.canceledDate = canceledDate;
    eventsList.update(event);
    navigationOptions = {
        moduleName: "views/events/details/details-page",
        context: { event: event, eventsList: eventsList },
        backstackVisible: false
    }
    frameModule.topmost().navigate(navigationOptions);
}