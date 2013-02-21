var voteSystem = {}

voteSystem.userInfo = {}
voteSystem.loggedIn = false;
voteSystem.checkHashOnStatus = null;
voteSystem.activeMenuItem = "menu_mydata"
voteSystem.tabCallbacks = {};
voteSystem.menuList = ["menu_statistics", "menu_mydata", "menu_help", "menu_voting"];
voteSystem.partyList = {};

voteSystem.menuTabList = {
	"menu_statistics" : ["tab_stats_regions", "tab_stats_candidates", "tab_stats_parties", "tab_stats_map"],
	"menu_mydata" : ["tab_login", "tab_mydata", "tab_application"],
	"menu_help" : ["tab_help"],
	"menu_voting" : ["tab_err_login", "tab_voting", "tab_err_region"]
};

voteSystem.menuActiveTab = {
	"menu_statistics" : voteSystem.menuTabList["menu_statistics"][0],
	"menu_mydata" : voteSystem.menuTabList["menu_mydata"][0],
	"menu_help" : voteSystem.menuTabList["menu_help"][0],
	"menu_voting" : voteSystem.menuTabList["menu_voting"][0]
};

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

voteSystem.getMenuItemNameForTab = function(tabName) {
	var foundMenu = null;

	$.each(voteSystem.menuList, function(index, menuName) {
		for(var i = 0; i < voteSystem.menuTabList[menuName].length; i++) {
			if(tabName == voteSystem.menuTabList[menuName][i]) {
				foundMenu = menuName;
			}
		}
	});
	
	return foundMenu;
};

voteSystem.setActiveTab = function(tabName, activateMenu) {
	var menuItemName = voteSystem.getMenuItemNameForTab(tabName);
	
	if(menuItemName) {
		if(voteSystem.menuActiveTab[menuItemName]) {
			voteSystem.menuActiveTab[menuItemName] = tabName;
		}

		if(this.activeMenuItem == menuItemName || activateMenu) {
			voteSystem.setActiveMenuItem($("#" + menuItemName)[0]);
		}
	}
};

voteSystem.swapToTab = function(tabElement) {
	$.each($(".tab.visible"), function(index, oldTab) {
		voteSystem.removeClassFromElement(oldTab, "visible");
	});
	
	$.each($("#" + tabElement), function(index, newTab) {
		voteSystem.addClassToElement(newTab, "visible");
		
		if(voteSystem.tabCallbacks[newTab.id]) {
			voteSystem.tabCallbacks[newTab.id](newTab);
		}
	});
};

voteSystem.jsonQuery = function(queryType, jsonObject, isPostQuery, doneFunction) {
	$.ajax("dyn/" + queryType + "?json=" + JSON.stringify(jsonObject), {type: isPostQuery ? "POST" : "GET", dataType: "json"}).done(doneFunction);
};

voteSystem.setLoggedInStatus = function(isLoggedIn) {
	if(voteSystem.loggedIn != isLoggedIn) {
		if(isLoggedIn) {
			$("#menu_mydata").text("Minu andmed");
			voteSystem.setActiveTab("tab_mydata", false);
			
			if(voteSystem.userInfo.userInfo.voteRegionId == 0) {
				voteSystem.setActiveTab("tab_err_region", false);
			}
			else {
				voteSystem.setActiveTab("tab_voting", false);
			}
		}
		else {
			$("#menu_mydata").text("Logi sisse");
			
			voteSystem.setActiveTab("tab_login", false);
			voteSystem.setActiveTab("tab_err_login", false);
		}
	}
	
	voteSystem.loggedIn = isLoggedIn;
}

voteSystem.applyUserInfo = function(newUserInfo) {
	voteSystem.userInfo = newUserInfo;
	
	if(newUserInfo.userInfo != null) {
		voteSystem.setLoggedInStatus(true);
	}
	else {
		voteSystem.setLoggedInStatus(false);
	}
};

voteSystem.redirectBasedOnUserInfo = function() {
	if(!voteSystem.loggedIn) return;
	
	var redirectTab = null;
	
	if(voteSystem.userInfo.userInfo.voteRegionId == 0) {
		redirectTab = "tab_mydata";
	}
	else if(voteSystem.userInfo.userInfo.votedCandidateId == 0) {
		redirectTab = "tab_voting";
	}
	
	if(redirectTab) {
		voteSystem.setActiveTab(redirectTab, true);
	}
}

