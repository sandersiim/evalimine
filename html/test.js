var voteSystem = {}

voteSystem.loggedIn = false;
voteSystem.activeMenuItem = "menu_mydata"
voteSystem.menuActiveTab = {"menu_help" : "tab_help", "menu_mydata" : "tab_login", "menu_statistics" : "tab_stats_regions", "menu_voting" : "tab_voting"};

voteSystem.resizeElements = function() {
	$("#mainblock").height($(window).height()-($("#mainblock").outerHeight(true)-$("#mainblock").height())); 
	$("#content").height($("#mainblock").height()-$("#header").outerHeight()-$("#footer").outerHeight()); 
};

voteSystem.addClassToElement = function(element, oneClass) {
	if (element.className.indexOf(oneClass) == -1) {
		element.className += " " + oneClass;
	}
};

voteSystem.removeClassFromElement = function(element, oneClass) {
	element.className = element.className.replace(oneClass, "");
};

voteSystem.changeActiveMenuClass = function(newMenuSelection) {
	$.each($(".menuitem.menuselected"), function(index, oldMenuItem) {
		voteSystem.removeClassFromElement(oldMenuItem, "menuselected");
	});
	
	voteSystem.addClassToElement(newMenuSelection, "menuselected");
};

voteSystem.setActiveMenuItem = function(newMenuSelection) {
	voteSystem.changeActiveMenuClass(newMenuSelection);
	voteSystem.swapToActiveTabForMenuItem(newMenuSelection)
};

voteSystem.swapToActiveTabForMenuItem = function(selectedMenu) {
	if(voteSystem.menuActiveTab[selectedMenu.id]) {
		voteSystem.swapToTab(voteSystem.menuActiveTab[selectedMenu.id]);
	}
};

voteSystem.setActiveTabForMenu = function(menuItemName, tabName, activateMenu) {
	if(voteSystem.menuActiveTab[menuItemName]) {
		voteSystem.menuActiveTab[menuItemName] = tabName;
	}

	if(this.activeMenuItem == menuItemName || activateMenu) {
		voteSystem.setActiveMenuItem($("#" + menuItemName)[0]);
	}
};

voteSystem.swapToTab = function(tabElement) {
	$.each($(".tab.visible"), function(index, oldTab) {
		voteSystem.removeClassFromElement(oldTab, "visible");
	});
	
	$.each($("#" + tabElement), function(index, newTab) {
		voteSystem.addClassToElement(newTab, "visible");
	});
};

voteSystem.jsonQuery = function(queryType, jsonObject, isPostQuery, doneFunction) {
	$.ajax("dyn/" + queryType + "?json=" + JSON.stringify(jsonObject), {type: isPostQuery ? "POST" : "GET", dataType: "json"}).done(doneFunction);
};

voteSystem.setLoggedInStatus = function(isLoggedIn) {
	if(isLoggedIn) {
		$("#menu_mydata").text("Minu andmed");
		voteSystem.setActiveTabForMenu("menu_mydata", "tab_mydata", false);
	}
	else {
		$("#menu_mydata").text("Logi sisse");
		voteSystem.setActiveTabForMenu("menu_mydata", "tab_login", false);
	}
	
	voteSystem.loggedIn = isLoggedIn;
}

voteSystem.queryStatus = function() {
	voteSystem.jsonQuery("status", {}, false, function(data) {
		if(data.responseType == "userInfo" && data.userInfo != null) {
			voteSystem.setLoggedInStatus(true);
		}
	});
}

voteSystem.initialise = function() {
	$(".menuitem").click( function() {
		voteSystem.setActiveMenuItem(this);
	});

	$("#loginByPassword").submit( function() {
		voteSystem.jsonQuery("login", {username:$("#username").val(), password:$("#password").val()}, false, function(data) {
			if(data.responseType == "userInfo" && data.userInfo != null) {
				voteSystem.setLoggedInStatus(true);
			}
			else if(data.responseType == "status") {
				if(data.statusCode < 0) {
					$("#loginErrorMessage").text("Süsteemi viga.");
				}
				else if(data.statusCode == 1) {
					$("#loginErrorMessage").text("Vale kasutajanimi/parool.");
				}
			}
		});
		
		return false;
	});
	
	voteSystem.resizeElements();
	
	$(window).resize(function() {
		voteSystem.resizeElements();
	});
	
	voteSystem.queryStatus();
};

$(document).ready(function() {
	voteSystem.initialise();
});