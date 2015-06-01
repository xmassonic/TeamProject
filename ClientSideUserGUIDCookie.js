/**
 *  This function creates a persistent cookie with a generated pseudo-GUID (for now, with a very simple algorithm. if we get collisions, we can improve it, or even create a service for it).
 *  If the user already has one, it will not be created, and we'll just fire a page-view event
 */
(function(){
    var PERSISTENCE_MILLISECONDS= 5 * 365 * 24 * 60 * 60 * 1000; //half a year
    var PERSISTENT_COOKIE='_wixCIDX';

    try{
        if (hasCookie(PERSISTENT_COOKIE)) {
            sendBIevent(1001);
        } else {
            createCookie(PERSISTENT_COOKIE, generateGUID(), PERSISTENCE_MILLISECONDS);
            sendBIevent(1000); //important here to send the event only after creating the cookie, so that the cookie is attached to the bi call!
        }
    }
    catch (e) {}

    function sendBIevent(evid) {
        new Image(0,0).src='http://frog.wix.com/pblc?src=19&evid=' + evid + '&referral=' + encodeURIComponent(document.referrer);
    }

    //use the copy in W.Utils.HelperUtils or UtilsClass or whatever
    function generateGUID() {
			var S4 = function () {
            /*
            * 1. 0x10000 equals 65536.
            * 2. Adding 1 to Math.random() forces the result to be at least 65536, so when converting it to Hexadecimal it will be at least 5-digits number (10000).
            * 3. Remove the first char in order to get 4-digits String.
            * */
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };

        return (
            S4() + S4() + "-" +
                S4() + "-" +
                S4() + "-" +
                S4() + "-" +
                S4() + S4() + S4()
            );
    }

    function createCookie(cookieName, value, persistenceMilliseconds) {
        var expires = "";
        if (persistenceMilliseconds) {
            var date = new Date();
            date.setTime(date.getTime()+(persistenceMilliseconds));
            expires = "; expires="+date.toGMTString();
        }
        document.cookie = cookieName+"="+value+expires+"; path=/; domain=." + removeOneSubDomain();
    }

    function removeOneSubDomain() {
        //for editor.wix.com we'll get wix.com and for editor.inari.wixpress.com we'll get inari.wixpress.com
        return document.location.host.split('.').splice(1).join('.');
    }

    function hasCookie(cookieName) {
        return readCookie(cookieName) !== null;
    }

    function readCookie(cookieName){
        var results = document.cookie.match(new RegExp('\\b' + cookieName + '=(.*?)(;|$)')) ;
        if(results){ return(results[1]); }
        else{ return null; }
    }
})();