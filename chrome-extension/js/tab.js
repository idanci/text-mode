/*************************************************
	TAB.js
	------
	This code is executed on the TAB
	Runs on the Page context
	Is fired with each page refresh

	Communication
		* Background.js <-> Tab.js		via Message Passing (http://developer.chrome.com/extensions/messaging.html)
*************************************************/

// Get Preferences from the Extension
var isEnabled = false;
var replacementImageID = 0;

function getMode(response) {
	isEnabled = (response.enableAll === "true");
	replacementImageID = parseInt(response.replacementImageID);
	useWhiteBg = (response.useWhiteBg === "true");

	this.setBodyType();
}
chrome.extension.sendMessage({method: "getMode", refresh: true}, this.getMode);

//Images
function getBlankImg(){
	return chrome.extension.getURL("imgs/bg/bg_blank_1px.png");
}
var img_url = "imgs/bg/bg_%ID%.png";
function getBgImg(){
	img_curr = img_url.replace("%ID%", replacementImageID);

	return chrome.extension.getURL(img_curr);
}

	function onReady() {
		this.setBodyType();
		this.replaceHolderImgs();
	}
	window.addEventListener('DOMContentLoaded', onReady, false);

var body_class_ready = "__plain_text_READY__";
var body_class_whitelisted = "__plain_text_whitelisted__";
var body_class_plain_text = "__plain_text__";

var body_class_text_mode_img = "__text_mode_img_%ID%__";
var body_class_text_mode_img_curr = "";

var body_class_text_mode_white_bg = "__text_mode_white_bg__";

function setBodyType() {
	var body = document.getElementsByTagName("body")[0];
	body_class_text_mode_img_curr = body_class_text_mode_img.replace("%ID%", replacementImageID);

	if(body) {
		// If the page is not whitelisted (now only options.html)
		if (body.className.indexOf(body_class_whitelisted) < 0)
		{
			if (body.className.indexOf(body_class_ready) < 0)
				body.className += " " + body_class_ready;

			if (isEnabled) {
				if (body.className.indexOf(body_class_plain_text) < 0)
					body.className += " " + body_class_plain_text;

				// CSS: Image Replacement
				if (body.className.indexOf(body_class_text_mode_img_curr) < 0)
					body.className += " " + body_class_text_mode_img_curr;

				// CSS: White Bg
				if (useWhiteBg)
					if (body.className.indexOf(body_class_text_mode_white_bg) < 0)
						body.className += " " + body_class_text_mode_white_bg;
			}
		}
	}
}

//------------------------------------------------
// Holder.js
//------------------------------------------------
function replaceHolderImgs()
{
	if(isEnabled
		&&
		(replacementImageID === 0) )
	{
		var holderImg = "holder.js/%W%x%H%/";
		var holderTextImg = "holder.js/%W%x%H%/text:%T%";
		var holderBgImg = "url(?holder.js/%W%x%H%/) no-repeat";
		var imgs = document.getElementsByTagName('img');

		for (var i=0; i<imgs.length; i++) {

			var imgEl = imgs[i];
			var imgAlt = imgEl.alt;
			var styleW = imgEl.style.width?imgEl.style.width:imgEl.width;
			var styleH = imgEl.style.height?imgEl.style.height:imgEl.height;

			if (imgAlt) {
				imgEl.src = "";
				imgEl.style.backgroundImage = holderBgImg.split("%W%").join(styleW).split("%H%").join(styleH);
			}
			else {
				imgEl.src = holderImg.split("%W%").join(styleW).split("%H%").join(styleH);
				imgEl.style.backgroundImage = "";
			}
		}
		Holder.run();
	}
}

//------------------------------------------------
// BLOCK IFRAMES
// Unless they come from this domain
// Might be some needed script
// GMAIL breaks if we block iFrames
//------------------------------------------------

	function urlBelongsToThisSite(assetUrl) {
		var currHost = parseUri(window.location).host;
		var assetHost = parseUri(assetUrl).host;

		return (currHost === assetHost);
	}
	var dataset_redirected_key = "__plain_text_redirected__";

	function doBeforeLoad(event) {
		if (isEnabled &&
			!event.srcElement.dataset['redirected'] &&
			event.srcElement.tagName == "IFRAME"  &&
			urlBelongsToThisSite(event.srcElement.src)
			)
		{
				// If it is something we want to redirect then set a data attribute so we know its allready been changed
				// Set that attribute to it original src in case we need to know what it was later
				event.srcElement.dataset['redirected'] = event.srcElement.src;

				event.srcElement.src = getBlankImg();
				event.srcElement.style.backgroundImage = "url('"+getBgImg()+"')";
		}
	}

	document.addEventListener('beforeload', doBeforeLoad, true);
