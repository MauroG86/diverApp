var frameModule = require("ui/frame");
var observableModule = require("data/observable")
var observableArray = require("data/observable-array");

var page;
var event;
var eventsList;

var pageData;

var status = new observableArray.ObservableArray(["Ja", "Nein", "Vielleicht"]);

exports.onNavigatingTo = function(args) {
    if (args.isBackNavigation) {
        return;
    }

    page = args.object;
    
    event = page.navigationContext.event;
    eventsList = page.navigationContext.eventsList;

    if (!eventsList.isCreator(event) || event.canceled) {
        editButtonVisible = "collapse";
    } else {
        editButtonVisible = "visible";
    }


    var statusIndex = status.indexOf(eventsList.getEventStatus(event));
    pageData = new observableModule.fromObject({
        event: event,
        editButtonVisible: editButtonVisible,
        status: status,
        selectedStatus: statusIndex === -1 ? null : statusIndex,
        divebuddiesList: eventsList.getParticipants(event)
    });

    page.bindingContext = pageData;
}

exports.goBack = function() {
    frameModule.topmost().goBack();
}

exports.editEvent = function() {
    navigationOptions = {
        moduleName: "views/events/edit/edit-page",
        context: { newEvent: false, event: event, eventsList: eventsList },
        backstackVisible: false
    }
    frameModule.topmost().navigate(navigationOptions);
}

exports.viewDivesite = function(args) {
    frameModule.topmost().navigate("views/divesite/divesite-page");
};

exports.viewDivebuddy = function(args) {
    frameModule.topmost().navigate("views/divebuddies/divebuddies-page");
};

exports.statusChanged = function(args) {
    eventsList.changeEventStatus(event, status.getItem(args.newIndex));
}