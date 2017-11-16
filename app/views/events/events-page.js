var frameModule = require("ui/frame");
var observableModule = require("data/observable")
var observableArray = require("data/observable-array").ObservableArray;

var EventsViewModel = require("./events-view-model");

var page;
var currentEvent;

var eventsList = new EventsViewModel([]);

var publicEvents;
var myEvents;

var pageData;

/* ***********************************************************
* Use the "onNavigatingTo" handler to initialize the page binding context.
*************************************************************/
function onNavigatingTo(args) {
    eventsList.empty();
    publicEvents = new observableArray()
    myEvents = new observableArray()

    eventsList.load();

    eventsList.forEach(function(element) {        
        if (element.public) {
            publicEvents.push(element);
        } else {
            //for now
            myEvents.push(element);
        }
    });

    pageData = new observableModule.fromObject({
        publicEvents: publicEvents,
        myEvents: myEvents
    });

    page = args.object;
    page.bindingContext = pageData;
}

/* ***********************************************************
 * According to guidelines, if you have a drawer on your page, you should always
 * have a button that opens it. Get a reference to the RadSideDrawer view and
 * use the showDrawer() function to open the app drawer section.
 *************************************************************/
function onDrawerButtonTap(args) {
    const sideDrawer = frameModule.topmost().getViewById("sideDrawer");
    sideDrawer.showDrawer();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;


exports.viewDetails = function(args) {
    currentEvent = args.view.bindingContext;
    navigationOptions = {
        moduleName: "views/events/details/details-page",
        context: { event: currentEvent, eventsList: eventsList },
        backstackVisible: false
    }
    frameModule.topmost().navigate(navigationOptions);
};

exports.viewDivesite = function(args) {
  frameModule.topmost().navigate("views/divesite/divesite-page");
};

exports.newEvent = function() {
    navigationOptions = {
        moduleName: "views/events/edit/edit-page",
        context: { newEvent: true, eventsList: eventsList },
        backstackVisible: false
    }
    frameModule.topmost().navigate(navigationOptions);  
}