voteSystem.queryStatus = function() {
	voteSystem.jsonQuery("status", {}, false, function(data) {
		if(data.responseType == "userInfo") {
			voteSystem.applyUserInfo(data);
		}
		
		if(!voteSystem.checkHashOnStatus) {
			voteSystem.redirectBasedOnUserInfo();
		}
		
		voteSystem.requestTabActivationOnStatus(window.location.hash);
	});
};

voteSystem.queryParties = function() {
	voteSystem.jsonQuery("parties", {regionId:0, orderId:7}, false, function(data) {
		if(data.responseType == "parties" && data.partyList) {
			$.each(data.partyList, function(index, item) {
				voteSystem.partyList[item.partyId] = item;
			});
		}
	});
};

voteSystem.setTabActivateCB = function(tabName, callbackFunction) {
	voteSystem.tabCallbacks[tabName] = callbackFunction;
};

voteSystem.requestTabActivation = function(tabName) {
	var menuName = voteSystem.getMenuItemNameForTab(tabName);
	if(!menuName) return;

	if(menuName == "menu_mydata" || menuName == "menu_voting") {
		voteSystem.checkHashOnStatus = tabName;
	}
	else {
		voteSystem.setActiveTab(tabName, true);
	}
};

voteSystem.requestTabActivationOnStatus = function() {
	if(!voteSystem.checkHashOnStatus) return;
	
	var tabName = voteSystem.checkHashOnStatus;
	voteSystem.checkHashOnStatus = null;
	
	var menuName = voteSystem.getMenuItemNameForTab(tabName);
	if(!menuName) return;
	
	if(menuName == "menu_mydata") {
		if(voteSystem.loggedIn && tabName == "tab_login") {
			tabName = "tab_mydata";
		}
		else if(!voteSystem.loggedIn && tabName != "tab_login") {
			tabName = "tab_login";
		}
	}
	else if(menuName == "menu_voting") {
		tabName = voteSystem.menuActiveTab["menu_voting"];
	}
	
	voteSystem.setActiveTab(tabName, true);
};

voteSystem.voteForCandidate = function(candidateId) {
	var queryData = {voteCandidateId: candidateId};
	
	voteSystem.jsonQuery("vote", queryData, false, function(data) {
		if(data.responseType == "status") {
			if(data.statusCode == 10 || data.statusCode == 11) {
				voteSystem.userInfo.userInfo.votedCandidateId = candidateId;
				voteSystem.refreshVotingList();
			}
			else {
				alert(data.statusMessage);
			}
		}
	});
}

voteSystem.refreshVotingList = function() {
	var queryData = {regionId: 0, partyId: 0, namePrefix:"", orderId:0, startIndex: 0, count: 1000};

	voteSystem.jsonQuery("candidates", queryData, false, function(data) {
		var listElement = $("#votingCandidateList"), template = $("#candidateTemplate");
		var selectedId = voteSystem.userInfo.userInfo.votedCandidateId;
		listElement.html("");
	
		if(data.responseType == "candidates" && data.candidateList) {
			for(var i = 0; i < data.candidateList.length; i++) {
				var info = data.candidateList[i], element = template.clone();
				var partyName = voteSystem.partyList[info.partyId] ? voteSystem.partyList[info.partyId].displayName : info.partyId;
				
				element.get().id = "";
				element.find(".candidateName").text(info.firstName + " " + info.lastName);
				element.find(".voteCount").text(info.voteCount);
				element.find(".partyName").text(partyName);
				element.find(".voteCandidateId").val(info.candidateId);
				
				if(selectedId == 0) {
					element.find(".voteCancelForm").css("display", "none");
					element.find(".voteGiveForm").submit(function() {
						var candidateId = $(this).children(".voteCandidateId").val();
						
						voteSystem.confirmMessage("Kinnita hääl", "Kas oled kindel, et soovid anda sellele kandidaadile oma hääle?", function() {
							voteSystem.voteForCandidate(candidateId);
						});
						
						return false;
					});
					
					listElement.append(element);
				}
				else if(selectedId == info.candidateId) {
					element.find(".voteGiveForm").css("display", "none");
					element.find(".voteCancelForm").submit(function() {
						voteSystem.confirmMessage("Kinnita tühistus", "Kas oled kindel, et soovid oma häält tühistada?", function() {
							voteSystem.voteForCandidate(0);
						});
						
						return false;
					});
					
					listElement.prepend(element);
				}
				else {
					element.find(".voteGiveForm").css("display", "none");
					element.find(".voteCancelForm").css("display", "none");
					listElement.append(element);
				}
			}
		}
	});
};

