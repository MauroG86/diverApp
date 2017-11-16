var observableArray = require("data/observable-array").ObservableArray;

var frameModule = require("ui/frame");

var myProfile = {
  id: 0,
  name: "Nico B",
  divebuddies: [{
    id: 1,
    name: "Mauro Greco",
  },{
    id: 2,
    name: "Deine Mutter",
  },{
    id: 3,
    name: "Max Mustermann",
  },{
    id: 5,
    name: "Noch jemand",
  }]
}

var diveSites = [{
  id: 0,
  name: "Streitköpfle"
},
{
  id: 1,
  name: "Baggersee Buxtehude"
},
{
  id: 3,
  name: "Totes Meer"
}]

var data = [{
  id: 0,
  name: "Frühlingstauchen 2018",
  type: "Tauchen",
  time: "2018-04-03 08:00:00",
  divesite: 0,
  comment: "Lasst und das Jahr 2018 mit einem Frühlingstauchen starten!",
  canceled: false,
  canceledDate: "",
  participants: [{id: 0, status: "Ja"}, {id: 1, status: "Nein"}, {id: 4, status: "Vielleicht"}],
  creator: 0
},
{
  id: 1,
  name: "Essen und Nachttauchen",
  type: "Tauchen",
  time: "2018-08-29 16:00:00",
  divesite: 1,
  comment: "Erst essen, dann tauchen.",
  canceled: false,
  canceledDate: "",
  participants: [{id: 1, status: "Ja"}, {id: 2, status: "Nein"}, {id: 3, status: "Vielleicht"}],
  creator: 1
},
{
  id: 3,
  name: "Grillparty",
  type: "Event",
  time: "2018-01-01 20:00:00",
  divesite: 3,
  comment: "Grillen halt.",
  canceled: false,
  canceledDate: "",
  participants: [{id: 5, status: "Ja"}],
  creator: 1
}];

function EventsViewModel(items) {

    var viewModel = new observableArray(items);

    viewModel.load = function() {

      data.forEach(function(element) {
        var date = new Date(element.time + " UTC");
        var day = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
        
        var canceledDate = "";
        if (element.canceled) {
          var str = element.canceledDate.split("-");
          canceledDate = str[2] + "." + str[1] + "." + str[0];
        }

        viewModel.push({
          id: element.id,
          name: element.name,
          divesite: getDiveSiteByID(element.divesite),
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
    }

    viewModel.empty = function() {
        while (viewModel.length) {
            viewModel.pop();
        }
    };

    viewModel.update = function(event) {
      viewModel.forEach(function(element) {
        if (element.id === event.id) {
          viewModel.setItem(viewModel.indexOf(element), event);
        }
      });

      for (var i = 0; i < data.length; i++) {
        if (data[i].id === event.id) {
          data[i] = createEventData(event);
        }
      }
    }

    viewModel.add = function(event) {
      event.id = viewModel.getItem(viewModel.length - 1).id + 1;
      viewModel.push(event);
      data.push(createEventData(event));
    }

    viewModel.delete = function(event) {
      var index = viewModel.indexOf(event);
      viewModel.splice(index, 1);

      index = data.indexOf(createEventData(event));
      data.splice(index, 1);
    }

    viewModel.getParticipants = function(event) {
      var participants = [];
      event.participants.forEach(function(element) {
        var divebuddy = getDiveBuddyByID(element.id);
        if (divebuddy !== null) {
          participants.push({name: divebuddy.name, status: element.status});
        }
      });
      return participants;
    }

    viewModel.getAllDivesites = function() {
      return diveSites;
    }

    viewModel.getEventStatus = function(event) {
      var status = null;
      event.participants.forEach(function(element) {
        if (element.id === myProfile.id) {
          status = element.status;
        }
      });
      return status;
    }

    viewModel.changeEventStatus = function(event, status) {
      var isNewParticipant = true;
      event.participants.forEach(function(element) {
        if (element.id === myProfile.id) {
          element.status = status;
          isNewParticipant = false;
        }
      });

      if (isNewParticipant) {
        event.participants.push({id: myProfile.id, status: status});
      }

      viewModel.update(event);
    }

    viewModel.isCreator = function(event) {
      return event.creator === myProfile.id;
    }

    viewModel.getProfileID = function() {
      return myProfile.id;
    }

    return viewModel;
}

module.exports = EventsViewModel;

function createEventData(event) {
  var str = event.date.split(".");
  var datestring = str[2]+ "-" + str[1] + "-" + str[0] + " " + event.time + ":00";
  var isodatestring = (new Date(datestring).toISOString());
  var time = isodatestring.split(".")[0].replace("T", " ");

  var canceledDate = "";
  if (event.canceled) {
    str = event.canceledDate.split(".");
    canceledDate = str[2]+ "-" + str[1] + "-" + str[0];
  }

  var res = {
    id: event.id,
    name: event.name,
    type: event.type,
    time: time,
    divesite: event.divesite.id,
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
  myProfile.divebuddies.forEach(function(element) {
    if (element.id === id) {
      res = element;
    }
  });
  return res;
}

function getDiveSiteByID(id) {
  var res = null;
  diveSites.forEach(function(element) {
    if (element.id === id) {
      res = element;
    }
  });
  return res;
}