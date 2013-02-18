function fileUpload(file) {
	if(!window.FormData) return;
	
	var formData = new FormData();
	
	if (file.type != "image/jpeg") {
		$("#uploadResult").text("Not an image file.");
	}
	else if(file.size > 262144) {
		$("#uploadResult").text("Size larger than 256KB.");
	}
	else {
		$("#uploadResult").text("Uploading...");
		
		formData.append("imageFile", file);
		
		$.ajax("../dyn/photo", {type: "POST", data: formData, processData: false, contentType: false, dataType: "text"}).done(function(data) {
			$("#uploadResult").text(data);
		});
	}
}

$(document).ready(function() {
	jQuery.event.props.push("dataTransfer");
	
	$("#testerForm").submit(function(event) {
		var queryType = $("#testerQueryType").val();
		var queryData = $("#testerQueryContents").val();
		
		if(queryData == "") queryData = "{}";

		$.ajax("../dyn/" + queryType + "?json=" + encodeURIComponent(queryData), {dataType: "text"}).done(function(data) {
			$("#testerResult").text(data);
		});
		
		return false;
	});
	
	$("#uploaderDragDrop").on("drop", function(event) {
		if(event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
			fileUpload(event.dataTransfer.files[0]);
		}
		
		return false;
	});
	
	$("#uploaderDragDrop").click(function(event) {
		$("#uploaderFile").click();
	});
	
	$("#uploaderFile").change(function(event) {
		if(this.files.length > 0) {
			fileUpload(this.files[0]);
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
