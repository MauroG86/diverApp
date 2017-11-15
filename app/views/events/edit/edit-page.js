var frameModule = require("ui/frame");
var observableModule = require("data/observable")
var observableArray = require("data/observable-array");
var ModalPicker = require("nativescript-modal-datetimepicker").ModalDatetimepicker;
var dialogs = require("ui/dialogs");

var page;
var event;
var eventsList;
var newEvent;
var pageData;
var picker = new ModalPicker();
var isNewEvent;
var types;
var divesites;

function validateEvent() {
    if (newEvent.name === "" || newEvent.type === ""
        || newEvent.time === "" || newEvent.date === ""
        || newEvent.divesite == "") {
        return false;
    }
    return true;
}

exports.onNavigatingTo = function(args) {
    if (args.isBackNavigation) {
        return;
    }

    types = new observableArray.ObservableArray();
    types.push("Tauchen");
    types.push("Club");
    types.push("Event");

    divesites = new observableArray.ObservableArray();
    divesites.push("Streitköpfle");
    divesites.push("Baggersee Buxtehude");

    page = args.object;
    
    isNewEvent = page.navigationContext.newEvent;
    eventsList = page.navigationContext.eventsList;

    if (isNewEvent) {
        newEvent = {
            name: "",
            type: "",
            time: "",
            date: "",
            divesite: "",
            public: false,
            comment: ""
        }
        pageData = new observableModule.fromObject({
            event: newEvent,
            types: types,
            divesites: divesites,
            deleteVisible: "collapse"
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
            comment: event.comment
        }

        pageData = new observableModule.fromObject({
            event: newEvent,
            types: types,
            selectedType: types.indexOf(event.type),
            divesites: divesites,
            selectedDivesite: types.indexOf(event.divesite),
            deleteVisible: "visible"
        });  
    }

    page.bindingContext = pageData;
}

exports.typeChanged = function(args) {
    newEvent.type = types.getItem(args.newIndex);
}

exports.divesiteChanged = function(args) {
    newEvent.divesite = divesites.getItem(args.newIndex); 
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
        theme: "light"
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

exports.deleteEvent = function() {
    eventsList.delete(event);
    navigationOptions = {
        moduleName: "views/events/events-page",
        backstackVisible: false
    }
    frameModule.topmost().navigate(navigationOptions);
}