Parse.initialize("cM18uI8SLt88aXrUxr2FpsXt06GA1D3Z7ojx0N3L", "mTJXKKWxRzYJ93d1tbuGpcNrFbvEKeWDCJZkYWr5");
var LogParseTable = Parse.Object.extend("Log");

var parseLogStartKey = "start";
var parseLogEndKey = "end";
var parseLogUserIdKey = "userId";

var lastLog;
$(document).ready(function(){
	readLogData();
	loadLastTimestamp();

	$("#loading").hide();

  	$("#submitButton").click(function() {
  		if ( $("#submitButton").val() == "Start" ) {
  			saveStartTime();
  		} else {
  			saveEndTime();
  		}
	});


});

function saveStartTime() {

	var startTimestamp = $("#timestamp").val();
	var start = moment(startTimestamp).tz("America/Los_Angeles").toDate();
	var log = new LogParseTable();
	log.set(parseLogUserIdKey, 15);
	log.set(parseLogStartKey, start);

	log.save(null,  {
		success: function(log) {
			console.log('New object created with objectId: ' + log.id);
			loadLastTimestamp();
		},
		error: function(log, error) {
			console.log('Failed to create new object, with error code: ' + error.message);
		}
	});
}

function saveEndTime() {

	var endTimestamp = $("#timestamp").val();
	var end = moment(endTimestamp).tz("America/Los_Angeles").toDate();
	if ( lastLog ) {
		lastLog.set(parseLogEndKey, end);

		lastLog.save(null,  {
			success: function(log) {
				console.log('Object updated with objectId: ' + log.id);
				loadLastTimestamp();	
			},
			error: function(log, error) {
				console.log('Failed to update endTime, with error code: ' + error.message);
			}
		});
	}
	
}

function loadLastTimestamp() {

	var query = new Parse.Query(LogParseTable);
	query.descending("createdAt");
	query.first().then(function(result) {
	  // only the selected fields of the object will now be available here.
	  console.log("Start" + result.get('start'));
	  console.log("End" + result.get('end'));
	  lastLog = result;
	  refreshView();
	  return result.fetch();
	});

}

function refreshView() {

	console.log("refresh");
	var nowString = moment().format("YYYY-MM-DD HH:mm");
	$("#timestamp").val(nowString);

	if ( lastLog && !lastLog.get('end') ) {
		$("#submitButton").val("End");
	} else {
		$("#submitButton").val("Start");
	}
}


function readLogData() {
	var query = new Parse.Query(LogParseTable);
	query.equalTo(parseLogUserIdKey, 15);
	query.descending(parseLogStartKey);
	query.limit(5)
	query.find({
	  success: function(results) {
	    console.log("Successfully retrieved " + results.length);
	    historyLog = results;
	    for (var i = 0; i < results.length; i++) {
	    	var object = results[i];
	    	var start = object.get('start');
	    	var end = object.get('end');
	    	var startString = moment(start).format("YYYY-MM-DD HH:mm");
	    	var endString = moment(end).format("YYYY-MM-DD HH:mm");
	    	var hourDiff = moment(end).diff(moment(start), 'hours');
	    	$("#summaryLog").append("<p>" + startString + " to " + endString + "</p>")
	    }
	  },
	  error: function(error) {
	    console.log("Error: " + error.code + " " + error.message);
	  }
	});

}
