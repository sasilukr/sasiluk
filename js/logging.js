Parse.initialize("cM18uI8SLt88aXrUxr2FpsXt06GA1D3Z7ojx0N3L", "mTJXKKWxRzYJ93d1tbuGpcNrFbvEKeWDCJZkYWr5");
var LogParseTable = Parse.Object.extend("Log");

var parseLogStartKey = "start";
var parseLogEndKey = "end";
var parseLogUserIdKey = "userId";

var lastLog;
$(document).ready(function(){
	
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
	var start = moment(startTimestamp).toDate();
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
	var end = moment(endTimestamp).toDate();
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
