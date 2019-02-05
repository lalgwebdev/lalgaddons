// *******************  Revert to using $ for jQuery
(function( $ ) {

$(document).ready(function(){
//	console.log("Webform Loaded");
	
// ***********************************************************************
// Detect which browser we are using.  Needed below.
//	Taken from https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser/9851769 
// Opera 8.0+
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]" 
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

// Internet Explorer 6-11
var isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;

// Chrome 1 - 71
var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

// Blink engine detection
var isBlink = (isChrome || isOpera) && !!window.CSS;
	
//*******************************************************************
//  Disable Autocomplete/Autofill on all input
//  On selecting Existing Contact on Admin Details Webform the browser drop-down interferes with the AJAX autocomplete code. 
//  On filling fields the browser can fill other, unwanted, fields, thus corrupting existing data.

	if(isChrome) {
		//  If Chrome have to put an invalid value in for Autocomplete attribute - Chrome ignores "off"
		$('body.node-type-webform input').attr('autocomplete', 'false123');
	} else if (isIE || isEdge) {
		// Display warning on IE & Edge.  Can't turn off Autofill on these.
		$('.webform-component--warning').css("display", "block");
	} else {
		$('body.node-type-webform input').attr('autocomplete', 'off');
	}

//*******************************************************************
//  Admin Webform only.  Force page reload when Existing Contact deleted - otherwise the page not cleared properly
//	Use Mutation Observer to detect when the <li> element containing the displayed name is destroyed
	
// Select the node that will be observed for mutations
var targetNode = document.getElementsByClassName("webform-component-civicrm-contact webform-component--civicrm-1-contact-1-fieldset-fieldset--civicrm-1-contact-1-contact-existing")[0]; 
//console.log(targetNode);

// Only apply if on the first page with the Existing Contact Field.
if (targetNode) {
	// Options for the observer (which mutations to observe)
	var config = { attributes: false, childList: true, subtree: true };

	// Callback function to execute when mutations are observed
	var callback = function(mutationsList, observer) {
		var mutation = mutationsList[0];
		if(mutation.target.nodeName == 'UL' && mutation.removedNodes[0] && mutation.removedNodes[0].nodeName == 'LI') {
		//	console.log('contact deleted');
		//	$(".PostContent div.tabs > ul:first-of-type > li:first-child a")[0].click();
		location.reload(true);
		}
	};

	// Create an observer instance linked to the callback function
	var observer = new MutationObserver(callback);

	// Start observing the target node for configured mutations
	observer.observe(targetNode, config);
}
	
//*******************************************************************	
//  Open Additional Household Member filesets on Webforms if they have content.

//	Check whether filesets have content when each page loaded
//	First Page of Webform (Input Fields)
	$("fieldset.lalg-wf-fs-additional-member input.form-text").each(function(index, el) {
//	console.log('Input field found');
		if ($(this).val()) {
			$(this).parent().parent().css("display", "block");
			$(this).parent().parent().parent().removeClass("collapsed");
		};	
	});

//	Confirmation Page of Webform (Text Fields)
	$("fieldset.lalg-wf-fs-additional-member .webform-component-display " ).each(function(index, el) {
//	console.log('Input field found');
		var text = $(this).contents().not($(this).children()).text().trim() ;
//	console.log(text);		
		if (text) {
			$(this).parent().css("display", "block");
			$(this).parent().parent().removeClass("collapsed");
		};	
	});

//  On Change, after page load, when form filled via AJAX (Admin Form only)
	$("input.lalg-wf-fs-additional-member").change(function(){
// console.log("The text has been changed.");
	  $(this).parent().parent().css("display", "block");
	  $(this).parent().parent().parent().removeClass("collapsed");
	});
	
//***************************************************************
// Default Printed Card Required Flag when Membership Type changed
	$("select.lalg-wf-membership-type").change(function(){
//		console.log($(this).val());
		if($(this).val()) {
			$("input#edit-submitted-membership-details-civicrm-2-contact-1-cg8-custom-18-1").click();
		} else {
			$("input#edit-submitted-membership-details-civicrm-2-contact-1-cg8-custom-18-2").click();
		}
	});

// And when existing contact loaded
	$( document ).ajaxComplete(function( event, request, settings ) {
//		console.log("AJAX complete");
		$("body.node-type-webform input#edit-submitted-membership-details-civicrm-2-contact-1-cg8-custom-18-2").click();
	});

//****************************************************************
// Capitalise Postcode fields
	$("input.lalg-wf-postcode").blur(function(){
//	   console.log('Postcode blur');
	  $(this).val( $(this).val().toUpperCase() );
	});
	
	

});				// End Document Ready
})(jQuery);		// ******************* Close the $ reversion	

