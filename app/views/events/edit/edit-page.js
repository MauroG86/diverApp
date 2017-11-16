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
var divesites;

var types = new observableArray.ObservableArray(["Tauchen", "Club", "Event"]);

function validateEvent() {
    if (newEvent.name === "" || newEvent.type === ""
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

    var divesitesDD = page.getViewById("divesitesDD");
    var itemSource = new valueList();

    divesites = eventsList.getAllDivesites();
    divesites.forEach(function(element) {
        itemSource.push({ value: element.id, display: element.name });
    });

    divesitesDD.items = itemSource;

    if (isNewEvent) {
        newEvent = {
            name: "",
            type: "",
            time: "",
            date: "",
            divesite: null,
            public: false,
            comment: "",
            participants: [],
            creator: eventsList.getProfileID()
        }
        pageData = new observableModule.fromObject({
            event: newEvent,
            types: types,
            divesites: divesites,
            cancelVisible: "collapse",
            isNewEvent: true
        });
    } else {
        event = page.navigationContext.event;

        newEvent = {
            id: event.id,
            name: event.name,
            type: event.type,
            time: event.time,
            date: event.date,
            divesite: event.divesite,
            public: event.public,
            comment: event.comment,
            participants: event.participants,
            creator: event.creator
        }

        pageData = new observableModule.fromObject({
            event: newEvent,
            types: types,
            selectedType: types.indexOf(event.type),
            divesites: divesites,
            selectedDivesite: event.divesite.id,
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
    newEvent.divesite = divesites[args.newIndex];
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
    eventsList.changeEventStatus(newEvent, "Ja");
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