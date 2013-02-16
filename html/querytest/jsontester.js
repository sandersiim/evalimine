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
	
	$(".sampleData").each(function(index, element) {
		$(element).click(function(event) {
			var items = $(this).children("span");
			$("#testerQueryType").val($(items[0]).text());
			$("#testerQueryContents").val($(items[1]).text());
			
			return false;
		});
	});
});
