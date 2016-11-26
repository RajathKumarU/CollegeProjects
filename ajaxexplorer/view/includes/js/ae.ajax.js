/*
AjaxExplorer Copyright (C) 2007-2013 S.M.Sid Software

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. Head to
GNU site http://www.gnu.org/licenses/ for license copy.
*/

var intIExplore = navigator.userAgent.indexOf('MSIE') == -1 || navigator.userAgent.indexOf('Trident/5') != -1? 0:1;
var objAjaxHttp = intIExplore? new ActiveXObject('Microsoft.XMLHTTP'):new XMLHttpRequest();
var objFileEditor, objMenuTabs;

var arrAjaxPost = new Array();

var arrFileList = new Array();
var arrFileOpen = new Array();
var arrFileSize = new Array('B', 'KB', 'MB', 'GB', 'TB');

var arrPathHist = new Array();
var arrPathList = new Array();
var arrPathOpen = new Array();

var arrUserCode = new Array();
var arrUserList = new Array();

var intAjaxLock = intAjaxTime = intCodeDate = intCodeTime = intPathList = intPathOpen = intTipsCase = intUserEdit = intUserHKey = intUserMenu = intUserMSpd = intUserMST1 = intUserMST2 = intUserPerm = intUserPKey = intUserTerm = 0;
var intFileCtrl = intFileDrag = intFileDrop = intFileEdit = intFileList = intFileMark = intFileMenu = intFileMode = intFileOpen = intFileOver = intFilePick = intFileRows = intFileSBox = intFileTime = intFileTree = 0;

var intFilePark = intAjaxTask = 1, intFGPointX = intFGPointY = 10, intDSPointX = intDSPointZ = intTDPointX = 210, intDSPointY = 50, intPDPointX = 250, intPDPointY = 330;
var intFDPointX = intFDPointY = intFMPointX = intFMPointY = intFPPointX = intFPPointY = intMGPointX = intMGPointY = intMPPointX = intMPPointY = intSDPointX = intSDPointY = intSPPointX = intSPPointY = intWDPointX = intWDPointY = 0;

var strAjaxFile, strAjaxPost, strCSSImage, strFileHref, strFileInfo = 'block', strFileLine = 'left', strFileMark = '', strFileMode, strFilePath = 'D:/', strFileRoot = '', strFileSBox = '', strFileSort = 'name', strFileView = 'tile', strFullPath, strMiniMenu, strTargetID, strUserView;

function ajaxAbort(intFlag) {
	if(intFlag || confirm('Abort '+ (arrAjaxPost.length+1) +' pending task?')) {
		userTerminalEcho('<br />Ajax pending task aborted by '+ (intFlag? 'javascript error':'user'), 'red')

		arrAjaxPost = new Array();
		ajaxLocking(0);
	}
}

function ajaxLocking(intFlag) {
	intAjaxLock = intFlag;

	document.title = intFlag? 'Processing: '+ (arrAjaxPost[0]? intAjaxTask - arrAjaxPost.length:'1') +'/'+ intAjaxTask +' Task':'AjaxExplorer';
	setDisplay('aeAjax', intFlag? 'inline':0);

	if(arrAjaxPost.length == 0) {
		if(intFlag) {
			intAjaxTask = 1;
			intAjaxTime = setTimeout("get('aeAjax').className = ''", 5000);
		} else {
			clearTimeout(intAjaxTime);
			get('aeAjax').className = 'hide';
			intAjaxTime = 0;
		}
	} else if(!intFlag) {
		ajaxRequest(arrAjaxPost[0]);
		arrAjaxPost.reverse();
		arrAjaxPost.pop();
		arrAjaxPost.reverse();
	}
}

function ajaxRespond() {
	if(intAjaxLock && objAjaxHttp.readyState == 4 && objAjaxHttp.status == 200) {
		var arrText = objAjaxHttp.responseText.split('::AJAX::');

		if(arrText[0].indexOf('::') != -1) {
			ajaxLocking(0);

			if(arrText[0].indexOf('::HALT::') != -1) {
				userAccess(0);
				userSignReset(1);
				alert('Your session has expired!');
			}

			if(arrText[0].indexOf('::LOAD::') != -1) {
				if(confirm('Some of the settings required page reload, reload now?')) {
					location.reload();
				} else {
					fileBrowse();
				}
			}

			if(arrText[0].indexOf('::WARN::') != -1) {
				if(confirm(arrText[2])) {
					ajaxRequest(strAjaxPost +'&strSkip=maxfileread');
				}
			}

			return false;
		}

		for(var intLoop = 1; intLoop >= 0; intLoop--) {
			if(arrText[intLoop] && arrText[intLoop] != '') {
				userTerminalEcho(arrText[intLoop].replace(/\|/g, '<br />'), intLoop? 'green':'red');
			}
		}

		var intPost = strAjaxPost.indexOf('&'), strCall = intPost == -1? strAjaxPost:strAjaxPost.substr(0, intPost);

		if(strCall == 'file/access') {
			userCheckPathDone(arrText[0] == ''? 1:0);
		}

		if(strCall == 'user/sign/out' && intUserPKey == -1) {
			return;
		}

		if(arrText[0] == '' || arrText[1] != '' || arrText[2] != '') {
			switch(strCall) {
				case 'conf/select': userSystemLoad(arrText[2]); break;
				case 'file/editor': fileEditorLoad(arrText[2]); break;
				case 'file/explore': fileTreeBrowse(arrText[2]); break;
				case 'file/property': filePropertyLoad(arrText[2]); break;
				case 'user/change/password': userChangePass(arrText[2]); break;
				case 'user/change/theme': location.reload(); break;
				case 'user/create': userCreateDone(arrText[2]); break;
				case 'user/delete': userDeleteDone(arrText[2]); break;
				case 'user/select': userLoad(arrText[2]); break;
				case 'user/sign/in': userSignReply(arrText[2]); break;
				case 'user/sign/out': userAccess(0); break;
				case 'user/terminal': userTerminalLoad(arrText[2]); break;
				default: fileLoad(arrText[3]);
			}
		}

		ajaxLocking(0);
		fileDetail();
		menuGenerate();
	}
}

function ajaxRequest(strPost) {
	if(intAjaxLock) {
		intAjaxTask++
		arrAjaxPost.push(strPost);
	} else {
		strAjaxPost = strPost;

		if(strPost.indexOf('strFile=|') != -1) {
			return;
		}

		setTimeout('ajaxSending()', 0);
		ajaxLocking(1);
	}
}

function ajaxSending() {
	objAjaxHttp.open('post', 'index.php');
	objAjaxHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	objAjaxHttp.onreadystatechange = ajaxRespond;
	objAjaxHttp.send('strPage=control/'+ strAjaxPost);
}