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

    var editButtonVisible;
    if (!eventsList.isCreator(event) || event.canceled) {
        editButtonVisible = "collapse";
    } else {
        editButtonVisible = "visible";
    }

    var deleteButtonVisible;
    if (eventsList.isCreator(event) && event.canceled) {
        deleteButtonVisible = "visible";
    } else {
        deleteButtonVisible = "collapse";
    }

    var statusIndex = status.indexOf(eventsList.getEventStatus(event));
    pageData = new observableModule.fromObject({
        event: event,
        editButtonVisible: editButtonVisible,
        deleteButtonVisible: deleteButtonVisible,
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
    console.log("Go to divesite " + event.divesite.id +" [" + event.divesite.name + "]");
    navigationOptions = {
        moduleName: "views/divesite/divesite-page",
        context: { divesite: event.divesite.id  }
    }
    frameModule.topmost().navigate(navigationOptions);
};

exports.viewDivebuddy = function(args) {
    var divebuddy = args.view.bindingContext;
    console.log("Go to divebuddy " + divebuddy.id +" [" + divebuddy.name + "]");
    navigationOptions = {
        moduleName: "views/divebuddies/divebuddies-page",
        context: { divebuddy: divebuddy }
    }
    frameModule.topmost().navigate(navigationOptions);
};

exports.statusChanged = function(args) {
    eventsList.changeEventStatus(event, status.getItem(args.newIndex));
}

exports.deleteEvent = function() {
    eventsList.delete(event);
    frameModule.topmost().goBack();
}