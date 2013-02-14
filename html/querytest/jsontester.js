$(document).ready(function() {
	$("#testerForm").submit(function(event) {
		var queryType = $("#testerQueryType").val();
		var queryData = $("#testerQueryContents").val();
		
		if(queryData == "") queryData = "{}";

		$.ajax("../dyn/" + queryType + "?json=" + encodeURIComponent(queryData), {dataType: "text"}).done(function(data) {
			$("#testerResult").text(data);
		});
		
		return false;
	});
});
