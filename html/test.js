/* global Storage, $, google, alert, InfoBox, jQuery */
/* jslint curly: false */ /* can do "if() then;" without braces */
/* jslint eqeq: true */ /* allow double equals */
/* jshint -W069 */ /* don't whine about not using dot notation - dot notation makes less sense in places where JSHint suggests it */
/* jshint -W089 */ /* no if filter required in for(var a in b) since I use continue instead */
/* jshint -W083 */ /* functions within a loop - this is deliberate so each fn has the scope of that loop instance */
/* jshint -W098 */ /* don't whine about arguments that are never used - it's better than just omitting them */
/* jshint -W035 */ /* allow empty blocks - for some unimplemented/commented stuff */
/* jshint -W004 */ /* no 'already defined' errors - JSHint wrongly handles for(var ...), so gives invalid warnings */

(function() { "use strict";

Storage.prototype.setObject = function(key, value) {
	this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key) {
	var value = this.getItem(key);
	return value && JSON.parse(value);
};

var imageLoader = { cSpeed: 8, cWidth: 75, cHeight: 75, cTotalFrames: 75, cFrameWidth: 75, cImageSrc: "images/sprites.gif",
	cImageTimeout: false, cIndex: 0, cXpos: 0, secondsBetweenFrames: 0, FPS: 0, genImage: null};
	
imageLoader.initialise = function() {
	clearTimeout(imageLoader.cImageTimeout);
	imageLoader.cImageTimeout = 0;
	imageLoader.genImage = new Image();
	imageLoader.genImage.onload = function() { imageLoader.cImageTimeout = setTimeout(imageLoader.startAnimation, 0); };
	imageLoader.genImage.onerror = function() { alert("Could not load the image"); };
	imageLoader.genImage.src = imageLoader.cImageSrc;
};

imageLoader.startAnimation = function() {
	document.getElementById("loaderImage").style.backgroundImage = "url('" + imageLoader.cImageSrc + "')";
	document.getElementById("loaderImage").style.width = imageLoader.cWidth + "px";
	document.getElementById("loaderImage").style.height = imageLoader.cHeight + "px";
	
	imageLoader.FPS = Math.round(100 / imageLoader.cSpeed);
	imageLoader.secondsBetweenFrames = 1 / imageLoader.FPS;
	
	setTimeout(imageLoader.continueAnimation, imageLoader.secondsBetweenFrames / 1000);
};

imageLoader.stopAnimation = function() {
	imageLoader.cIndex = imageLoader.cTotalFrames;
};

imageLoader.continueAnimation = function() {
	imageLoader.cXpos += imageLoader.cFrameWidth;
	imageLoader.cIndex += 1;
	
	if (imageLoader.cIndex >= imageLoader.cTotalFrames) {
		imageLoader.cXpos = 0;
		imageLoader.cIndex = 0;
	}
	
	document.getElementById("loaderImage").style.backgroundPosition = (-imageLoader.cXpos) + "px 0";
	
	setTimeout(imageLoader.continueAnimation, imageLoader.secondsBetweenFrames * 1000);
};

var voteSystem = {};

voteSystem.userInfo = {};
voteSystem.loggedIn = false;
voteSystem.initialTabSet = false;
voteSystem.delayedTabName = null;
voteSystem.delayedTabParams = null;
voteSystem.activeMenuItem = "menu_mydata";
voteSystem.tabCallbacks = {};
voteSystem.menuList = ["menu_statistics", "menu_mydata", "menu_help", "menu_voting"];
voteSystem.partyList = {};
voteSystem.regionList = {};
voteSystem.candidateList = {};
voteSystem.partyListQuery = null;
voteSystem.regionListQuery = null;
voteSystem.candidateNameQuery = null;
voteSystem.candidateListQuery = null;
voteSystem.lastSeenHash = null;
voteSystem.regionViewLoaded = false;
voteSystem.regionViewLastFilter = "";
voteSystem.votedCandidateName = "";
voteSystem.candidateViewState = null;
voteSystem.partyViewState = null;
voteSystem.regionSelectLoaded = false;
voteSystem.candidateFilterDelay = null;

voteSystem.map = null;
voteSystem.mapMarkers = {};

voteSystem.pageLoaded = $.Deferred();

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

voteSystem.sortItemList = function(itemList, sortMethods, sortMethodQueue) {
	itemList.sort( function(a, b) {
		for(var methodId in sortMethodQueue) {
			if(!sortMethodQueue.hasOwnProperty(methodId)) continue;
			
			var compareResult = sortMethods[sortMethodQueue[methodId]](a, b);
			
			if(compareResult !== 0) return compareResult;
		}
		
		return 0;
	});
};

voteSystem.getUpdatedSortMethodQueue = function(newMethod, oldQueue, sortMethods) {
	for(var methodName in sortMethods) {
		if(!sortMethods.hasOwnProperty(methodName)) continue;
		
		$("#" + methodName).removeClass("primarySortMethod secondarySortMethod tertiarySortMethod");
	}

	var methodCriteria = newMethod.indexOf("_") >= 0 ? newMethod.substr(0, newMethod.indexOf("_")) : newMethod;
	var newMethodList = [newMethod];
	
	for(var methodId in oldQueue) {
		if(!oldQueue.hasOwnProperty(methodId)) continue;
		
		var methodName = oldQueue[methodId];
		var currentMethodCriteria = methodName.indexOf("_") >= 0 ? methodName.substr(0, methodName.indexOf("_")) : methodName;
		
		if(currentMethodCriteria != methodCriteria && newMethodList.length < 3) {
			newMethodList.push(methodName);
		}
	}
	
	if(newMethodList.length > 0) $("#" + newMethodList[0]).addClass("primarySortMethod");
	if(newMethodList.length > 1) $("#" + newMethodList[1]).addClass("secondarySortMethod");
	if(newMethodList.length > 2) $("#" + newMethodList[2]).addClass("tertiarySortMethod");
	
	return newMethodList;
};

voteSystem.sortMethodAttachClickHandler = function(methodName, sortMethods, sortQueueName, changeCallback) {
	$("#" + methodName).click( function(event) {
		voteSystem[sortQueueName] = voteSystem.getUpdatedSortMethodQueue(methodName, voteSystem[sortQueueName], sortMethods);

		changeCallback();
	});
};

voteSystem.initialiseSortingMethods = function(sortMethods, sortQueueName, changeCallback) {
	for(var methodName in sortMethods) {
		if(!sortMethods.hasOwnProperty(methodName)) continue;
		
		voteSystem.sortMethodAttachClickHandler(methodName, sortMethods, sortQueueName, changeCallback);
	}
	
	voteSystem.getUpdatedSortMethodQueue(voteSystem[sortQueueName][0], voteSystem[sortQueueName], sortMethods);
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
};

voteSystem.resizeElements = function() {
	$("#mainblock").height(Math.max($(window).height() - ($("#mainblock").outerHeight(true) - $("#mainblock").height()), 630)-1);
	$("#content").height($("#mainblock").height() - $("#headerContainer").outerHeight()-$("#footer").outerHeight());
	
	var visibleTab = $(".tab.visible");
	
	if(visibleTab) {
		voteSystem.resizeTabContents(visibleTab.get());
	}
};

voteSystem.resizeForPrint = function() {
	var visibleTab = $(".tab.visible");
	
	if(visibleTab) {
		var contentsBlock = visibleTab.children(".tabContents");
		contentsBlock.height(contentsBlock.prop("scrollHeight"));
		visibleTab.height(visibleTab.prop("scrollHeight"));
		$("#content").height($("#content").prop("scrollHeight"));
		$("#mainblock").height($("#content").outerHeight() + $("#header").outerHeight() + $("#footer").outerHeight());
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
	voteSystem.swapToActiveTabForMenuItem(newMenuSelection);
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
		voteSystem.resizeElements();
		
		if(voteSystem.tabCallbacks[newTab.id]) {
			voteSystem.tabCallbacks[newTab.id](newTab, tabParameters);
		}
		
		voteSystem.updateHashSilently("#" + newTab.id + ((tabParameters.length > 0) ? "-" + tabParameters : ""));
	});
	
};

voteSystem.jsonQuery = function(queryType, jsonObject, isPostQuery, doneFunction, failFunction, alwaysFunction) {
	if(isPostQuery) 
		return $.post("dyn/" + queryType, {"json": JSON.stringify(jsonObject)}, function() { }, "json")
			.done(doneFunction).fail(failFunction).always(alwaysFunction);
	else 
		return $.get("dyn/" + queryType, {"json": JSON.stringify(jsonObject)}, function() { }, "json")
			.done(doneFunction).fail(failFunction).always(alwaysFunction);
};

voteSystem.setLoggedInStatus = function(isLoggedIn) {
	if(voteSystem.loggedIn != isLoggedIn) {
		if(isLoggedIn) {
			$("#menu_mydata").text("Minu andmed");
			voteSystem.setActiveTab("tab_mydata", "", false);
			
			if(voteSystem.userInfo.userInfo.voteRegionId === 0) {
				voteSystem.setActiveTab("tab_err_region", "", false);
			}
			else {
				voteSystem.setActiveTab("tab_voting", "", false);
			}
			
			if(voteSystem.userInfo.cardFirstName && voteSystem.userInfo.cardLastName) {
				$("#oldPasswordBlock").css("display", "none");
				$("#applicationFirstName").val(voteSystem.userInfo.cardFirstName);
				$("#applicationLastName").val(voteSystem.userInfo.cardLastName);
			}
			else {
				$("#oldPasswordBlock").css("display", "block");
				$("#oldPassword").val("");
				$("#applicationFirstName").val("");
				$("#applicationLastName").val("");
			}
			
			$("#changePasswordErrorMessage").text("");
			$("#candidacyUploadImg").attr("src", "./images/scary_face.png");
			$("#applicationErrorMessage").text("");
		}
		else {
			$("#menu_mydata").text("Logi sisse");
			voteSystem.queryCandidateName = null;
			voteSystem.setActiveTab("tab_login", "", false);
			voteSystem.setActiveTab("tab_err_login", "", false);
		}
		
	}
	voteSystem.refreshMyDataInfo();
	
	voteSystem.loggedIn = isLoggedIn;
};

voteSystem.applyUserInfo = function(newUserInfo) {
	voteSystem.userInfo = newUserInfo;
	localStorage.setObject("userInfo", newUserInfo);
	
	if(newUserInfo.userInfo !== null) {
		voteSystem.setLoggedInStatus(true);
	}
	else {
		voteSystem.setLoggedInStatus(false);
	}
};

voteSystem.redirectBasedOnUserInfo = function() {
	if(!voteSystem.loggedIn) return;
	
	var redirectTab = null;
	
	if(voteSystem.userInfo.userInfo.voteRegionId === 0) {
		redirectTab = "tab_mydata";
	}
	else if(voteSystem.userInfo.userInfo.votedCandidateId === 0) {
		redirectTab = "tab_voting";
	}
	
	if(redirectTab) {
		voteSystem.setActiveTab(redirectTab, "", true);
	}
};

voteSystem.queryStatus = function() {
	voteSystem.pageLoaded.done( function() {
		voteSystem.showLoader();
	});
	
	voteSystem.jsonQuery("status", {}, false, function(data) {
		voteSystem.pageLoaded.done( function() {
			if(data.responseType == "userInfo") {
				voteSystem.applyUserInfo(data);			
			}
			
			if(!voteSystem.initialTabSet) {
				voteSystem.redirectBasedOnUserInfo();
			}
			
			voteSystem.requestTabActivationOnStatus();
		});
	}, function() {
		voteSystem.pageLoaded.done( function() {
			if (localStorage.getObject("userInfo") ) {
				voteSystem.applyUserInfo(localStorage.getObject("userInfo"));
				if(!voteSystem.initialTabSet) {
					voteSystem.redirectBasedOnUserInfo();
				}
				
				voteSystem.requestTabActivationOnStatus();
			}
		});
	}, function() {
		voteSystem.pageLoaded.done( function() {
			voteSystem.hideLoader();
		});
	});
};

voteSystem.queryParties = function() {
	voteSystem.partyListQuery = voteSystem.jsonQuery("parties", {regionId:0, orderId:7}, false, function(data) {
		if(data.responseType == "parties" && data.partyList) {
			$.each(data.partyList, function(index, item) {
				voteSystem.partyList[item.partyId] = item;
			});
			
			voteSystem.loadApplicationPartyList();
			localStorage.setObject("partyList", voteSystem.partyList);
		}
	}, function() {
		if (localStorage.getObject("partyList")) {
			voteSystem.partyList = localStorage.getObject("partyList");
						
			voteSystem.loadApplicationPartyList();
		}
	}, null);
};

voteSystem.queryRegions = function() {
	voteSystem.regionListQuery = voteSystem.jsonQuery("regions", {resultMethod: 1}, false, function(data) {
		if(data.responseType == "regions" && data.regionList) {
			$.each(data.regionList, function(index, item) {
				voteSystem.regionList[item.regionId] = item;
			});
			
			voteSystem.loadSetRegionRegionList();
			localStorage.setObject("regionList", voteSystem.regionList);
		}
	}, function() {
		if (localStorage.getObject("regionList")) {
			voteSystem.regionList = localStorage.getObject("regionList");
						
			voteSystem.loadSetRegionRegionList();
		}
	},null);
};

voteSystem.queryCandidates = function() {
	voteSystem.candidateListQuery = voteSystem.jsonQuery("candidates", {count: 10000}, false, function(data) {
		if(data.responseType == "candidates" && data.candidateList) {
			$.each(data.candidateList, function(index, item) {
				voteSystem.candidateList[item.candidateId] = item;
			});
			
			localStorage.setObject("candidateList", voteSystem.candidateList);
		}
	}, function() {
		if (localStorage.getObject("candidateList")) {
			voteSystem.candidateList = localStorage.getObject("candidateList");
		}
	}, null);
};

voteSystem.queryCandidateName = function(_candidateId) {
	voteSystem.candidateNameQuery = voteSystem.jsonQuery("candidate", {candidateId:_candidateId}, false, function(data) {
		if(data.responseType == "candidate" && data.candidateInfo) {
			voteSystem.votedCandidateName = data.candidateInfo.firstName + " " + data.candidateInfo.lastName;
			localStorage["votedCandidateName"] = voteSystem.votedCandidateName;
		}
	}, function() {
		if (localStorage["votedCandidateName"]) {
			voteSystem.votedCandidateName = localStorage["votedCandidateName"];
		}
	}, null);
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
	
	voteSystem.jsonQuery("vote", queryData, true, function(data) {
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
	}, null, null);
};

voteSystem.refreshVotingList = function() {
	voteSystem.showLoader();
	
	if(voteSystem.userInfo.userInfo["voteRegionId"]) {
		voteSystem.regionListQuery.done(function() {
			if(voteSystem.regionList[voteSystem.userInfo.userInfo["voteRegionId"]]) {
				var regionName = voteSystem.regionList[voteSystem.userInfo.userInfo["voteRegionId"]]["displayName"];
				$("#tab_voting .tabNameLabel").text("Hääletamine - Sinu piirkond: " + regionName);
			}
		});
		voteSystem.regionListQuery.fail(function() {
			if ( localStorage.getObject("regionList") ) {
				voteSystem.regionList = localStorage.getObject("regionList");
				if(voteSystem.regionList[voteSystem.userInfo.userInfo["voteRegionId"]]) {
					var regionName = voteSystem.regionList[voteSystem.userInfo.userInfo["voteRegionId"]]["displayName"];
					$("#tab_voting .tabNameLabel").text("Hääletamine - Sinu piirkond: " + regionName);
				}
			}
		});
	}

	var populateCandidateList = function() {
		var listElement = $("#votingCandidateList"), template = $("#candidateTemplate");
		var selectedId = voteSystem.userInfo.userInfo.votedCandidateId;
		listElement.html("");

		var availableCandidates = [];

		for (var candidateId in voteSystem.candidateList) {
			if(!voteSystem.candidateList.hasOwnProperty(candidateId)) continue;
			
			if ( voteSystem.candidateList[candidateId].regionId == voteSystem.userInfo.userInfo.voteRegionId ) {
				availableCandidates.push(voteSystem.candidateList[candidateId]);
			}
		}
		
		for(var i = 0; i < availableCandidates.length; i++) {
			var info = availableCandidates[i], element = template.clone();
			
			element.get().id = "";
			element.find(".candidateName").text(info.firstName + " " + info.lastName);
			element.find(".voteCount").text(info.voteCount);
			element.find(".partyName").text(info.partyId);
			element.find(".voteCandidateId").val(info.candidateId);
			
			voteSystem.partyListQuery.done(function() {
				if(voteSystem.partyList[info.partyId]) {
					element.find(".partyName").text(voteSystem.partyList[info.partyId].displayName);
					element.find(".partyLogoImg").attr("src", "./images/parties/party_" + voteSystem.partyList[info.partyId].keyword + "_medium.png");
				}
			});
			voteSystem.partyListQuery.fail(function() {
				if (localStorage.getObject("partyList")) {
					voteSystem.partyList = localStorage.getObject("partyList");
					
					if(voteSystem.partyList[info.partyId]) {
						element.find(".partyName").text(voteSystem.partyList[info.partyId].displayName);
						element.find(".partyLogoImg").attr("src", "./images/parties/party_" + voteSystem.partyList[info.partyId].keyword + "_medium.png");
					}
				}
			});
			
			if(selectedId === 0) {
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
			
			if(info.hasPhoto > 0) {
				element.find(".photoImg").attr("src", "./userimg/candidate_" + info.candidateId + ".jpg");
			}
		}	
		voteSystem.hideLoader();
	};

	voteSystem.candidateListQuery.done(populateCandidateList);
	voteSystem.candidateListQuery.fail( function() {
		if ( localStorage.getObject("candidateList") ) {
			voteSystem.candidateList = localStorage.getObject("candidateList");
			populateCandidateList();
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

voteSystem.regionSortMethods = {
	"sortRegionName_Asc" : function(a, b) {
		if(a.displayName < b.displayName) return 1;
		else if(a.displayName  > b.displayName) return -1;
		else return 0;
	}, 
	
	"sortRegionCandidateCount_Asc" : function(a, b) {
		if(a.totalCandidates < b.totalCandidates) return -1;
		else if(a.totalCandidates > b.totalCandidates) return 1;
		else return 0;
	}, 
	
	"sortCandidateVoterCount_Asc" : function(a, b) {
		if(a.totalVoters < b.totalVoters) return -1;
		else if(a.totalVoters > b.totalVoters) return 1;
		else return 0;
	}
};

voteSystem.regionSortMethods["sortRegionName_Desc"] = function(a, b) { return -voteSystem.regionSortMethods["sortRegionName_Asc"](a, b); };
voteSystem.regionSortMethods["sortRegionCandidateCount_Desc"] = function(a, b) { return -voteSystem.regionSortMethods["sortRegionCandidateCount_Asc"](a, b); };
voteSystem.regionSortMethods["sortCandidateVoterCount_Desc"] = function(a, b) { return -voteSystem.regionSortMethods["sortCandidateVoterCount_Asc"](a, b); };

voteSystem.regionSortMethodQueue = ["sortRegionName_Desc"];

voteSystem.currentRegionList = null;

voteSystem.resortRegionView = function() {
	if(!voteSystem.currentRegionList) return;
	
	voteSystem.sortItemList(voteSystem.currentRegionList, voteSystem.regionSortMethods, voteSystem.regionSortMethodQueue);
	
	var listElement = $("#statsRegionList"), template = $("#regionTemplate");
	listElement.html("");
	
	var totalVoters = 0, totalCandidates = 0;
	
	for(var i = 0; i < voteSystem.currentRegionList.length; i++) {
		totalVoters += voteSystem.currentRegionList[i].totalVoters;
		totalCandidates += voteSystem.currentRegionList[i].totalCandidates;
	}
	
	voteSystem.addLineToRegionView(listElement, template, "Kogu Rooma", "all", totalVoters, totalCandidates);
	
	for(var i = 0; i < voteSystem.currentRegionList.length; i++) {
		var info = voteSystem.currentRegionList[i];
	
		voteSystem.addLineToRegionView(listElement, template, info.displayName, info.keyword, info.totalVoters, info.totalCandidates);
	}
};

voteSystem.loadRegionView = function() {
	if(voteSystem.regionViewLoaded) return;
	
	voteSystem.showLoader();
	
	voteSystem.regionViewLoaded = true;

	voteSystem.regionListQuery.done(function(data) {
		voteSystem.currentRegionList = [];
		
		for(var regionId in voteSystem.regionList) {
			if(!voteSystem.regionList.hasOwnProperty(regionId)) continue;
			
			voteSystem.currentRegionList.push(voteSystem.regionList[regionId]);
		}
		
		voteSystem.resortRegionView();
		voteSystem.hideLoader();
	});

	voteSystem.regionListQuery.fail(function(data) {
		if ( localStorage.getObject("regionList") ) {
			voteSystem.regionList = localStorage.getObject("regionList");
			voteSystem.currentRegionList = [];
		
			for(var regionId in voteSystem.regionList) {
				if(!voteSystem.regionList.hasOwnProperty(regionId)) continue;
				
				voteSystem.currentRegionList.push(voteSystem.regionList[regionId]);
			}
			
			voteSystem.resortRegionView();
			voteSystem.hideLoader();
		}
	});
};

voteSystem.regionFromKeyword = function(keyword) {
	if(keyword && keyword.length > 0) {	
		for(var regionId in voteSystem.regionList) {
			if(!voteSystem.regionList.hasOwnProperty(regionId)) continue;
			
			if(keyword == voteSystem.regionList[regionId].keyword) {
				return regionId;
			}
		}
	}
	
	return 0;
};

voteSystem.keywordFromRegion = function(regionId) {
	if(voteSystem.regionList[regionId]) {
		return voteSystem.regionList[regionId].keyword;
	}
	else {
		return "all";
	}
};

voteSystem.partyFromKeyword = function(keyword) {
	if(keyword && keyword.length > 0) {	
		for(var partyId in voteSystem.partyList) {
			if(!voteSystem.partyList.hasOwnProperty(partyId)) continue;
			
			if(keyword == voteSystem.partyList[partyId].keyword) {
				return partyId;
			}
		}
	}
	
	return 0;
};

voteSystem.keywordFromParty = function(partyId) {
	if(voteSystem.partyList[partyId]) {
		return voteSystem.partyList[partyId].keyword;
	}
	else {
		return "all";
	}
};

voteSystem.wrapSpanInParent = function(spanElement) {
	var parent = spanElement.parent();

	if(spanElement.width() >= parent.width()) {
		spanElement.css("width", (parent.width() - 20) + "px");
		spanElement.attr("class", "wrappedText");
		spanElement.attr("title", spanElement.text());
		
		parent.append($("<div>", {text: "...", class: "wrappedEtc"} ));
		parent.append($("<div>", {class: "clear"} ));
	}
};

voteSystem.placeTextAsSpanInElement = function(element, spanText) {
	var spanElement = $("<span>", {	text: spanText } );
	spanElement.css("white-space", "nowrap");
	
	element.html(spanElement);
	return spanElement;
};

voteSystem.addLineToCandidateView = function(listElement, template, candidateName, candidateIdForImage, partyName, partyKeyword, regionName, voteCount) {
	var element = template.clone();
	
	element.get().id = "";
	var nameWrapper = voteSystem.placeTextAsSpanInElement(element.find(".candidateName"), candidateName);
	var partyWrapper = voteSystem.placeTextAsSpanInElement(element.find(".partyName"), partyName);
	var regionWrapper = voteSystem.placeTextAsSpanInElement(element.find(".regionName"), regionName);
	element.find(".voteCount").text(voteCount);
	element.find(".partyLogo").attr("src", "./images/parties/party_" + partyKeyword + "_small.png");
	
	if(candidateIdForImage !== 0) {
		element.find(".candidatePhoto").attr("src", "./userimg/candidate_" + candidateIdForImage + ".jpg");
	}
	
	listElement.append(element);
	
	voteSystem.wrapSpanInParent(nameWrapper);
	voteSystem.wrapSpanInParent(partyWrapper);
	voteSystem.wrapSpanInParent(regionWrapper);
};

voteSystem.candidateSortMethods = {
	"sortCandidateName_Asc" : function(a, b) {
		var fullNameA = a.firstName + " " + a.lastName;
		var fullNameB = b.firstName + " " + b.lastName;
	
		if(fullNameA < fullNameB) return 1;
		else if(fullNameA > fullNameB) return -1;
		else return 0;
	}, 
	
	"sortCandidateParty_Asc" : function(a, b) {
		if(voteSystem.partyList[a.partyId].displayName < voteSystem.partyList[b.partyId].displayName) return 1;
		else if(voteSystem.partyList[a.partyId].displayName > voteSystem.partyList[b.partyId].displayName) return -1;
		else return 0;
	}, 
	
	"sortCandidateRegion_Asc" : function(a, b) {
		if(voteSystem.regionList[a.regionId].displayName < voteSystem.regionList[b.regionId].displayName) return 1;
		else if(voteSystem.regionList[a.regionId].displayName > voteSystem.regionList[b.regionId].displayName) return -1;
		else return 0;
	}, 
	
	"sortCandidateVoteCount_Asc" : function(a, b) {
		if(a.voteCount < b.voteCount) return -1;
		else if(a.voteCount > b.voteCount) return 1;
		else return 0;
	}
};

voteSystem.candidateSortMethods["sortCandidateName_Desc"] = function(a, b) { return -voteSystem.candidateSortMethods["sortCandidateName_Asc"](a, b); };
voteSystem.candidateSortMethods["sortCandidateParty_Desc"] = function(a, b) { return -voteSystem.candidateSortMethods["sortCandidateParty_Asc"](a, b); };
voteSystem.candidateSortMethods["sortCandidateRegion_Desc"] = function(a, b) { return -voteSystem.candidateSortMethods["sortCandidateRegion_Asc"](a, b); };
voteSystem.candidateSortMethods["sortCandidateVoteCount_Desc"] = function(a, b) { return -voteSystem.candidateSortMethods["sortCandidateVoteCount_Asc"](a, b); };

voteSystem.candidateSortMethodQueue = ["sortCandidateVoteCount_Desc"];

voteSystem.currentCandidateList = null;
voteSystem.filteredCandidateList = null;

voteSystem.filterCandidateList = function(filterString) {
	voteSystem.filteredCandidateList = [];
	
	filterString = filterString.toUpperCase();

	for(var i = 0; i < voteSystem.currentCandidateList.length; i++) {
		var compareString = (voteSystem.currentCandidateList[i].lastName + ", " + voteSystem.currentCandidateList[i].firstName).toUpperCase();
		
		if(compareString.substring(0, filterString.length) == filterString) {
			voteSystem.filteredCandidateList.push(voteSystem.currentCandidateList[i]);
		}
	}
};

voteSystem.candidateNameFilterChanged = function() {
	clearTimeout(voteSystem.candidateFilterDelay);
	
	voteSystem.candidateFilterDelay = setTimeout(voteSystem.resortCandidateView, 200);
};

voteSystem.resortCandidateView = function() {
	if(!voteSystem.currentCandidateList) return;
	
	var listElement = $("#statsCandidateList"), template = $("#candidateStatsTemplate");
	listElement.html("");
	
	voteSystem.filterCandidateList($("#candidateViewNameFilter").val());
	voteSystem.sortItemList(voteSystem.filteredCandidateList, voteSystem.candidateSortMethods, voteSystem.candidateSortMethodQueue);
	
	for(var i = 0; i < voteSystem.filteredCandidateList.length; i++) {
		var info = voteSystem.filteredCandidateList[i];
		var partyName = voteSystem.partyList[info.partyId].displayName;
		var partyKeyword = voteSystem.partyList[info.partyId].keyword;
		var regionName = voteSystem.regionList[info.regionId].displayName;
		var candidateIdForPhoto = (info.hasPhoto > 0) ? info.candidateId : 0;
		
		voteSystem.addLineToCandidateView(listElement, template, info.firstName + " " + info.lastName, candidateIdForPhoto, partyName, partyKeyword, regionName, info.voteCount);
	}
};

voteSystem.refreshCandidateViewData = function() {
	if(voteSystem.candidateViewState !== null) {
		voteSystem.loadCandidateView(voteSystem.candidateViewState);
	}
};

voteSystem.loadCandidateView = function(params) {
	voteSystem.showLoader();
	
	var regionAndPartyQuerySuccesful = function() {
		if(voteSystem.candidateViewState === null) {
			for(var regionId in voteSystem.regionList) {
				if(!voteSystem.regionList.hasOwnProperty(regionId)) continue;
				
				$("#candidateViewRegionFilter").append($("<option>", {
					value: voteSystem.regionList[regionId].keyword,
					text: voteSystem.regionList[regionId].displayName
				}));
			}
			
			for(var partyId in voteSystem.partyList) {
				if(!voteSystem.partyList.hasOwnProperty(partyId)) continue;
				
				$("#candidateViewPartyFilter").append($("<option>", {
					value: voteSystem.partyList[partyId].keyword,
					text: voteSystem.partyList[partyId].displayName
				}));
			}
		}
		
		var paramList = params.split("-");
		var findRegionId = voteSystem.regionFromKeyword(paramList[0]);
		var findPartyId = voteSystem.partyFromKeyword(paramList[1]);
		var regionKeyword = voteSystem.keywordFromRegion(findRegionId);
		var partyKeyword = voteSystem.keywordFromParty(findPartyId);
		var sanitizedParamString = regionKeyword + "-" + partyKeyword;
		
		//might as well always update since no queries are made, this function can easily be used to "refresh" after websocket update then
		
		voteSystem.currentCandidateList = [];
		
		for ( var candidateId in voteSystem.candidateList ) {
			if(!voteSystem.candidateList.hasOwnProperty(candidateId)) continue;
			
			if ( (findRegionId === 0 || voteSystem.candidateList[candidateId].regionId == findRegionId) &&
				(findPartyId === 0 || voteSystem.candidateList[candidateId].partyId == findPartyId) ) {
				voteSystem.currentCandidateList.push(voteSystem.candidateList[candidateId]);
			}
		}
		
		voteSystem.resortCandidateView();
		
		voteSystem.candidateViewState = sanitizedParamString;
		
		$("#candidateViewRegionFilter").val(regionKeyword);
		$("#candidateViewPartyFilter").val(partyKeyword);
		
		voteSystem.hideLoader();
	};
	
	$.when(voteSystem.regionListQuery, voteSystem.partyListQuery, voteSystem.candidateListQuery).then( regionAndPartyQuerySuccesful, function() {
		if ( localStorage.getObject("regionList") && localStorage.getObject("partyList") && localStorage.getObject("candidateList") ) {
			voteSystem.regionList = localStorage.getObject("regionList");
			voteSystem.partyList = localStorage.getObject("partyList");
			voteSystem.candidateList = localStorage.getObject("candidateList");
			
			regionAndPartyQuerySuccesful();
		} else {
			voteSystem.hideLoader();
		}
	});
};

voteSystem.candidateFiltersChanged = function() {
	$.when(voteSystem.regionListQuery, voteSystem.partyListQuery).then( function() {
		var regionKeyword = $("#candidateViewRegionFilter").val(), partyKeyword = $("#candidateViewPartyFilter").val();
		
		window.location.hash = "#tab_stats_candidates-" + regionKeyword + "-" + partyKeyword;
	}, function() {
		if ( localStorage.getObject("regionList") && localStorage.getObject("partyList") ) {
			voteSystem.regionList = localStorage.getObject("regionList");
			voteSystem.partyList = localStorage.getObject("partyList");
			var regionKeyword = $("#candidateViewRegionFilter").val(), partyKeyword = $("#candidateViewPartyFilter").val();
		
			window.location.hash = "#tab_stats_candidates-" + regionKeyword + "-" + partyKeyword;
		}
	});
};

voteSystem.addLineToPartyView = function(listElement, template, partyName, keyword, regionKeyword, voteCount, votePercentage) {
	var element = template.clone();
	
	element.get().id = "";
	element.find(".partyName").text(partyName);
	element.find(".candidatesLink").attr("href", "#tab_stats_candidates-" + regionKeyword + "-" + keyword);
	element.find(".voteCount").text(voteCount + " häält");
	element.find(".votePercentage").text(votePercentage);
	element.find(".logo").attr("src", "./images/parties/party_" + keyword + ".png");
	
	listElement.append(element);
};

voteSystem.partySortMethods = {
	"sortPartyName_Asc" : function(a, b) {
		if(a.displayName < b.displayName) return 1;
		else if(a.displayName  > b.displayName ) return -1;
		else return 0;
	}, 
	
	"sortPartyVoteCount_Asc" : function(a, b) {
		if(a.voteCount < b.voteCount) return -1;
		else if(a.voteCount > b.voteCount) return 1;
		else return 0;
	}
};

voteSystem.partySortMethods["sortPartyName_Desc"] = function(a, b) { return -voteSystem.partySortMethods["sortPartyName_Asc"](a, b); };
voteSystem.partySortMethods["sortPartyVoteCount_Desc"] = function(a, b) { return -voteSystem.partySortMethods["sortPartyVoteCount_Asc"](a, b); };

voteSystem.partySortMethodQueue = ["sortPartyVoteCount_Desc"];

voteSystem.currentPartyList = null;

voteSystem.resortPartyView = function() {
	if(!voteSystem.currentPartyList) return;
	
	var paramList = voteSystem.partyViewState.split("-");
	var findRegionId = voteSystem.regionFromKeyword(paramList[0]);
	
	var listElement = $("#statsPartyList"), template = $("#partyTemplate"), totalVotes = 0;
	listElement.html("");
	
	voteSystem.sortItemList(voteSystem.currentPartyList, voteSystem.partySortMethods, voteSystem.partySortMethodQueue);
	
	for(var i = 0; i < voteSystem.currentPartyList.length; i++) {
		totalVotes += voteSystem.currentPartyList[i].voteCount;
	}
	
	for(var i = 0; i < voteSystem.currentPartyList.length; i++) {
		var percentage = parseFloat(Math.round(((totalVotes > 0) ? voteSystem.currentPartyList[i].voteCount / totalVotes : 0) * 1000) / 10).toFixed(1) + "%";
		var regionKeyword = voteSystem.keywordFromRegion(findRegionId);
		
		voteSystem.addLineToPartyView(listElement, template, voteSystem.currentPartyList[i].displayName, voteSystem.currentPartyList[i].keyword, regionKeyword, voteSystem.currentPartyList[i].voteCount, percentage);
	}
};

voteSystem.loadPartyView = function(params) {
	voteSystem.showLoader();

	var regionAndPartyQuerySuccesful = function() {
		if(voteSystem.partyViewState === null) {
			for(var regionId in voteSystem.regionList) {
				if(!voteSystem.regionList.hasOwnProperty(regionId)) continue;
				
				$("#partyViewRegionFilter").append($("<option>", {
					value: voteSystem.regionList[regionId].keyword,
					text: voteSystem.regionList[regionId].displayName
				}));
			}
		}
		
		if(params != voteSystem.partyViewState) {
			var paramList = params.split("-");
			var findRegionId = voteSystem.regionFromKeyword(paramList[0]);
			$("#partyViewRegionFilter").val(paramList[0]);

			var queryData = {regionId: findRegionId, orderId: 4};
			
			voteSystem.partyViewState = params;
			
			voteSystem.jsonQuery("parties", queryData, false, function(data) {
				if(data.responseType == "parties" && data.partyList) {
					voteSystem.currentPartyList = data.partyList;
					
					voteSystem.resortPartyView();
					localStorage.setObject("parties-"+findRegionId, data.partyList);
				}
				voteSystem.hideLoader();
			}, function() {
				if ( localStorage.getObject("parties-"+findRegionId) ) {
					voteSystem.currentPartyList = localStorage.getObject("parties-"+findRegionId);
					voteSystem.resortPartyView();
				} else if ( localStorage.getObject("candidateList") ) {
					voteSystem.candidateList = localStorage.getObject("candidateList");
					voteSystem.currentPartyList = [];
					var partyListIndexes = {};
					var counter = 0;
					for ( var partyId in voteSystem.partyList ) {
						if(!voteSystem.partyList.hasOwnProperty(partyId)) continue;
						
						voteSystem.currentPartyList.push(voteSystem.partyList[partyId]);
						partyListIndexes[partyId] = counter;
						counter++;
					}
					
					for ( var i = 0; i<voteSystem.currentPartyList.length; i++ ) {
						voteSystem.currentPartyList[i].voteCount = 0;
					}
					for ( var candidateId in voteSystem.candidateList ) {
						if(!voteSystem.candidateList.hasOwnProperty(candidateId)) continue;
						
						if ( voteSystem.candidateList[candidateId].regionId === findRegionId || findRegionId === 0 ) {
							voteSystem.currentPartyList[partyListIndexes[voteSystem.candidateList[candidateId].partyId]].voteCount += voteSystem.candidateList[candidateId].voteCount;
						}
					}
					
					localStorage.setObject("parties-"+findRegionId,voteSystem.currentPartyList);
					voteSystem.resortPartyView();
				}
				voteSystem.hideLoader();

			}, null);
		} else {
			voteSystem.hideLoader();
		}
				
	};
	
	$.when(voteSystem.regionListQuery, voteSystem.partyListQuery).then( regionAndPartyQuerySuccesful, function() {
		if ( localStorage.getObject("regionList") && localStorage.getObject("partyList") ) {
			voteSystem.regionList = localStorage.getObject("regionList");
			voteSystem.partyList = localStorage.getObject("partyList");
			regionAndPartyQuerySuccesful();
		}
	});
};

voteSystem.partyFiltersChanged = function() {
	$.when(voteSystem.regionListQuery, voteSystem.partyListQuery).then( function() {
		var regionKeyword = $("#partyViewRegionFilter").val();
		
		window.location.hash = "#tab_stats_parties-" + regionKeyword;
	}, function() {
		if ( localStorage.getObject("regionList") && localStorage.getObject("partyList") ) {
			voteSystem.regionList = localStorage.getObject("regionList");
			voteSystem.partyList = localStorage.getObject("partyList");
			var regionKeyword = $("#partyViewRegionFilter").val();
		
			window.location.hash = "#tab_stats_parties-" + regionKeyword;
		}
	});
};

voteSystem.loadSetRegionRegionList = function(params) {
	voteSystem.pageLoaded.done( function() {
		voteSystem.regionListQuery.done( function() {
			for(var regionId in voteSystem.regionList) {
				if(!voteSystem.regionList.hasOwnProperty(regionId)) continue;
				
				$("#regions").append($("<option>", {
					value: voteSystem.regionList[regionId].regionId,
					text: voteSystem.regionList[regionId].displayName
				}));
			}
		});
		
		voteSystem.regionListQuery.fail( function() {
			if ( localStorage.getObject("regionList")) {
				voteSystem.regionList = localStorage.getObject("regionList");
				for(var regionId in voteSystem.regionList) {
					if(!voteSystem.regionList.hasOwnProperty(regionId)) continue;
					
					$("#regions").append($("<option>", {
						value: voteSystem.regionList[regionId].regionId,
						text: voteSystem.regionList[regionId].displayName
					}));
				}
			}
		});
	});
};

voteSystem.loadApplicationPartyList = function(params) {
	voteSystem.pageLoaded.done( function() {
		voteSystem.partyListQuery.done( function() {
			for(var partyId in voteSystem.partyList) {
				if(!voteSystem.partyList.hasOwnProperty(partyId)) continue;
				
				$("#parties").append($("<option>", {
					value: voteSystem.partyList[partyId].partyId,
					text: voteSystem.partyList[partyId].displayName
				}));
			}
		});
		
		voteSystem.partyListQuery.fail( function() {
			if ( localStorage.getObject("partyList")) {
				voteSystem.partyList = localStorage.getObject("partyList");
				for(var partyId in voteSystem.partyList) {
					if(!voteSystem.partyList.hasOwnProperty(partyId)) continue;
					
					$("#parties").append($("<option>", {
						value: voteSystem.partyList[partyId].partyId,
						text: voteSystem.partyList[partyId].displayName
					}));
				}
			}
		});
	});
};

voteSystem.refreshMyDataInfo = function() {
	if (voteSystem.userInfo.userInfo) {
		$("#myDataIdCode").text(voteSystem.userInfo.userInfo["username"]);
		if ( voteSystem.userInfo.userInfo["voteRegionId"] ) {	
			voteSystem.removeClassFromElement($("#myDataApplication")[0],"greyText");
			voteSystem.removeClassFromElement($("#myDataVoting")[0],"greyText");
			voteSystem.removeClassFromElement($("#myDataRegion")[0],"errorMessage" );			
			voteSystem.regionListQuery.done(function() {
				$("#myDataRegion").text(voteSystem.regionList[voteSystem.userInfo.userInfo["voteRegionId"]]["displayName"]);
				$("#myDataApplyRegion").text(voteSystem.regionList[voteSystem.userInfo.userInfo["voteRegionId"]]["displayName"]);
			});
			voteSystem.regionListQuery.fail(function() {
				if ( localStorage.getObject("regionList") ) {
					voteSystem.regionList = localStorage.getObject("regionList");
					$("#myDataRegion").text(voteSystem.regionList[voteSystem.userInfo.userInfo["voteRegionId"]]["displayName"]);
					$("#myDataApplyRegion").text(voteSystem.regionList[voteSystem.userInfo.userInfo["voteRegionId"]]["displayName"]);
				}
			});
			
			$("#toSetRegionLink").remove();
			if ( voteSystem.userInfo.userInfo.votedCandidateId ) {
				voteSystem.removeClassFromElement($("#myDataVoting")[0],"errorMessage" );
				if ( !voteSystem.votedCandidateName ) {					 
					voteSystem.queryCandidateName(voteSystem.userInfo.userInfo.votedCandidateId);
				}
				voteSystem.candidateNameQuery.done(function() {
					$("#myDataVoting").html("<span class=\"greenText\">Hääl antud: </span>"+voteSystem.votedCandidateName);
				});	
				voteSystem.candidateNameQuery.fail(function() {
					if ( localStorage["votedCandidateName"] ) {
						$("#myDataVoting").html("<span class=\"greenText\">Hääl antud: </span>"+localStorage["votedCandidateName"]);
					}
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
				if(voteSystem.userInfo.candidateInfo.hasPhoto > 0) {
					$("#myDataPhotoImg").attr("src", "./userimg/candidate_" + voteSystem.userInfo.candidateInfo.candidateId + ".jpg");
				}
				else {
					$("#myDataPhotoImg").attr("src", "./images/scary_face.png");
				}
			
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

voteSystem.showLoader = function() {
	$("#loaderBlock").css("display", "block");
	$("#loaderBlock").width($(".tab.visible .tabContents").outerWidth());
	$("#loaderBlock").height($(".tab.visible .tabContents").outerHeight());
	$("#loaderBlock").css("top", $('.tab.visible .tabContents').offset().top);
	$("#loaderBlock").css("left", $('.tab.visible .tabContents').offset().left);
	$("#loaderImage").css("margin-top", (($(".tab.visible .tabContents").height()-75) / 2) + "px");	
};

voteSystem.hideLoader = function() {
	$("#loaderBlock").css("display", "none");
};

voteSystem.clearChangePasswordSection = function() {
	$(".myDataChangePasswordSection .errorMessage").each(function(index, errorMessageItem) {
		$(errorMessageItem).text("");
	});

	$(".myDataChangePasswordSection .inputBox.invalidInput").each( function(index, inputBoxItem) {
		voteSystem.removeClassFromElement(inputBoxItem,"invalidInput");
	});

	$(".myDataChangePasswordSection .inputBox").each( function(index, inputBoxItem) {
		$(inputBoxItem).val("");
	});
};

voteSystem.updateCandidateStats = function(info) {
	if(voteSystem.candidateList === null) return;

	var voteDifference = info.voteCount - ((info.candidateId in voteSystem.candidateList) ? voteSystem.candidateList[info.candidateId].voteCount : 0);
	
	if(voteSystem.regionList !== null && voteSystem.partyList !== null && voteSystem.currentPartyList !== null) {
		var currentRegion = voteSystem.regionFromKeyword(voteSystem.partyViewState);
		
		if(currentRegion === 0 || currentRegion == info.regionId) {
			for(var i = 0; i < voteSystem.currentPartyList.length; i++) {
				if(voteSystem.currentPartyList[i].partyId == info.partyId) {
					voteSystem.currentPartyList[i].voteCount += voteDifference;
					voteSystem.resortPartyView();
					break;
				}
			}
		}
	}

	voteSystem.candidateList[info.candidateId] = info;
	localStorage.setObject("candidateList", voteSystem.candidateList);
	
	voteSystem.refreshCandidateViewData();
};

voteSystem.ws = null;

voteSystem.setupWebsocket = function() {
	voteSystem.ws = $.websocket("ws://" + window.location.hostname + ":8081/test", {
		open: function() {},
		close: function() {},
		events: {
			candidate: function(data) {
				voteSystem.updateCandidateStats(data.candidateInfo);
			}
		}
	}, "vote-broadcaster");
	
	setTimeout(voteSystem.pingServer, 60000);
};

voteSystem.pingServer = function() {
	if(voteSystem.ws !== null) {
		voteSystem.ws._send("PING");
	}

	voteSystem.jsonQuery("sessionid", {}, false, function(data) { } );
	
	setTimeout(voteSystem.pingServer, 60000);
};

voteSystem.doPhotoUpload = function(file) {
	if(!window.FormData) return;
	
	var formData = new FormData();
	
	if (file.type != "image/jpeg") {
		$("#applicationErrorMessage").text("Pole JPG fail.");
	}
	else if(file.size > 262144) {
		$("#applicationErrorMessage").text("Fail on suurem kui 256KB.");
	}
	else {
		$("#applicationErrorMessage").text("Pilti laetakse üles, palun oodake...");
		
		formData.append("imageFile", file);
		
		$.ajax("./dyn/photo", {type: "POST", data: formData, processData: false, contentType: false, dataType: "json"}).done(function(data) {
			if(data.statusCode == 10) {
				$("#applicationErrorMessage").text("Pilt edukalt saadetud.");
				$("#candidacyUploadImg").attr("src", "./userimg/user_" + voteSystem.userInfo.userInfo.userId + ".jpg");
			}
			else {
				$("#applicationErrorMessage").text("Pildi saatmine ebaõnnestus.");
				$("#hiddenLog").append(JSON.stringify(data) + "<br />");
			}
		});
	}
};

//hints from: http://tjvantoll.com/2012/06/15/detecting-print-requests-with-javascript/
voteSystem.configurePrinting = function() {
	var beforePrint = function() {
		voteSystem.resizeForPrint();
	};
	var afterPrint = function() {
		voteSystem.resizeElements();
	};

	if (window.matchMedia) {
		var mediaQueryList = window.matchMedia("print");
		mediaQueryList.addListener(function(mql) {
			if (mql.matches) {
				beforePrint();
			} else {
				afterPrint();
			}
		});
	}

	window.onbeforeprint = beforePrint;
	window.onafterprint = afterPrint;
};

voteSystem.initializeMap = function() {
	if(voteSystem.map !== null) return;

	var mapOptions = {
		center: new google.maps.LatLng(58.5673, 24.7990),
		zoom: 7,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	
	voteSystem.map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

	$.when(voteSystem.regionListQuery, voteSystem.partyListQuery).then( function() {
		for ( var partyId in voteSystem.partyList ) {
			if(!voteSystem.partyList.hasOwnProperty(partyId)) continue;
			
			$("#mapLegend").append('<div class="legendItem"><div class="legendColor" id="'+voteSystem.partyList[partyId].keyword+'">'+voteSystem.partyList[partyId].displayName+'</div></div>');
			$("#"+voteSystem.partyList[partyId].keyword).css("background",voteSystem.partyList[partyId].color );
		}
		for(var regionId in voteSystem.regionList) {
			if(!voteSystem.regionList.hasOwnProperty(regionId)) continue;
			
			voteSystem.addMarkerToRegion(regionId);
		}
	} );
	
};

voteSystem.addMarkerToRegion = function(regionId) {
	voteSystem.mapMarkers[regionId] = new google.maps.Marker({
		map : voteSystem.map,
		position: new google.maps.LatLng(voteSystem.regionList[regionId].latitude,voteSystem.regionList[regionId].longitude),
		title: voteSystem.regionList[regionId].displayName
	});

	var queryData = {regionId: regionId, orderId: 4};

	voteSystem.jsonQuery("parties", queryData, false, function(data) {
		if(data.responseType == "parties" && data.partyList) {
			var totalVotes = 0;
			var maxVoteCount = 0;
			var winnerPartyId = null;
			for(var i = 0; i < data.partyList.length; i++) {
				totalVotes += data.partyList[i].voteCount;
				if ( data.partyList[i].voteCount > maxVoteCount ) {
					maxVoteCount = data.partyList[i].voteCount;
					winnerPartyId = data.partyList[i].partyId;
				}
			}

			var partyColor = voteSystem.partyList[winnerPartyId]["color"];
			var partyName = voteSystem.partyList[winnerPartyId].displayName;
			
			var percentage = parseFloat(Math.round(((totalVotes > 0) ? maxVoteCount / totalVotes : 0) * 1000) / 10).toFixed(1) + "%";

			var content = "<div class=infoBoxText>" + partyName + " " + percentage.toString() + "</div>";
				
			var myOptions = {
				content: content,
				pixelOffset: new google.maps.Size(-40, 0),
				boxClass: "infoBox",
				boxStyle: { 
					background: partyColor,
					width: "80px"
				},
				infoBoxClearance: new google.maps.Size(1, 1),
				pane: "floatPane",
				enableEventPropagation: false
			};

			var ib = new InfoBox(myOptions);
			ib.open(voteSystem.map, voteSystem.mapMarkers[regionId]); 

			var marker = voteSystem.mapMarkers[regionId];
			google.maps.event.addListener(marker, 'click', function() {
				ib.open(voteSystem.map,marker);
			});
		}

	});
};

voteSystem.preinit = function() {
	voteSystem.setupWebsocket();
	voteSystem.queryRegions();
	voteSystem.queryStatus();
	voteSystem.queryParties();
	voteSystem.queryCandidates();
};

voteSystem.initialise = function() {
	jQuery.event.props.push("dataTransfer");
	
	voteSystem.pageLoaded.resolve();

	imageLoader.initialise();

	$(".menuitem").click( function() {
		voteSystem.setActiveMenuItem(this);
	});
	
	voteSystem.setTabActivateCB("tab_voting", function(tabElement) {
		voteSystem.refreshVotingList();
	});	
	
	voteSystem.initialiseSortingMethods(voteSystem.regionSortMethods, "regionSortMethodQueue", voteSystem.resortRegionView);
	
	voteSystem.setTabActivateCB("tab_stats_regions", function(tabElement) {
		voteSystem.loadRegionView();
	});
	
	voteSystem.initialiseSortingMethods(voteSystem.candidateSortMethods, "candidateSortMethodQueue", voteSystem.resortCandidateView);
	
	voteSystem.setTabActivateCB("tab_stats_candidates", function(tabElement, parameters) {
		voteSystem.loadCandidateView(parameters);
	});
	
	voteSystem.initialiseSortingMethods(voteSystem.partySortMethods, "partySortMethodQueue", voteSystem.resortPartyView);
	
	voteSystem.setTabActivateCB("tab_stats_parties", function(tabElement, parameters) {
		voteSystem.loadPartyView(parameters);
	});
	
	voteSystem.setTabActivateCB("tab_stats_map", function(tabElement, parameters) {
		voteSystem.initializeMap();
	});

	voteSystem.setTabActivateCB("tab_mydata", function() {
		voteSystem.clearChangePasswordSection();
	});

	$("#loginByPassword").submit( function() {
		$("#loginErrorMessage").text("");
		
		voteSystem.jsonQuery("login", {username:$("#username").val(), password:$("#password").val()}, true, function(data) {
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
		},null,null);
		
		return false;
	});
	
	$("#loginByIdCard").submit(function(event) {
		$("#authErrorMessage").text("");
		
		var sessionId = $("#authSessionId").val();
		
		this.action = "https://" + window.location.hostname + ":8443/";
		
		if(sessionId.length === 0) {
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
	
	$("#changePasswordForm").submit(function(event) {
		$("#changePasswordErrorMessage").text("");
		$("#oldPassword").removeClass("invalidInput");
		$("#newPassword").removeClass("invalidInput");
		$("#newPasswordConfirmation").removeClass("invalidInput");
		
		var queryData = {oldPassword:$("#oldPassword").val(), newPassword:$("#newPassword").val(), newPasswordRepeat:$("#newPasswordConfirmation").val()};
		var errorMessage = "";
		
		if($("#oldPasswordBlock").css("display") != "none") {
			if (queryData.oldPassword === "") {
				errorMessage += "Vana salasõna on sisestamata. "; 
				$("#oldPassword").addClass("invalidInput");
			}
		}
		
		if (queryData.newPassword === "") {
			errorMessage += "Uus salasõna on sisestamata. "; 
			$("#newPassword").addClass("invalidInput");
		}
		else if (queryData.newPassword.length < 5) {
			errorMessage += "Uus salasõna peab olema vähemalt 5 tähemärki. ";
			$("#newPassword").addClass("invalidInput");
		}
		
		if (queryData.newPasswordRepeat === "") {
			errorMessage += "Uue salasõna kordus on sisestamata. "; 
			$("#newPasswordConfirmation").addClass("invalidInput");
		}
		else if (queryData.newPassword != queryData.newPasswordRepeat) {
			errorMessage += "Uued salasõnad ei kattu. ";
			$("#newPasswordConfirmation").addClass("invalidInput");
		}
		
		$("#changePasswordErrorMessage").text(errorMessage);
		
		if (errorMessage === "") {
			voteSystem.jsonQuery("changepass", queryData, true, function(data) {
				if(data.responseType == "status") {
					voteSystem.removeClassFromElement($("#changePasswordErrorMessage")[0],"greenText");
					if(data.statusCode < 0) $("#changePasswordErrorMessage").text("Süsteemi viga.");
					else if(data.statusCode == 1) $("#changePasswordErrorMessage").text("Pole sisse logitud.");
					else if(data.statusCode == 2) $("#changePasswordErrorMessage").text("Uus salasõna alla 5 tähemärgi.");
					else if(data.statusCode == 3) $("#changePasswordErrorMessage").text("Uued salasõnad ei kattu.");
					else if(data.statusCode == 4) {
						$("#changePasswordErrorMessage").text("Vana salasõna ei ole õige.");
						$("#oldPassword").addClass("invalidInput");
					} else if(data.statusCode == 10) {
						voteSystem.addClassToElement($("#changePasswordErrorMessage")[0],"greenText");
						$("#changePasswordErrorMessage").text("Salasõna edukalt muudetud.");
					}
					
					$("#oldPassword").val("");
					$("#newPassword").val("");
					$("#newPasswordConfirmation").val("");
				}
			},null,null);
		}
		
		return false;
	});

	$("#setRegionForm").submit( function(event) {
		$("#setRegionErrorMessage").text("");
		var selectedRegionId = $("#regions").val();
		if (selectedRegionId === "") {
			$("#setRegionErrorMessage").text("Palun valige piirkond");
		} else {
			var regionName = $("#regions").find(":selected").text();
			voteSystem.confirmMessage("Kinnita", "Kas olete kindel, et soovite oma piirkonnaks määrata "+regionName+"? "+
				"Pärast kinnitamist ei saa te enam oma piirkonda muuta.", function() {
				voteSystem.jsonQuery("setregion", {regionId:selectedRegionId}, true, function(data) {
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
				},null,null);
			});

			return false;			
		}

		return false;
	});
	
	$("#applicationForm").submit( function(event) {
		$("#applicationErrorMessage").text("");
		$("#parties").removeClass("invalidInput");
		$("#applicationFirstName").removeClass("invalidInput");
		$("#applicationLastName").removeClass("invalidInput");		
		
		var selectedPartyId = $("#parties").val();
		var newFirstName = $("#applicationFirstName").val();
		var newLastName = $("#applicationLastName").val();
		var errorMessage = "";
		
		if (selectedPartyId === "") {
			errorMessage += "Partei on valimata. "; 
			$("#parties").addClass("invalidInput");
		}
		
		if (newFirstName === "") {
			errorMessage += "Eesnimi on sisestamata. "; 
			$("#applicationFirstName").addClass("invalidInput");
		}
		else if (newFirstName.length < 2 || newFirstName.length > 60) {
			errorMessage += "Eesnimi pole pikkusega 2-60. ";
			$("#applicationFirstName").addClass("invalidInput");
		}
		
		if (newLastName === "") {
			errorMessage += "Perenimi on sisestamata. "; 
			$("#applicationLastName").addClass("invalidInput");
		}
		else if (newLastName.length < 2 || newLastName.length > 60) {
			errorMessage += "Perenimi pole pikkusega 2-60. ";
			$("#applicationLastName").addClass("invalidInput");
		}
		
		
		$("#applicationErrorMessage").text(errorMessage);
		
		if (errorMessage === "") {
			var partyName = $("#parties").find(":selected").text();
			var confirmText = "Kas olete kindel, et teie, " + newFirstName + " " + newLastName + ", soovite olla partei " + partyName + " kandidaat?";
			var queryData = {partyId: selectedPartyId, firstName: newFirstName, lastName: newLastName};
			
			voteSystem.confirmMessage("Kinnita kandidatuur", confirmText, function() {
				voteSystem.jsonQuery("application", queryData, true, function(data) {
					if(data.responseType == "status") {
						if(data.statusCode < 0) $("#applicationErrorMessage").text("Süsteemi viga.");
						else if(data.statusCode == 100) $("#applicationErrorMessage").text("Eesnimi pole pikkusega 2-60.");
						else if(data.statusCode == 101) $("#applicationErrorMessage").text("Perekonnanimi pole pikkusega 2-60.");
						else if(data.statusCode == 1) $("#applicationErrorMessage").text("Pole sisse logitud.");
						else if(data.statusCode == 2) $("#applicationErrorMessage").text("Piirkonda pole määratud.");
						else if(data.statusCode == 3) $("#applicationErrorMessage").text("Olete juba kandidaat.");
						else if(data.statusCode == 4) $("#applicationErrorMessage").text("Sellist parteid ei eksisteeri.");
						else $("#applicationErrorMessage").text("Tundmatu viga.");
					}
					else if(data.responseType == "userInfo") {
						voteSystem.userInfo = data;
						voteSystem.refreshMyDataInfo();
						voteSystem.setActiveTab("tab_mydata", "", false);
					}
				},null,null);
			});
		}

		return false;
	});
	
	$("#logoutForm").submit(function(event) {
		voteSystem.jsonQuery("logout", {}, true, function(data) {
			voteSystem.applyUserInfo({userInfo:null, candidateInfo:null});
		},null,null);
		
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
			if(data.responseType == "status" && data.userInfo !== null) {
				$("#authenticationResult").text("Veateade: " + data.statusMessage);
			}
			else {
				$("#authenticationResult").text("Tundmatu viga.");
			}
		},null,null);
		
		window.location.hash = "";
	}
	else if(window.location.hash.indexOf("#tab_") === 0) {
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
			if(window.location.hash.indexOf("#tab_") === 0) {
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
			voteSystem.doPhotoUpload(event.dataTransfer.files[0]);
		}
		
		return false;
	});
	
		
	$("#candidateViewNameFilter")
		.change(voteSystem.candidateNameFilterChanged)
		.keyup(voteSystem.candidateNameFilterChanged)
		.keydown(voteSystem.candidateNameFilterChanged)
		.keypress(voteSystem.candidateNameFilterChanged);
	
	$("#candidateViewRegionFilter").change(function(event) {
		voteSystem.candidateFiltersChanged();
	});
	
	$("#candidateViewPartyFilter").change(function(event) {
		voteSystem.candidateFiltersChanged();
	});
	
	$("#partyViewRegionFilter").change(function(event) {
		voteSystem.partyFiltersChanged();
	});
	
	
	$("#uploaderDragDrop").click(function(event) {
		$("#uploaderFile").click();
	});
	
	$("#uploaderFile").change(function(event) {
		if(this.files.length > 0) {
			voteSystem.doPhotoUpload(this.files[0]);
		}
	});
	
	$("#uploaderForm").submit(function(event) {
		return false;
	});

	voteSystem.resizeElements();
	
	$(window).resize(function() {
		voteSystem.resizeElements();
	});
	
	voteSystem.configurePrinting();
};

voteSystem.preinit();

$(document).ready(function() {
	voteSystem.initialise();
});

})();