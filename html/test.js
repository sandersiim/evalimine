var voteSystem = {}

voteSystem.userInfo = {}
voteSystem.loggedIn = false;
voteSystem.initialTabSet = false;
voteSystem.delayedTabName = null;
voteSystem.delayedTabParams = null;
voteSystem.activeMenuItem = "menu_mydata"
voteSystem.tabCallbacks = {};
voteSystem.menuList = ["menu_statistics", "menu_mydata", "menu_help", "menu_voting"];
voteSystem.partyList = {};
voteSystem.regionList = {};
voteSystem.partyListQuery = null;
voteSystem.regionListQuery = null;
voteSystem.candidateNameQuery = null;
voteSystem.lastSeenHash = null;
voteSystem.regionViewLoaded = false;
<<<<<<< HEAD
voteSystem.regionViewLastFilter = "";
voteSystem.votedCandidateName = "";
=======
voteSystem.candidateViewState = null;
>>>>>>> Implemented candidate statistics view

voteSystem.menuTabList = {
	"menu_statistics" : ["tab_stats_regions", "tab_stats_candidates", "tab_stats_parties", "tab_stats_map"],
	"menu_mydata" : ["tab_login", "tab_mydata", "tab_application", "tab_setregion"],
	"menu_help" : ["tab_help"],
	"menu_voting" : ["tab_err_login", "tab_voting", "tab_err_region"]
};

voteSystem.menuActiveTab = {
	"menu_statistics" : voteSystem.menuTabList["menu_statistics"][0],
	"menu_mydata" : voteSystem.menuTabList["menu_mydata"][0],
	"menu_help" : voteSystem.menuTabList["menu_help"][0],
	"menu_voting" : voteSystem.menuTabList["menu_voting"][0]
};

voteSystem.menuActiveTabParams = {
	"menu_statistics" : "",
	"menu_mydata" : "",
	"menu_help" : "",
	"menu_voting" : ""
};

voteSystem.resizeTabContents = function(tabElement) {
	var nameBlock = $(tabElement).children(".tabNameLabel");
	var multiNameBlock = $(tabElement).children(".tabNameLabelsMultiple");
	var headerBlock = $(tabElement).children(".tabHeader");
	var contentsBlock = $(tabElement).children(".tabContents");
	
	var heightRemaining = $("#content").height() - 35;
	
	if(contentsBlock) {
		heightRemaining -= $(tabElement).outerHeight() - $(tabElement).height();
		if(nameBlock) heightRemaining -= nameBlock.outerHeight();
		if(multiNameBlock) heightRemaining -= multiNameBlock.outerHeight();
		if(headerBlock) heightRemaining -= headerBlock.outerHeight();
		
		contentsBlock.height(heightRemaining);
	}
}

voteSystem.resizeElements = function() {
	$("#mainblock").height(Math.max($(window).height() - ($("#mainblock").outerHeight(true) - $("#mainblock").height()), 630));
	$("#content").height($("#mainblock").height() - $("#header").outerHeight()-$("#footer").outerHeight());
	
	var visibleTab = $(".tab.visible");
	
	if(visibleTab) {
		voteSystem.resizeTabContents(visibleTab.get());
	}
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
	voteSystem.activeMenuItem = newMenuSelection.id;

	voteSystem.changeActiveMenuClass(newMenuSelection);
	voteSystem.swapToActiveTabForMenuItem(newMenuSelection)
};

