var observableArray = require("data/observable-array").ObservableArray;
var appSettings = require("application-settings");
var frameModule = require("ui/frame");

var data = require("./static_data")
var events_data;

function getEventsData() {
  //try to get events per REST later
  return JSON.parse(appSettings.getString("events", "[]"));;
}

function EventsViewModel(items) {

    var viewModel = new observableArray(items);

    viewModel.load = function() {

      events_data = getEventsData();
      if (events_data.length === 0) {
        //fill with static data for now
        events_data = data.events_data;
      }

      events_data.forEach(function(element) {
        var date = new Date(element.time + " UTC");
        var day = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
        
        var canceledDate = null;
        if (element.canceled) {
          var str = element.canceledDate.split("-");
          canceledDate = str[2] + "." + str[1] + "." + str[0];
        }

        viewModel.push({
          id: element.id,
          name: element.name,
          divesite: viewModel.getDiveSiteByID(element.divesite),
          type: element.type,
          date: day,
          time: date.toLocaleTimeString().substring(0, 5),
          comment: element.comment,
          canceled: element.canceled,
          canceledDate: canceledDate,
          participants: element.participants,
          creator: element.creator
        });
      });
    };

    viewModel.empty = function() {
        while (viewModel.length) {
            viewModel.pop();
        }
    };

    viewModel.update = function(event) {
      for (var i = 0; i < viewModel.length; i++) {
        if (viewModel.getItem(i).id === event.id) {
          viewModel.setItem(i, event);
          break;
        }
      };

      for (var i = 0; i < events_data.length; i++) {
        if (events_data[i].id === event.id) {
          events_data[i] = createEventData(event);
          break;
        }
      }
      appSettings.setString("events", JSON.stringify(events_data));
    }

    viewModel.add = function(event) {
      viewModel.changeEventStatus(event, "Ja");
      viewModel.push(event);
      events_data.push(createEventData(event));
      appSettings.setString("events", JSON.stringify(events_data));
    }

    viewModel.delete = function(event) {
      for (var i = 0; i < viewModel.length; i++) {
        if (viewModel.getItem(i).id === event.id) {
          viewModel.splice(i, 1);
          break;
        }
      }

      for (var i = 0; i < events_data.length; i++) {
        if (events_data[i].id === event.id) {
          events_data.splice(i, 1);
          break;
        }
      }
      appSettings.setString("events", JSON.stringify(events_data));
    }

    viewModel.getParticipants = function(event) {
      var participants = [];
      event.participants.forEach(function(element) {
        var divebuddy = getDiveBuddyByID(element.id);
        if (divebuddy !== null) {
          participants.push({id: element.id, name: divebuddy.name, status: element.status});
        }
      });
      return participants;
    }

    viewModel.getAllDivesites = function() {
      return data.divesites_data;
    }

    viewModel.getEventStatus = function(event) {
      var status = null;
      event.participants.forEach(function(element) {
        if (element.id === data.personal_data.id) {
          status = element.status;
        }
      });
      return status;
    }

    viewModel.changeEventStatus = function(event, status) {
      var isNewParticipant = true;
      event.participants.forEach(function(element) {
        if (element.id === data.personal_data.id) {
          element.status = status;
          isNewParticipant = false;
        }
      });

      if (isNewParticipant) {
        event.participants.push({id: data.personal_data.id, status: status});
      }
    }

    viewModel.isCreator = function(event) {
      return event.creator === data.personal_data.id;
    }

    viewModel.getProfileID = function() {
      return data.personal_data.id;
    }

    viewModel.getDiveSiteByID = function(id) {
      var res = null;
      data.divesites_data.forEach(function(element) {
        if (element.id === id) {
          res = element;
        }
      });
      return res;
    }

    return viewModel;
}

module.exports = EventsViewModel;

function createEventData(event) {
  var str = event.date.split(".");
  var datestring = str[2]+ "-" + str[1] + "-" + str[0] + " " + event.time + ":00";
  var isodatestring = (new Date(datestring).toISOString());
  var time = isodatestring.split(".")[0].replace("T", " ");

  var canceledDate = null;
  if (event.canceled) {
    str = event.canceledDate.split(".");
    canceledDate = str[2]+ "-" + str[1] + "-" + str[0];
  }

  var divesiteID = null;
  if (event.divesite !== null) {
    divesiteID = event.divesite.id;
  }

  var res = {
    id: event.id,
    name: event.name,
    type: event.type,
    time: time,
    divesite: divesiteID,
    comment: event.comment,
    canceled: event.canceled,
    canceledDate: canceledDate,
    participants: event.participants,
    creator: event.creator
  }
  return res;
}

function getDiveBuddyByID(id) {
  var res = null;
  data.personal_data.divebuddies.forEach(function(element) {
    if (element.id === id) {
      res = element;
    }
  });
  return res;
}