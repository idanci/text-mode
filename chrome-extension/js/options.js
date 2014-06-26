/*************************************************
	This code is executed on the OPTIONS.html page
	It runs in the context of the extension Options page (not the page, not the background)
	Is fired when the user opens the extension options page

	Communication
		* Options.js <-> Background.js via localStorage
*************************************************/

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