voteSystem.swapToActiveTabForMenuItem = function(selectedMenu) {
	if(voteSystem.menuActiveTab[selectedMenu.id]) {
		voteSystem.swapToTab(voteSystem.menuActiveTab[selectedMenu.id], voteSystem.menuActiveTabParams[selectedMenu.id]);
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

voteSystem.setActiveTab = function(tabName, tabParameters, activateMenu) {
	var menuItemName = voteSystem.getMenuItemNameForTab(tabName);
	
	if(menuItemName) {
		if(voteSystem.menuActiveTab[menuItemName]) {
			voteSystem.menuActiveTab[menuItemName] = tabName;
			voteSystem.menuActiveTabParams[menuItemName] = tabParameters;
		}

		if(voteSystem.activeMenuItem == menuItemName || activateMenu) {
			voteSystem.setActiveMenuItem($("#" + menuItemName)[0]);
		}
	}
};

voteSystem.updateHashSilently = function(newHash) {
	voteSystem.lastSeenHash = newHash;
	window.location.hash = newHash;
};

voteSystem.swapToTab = function(tabElement, tabParameters) {
	$.each($(".tab.visible"), function(index, oldTab) {
		voteSystem.removeClassFromElement(oldTab, "visible");
	});
	
	$.each($("#" + tabElement), function(index, newTab) {
		voteSystem.addClassToElement(newTab, "visible");
		
		if(voteSystem.tabCallbacks[newTab.id]) {
			voteSystem.tabCallbacks[newTab.id](newTab, tabParameters);
		}
		
		voteSystem.resizeTabContents(newTab);
		voteSystem.updateHashSilently("#" + newTab.id + ((tabParameters.length > 0) ? "-" + tabParameters : ""));
	});
	
	voteSystem.resizeElements();
};

voteSystem.jsonQuery = function(queryType, jsonObject, isPostQuery, doneFunction) {
	return $.ajax("dyn/" + queryType + "?json=" + JSON.stringify(jsonObject), {type: isPostQuery ? "POST" : "GET", dataType: "json"}).done(doneFunction);
};

voteSystem.setLoggedInStatus = function(isLoggedIn) {
	if(voteSystem.loggedIn != isLoggedIn) {
		if(isLoggedIn) {
			$("#menu_mydata").text("Minu andmed");
			voteSystem.setActiveTab("tab_mydata", "", false);
			
			if(voteSystem.userInfo.userInfo.voteRegionId == 0) {
				voteSystem.setActiveTab("tab_err_region", "", false);
			}
			else {
				voteSystem.setActiveTab("tab_voting", "", false);
			}
			
			if(voteSystem.userInfo.cardFirstName && voteSystem.userInfo.cardLastName) {
				$("#oldPasswordBlock").css("visibility", "hidden");
				$("#firstname").val(voteSystem.userInfo.cardFirstName);
				$("#lastname").val(voteSystem.userInfo.cardLastName);
			}
			else {
				$("#oldPasswordBlock").css("visibility", "visible");
				$("#oldPassword").val("");
				$("#firstname").val("");
				$("#lastname").val("");
			}
			
			$("#changePasswordErrorMessage").text("");
		}
		else {
			$("#menu_mydata").text("Logi sisse");
			
			voteSystem.setActiveTab("tab_login", "", false);
			voteSystem.setActiveTab("tab_err_login", "", false);
		}
		
	}
	voteSystem.refreshMyDataInfo();
	
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
		voteSystem.setActiveTab(redirectTab, "", true);
	}
}

voteSystem.queryStatus = function() {
	voteSystem.jsonQuery("status", {}, false, function(data) {
		if(data.responseType == "userInfo") {
			voteSystem.applyUserInfo(data);
		}
		
		if(!voteSystem.initialTabSet) {
			voteSystem.redirectBasedOnUserInfo();
		}
		
		voteSystem.requestTabActivationOnStatus();
	});
};

voteSystem.queryParties = function() {
	voteSystem.partyListQuery = voteSystem.jsonQuery("parties", {regionId:0, orderId:7}, false, function(data) {
		if(data.responseType == "parties" && data.partyList) {
			$.each(data.partyList, function(index, item) {
				voteSystem.partyList[item.partyId] = item;
			});
		}
	});
};

voteSystem.queryRegions = function() {
	voteSystem.regionListQuery = voteSystem.jsonQuery("regions", {resultMethod: 1}, false, function(data) {
		if(data.responseType == "regions" && data.regionList) {
			$.each(data.regionList, function(index, item) {
				voteSystem.regionList[item.regionId] = item;
			});
		}
	});
};

voteSystem.queryCandidateName = function(_candidateId) {
	voteSystem.candidateNameQuery = voteSystem.jsonQuery("candidate", {candidateId:_candidateId}, false, function(data) {
		if(data.responseType == "candidate" && data.candidateInfo) {
			voteSystem.votedCandidateName = data.candidateInfo.firstName + " " + data.candidateInfo.lastName;
		}
	});
};

voteSystem.setTabActivateCB = function(tabName, callbackFunction) {
	voteSystem.tabCallbacks[tabName] = callbackFunction;
};

voteSystem.requestTabActivation = function(tabName, tabParameters) {
	var menuName = voteSystem.getMenuItemNameForTab(tabName);
	if(!menuName) return;

	if(menuName == "menu_mydata" || menuName == "menu_voting") {
		voteSystem.delayedTabName = tabName;
		voteSystem.delayedTabParams = tabParameters;
	}
	else {
		voteSystem.setActiveTab(tabName, tabParameters, true);
	}
};

voteSystem.requestTabActivationOnStatus = function() {
	if(!voteSystem.delayedTabName) return;
	
	var tabName = voteSystem.delayedTabName, tabParameters = voteSystem.delayedTabParams;
	voteSystem.delayedTabName = null;
	
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
	
	voteSystem.setActiveTab(tabName, tabParameters, true);
};

voteSystem.voteForCandidate = function(candidateId) {
	var queryData = {voteCandidateId: candidateId};
	
	voteSystem.jsonQuery("vote", queryData, false, function(data) {
		if(data.responseType == "status") {
			if(data.statusCode == 10 || data.statusCode == 11) {
				voteSystem.userInfo.userInfo.votedCandidateId = candidateId;
				voteSystem.refreshVotingList();
				voteSystem.refreshMyDataInfo();
			}
			else {
				alert(data.statusMessage);
			}
		}
	});
}

voteSystem.refreshVotingList = function() {
	var queryData = {regionId: 0, partyId: 0, namePrefix:"", orderId:0, startIndex: 0, count: 1000};
	
	if(voteSystem.userInfo.userInfo["voteRegionId"]) {
		voteSystem.partyListQuery.success(function() {
			if(voteSystem.regionList[voteSystem.userInfo.userInfo["voteRegionId"]]) {
				var regionName = voteSystem.regionList[voteSystem.userInfo.userInfo["voteRegionId"]]["displayName"];
				$("#tab_voting .tabNameLabel").text("Hääletamine - Sinu piirkond: " + regionName);
			}
		});
	}

	voteSystem.jsonQuery("candidates", queryData, false, function(data) {
		var listElement = $("#votingCandidateList"), template = $("#candidateTemplate");
		var selectedId = voteSystem.userInfo.userInfo.votedCandidateId;
		listElement.html("");
	
		if(data.responseType == "candidates" && data.candidateList) {
			for(var i = 0; i < data.candidateList.length; i++) {
				var info = data.candidateList[i], element = template.clone();
				
				element.get().id = "";
				element.find(".candidateName").text(info.firstName + " " + info.lastName);
				element.find(".voteCount").text(info.voteCount);
				element.find(".partyName").text(info.partyId);
				element.find(".voteCandidateId").val(info.candidateId);
				
				voteSystem.partyListQuery.success(function() {
					if(voteSystem.partyList[info.partyId]) {
						element.find(".partyName").text(voteSystem.partyList[info.partyId].displayName);
					}
				});
				
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

voteSystem.addLineToRegionView = function(listElement, template, displayName, keyword, voterCount, candidateCount) {
	var element = template.clone();
	
	element.get().id = "";
	element.find(".regionName").text(displayName);
	element.find(".regionCandidateCount").text(candidateCount + " kandidaati");
	element.find(".regionVoterCount").text(voterCount + " hääletajat");
	element.find(".regionPartyStats").attr("href", "#tab_stats_parties-" + keyword);
	element.find(".regionCandidateStats").attr("href", "#tab_stats_candidates-" + keyword + "-all");
	
	if(keyword == "all") element.addClass("combined");
	
	listElement.append(element);
};

voteSystem.loadRegionView = function() {
	if(voteSystem.regionViewLoaded) return;
	
	voteSystem.regionViewLoaded = true;

	voteSystem.regionListQuery.success(function(data) {
		var listElement = $("#statsRegionList"), template = $("#regionTemplate");
		listElement.html("");
		
		var totalVoters = 0, totalCandidates = 0;
		
		for(var regionId in voteSystem.regionList) {
			totalVoters += voteSystem.regionList[regionId].totalVoters;
			totalCandidates += voteSystem.regionList[regionId].totalCandidates;
		}
		
		voteSystem.addLineToRegionView(listElement, template, "Kogu Eesti", "all", totalVoters, totalCandidates);
		
		for(var regionId in voteSystem.regionList) {
			var info = voteSystem.regionList[regionId];
		
			voteSystem.addLineToRegionView(listElement, template, info.displayName, info.keyword, info.totalVoters, info.totalCandidates);
			voteSystem.addLineToRegionView(listElement, template, info.displayName, info.keyword, info.totalVoters, info.totalCandidates);
			voteSystem.addLineToRegionView(listElement, template, info.displayName, info.keyword, info.totalVoters, info.totalCandidates);
			voteSystem.addLineToRegionView(listElement, template, info.displayName, info.keyword, info.totalVoters, info.totalCandidates);
			voteSystem.addLineToRegionView(listElement, template, info.displayName, info.keyword, info.totalVoters, info.totalCandidates);
			voteSystem.addLineToRegionView(listElement, template, info.displayName, info.keyword, info.totalVoters, info.totalCandidates);
			voteSystem.addLineToRegionView(listElement, template, info.displayName, info.keyword, info.totalVoters, info.totalCandidates);
			voteSystem.addLineToRegionView(listElement, template, info.displayName, info.keyword, info.totalVoters, info.totalCandidates);
			voteSystem.addLineToRegionView(listElement, template, info.displayName, info.keyword, info.totalVoters, info.totalCandidates);
		}
	});
};

voteSystem.findRegionFromKeyword = function(keyword) {
	if(keyword && keyword.length > 0) {	
		for(var regionId in voteSystem.regionList) {
			if(keyword == voteSystem.regionList[regionId].keyword) {
				return regionId;
			}
		}
	}
	
	return 0;
};

voteSystem.findPartyFromKeyword = function(keyword) {
	if(keyword && keyword.length > 0) {	
		for(var partyId in voteSystem.partyList) {
			if(keyword == voteSystem.partyList[partyId].keyword) {
				return partyId;
			}
		}
	}
	
	return 0;
};

voteSystem.addLineToCandidateView = function(listElement, template, candidateName, partyName, regionName, voteCount) {
	var element = template.clone();
	
	element.get().id = "";
	element.find(".candidateName").text(candidateName);
	element.find(".partyName").text(partyName);
	element.find(".regionName").text(regionName);
	element.find(".voteCount").text(voteCount);
	
	listElement.append(element);
};

voteSystem.loadCandidateView = function(params) {
	$.when(voteSystem.regionListQuery, voteSystem.partyListQuery).done( function() {
		if(voteSystem.candidateViewState == null) {
			for(var regionId in voteSystem.regionList) {
				$("#candidateViewRegionFilter").append($("<option>", {
					value: voteSystem.regionList[regionId].keyword,
					text: voteSystem.regionList[regionId].displayName
				}));
			}
			
			for(var partyId in voteSystem.partyList) {
				$("#candidateViewPartyFilter").append($("<option>", {
					value: voteSystem.partyList[partyId].keyword,
					text: voteSystem.partyList[partyId].displayName
				}));
			}
		}
		
		if(params != voteSystem.candidateViewState) {
			var paramList = params.split("-");
			var findRegionId = voteSystem.findRegionFromKeyword(paramList[0]);
			var findPartyId = voteSystem.findPartyFromKeyword(paramList[1]);
			
			var queryData = {regionId: findRegionId, partyId: findPartyId, namePrefix: "", orderId: 4, startIndex: 0, count: 1000};
			
			voteSystem.jsonQuery("candidates", queryData, false, function(data) {
				if(data.responseType == "candidates" && data.candidateList) {
					var listElement = $("#statsCandidateList"), template = $("#candidateStatsTemplate");
					listElement.html("");
					
					for(var i = 0; i < data.candidateList.length; i++) {
						var info = data.candidateList[i];
						var partyName = voteSystem.partyList[info.partyId].displayName;
						var regionName = voteSystem.regionList[info.regionId].displayName;
						
						voteSystem.addLineToCandidateView(listElement, template, info.firstName + " " + info.lastName, partyName, regionName, info.voteCount);
					}
				}
			});
		
			voteSystem.candidateViewState = params;
		}
	});
};

voteSystem.candidateFiltersChanged = function() {
	$.when(voteSystem.regionListQuery, voteSystem.partyListQuery).done( function() {
		var regionKeyword = $("#candidateViewRegionFilter").val(), partyKeyword = $("#candidateViewPartyFilter").val();
		
		window.location.hash = "#tab_stats_candidates-" + regionKeyword + "-" + partyKeyword;
	});
};

voteSystem.refreshMyDataInfo = function() {
	if (voteSystem.userInfo.userInfo) {
		$("#myDataIdCode").text(voteSystem.userInfo.userInfo["username"]);
		if ( voteSystem.userInfo.userInfo["voteRegionId"] ) {	
			voteSystem.removeClassFromElement($("#myDataApplication")[0],"greyText");
			voteSystem.removeClassFromElement($("#myDataVoting")[0],"greyText");
			voteSystem.removeClassFromElement($("#myDataRegion")[0],"errorMessage" );			
			voteSystem.regionListQuery.success(function() {
				$("#myDataRegion").text(voteSystem.regionList[voteSystem.userInfo.userInfo["voteRegionId"]]["displayName"]);
				$("#myDataApplyRegion").text(voteSystem.regionList[voteSystem.userInfo.userInfo["voteRegionId"]]["displayName"]);
			});
			
			$("#toSetRegionLink").remove();
			if ( voteSystem.userInfo.userInfo.votedCandidateId ) {
				voteSystem.removeClassFromElement($("#myDataVoting")[0],"errorMessage" );
				if ( !voteSystem.votedCandidateName ) {
					voteSystem.queryCandidateName(voteSystem.userInfo.userInfo.votedCandidateId);
				}
				voteSystem.candidateNameQuery.success(function() {
					$("#myDataVoting").html("<span class=\"greenText\">Hääl antud: </span>"+voteSystem.votedCandidateName);
				});				
				$("#toVotingLink").remove();
			} else {
				voteSystem.addClassToElement($("#myDataVoting")[0],"errorMessage" );
				$("#myDataVoting").text("Te pole oma häält veel andnud!");
				if (!$("#toVotingLink")[0]) {
					$("#myDataVoting").after("<a id=\"toVotingLink\" href=\"#tab_voting\">Mine hääletama</a>");	
				}			
			}
			if ( voteSystem.userInfo.candidateInfo) {
				voteSystem.removeClassFromElement($("#myDataName").parent()[0],"displayNone");				
				$("#myDataName").text(voteSystem.userInfo.candidateInfo["firstName"]+" "+voteSystem.userInfo.candidateInfo["lastName"]);
				voteSystem.addClassToElement($("#myDataApplication")[0],"greenText");
				$("#myDataApplication").text("Te kandideerite oma piirkonnas");
				$("#toApplicationLink").remove();
			} else {
				voteSystem.addClassToElement($("#myDataName").parent()[0],"displayNone");
				$("#myDataName").text("");
				$("#myDataApplication").text("");
				if (!$("#toApplicationLink")[0]) {
					$("#myDataApplication").after("<a id=\"toApplicationLink\" href=\"#tab_application\">Kandideeri oma piirkonnas</a>"); 
				}
			}
		} else {
			voteSystem.addClassToElement($("#myDataName").parent()[0],"displayNone");
			$("#toApplicationLink").remove();
			$("#toVotingLink").remove();
			voteSystem.addClassToElement($("#myDataRegion")[0],"errorMessage" );
			$("#myDataRegion").text("Teil on piirkond määramata!");
			$("#myDataApplyRegion").text("");			
			if (!$("#toSetRegionLink")[0]) {
				$("#myDataRegion").after("<a id=\"toSetRegionLink\" href=\"linkButton\">Määra piirkond</a>");
			}
			voteSystem.addClassToElement($("#myDataApplication")[0],"greyText");
			voteSystem.addClassToElement($("#myDataVoting")[0],"greyText");
			$("#myDataApplication").text("Kandideerimiseks peate piirkonna määrama.");
			$("#myDataVoting").text("Hääletamiseks peate piirkonna määrama.");
		}		
	} 
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
	voteSystem.queryRegions();
	voteSystem.queryStatus();
	voteSystem.queryParties();	
	
	$(".menuitem").click( function() {
		voteSystem.setActiveMenuItem(this);
	});
	
	voteSystem.setTabActivateCB("tab_voting", function(tabElement) {
		voteSystem.refreshVotingList();
	});	
	
	voteSystem.setTabActivateCB("tab_stats_regions", function(tabElement) {
		voteSystem.loadRegionView();
	});
	
	voteSystem.setTabActivateCB("tab_stats_candidates", function(tabElement, parameters) {
		voteSystem.loadCandidateView(parameters);
	});	

	$("#loginByPassword").submit( function() {
		$("#loginErrorMessage").text("");
		
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
		$("#authErrorMessage").text("");
		
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
	
	$("#changePassword").submit(function(event) {
		$("#changePasswordErrorMessage").text("");
		
		voteSystem.jsonQuery("changepass", {oldPassword:$("#oldPassword").val(), newPassword:$("#newPassword").val(), newPasswordRepeat:$("#newPasswordConfirmation").val()}, false, function(data) {
			if(data.responseType == "status") {
				voteSystem.removeClassFromElement($("#changePasswordErrorMessage")[0],"greenText");
				if(data.statusCode < 0) $("#changePasswordErrorMessage").text("Süsteemi viga.");
				else if(data.statusCode == 1) $("#changePasswordErrorMessage").text("Pole sisse logitud.");
				else if(data.statusCode == 2) $("#changePasswordErrorMessage").text("Uus salasõna alla 5 tähemärgi.");
				else if(data.statusCode == 3) $("#changePasswordErrorMessage").text("Uued salasõnad ei kattu.");
				else if(data.statusCode == 4) $("#changePasswordErrorMessage").text("Vana salasõna ei ole õige.");
				else if(data.statusCode == 10) {
					voteSystem.addClassToElement($("#changePasswordErrorMessage")[0],"greenText");
					$("#changePasswordErrorMessage").text("Salasõna edukalt muudetud.");
				}
				
				$("#oldPassword").val("");
				$("#newPassword").val("");
				$("#newPasswordConfirmation").val("");
			}
		});
		
		return false;
	});

	$("#setRegionForm").submit( function(event) {
		$("#setRegionErrorMessage").text("");
		var selectedRegionId = $("#regions").val();
		if (selectedRegionId == "") {
			$("#setRegionErrorMessage").text("Palun valige piirkond");
		} else {
			var regionName = $("#regions").find(":selected").text();
			voteSystem.confirmMessage("Kinnita", "Kas olete kindel, et soovite oma piirkonnaks määrata "+regionName+"? "+
				"Pärast kinnitamist ei saa te enam oma piirkonda muuta.", function() {
				voteSystem.jsonQuery("setregion", {regionId:selectedRegionId}, false, function(data) {
					if(data.responseType == "status") {
						if(data.statusCode < 0) $("#setRegionErrorMessage").text("Süsteemi viga.");
						else if(data.statusCode == 1) $("#setRegionErrorMessage").text("Pole sisse logitud.");
						else if(data.statusCode == 3) $("#setRegionErrorMessage").text("Seda piirkonda pole olemas.");
						else if(data.statusCode == 10) {
							$("#setRegionErrorMessage").text("");
							voteSystem.userInfo.userInfo["voteRegionId"] = selectedRegionId;
							voteSystem.refreshMyDataInfo();
							voteSystem.setActiveTab("tab_mydata", "", false);
							voteSystem.setActiveTab("tab_voting", "", false);
						}						
					}
				});
			});

			return false;			
		}

		return false;
	});
	
	$("#logoutForm").submit(function(event) {
		voteSystem.jsonQuery("logout", {}, false, function(data) {
			voteSystem.applyUserInfo({userInfo:null, candidateInfo:null});
		});
		
		return false;
	});

	$("#toMyDataButton").click( function() {
		voteSystem.setActiveTab("tab_mydata", "", false);
	});

	$("#toMyDataButton2").click( function() {
		voteSystem.setActiveTab("tab_mydata", "", false);
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
		var hashString = window.location.hash.substr(1);
		var dashPosition = hashString.indexOf("-");
		
		voteSystem.initialTabSet = true;
		
		if(dashPosition < 0) {
			voteSystem.requestTabActivation(hashString, "");
		}
		else {
			voteSystem.requestTabActivation(hashString.slice(0, dashPosition), hashString.slice(dashPosition + 1));
		}
	}
	
	$(window).on("hashchange", function() {
		if(voteSystem.lastSeenHash != window.location.hash) {
			if(window.location.hash.indexOf("#tab_") == 0) {
				var hashString = window.location.hash.substr(1);
				var dashPosition = hashString.indexOf("-");
				
				if(dashPosition < 0) {
					voteSystem.delayedTabName = hashString;
					voteSystem.delayedTabParams = "";
				}
				else {
					voteSystem.delayedTabName = hashString.slice(0, dashPosition);
					voteSystem.delayedTabParams = hashString.slice(dashPosition + 1);
				}
				
				voteSystem.requestTabActivationOnStatus();
			}
		}
		
		voteSystem.lastSeenHash = window.location.hash;
	});

	$("#uploaderDragDrop").on("drop", function(event) {
		if(event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
			//fileUpload(event.dataTransfer.files[0]);
		}
		
		return false;
	});
	
	
	
	$("#regionViewFilter").focus(function(event) {
		if($("#regionViewFilter").val() == "Filtreeri piirkondi") {
			$("#regionViewFilter").val("");
		}
		
		$("#regionViewFilter").css("color", "#000000");
	});
	
	$("#regionViewFilter").blur(function(event) {
		if($("#regionViewFilter").val() == "") {
			$("#regionViewFilter").css("color", "#aaaaaa");
			$("#regionViewFilter").val("Filtreeri piirkondi");
		}
	});
	
	$("#candidateViewNameFilter").focus(function(event) {
		if($("#candidateViewNameFilter").val() == "Filtreeri nimesid") {
			$("#candidateViewNameFilter").val("");
		}
		
		$("#candidateViewNameFilter").css("color", "#000000");
	});
	
	$("#candidateViewNameFilter").blur(function(event) {
		if($("#candidateViewNameFilter").val() == "") {
			$("#candidateViewNameFilter").css("color", "#aaaaaa");
			$("#candidateViewNameFilter").val("Filtreeri nimesid");
		}
	});
	
	$("#candidateViewRegionFilter").change(function(event) {
		voteSystem.candidateFiltersChanged();
	});
	
	$("#candidateViewPartyFilter").change(function(event) {
		voteSystem.candidateFiltersChanged();
	});
	
	
	$("#uploaderDragDrop").click(function(event) {
		$("#uploaderFile").click();
	});
	
	$("#uploaderFile").change(function(event) {
		if(this.files.length > 0) {
			//fileUpload(this.files[0]);
		}
	});
	
	$("#uploaderForm").submit(function(event) {
		return false;
	});
	
	voteSystem.resizeElements();
	
	$(window).resize(function() {
		voteSystem.resizeElements();
	});
};

$(document).ready(function() {
	voteSystem.initialise();
});