Parse.initialize("cM18uI8SLt88aXrUxr2FpsXt06GA1D3Z7ojx0N3L", "mTJXKKWxRzYJ93d1tbuGpcNrFbvEKeWDCJZkYWr5");
var LogParseTable = Parse.Object.extend("Log");
var lastLog;
$(document).ready(function(){
	
	loadLastTimestamp();

	$("#loading").hide();

	// TODO decide to display "Start" or "End"
	if ( !lastLog['end'] ) {
		$("#submitButton").val("End");
	} else {
		$("#submitButton").val("Start");
	}
	var nowString = moment().format("YYYY-MM-DD HH:MM");
	$("#timestamp").val(nowString);

  	// $("#actionButton").click();



});

function saveStartTime() {

	var startTimestamp = $("#timestamp").val();
	var start = moment(startTimestamp);
	var log = new LogParseTable();
	log.set(parseLogUserIdKey, 15);
	log.set(parseLogStartKey, start);

	log.save(null,  {
		success: function(log) {
			console.log('New object created with objectId: ' + log.id);
		},
		error: function(log, error) {
			console.log('Failed to create new object, with error code: ' + error.message);
		}
	});
}

function saveEndTime() {

}

function loadLastTimestamp() {

	var query = new Parse.Query(LogParseTable);
	query.descending("createdAt");
	query.first().then(function(result) {
	  // only the selected fields of the object will now be available here.
	  console.log("Start" + result.get('start'));
	  console.log("End" + result.get('end'));
	  lastLog = result;

	  return result.fetch();
	});

}
