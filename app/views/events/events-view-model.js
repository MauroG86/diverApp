var observableArray = require("data/observable-array").ObservableArray;

var frameModule = require("ui/frame");

var data = [{
  id: 0,
  name: "Frühlingstauchen 2018",
  type: "Tauchen",
  time: "2018-04-03 08:00:00",
  divesite: "Streitköpfle",
  public: true,
  comment: "Lasst und das Jahr 2018 mit einem Frühlingstauchen starten!"
},
{
  id: 1,
  name: "Essen und Nachttauchen",
  type: "Tauchen",
  time: "2018-08-29 16:00:00",
  divesite: "Streitköpfle",
  public: false,
  comment: "Erst essen, dann tauchen."
}];

function EventsViewModel(items) {

    var viewModel = new observableArray(items);

    viewModel.load = function() {

      for (var i = 0; i < data.length; i++) {
        var date = new Date(data[i].time + " UTC");
        var day = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
        viewModel.push({
          id: data[i].id,
          name: data[i].name,
          divesite: data[i].divesite,
          type: data[i].type,
          date: day,
          time: date.toLocaleTimeString().substring(0, 5),
          public: data[i].public,
          comment: data[i].comment
        });
      }
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

    return viewModel;
}

module.exports = EventsViewModel;

function createEventData(event) {
  var str = event.date.split(".");
  var datestring = str[2]+ "-" + str[1] + "-" + str[0] + " " + event.time + ":00";
  var isodatestring = (new Date(datestring).toISOString());
  var time = isodatestring.split(".")[0].replace("T", " ");

  var res = {
    id: event.id,
    name: event.name,
    type: event.type,
    time: time,
    divesite: event.divesite,
    public: event.public,
    comment: event.comment
  }
  return res;
}