voteSystem.confirmMessage = function(title, message, yesCallback) {
	$("#confirmBlock").css("display", "block");
	$("#confirmBlock").width($(window).width());
	$("#confirmBlock").height($(window).height());
	$("#confirmBox").css("margin-top", (($(window).height() - 300) / 2) + "px");
	$("#confirmBoxTitle").text(title);
	$("#confirmBoxMessage").text(message);
	
	$("#confirmBoxNo").on("click", function(event) {
		$("#confirmBoxYes").off("click");
		$("#confirmBlock").css("display", "none");
	});
	
	$("#confirmBoxYes").on("click", function(event) {
		$("#confirmBoxYes").off("click");
		$("#confirmBlock").css("display", "none");
		
		yesCallback();
	});
};

voteSystem.initialise = function() {
	$(".menuitem").click( function() {
		voteSystem.setActiveMenuItem(this);
	});
	
	voteSystem.setTabActivateCB("tab_voting", function(tabElement) {
		voteSystem.refreshVotingList();
	});

	$("#loginByPassword").submit( function() {
		voteSystem.jsonQuery("login", {username:$("#username").val(), password:$("#password").val()}, false, function(data) {
			if(data.responseType == "userInfo") {
				voteSystem.applyUserInfo(data);
				voteSystem.redirectBasedOnUserInfo();
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
	
	$("#loginByIdCard").submit(function(event) {
		var sessionId = $("#authSessionId").val();
		
		this.action = "https://" + window.location.hostname + ":8443/";
		
		if(sessionId.length == 0) {
			$.ajax("../dyn/sessionid", {dataType: "json"}).done(function(data) {
				if(data.responseType && data.responseType == "status" && data.statusComponent && data.statusComponent == "sessionId" && data.statusMessage && data.statusMessage.length > 0) {
					$("#authSessionId").val(data.statusMessage);
					$("#loginByIdCard").submit();
				}
				else {
					$("#authErrorMessage").text("Sessiooni tuvastamine ebaõnnestus.");
				}
			});
			
			return false;
		}
		
		return true;
	});
	
	$("#logoutForm").submit(function(event) {
		voteSystem.jsonQuery("logout", {}, false, function(data) {
			voteSystem.applyUserInfo({userInfo:null, candidateInfo:null});
		});
		
		return false;
	});
	
	if(window.location.hash == "#authSessionError") {
		$("#authErrorMessage").text("Serveri sessiooni tuvastamine ebaõnnestus.");
		
		window.location.hash = "";
	}
	else if(window.location.hash == "#authCheckError") {
		$("#authenticationResult").text("Vea tuvastamine...");
		
		voteSystem.jsonQuery("status", {statusType: "authStatus"}, false, function(data) {
			if(data.responseType == "status" && data.userInfo != null) {
				$("#authenticationResult").text("Veateade: " + data.statusMessage);
			}
			else {
				$("#authenticationResult").text("Tundmatu viga.");
			}
		});
		
		window.location.hash = "";
	}
	else if(window.location.hash.indexOf("#tab_") == 0) {
		voteSystem.requestTabActivation(window.location.hash.substr(1));
	}
	
	$(window).on("hashchange", function() {
		if(window.location.hash.indexOf("#tab_") == 0) {
			voteSystem.checkHashOnStatus = window.location.hash.substr(1);
			voteSystem.requestTabActivationOnStatus();
		}
	});
	
	voteSystem.resizeElements();
	
	$(window).resize(function() {
		voteSystem.resizeElements();
	});
	
	voteSystem.queryStatus();
	voteSystem.queryParties();
};

$(document).ready(function() {
	voteSystem.initialise();
});