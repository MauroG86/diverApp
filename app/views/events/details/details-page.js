var frameModule = require("ui/frame");
var observableModule = require("data/observable")

var page;
var event;
var eventsList;

var pageData;

exports.onNavigatingTo = function(args) {
    if (args.isBackNavigation) {
        return;
    }

    page = args.object;
    
    event = page.navigationContext.event;
    eventsList = page.navigationContext.eventsList;

    if (event.public || event.canceled) {
        editButtonVisible = "collapse";
    } else {
        editButtonVisible = "visible";
    }

    pageData = new observableModule.fromObject({
        event: event,
        editButtonVisible: editButtonVisible
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
