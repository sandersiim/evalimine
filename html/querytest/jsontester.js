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
	
	$("#uploaderFile").change(function(event) {
		if(!window.FormData || !window.FileReader) return;
		
		var formData = new FormData();
		
		for(var i = 0; i < this.files.length; i++) {
			if (!this.files[i].type.match(/image.*/)) {
				$("#uploadResult").text("Not an image file.");
			}
			else if(this.files[i].size > 1048576) {
				$("#uploadResult").text("Size larger than 1MB.");
			}
			else {
				$("#uploadResult").text("Uploading...");
				
				formData.append("imageFile", this.files[i]);
				
				$.ajax("../dyn/photo", {type: "POST", data: formData, processData: false, contentType: false, dataType: "text"}).done(function(data) {
					$("#uploadResult").text(data);
				});
			}
		}
	});
	
	$("#uploaderForm").submit(function(event) {
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
