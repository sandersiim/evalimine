function resizeElements() {
	$("#mainblock").height($(window).height()-($("#mainblock").outerHeight(true)-$("#mainblock").height())); 
	$("#content").height($("#mainblock").height()-$("#header").outerHeight()-$("#footer").outerHeight()); 
}

function addClassToElement(element,clazz) {
	if (element.className.indexOf(clazz) == -1) {
		element.className += " "+clazz;
	}
}

function removeClassFromElement(element,clazz) {
	element.className = element.className.replace(clazz,"");
}

function changeMenuSelection(newMenuSelection) {
	var oldMenuSelection = $(".menuitem.menuselected")[0];
	removeClassFromElement(oldMenuSelection, "menuselected");
	addClassToElement(newMenuSelection,"menuselected")
}

function swapTab(selectedMenu) {
	var oldTab = $(".tab.visible")[0];
	removeClassFromElement(oldTab,"visible");	
	switch(selectedMenu.id) {
		case "menu_help":
			addClassToElement($("#tab_help")[0],"visible");
			break;
		case "menu_mydata":
			addClassToElement($("#tab_login")[0],"visible");
			break;
		case "menu_statistics":
			addClassToElement($("#tab_statistics")[0],"visible");
			break;
		case "menu_voting":
			addClassToElement($("#tab_voting")[0],"visible");
			break;

	}
}

$(document).ready(function() {
	$(".menuitem").click( function() {
		changeMenuSelection(this);
		swapTab(this);
	});
		
	resizeElements();
	$(window).resize(function() {
		resizeElements();
	});
});