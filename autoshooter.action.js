////////////////////////////////
// action functions.

function fJumpPage(nNewStatus) {
    if(bOncamera) {
        fStopcamera() ;
    }
	nStatus = nNewStatus ;
}

function fCameraonoff() {
    if (bOncamera) {
        fStopcamera() ;
    } else {
        fStartcamera() ;
    }
}

function fStartcamera() {
    var video = document.getElementById('local_video');
    var lStream;

	fCanvasresize(nCmrwidth,nCmrheight) ;
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(function (stream) { // success
      lStream = stream;
      video.src = window.URL.createObjectURL(lStream);
    }).catch(function (error) { // error
      console.error('mediaDevice.getUserMedia() error:', error);
      return;
    });
    bOncamera = true ;
    bVisibility = false ;
var canvas = document.getElementById('canvas');
    canvas.style.visibility = 'hidden' ;
    dtStarttime = new Date() ;

	_startmainloop(fMainloop) ;
}

function fMainloop() {

    fCamerarefresh() ;
}

function fStopcamera() {
    var video = document.getElementById('local_video');

	_stopmainloop() ;
    video.src = null ;
    bOncamera = false ;
	fCanvasresize(0,0) ;
}

function fCamerarefresh() {
if (bOncamera) {
	var canvas = document.getElementById('canvas');
    var video = document.getElementById('local_video');
	var context = canvas.getContext("2d") ;
    var dtCur = new Date() ;

	context.drawImage(video, 0, 0, nCmrwidth, nCmrheight);
// print date time
    context.fillStyle = 'rgb(127,127,127)' ;
    context.fillRect(0,0,250,20) ;
    context.fillStyle = 'rgb(255,255,255)' ;
    context.font = '18px sans-serif' ;
//    context.fillText(_date2string(dtCur),20,18) ;
    context.fillText(_date2string(dtCur)+' : '+_tblSize(tImg).toString(),20,18) ;

    if (dtCur-dtStarttime >= nInterval*1000) {
        // timeup. start burst mode.
        bBurstmode = true ;
        nCount = 0 ;
        dtStarttime = dtCur ;
        dtBurststarttime = dtCur ;
    }
    if (bBurstmode) {
        if (dtCur-dtBurststarttime >= 100) {
            // Burst time up. 100ms.
            fCopyimagetotable() ;
            if (++nCount < nBurstcount) {
                // once more.
                dtBurststarttime = dtCur ;
            } else {
                // count up.
                bBurstmode = false ;
            }
        }
    }
}
}

function fCopyimagetotable() {
	var canvas = document.getElementById('canvas');
    var sBase64 = canvas.toDataURL('image/jpeg');
    _tblAddRow(tImg,[sBase64,false]) ;
}

function fCanvasresize(nX,nY) {
	var canvas = document.getElementById('canvas') ;
	if (canvas.getContext) {
		canvas.style.width = nX.toString()+'px' ;
		canvas.style.height = nY.toString()+'px' ;

		var context = canvas.getContext('2d') ;

		context.canvas.width = nX ;
		context.canvas.height = nY ;
	}
}

function fVisibilityonoff() {
    bVisibility = !bVisibility ;
	var canvas = document.getElementById('canvas');
    if (bVisibility) {
        canvas.style.visibility = 'visible' ;
    } else {
        canvas.style.visibility = 'hidden' ;
    }
}

function fOKSetting() {
	var sBurstcount ;
	var sCountlimit ;
	var sInterval ;
	var sMes ;

	sBurstcount = document.form1.burst.value ;
	sCountlimit = document.form1.count.value ;
	sInterval = document.form1.interval.value ;

	sMes  = 'Burst count   = '+sBurstcount+'\n' ;
	sMes += 'Count limit   = '+sCountlimit+'\n' ;
	sMes += 'Interval(sec) = '+sInterval ;

	if (_gAskboolean(sMes)) {
		nBurstcount = Number(sBurstcount) ;
		nCountlimit = Number(sCountlimit) ;
		nInterval   = Number(sInterval) ;
	}
	nStatus = 0 ;
}

function saveimage() {
    if (bOncamera) {
//        _stopmainloop() ;
        gosave() ;
//        _startmainloop(fMainloop) ;
    }
}

function gosave() {
	var sFn = '' ;
    var dtNow = new Date() ;
    var sTmp = _date2string(dtNow) ;
    sFn = 'as'+sTmp.replace(/\/|:|\s/g,'')+'.jpg' ;
	_savecanvas('canvas',sFn,'jpeg') ;
}

function _line(context,nX1,nY1,nX2,nY2) {
    context.beginPath() ;
    context.moveTo(nX1,nY1) ;
    context.lineTo(nX2,nY2) ;
    context.stroke() ;
}

function fGoMainPage() {
	var canvas = document.getElementById('canvas') ;
	if (canvas.getContext) {
		canvas.style.width = '0px' ;
		canvas.style.height = '0px' ;
	}
	nStatus = 0 ;
}
