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
		
		var ref = ($("#testerQueryMethod").val() == "POST") ? $.post("../dyn/" + queryType, {"json": queryData}, function() { }, "text") : $.get("../dyn/" + queryType, {"json": queryData}, function() { }, "text");
		
		ref.done(function(data) {
			$("#testerResult").text(data);
		});
		
		return false;
	});
	
	$("#authenticationForm").submit(function(event) {
		var sessionId = $("#authSessionId").val();
		
		this.action = "https://" + window.location.hostname + ":8443/";
		
		if(sessionId.length == 0) {
			$.ajax("../dyn/sessionid", {dataType: "json"}).done(function(data) {
				if(data.responseType && data.responseType == "status" && data.statusComponent && data.statusComponent == "sessionId" && data.statusMessage && data.statusMessage.length > 0) {
					$("#authSessionId").val(data.statusMessage);
					$("#authenticationForm").submit();
				}
				else {
					$("#authenticationResult").text("Failed to receive session ID.");
				}
			});
			
			return false;
		}
		
		return true;
	});
	
	if(window.location.hash == "#authSessionError") {
		$("#authenticationResult").text("ID card authentication: Failed to find session.");
		
		window.location.hash = "";
	}
	else if(window.location.hash == "#authCheckError" || window.location.hash == "#authCheckSuccess") {
		if(window.location.hash == "#authCheckError") {
			$("#authenticationResult").text("ID card authentication: Fetching error message...");
		}
		else {
			$("#authenticationResult").text("ID card authentication: Fetching success message...");
		}
		
		$.ajax("../dyn/status" + "?json=" + encodeURIComponent("{statusType:\"authStatus\"}"), {dataType: "json"}).done(function(data) {
			if(data.responseType && data.responseType == "status" && data.statusComponent && data.statusComponent == "authStatus" && data.statusMessage && data.statusMessage.length > 0) {
				$("#authenticationResult").text("ID card authentication: " + data.statusMessage);
			}
			else {
				$("#authenticationResult").text("ID card authentication: Failed to fetch auth status message from server.");
			}
		});
		
		window.location.hash = "";
	}
	
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
			$("#testerQueryMethod").val($(this).hasClass("dataPost") ? "POST" : "GET");
			
			return false;
		});
	});
	
	var ws = $.websocket("ws://" + window.location.hostname + ":8081/", {
		open: function() {},
		close: function() {},
		events: {
			candidate: function(data) {
				var info = data.candidateInfo;
				
				$("#webSocketData").val($("#webSocketData").val() + info.firstName + " " + info.lastName + "\n");
			}
		}
	}, "vote-broadcaster");
});
