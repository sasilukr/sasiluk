$(document).ready(function(){


	$("#loading").show();
  	createCalendar();

	readLogData();

  	$(".sasian-calendar>tbody>tr>td").hover(
  		function(){
	  		var date = ($(this).attr("dateOfMonth"));
	  		if ( !($(this).hasClass("flipped")) ) {
	  			$(this).addClass("flipped");
	  			$(this).text(date);
	  			// TODO decide which color to apply
	  			$(this).addClass("flipped-80");

	  		} 
	    },function(){
	  		if ( $(this).hasClass("flipped") ) {
				$(this).removeClass("flipped");
				$(this).removeClass("flipped-10");
				$(this).removeClass("flipped-80");
				$(this).removeClass("flipped-100");
				$(this).text('');
		    }
  });



});

Parse.initialize("cM18uI8SLt88aXrUxr2FpsXt06GA1D3Z7ojx0N3L", "mTJXKKWxRzYJ93d1tbuGpcNrFbvEKeWDCJZkYWr5");
var LogParseTable = Parse.Object.extend("Log");
var parseLogStartKey = "start";
var parseLogEndKey = "end";
var parseLogUserIdKey = "userId";

function createCalendar() {
	var anniversary = moment('2015-06-04');
	var now = moment();

	for ( var i = anniversary.year(); i <= now.year(); i++ ) {
		var startMonth = (i == anniversary.year()) ? anniversary.month() : 0;
		var endMonth = (i < now.year()) ? 11 : now.month();
		for ( var j = startMonth; j <= endMonth; j++) {
			var tableDiv = $("<table class=\"sasian-calendar\"><caption>" + moment().month(j).format("MMM") + "</caption></table>");
			var tbodyDiv = $("<tbody></tbody>");
			var trDiv = $("<tr></tr>");

			// insert empty cell in the week before 1st date
			var dayOfWeekFirstDate = moment().month(j).year(i).startOf("month").day();
			var filler = 0;
			while ( filler < dayOfWeekFirstDate ) {
				var tdDiv = $("<td class=\"filler\"></td>");
				trDiv.append(tdDiv);
				filler++;
			}
			for ( var k = 0; k < moment().month(j).year(i).endOf("month").date(); k++ ) {
				var tdDiv = $("<td dateOfMonth=\'" + (k+1) + "\' date=\'" + i + "-" + (j+1) + "-" + (k+1) + "\'></td>");
				trDiv.append(tdDiv);

				if ( moment().month(j).year(i).date(k+1).day() == 6 ) {
					// end of week
					tbodyDiv.append(trDiv);
					trDiv = $("<tr></tr>");
				}
			}
			// insert empty cell in the week after the last date
			var dayOfWeekLastDate = moment().month(j).year(i).endOf("month").day();
			while ( dayOfWeekLastDate < 6 ) {
				var tdDiv = $("<td class=\"filler\"></td>");
				trDiv.append(tdDiv);
				dayOfWeekLastDate++;
			}

			(tbodyDiv).append(trDiv);
			(tableDiv).append((tbodyDiv));
			$("#mainBody").append((tableDiv));

		}
	}

	var endDate = moment('2015-06-04').endOf('month');
	var endDateDay = endDate.date();
}

function readLogData() {



	var query = new Parse.Query(LogParseTable);
	query.equalTo(parseLogUserIdKey, 15);
	query.find({
	  success: function(results) {
	    console.log("Successfully retrieved " + results.length);
	    historyLog = results;
	    for (var i = 0; i < results.length; i++) {
	    	var object = results[i];
	    	var start = object.get('start');
	    	var end = object.get('end');
	    	var startString = moment(start).format("YYYY-M-D");
	    	var endString = moment(end).format("YYYY-M-D");
	    	var hourDiff = moment(end).diff(moment(start), 'hours');
	    	var levelClass = "level-2";
	    	if ( hourDiff < 3 ) {
	    		levelClass = "level-1";
	    	} else if ( hourDiff > 6 ) {
	    		levelClass = "level-3";
	    	}

	    	$( "td[date='"  + startString + "'").addClass(levelClass);
	    }
	    $("#loading").hide();
	  },
	  error: function(error) {
	    console.log("Error: " + error.code + " " + error.message);
	    $("#loading").hide();

	  }
	});

}

function loadLogData(){
	var startdateArray = [];

	var enddateArray = [];

	for ( var i = 0; i < startdateArray.length; i++ ) {
		saveLogData(startdateArray[i], enddateArray[i]);
	}
}

function saveLogData(start, end) {
	var log = new LogParseTable();
	log.set(parseLogUserIdKey, 15);
	log.set(parseLogStartKey, start);
	log.set(parseLogEndKey, end);

	log.save(null,  {
		success: function(log) {
			console.log('New object created with objectId: ' + log.id);
		},
		error: function(log, error) {
			console.log('Failed to create new object, with error code: ' + error.message);
		}
	});
}

function play_audio() {
  	var myAudio = document.getElementById("myAudio");
	myAudio.play();
}