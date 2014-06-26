
/*************************************************

	OPTIONS.js
	------
	This code is executed on the OPTIONS.html page
	It runs in the context of the extension Options page (not the page, not the background)
	Is fired when the user opens the extension options page

	Communication
		* Options.js <-> Background.js via localStorage

*************************************************/


//-----------------------------------------------------------------------------
// Add listeners

ii = document.querySelectorAll('#imageReplacement input');

for(var i=0, max = ii.length; i<max; i++) {
    ii[i].addEventListener('click', handleImageReplacementClick);
}

// Get image # to use
var currImageReplacementDefault = 0;
var currImageReplacement = localStorage["replacement_image"] || currImageReplacementDefault;
//console.log("currImageReplacement: "+currImageReplacement);

// Save value on Local Storage
function handleImageReplacementClick() {
    localStorage["replacement_image"] = this.value;

    $(this).parent().addClass('selected').siblings().removeClass('selected');
}

currImageReplacementCSS = parseInt(currImageReplacement) + 1;
$("#imageReplacement li:nth-child("+currImageReplacementCSS+")").addClass('selected');


//-----------------------------------------------------------------------------
// [OPTIONS] Desaturation

function getIsDesaturated() {
	// return localStorage['is_desaturated'] === "true";
	return !(localStorage['is_desaturated'] === "false");
}
function setIsDesaturated(value) {
	localStorage['is_desaturated'] = value;
}

$("#desat").prop('checked', getIsDesaturated());
$("#desat").click(function() {
    var $this = $(this);
    // $this will contain a reference to the checkbox
    if ($this.is(':checked')) {
        // the checkbox was checked
	    setIsDesaturated(true);
    } else {
        // the checkbox was unchecked
	    setIsDesaturated(false);
    }
});


//-----------------------------------------------------------------------------
// [OPTIONS] White BG

function getUseWhiteBg() {
	return !(localStorage['use_white_bg'] === "false");
}
function setUseWhiteBg(value) {
	localStorage['use_white_bg'] = value;
}

$("#whiteBg").prop('checked', getUseWhiteBg());
$("#whiteBg").click(function() {
    var $this = $(this);
    // $this will contain a reference to the checkbox
    if ($this.is(':checked')) {
        // the checkbox was checked
	    setUseWhiteBg(true);
    } else {
        // the checkbox was unchecked
	    setUseWhiteBg(false);
    }
});
