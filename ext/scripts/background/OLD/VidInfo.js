VSb.VidInfo = {
    "mediaStatus": "",
    "src": "",
    "duration": undefined,
    "currentTime": "",
    "currentlyFilterable": false,
    "updateMediaStatus": function(event) {
        // eventually get rid of this function by just using get and set methods on the mediaStatus
        VSb.VidInfo.mediaStatus = event.value;
        if ( VSb.VidInfo.mediaStatus == 'ended') {
            VSb.VidInfo.videoEnded();
        }
    },
    "processInfoFromContent": function(event) {
//console.log('\n\n%cVidInfo::processInfoFromContent()', 'color:white; font-weight: bold; background-color: blue; padding: 3px;');
        VSb.VidInfo.src =  decodeURIComponent(event.src.toString().replace('blob:', ''));
        VSb.VidInfo.duration = parseFloat(event.duration);
        // now that we have a VidInfo we can see if there is a filter for it
//         if (!VSb.Main.filterEDL || !VSb.Main.filterEDL.creation_date) {
// //console.log('need filter -- call VSb.Main.findFilterFile()');
// //				VSb.Main.findFilterFile();
//             VSb.Filter.PreMade.find();
//         } else {
// //console.log('aready have filter');
//         }
    },
    videoStarted: function() {

    },
    videoEnded: function() {
//console.log('%cvideoEnded()', 'font-sie:200%; color: lime');
        VSb.Main.reset();
    }

};