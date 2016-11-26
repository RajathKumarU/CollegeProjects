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

function userAccess(intFlag) {
	setWriteAt('aeDesktop', '');
	setWriteAt('txtSignFail', '');

	setDisplay('icon23', 0);
	setDisplay('aeEntrance', intFlag? 0:1);
	userSystemHide();

	if(!intFlag) {
		menuLoad();
		setTimeout("get('fldUserName').focus()", 0);
	}
	else ajaxRequest('user/select');
}

function userBrowse(strCase) {
	var intFlag = 0;

	if(strCase < 0 && intPathList > 0) {
		intPathList--;
		intFlag = 1;
	}

	if(strCase > 0 && intPathList < arrPathHist.length-1) {
		intPathList++;
		intFlag = 1;
	}

	if(intFlag) {
		get('fldFilePath').value = arrPathHist[intPathList];
		intPathLoad = 0;
		fileBrowse();
	}
}

function userChangePass(strText) {
	if(strText) {
		userTerminalEcho(strText, 'red');
	}
	else userSystemHide();
}

function userCheckPath(objElem) {
	if(objElem.value) {
		ajaxRequest('file/access&strPath=D:'+ objElem.value);
	}
}

function userCheckPathDone(intFlag) {
	setImageAt('syst131', strCSSImage +'/icon/'+ (intFlag? 'yes':'no') +'.gif');
}

function userCreate(objThis, objUser) {
	if(intIExplore) {
		objUser = objUser || event;
	}

	strName = objThis.value.toLowerCase();

	if(objUser.keyCode == 13 && strName) {
		setDisplay('syst130', 0);
		setDisplay('syst140', 0);

		if((','+ arrUserList.toString() +',').indexOf(','+ strName +',') == -1) {
			ajaxRequest('user/create&strUserName='+ strName);
			objThis.value = '';
		}
		else userTerminalEcho('Error: User already exists', 'red');
	}
}

function userCreateDone(strText) {
	arrUserList.push(strText.split(':'));
	userListAll();
}

function userDelete(intUserPKey) {
	setDisplay('syst130', 0);
	setDisplay('syst140', 0);

	if(confirm('Do you want to delete '+ arrUserList[intUserPKey][0] +'?')) {
		ajaxRequest('user/delete&intUserPKey='+ intUserPKey);
	}
}

function userDeleteDone(strText) {
	arrUserList[strText] = '';
	userListAll();
}

function userElement() {
	var objElem = get('aeAjax').style;
	objElem.padding = !intUserPKey? '0':'0 0 0 '+ Math.round(intDSPointX / 2) +'px';

	var objElem = get('aeSystMenu').style;
	objElem.left = Math.round((intWDPointX + intDSPointX - intPDPointX) / 2) +'px';
	objElem.top = Math.round((intWDPointY + intDSPointY - intPDPointY) / 2) +'px';

	var intPt1X = Math.round((intWDPointX + intDSPointX - intPDPointX + 16) / 2);
	var intPt1Y = Math.round((intWDPointY + intDSPointY - intPDPointY + 143) / 2);

	var objElem = get('syst130').style;
	objElem.left = intPt1X +'px';
	objElem.top = intPt1Y +'px';

	var objElem = get('syst140').style;
	objElem.left = intPt1X +'px';
	objElem.top = intPt1Y +'px';
}

function userError(strText, strHref, intLine) {
	userTerminalEcho('Error (JS) - '+ strText +' in '+ strHref +' on line '+ intLine, 'red');
	ajaxAbort(1);
}

function userExit() {
	if(intUserPKey != 0 && getCookies('aeFilePath') != '') {
		intUserPKey = -1;
		userSetSession();
	}
}

function userFocus() {
	if(!intUserMenu) {
		if(document.activeElement != undefined) {
			var strName = document.activeElement.tagName.toLowerCase();

			intFileCtrl = strName == 'label' || strName == 'input' || strName == 'select' || strName == 'textarea'? 0:1;
		}
	}
	else intFileCtrl = 0;

	setDisplay('icon00', intFileCtrl? 'inline':0);
}

function userIcon(strName) {
	var objUserIcon = new XMLHttpRequest();

	var strHref = 'ae.user/'+ strName.toLowerCase() +'/myprofile/icon.jpg'; 

	objUserIcon.open('head', strHref, false);
	objUserIcon.send();

    return objUserIcon.status == 200? strHref:strCSSImage +'/layout/avatar.png';
}

function userKeyArrow(intCase) {
	if(intFileList == 0) {
		return;
	}

	if(!intUserHKey) {
		fileSelectNone();
	}

	switch(intCase) {
		case 1:
			var intPark = 1;
			if(intFilePark > intPark) {
				intFilePark -= intPark;
			}
			break;
		case 2:
			var intPark = intFileRows;
			if(intFilePark > intPark) {
				intFilePark -= intPark;
			}
			break;
		case 3:
			var intPark = -1;
			if(intFileList >= intFilePark - intPark) {
				intFilePark -= intPark;
			}
			break;
		case 4:
			var intPark = -intFileRows;
			if(intFileList >= intFilePark - intPark) {
				intFilePark -= intPark;
			}
			break;
	}

	fileSelect(intFilePark, 1);
	menuGenerate();
}

function userKeyDown(objUser) {
	if(intIExplore) {
		objUser = objUser || event;
	}

	userFocus();
	userKeyHold(objUser);

	switch(objUser.keyCode) {
		case 9:		if(intUserPKey && intFileCtrl) { get('fldFilePath').focus(); return false; } else
					if(intUserTerm == 1) { userTerminalRun(); return false; } break;
		case 13:	if(intUserPKey && intFileCtrl) { fileOpen(); return false; }
					if(intUserPKey && intFileEdit) { get('item'+ intFileEdit +'-edit').blur(); return false; } break;
		case 27:	if(intUserPKey) userSignOut(); return false;
		case 37:	if(intUserPKey && intFileCtrl && intUserHKey != 3) { userKeyArrow(1); return false; }
					if(intUserPKey && intUserHKey == 3) { userBrowse(-1); return false; } break;
		case 38:	if(intUserPKey && intFileCtrl && intUserHKey != 3) { userKeyArrow(2); return false; }
					if(intUserPKey && intUserHKey == 3) { fileBrowse(-1); return false; } break;
		case 39:	if(intUserPKey && intFileCtrl && intUserHKey != 3) { userKeyArrow(3); return false; }
					if(intUserPKey && intUserHKey == 3) { userBrowse(+1); return false; } break;
		case 40:	if(intUserPKey && intFileCtrl && intUserHKey != 3) { userKeyArrow(4); return false; }
					if(intUserPKey && intUserHKey == 3) { get('fldFilePath').focus(); return false; } break;
		case 46:	if(intUserPKey && intFileCtrl) { fileDelete(); return false; } break;
		case 49:	if(intUserPKey && intFileCtrl && intUserHKey == 1) { fileOpen('internal'); return false; } break;
		case 50:	if(intUserPKey && intFileCtrl && intUserHKey == 1) { fileOpen('newtab'); return false; } break;
		case 51:	if(intUserPKey && intFileCtrl && intUserHKey == 1) { fileOpen('download'); return false; } break;
		case 52:	if(intUserPKey && intFileCtrl && intUserHKey == 1) { fileOpen('editor'); return false; } break;
		case 65:	if(intUserPKey && intFileCtrl && intUserHKey == 2) { fileSelectAll(); return false; }
					if(intUserPKey && intFileCtrl && intUserHKey == 1) { fileSort('*'); return false; } break;
		case 67:	if(intUserPKey && intFileCtrl && intUserHKey == 2) { fileCopy(0); return false; } break;
		case 68:	if(intUserPKey && intFileCtrl && intUserHKey == 2) { fileDelete(); return false; } break;
		case 69:	if(intUserPKey && intFileCtrl && intUserHKey == 1) { fileSort('type'); return false; } break;
		case 70:	if(intUserPKey && intFileCtrl && intUserHKey == 2) { fileCreate('file'); return false; } break;
		case 71:	if(intUserPKey && intFileCtrl && intUserHKey == 2) { fileCreate('folder'); return false; } break;
		case 73:	if(intUserPKey && intFileCtrl && intUserHKey == 1) { fileView('icon'); return false; } break;
		case 76:	if(intUserPKey && intFileCtrl && intUserHKey == 1) { fileView('list'); return false; } break;
		case 77:	if(intUserPKey && intFileCtrl && intUserHKey == 1) { fileSort('date'); return false; } break;
		case 78:	if(intUserPKey && intFileCtrl && intUserHKey == 1) { fileSort('name'); return false; } break;
		case 82:	if(intUserPKey && intUserHKey == 2) { fileRename(); return false; } break;
		case 83:	if(intUserPKey && intFileCtrl && intUserHKey == 1) { fileSort('size'); return false; } break;
		case 84:	if(intUserPKey && intFileCtrl && intUserHKey == 1) { fileView('tile'); return false; } break;
		case 86:	if(intUserPKey && intFileCtrl && intUserHKey == 2) { filePaste(); return false; }
					if(intUserPKey && intFileCtrl && intUserHKey == 1) { fileView('*'); return false; } break;
		case 88:	if(intUserPKey && intFileCtrl && intUserHKey == 2) { fileCopy(1); return false; } break;
		case 90:	if(intUserPKey && intFileCtrl && intUserHKey == 2) { fileProperty(); return false; } break;
		case 112:	window.open('readme.html'); return false;
		case 113:	if(intUserPKey) userSystem(1); return false;
		case 114:	if(intUserPKey) userSystem(2); return false;
		case 115:	if(intUserPKey) userSystem(3); return false;
		case 116:	if(intUserPKey && intUserHKey != 2) { fileBrowse(); return false; } break;
		case 117:	if(intUserPKey) fileTree(); return false;
		case 118:	if(intUserPKey) fileEditor(); return false;
		case 192:	userTerminal(); return false;
	}
}

function userKeyHold(objUser) {
	intUserHKey = 0;

	if(objUser.altKey) {
		intUserHKey = 3;
	}

	if(objUser.ctrlKey) {
		intUserHKey = 2;
	}

	if(objUser.shiftKey) {
		intUserHKey = 1;
	}
}

function userKeyUp(objUser) {
	if(intIExplore) {
		objUser = objUser || event;
	}

	userFocus();
	userKeyHold(objUser);
}

function userListAll() {
	var strText = '';

	for(var intLoop = 1; intLoop < arrUserList.length; intLoop++) {
		if(arrUserList[intLoop][0]) {
			strText += (intLoop == 1? '':'<span class="alignright"><img alt="" src="'+ strCSSImage +'/icon/lock.gif" class="icon" title="Set Permission" onclick="userSetPerm(this, '+ intLoop +')" /><img alt="" src="'+ strCSSImage +'/icon/keys.gif" class="icon" title="Set Password" onclick="userSetPass(this, '+ intLoop +')" /><img alt="" src="'+ strCSSImage +'/icon/delete.gif" class="icon" title="Delete" onclick="userDelete('+ intLoop +')" /></span>') +'<img alt="" src="'+ userIcon(arrUserList[intLoop][0]) +'" class="user" /> <div class="bold">'+ arrUserList[intLoop][0] +' ('+ arrUserList[intLoop][2] +')</div>'+ arrUserList[intLoop][1] +'<div class="clearfloat"></div>';
		}
	}

	setWriteAt('syst121', strText);
}

function userLoad(strText) {
	var arrHref = location.href.split('?'), arrText = strText.split('|');

	if(strUserView != arrText[2]) {
		location.reload();
	}

	intPathLoad = 1;
	intUserPKey = arrText[0];
	intUserPerm = arrText[1];

	arrPathList = getCookies('aePathList').split(',');
	intUserMSpd = setInteger(getCookies('aeUserMSpd', 400));
	intTDPointX = setInteger(getCookies('aeTDPointX', intDSPointX));

	strFileSort = getCookies('aeFileSort', 'name');
	strFileView = getCookies('aeFileView', 'tile');

	get('aeBody').style.backgroundImage = 'url('+ getCookies('aeFileWall') +')';
	get('fldFilePath').value = strFilePath = unescape(arrHref[1]? arrHref[1].replace(/\%20/g, ' ').replace(/\%26/g, '&') +'/':getCookies('aeFilePath', 'D:/').replace(/\+/g, ' '));

	arrPathHist[0] = strFilePath;

	if(intUserTerm == 1) {
		ajaxRequest('user/terminal');
	}

	setDisplay('aeHeader', 1);
	setDisplay('aeSideMenu', 1);
	setDisplay('aeTreeMenu', 0);

	get('aeDesktop').focus();

	if(intUserPKey != '0') {
		if(intUserPKey == '1') {
			setDisplay('icon23', 'inline');
		}

		fileBrowse();
		menuLoad();
	}
}

function userMouseDown(objUser) {
	if(!intUserPKey) {
		return;
	}

	if(intIExplore) {
		objUser = objUser || event;
		objUser.target = objUser.target || objUser.srcElement;
	}

	strTargetID = objUser.target.id;
	var strName = objUser.target.tagName.toLowerCase();

	if(intFileCtrl && !intUserHKey && !intFilePick && !intFileSBox && objUser.button != 2 && strName != 'input' && strName != 'select' && strName != 'textarea' && objUser.target.className != 'menu') {
		fileDetail();
		fileSelectNone();
	}

	if(intFileCtrl || intFileOver || objUser.button == 2) {
		userSystemHide();
	}

	if(intFileOver) {
		fileSelect();
	}

	if(objUser.button != 2) {
		if(intFileOver && !intFileSBox) {
			intFilePick = intFileOver;

			if(intUserHKey == 0) {
				fileRename('timer');
			}
		} else {
			intFPPointX = intMPPointX + intSPPointX;
			intFPPointY = intMPPointY + intSPPointY;
		}
	}
}

function userMouseMenu() {
	if(intUserPKey) {
		menuShowMini();
	}

	return false;
}

function userMouseMove(objUser) {
	if(!intUserPKey) {
		return;
	}

	if(intIExplore) {
		objUser = objUser || event;
		objUser.target = objUser.target || objUser.srcElement;
	}

	userFocus();

	intFileOver = 0;
	intMPPointX = objUser.clientX;
	intMPPointY = objUser.clientY;

	var objElem = objUser.target;

	if(!intFileCtrl && objElem.id != 'aeDesktop') {
		return;
	}

	if(objElem.className == 'drag' || objElem.className == 'over') {
		intFileOver = objElem.id;
	}

	if(objElem.id != undefined) {
		if(objElem.id != strMiniMenu && objElem.className != 'hint') {
			menuHide();
		}

		if(objElem.id.substr(0, 4) == 'menu') {
			menuShow(objElem.id);
		}
	}

	if(strTargetID == 'aeTreeMenu') {
		intTDPointX = intMPPointX > 0? intMPPointX:0;
		fileTreeResize(0);
	}

	if(intFileDrag) {
		intFMPointX += intMPPointX + intSPPointX - intMGPointX;
		intFMPointY += intMPPointY + intSPPointY - intMGPointY;
		fileDrag(intFMPointX, intFMPointY);
		//fileDrag(intMGPointX-13, intMGPointY-13);
	} else {
		if(intFilePick && fileDisk('DP')) {
			filePick();
		}

		if(strTargetID != 'aeTreeMenu' && intUserPKey && intFPPointX > intDSPointX && intFPPointY > intDSPointY && intFPPointX < intSDPointX && intFPPointY < intSDPointY) {
			fileSelectBox();
		}
	}

	if(intFileTime && (!intFileCtrl || intFileDrag || intFileSBox)) {
		clearTimeout(intFileTime);
	}

	intMGPointX = intMPPointX + intSPPointX;
	intMGPointY = intMPPointY + intSPPointY;

	return false;
}

function userMouseUp(objUser) {
	if(!intUserPKey) {
		return;
	}

	if(intIExplore) {
		objUser = objUser || event;
		objUser.target = objUser.target || objUser.srcElement;
	}

	setTimeout('userFocus()', 50);

	strFileSBox = strFileMark;
	strFileMark = strTargetID = '';

	if(intFileDrag) {
		fileDrop();
	}

	if(objUser.target.id) {
		menuHideMini();
		menuExecute(objUser.target.id);
	}

	var intTime = new Date();
	intTime = intTime.getTime();
	intUserMST1 = intUserMST2? intUserMST2:intTime + intUserMSpd;
	intUserMST2 = intTime;

	if(intFileSBox) {
		for(var intLoop = 1; intLoop <= intFileList; intLoop++) {
			var objFile = get('item'+ intLoop);

			if(objFile) {
				if(objFile.className=='mark') {
					strFileMark += ':'+ intLoop +':';
				}
			}
		}
	}
	else if(intFileCtrl && objUser.button != 2 && intUserMST2 - intUserMST1 < intUserMSpd) {
		fileOpen();
	}

	if(intFileOver) {
		intFileMenu = intFileOver;
	}

	intFilePick = intFileSBox = intFPPointX = intFPPointY = 0;
	setDisplay('aeMasking', 0);
	menuGenerate();
}

function userResize() {
	userScreen();
	userElement();
	fileSort();
}

function userScreen() {
	filePointer(0, 0);
	intSDPointX = document.body.scrollWidth - 4;
	intSDPointY = document.body.scrollHeight - 2;
	intWDPointX = (self.innerWidth || document.body.clientWidth || document.documentElement.clientWidth) - 4;
	intWDPointY = (self.innerHeight || document.body.clientHeight || document.documentElement.clientHeight) - 2;

	if(get('aeContent')) {
		objElem = get('aeContent').style;
		objElem.width = (intWDPointX - intDSPointX - 1) +'px';
		objElem.height = (intWDPointY - intDSPointY) +'px';
		objElem.left = (intDSPointX - 1) +'px';
		objElem.top = (intDSPointY - 1) +'px';
	}
}

function userScroll() {
	intSPPointX = document.body.scrollLeft || document.documentElement.scrollLeft;
	intSPPointY = document.body.scrollTop || document.documentElement.scrollTop;
}

function userSetPass(objThis, intUser) {
	intUserEdit = intUser;
	userSystemTabPopup(objThis, 4);
}

function userSetPassSave() {
	var objFld1 = get('syst141');
	var objFld2 = get('syst142');
	var strPwd1 = objFld1.value;
	var strPwd2 = objFld2.value;

	objFld1.value = objFld2.value = '';

	if(strPwd2.length > 7) {
		if(strPwd1 == strPwd2) {
			ajaxRequest('user/update&intUserPKey='+ intUserEdit +'&strUserPass='+ MD5(strPwd2));
			userSystemHide(4);
		}
		else userTerminalEcho('User new password does not match', 'red');
	}
	else userTerminalEcho('User new password must be at least 8 characters long', 'red');
}

function userSetPerm(objThis, intUser) {
	intUserEdit = intUser;

	get('syst132').value = arrUserList[intUser][1];
	get('syst133').checked = arrUserList[intUser][2] & 0x0001? 'checked':'';
	get('syst134').checked = arrUserList[intUser][2] & 0x0002? 'checked':'';
	get('syst135').checked = arrUserList[intUser][2] & 0x0004? 'checked':'';
	get('syst136').checked = arrUserList[intUser][2] & 0x0008? 'checked':'';

	userSystemTabPopup(objThis, 3);
}

function userSetPermSave() {
	var intPerm = 0;

	for(var intLoop = 3; intLoop < 7; intLoop++) {
		var objElem = get('syst13'+ intLoop);
		intPerm -= objElem.checked? -objElem.value:0;
	}

	ajaxRequest('user/update&intUserPKey='+ intUserEdit +'&strUserPath='+ getEscape(arrUserList[intUserEdit][1] = get('syst132').value) +'&strUserPerm='+ (arrUserList[intUserEdit][2] = intPerm));
	userSystemHide(3);
	userListAll();
}

function userSetSession() {
	ajaxRequest('user/change/session&strCook='+ document.cookie);
}

function userSetTheme(objElem) {
	ajaxRequest('user/change/theme&strUserView='+ objElem.value);
}

function userSignIn() {
	ajaxRequest('user/sign/in&strUserName='+ get('fldUserName').value +'&strUserPass='+ MD5(get('fldUserPass').value));
}

function userSignOut() {
	if(confirm('Do you want to sign out?')) {
		userSignReset();
	}
}

function userSignReply(strFlag) {
	if(strFlag == 'ok') {
		strFileHref = '';

		setWriteAt('aeTerminalEcho', '');
		setCookies('aeFilePath', '');

		menuLoad();
		userAccess(1);
	}
}

function userSignReset(intFlag) {
	intUserPKey = 0;
	strFileHref = '';

	setCookies('aeFilePath', strFilePath);
	setDisplay('aeHeader', 0);
	setDisplay('aePointer', 0);
	setDisplay('aeSideMenu', 0);
	setDisplay('aeTreeMenu', 0);
	setWriteAt('aeTerminalEcho', '');

	if(get('frame_aeEditArea').style.display == 'inline') {
		get('aeBody').style.overflow = 'auto';
		editAreaLoader.hide('aeEditArea');
	}

	if(!intFlag) {
		ajaxRequest('user/sign/out&strCook='+ document.cookie);
	}
}

function userSystem(intLoad) {
	intUserMenu = intLoad;

	if(intLoad == 1 || intLoad == 3) {
		ajaxRequest('conf/select&intLoad='+ intLoad);
	}
	else userSystemLoad();
}

function userSystemHide(intLoad) {
	if(!intLoad) {
		setDisplay('aeSystMenu', intUserMenu = 0);
		setDisplay('syst130', 0);
		setDisplay('syst140', 0);
	}
	else setDisplay('syst1'+ intLoad +'0', 0);
}

function userSystemLoad(strText) {
	var arrText = strText? strText.split('|'):0;

	switch(intUserMenu) {
		case 1:
			arrUserList = new Array();
			for(var intLoop = 0; intLoop < arrText.length; intLoop++) {
				arrUserList[intLoop] = arrText[intLoop].split(':');

				if(arrUserList[intLoop][1]) {
					arrUserList[intLoop][1] = arrUserList[intLoop][1].replace(/\$3A\$/g, ':');
				}
			}

			if(intUserPKey == 1) userListAll();

			setImageAt('syst101', userIcon(arrUserList[intUserPKey][0]));
			setWriteAt('syst102', arrUserList[intUserPKey][0]);
			setWriteAt('syst103', arrUserList[intUserPKey][1]);
			setImageAt('syst104', strCSSImage +'/icon/'+(arrUserList[intUserPKey][2] & 0x0001? 'yes':'no')+'.gif');
			setImageAt('syst105', strCSSImage +'/icon/'+(arrUserList[intUserPKey][2] & 0x0002? 'yes':'no')+'.gif');
			setImageAt('syst106', strCSSImage +'/icon/'+(arrUserList[intUserPKey][2] & 0x0004? 'yes':'no')+'.gif');
			setImageAt('syst107', strCSSImage +'/icon/'+(arrUserList[intUserPKey][2] & 0x0008? 'yes':'no')+'.gif');
			get('syst111').value = arrUserList[intUserPKey][3];
			break;
		case 2:
			get('syst201').value = getCookies('aeFileWall');
			get('syst202').value = arrPathList.sort().toString().replace(/,/g, '\n').substr(1);
			get('syst211').value = getCookies('aeClipTask');
			get('syst212').value = getCookies('aeClipFrom');
			get('syst213').value = getCookies('aeClipFile').replace(/,/g, '\n');
			get('syst221').value = intTDPointX;
			get('syst222').value = intUserMSpd;
			break;
		case 3:
			get('syst301').checked = arrText[0] == '1'? 'checked':'';
			get('syst302').checked = arrText[1] == '1'? 'checked':'';
			get('syst303').checked = arrText[2] == '1'? 'checked':'';
			get('syst304').checked = arrText[3] == '1'? 'checked':'';
			get('syst305').checked = arrText[4] == '1'? 'checked':'';
			get('syst311').value = arrText[5];
			get('syst312').value = arrText[6];
			get('syst313').value = arrText[7];
			get('syst314').value = arrText[8];
			get('syst321').value = arrText[11];
			get('syst322').value = arrText[12];
			get('syst323').value = arrText[13];
			get('syst324').value = arrText[14];
	}

	userSystemShow();
}

function userSystemSave() {
	switch(intUserMenu) {
		case 1:
			var objFld1 = get('syst112');
			var objFld2 = get('syst113');
			var objFld3 = get('syst114');
			var strPwd1 = objFld1.value;
			var strPwd2 = objFld2.value;
			var strPwd3 = objFld3.value;

			objFld1.value = objFld2.value = objFld3.value = '';

			if(get('syst110').style.display == 'block' && (strPwd1 || strPwd2 || strPwd3)) {
				if(strPwd1) {
					if(strPwd2.length > 7) {
						if(strPwd2 == strPwd3) {
							ajaxRequest('user/change/password&strUserPass='+ MD5(strPwd1) +'&strUserPNew='+ MD5(strPwd2));
						}
						else userTerminalEcho('Your new password does not match', 'red');
					}
					else userTerminalEcho('Your new password must be at least 8 characters long', 'red');
				}
				else userTerminalEcho('Your old password must be supplied for password verification', 'red');
			}
			else userSystemHide();
			break;
		case 2:
			fileWallpaper(get('syst201').value);
			setCookies('aePathList', arrPathList = ('\n'+ get('syst202').value).split('\n'));
			setCookies('aeClipTask', get('syst211').value);
			setCookies('aeClipFrom', get('syst212').value);
			setCookies('aeClipFile', get('syst213').value.split('\n'));
			var intTemp = setInteger(get('syst221').value);
			setCookies('aeUserMSpd', intUserMSpd = setInteger(get('syst222').value));

			if(intTDPointX != intTemp) {
				intTDPointX = intTemp;

				if(intFileTree) {
					fileTreeResize(0);
				}
			}

			ajaxRequest('user/change/session&strCook='+ document.cookie);
			userSystemHide();
			break;
		case 3:
			ajaxRequest('conf/update&strConf='+ (get('syst301').checked? 1:0) +'\t'+ (get('syst302').checked? 1:0) +'\t'+ (get('syst303').checked? 1:0) +'\t'+ (get('syst304').checked? 1:0) +'\t'+ (get('syst305').checked? 1:0) +'\t'+ get('syst311').value +'\t'+ get('syst312').value +'\t'+ get('syst313').value +'\t'+ get('syst314').value +'\t::CORE::\t'+ get('syst321').value +'\t'+ get('syst322').value +'\t'+ get('syst323').value +'\t'+ get('syst324').value +'\t');
			userSystemHide();
			break;
	}
}

function userSystemShow() {
	if(!userSystemTab(get('syst'+ intUserMenu +'1'), 0)) {
		return;
	}

	for(var intLoop = 1; intLoop < 5; intLoop++) {
		setDisplay('page'+ intLoop, intLoop == intUserMenu? 1:0);
	}

	setDisplay('aeSystMenu', 1);
}

function userSystemTab(objThis, intLoad) {
	if(intLoad == 2 && intUserMenu == 1 && intUserPKey != 1) {
		userTerminalEcho('You do not have the permission to Manage Account', 'red');
		return 0;
	}

	for(var intLoop = 0; intLoop < 5; intLoop++) {
		if(intLoop < 3 || intUserMenu == 1) {
			setDisplay('syst'+ intUserMenu + intLoop +'0', intLoop == intLoad? 1:0);
		}
	}

	if(intUserMenu < 4) {
		get('syst'+ intUserMenu +'0').innerHTML = objThis.innerHTML;
	}

	if(objMenuTabs != undefined) {
		objMenuTabs.className = '';
	}

	objMenuTabs = objThis;
	objThis.className = 'active';

	return 1;
}

function userSystemTabPopup(objThis, intLoad) {
	get('syst1'+ (intLoad == 3? 4:3) +'0').style.display = 'none';
	get('syst1'+ intLoad +'0').style.display = 'block';
}

function userTerminal() {
	intUserTerm = intUserTerm? 0:1;

	var objElem = get('aeTerminal');
	objElem.className = intUserTerm? 'code':'mini';

	objElem = get('aeTerminalText');
	objElem.scrollTop = objElem.scrollHeight;

	if(intUserTerm) {
		get('fldTermCode').focus();
	}

	if(intUserPKey != '0' && intUserTerm && get('fldTermFunc').innerHTML == '') {
		ajaxRequest('user/terminal');
	}
}

function userTerminalApply(objThis) {
	var arrList = fileSelectList(), objCode = get('fldTermCode'), strFunc = get('fldTermComm').value, arrFunc = strFunc.split(' '), strText = '';

	if(arrList.length == 0 && (strFunc.indexOf('F') != -1 || strFunc.indexOf('M') != -1)) {
		userTerminalEcho('Select files first before apply this command', 'red');
		objThis.selectedIndex = 0;
		return;
	}

	if(strFunc.indexOf(arrFunc[0] +' S') != -1) {
		strText += '\n'+ arrFunc[0];
	}

	if(strFunc.indexOf(arrFunc[0] +' P') != -1) {
		strText += '\n'+ arrFunc[0] +' '+ getEscape(strFilePath, 1);
	}

	if(strFunc.indexOf(arrFunc[0] +' M') != -1) {
		strText += '\n'+ arrFunc[0];
	}

	for(intLoop = 0; intLoop < arrList.length; intLoop++) {
		if(strFunc.indexOf('F') != -1) {
			strText += '\n'+ arrFunc[0] +' '+ getEscape(strFilePath + arrFileList[arrList[intLoop]][0], 1);
		}

		if(strFunc.indexOf('F F') != -1) {
			strText += ' '+ getEscape(strFilePath + arrFileList[arrList[intLoop]][0], 1);
		}

		if(strFunc.indexOf('F P') != -1) {
			strText += ' '+ getEscape(strFilePath, 1);
		}

		if(strFunc.indexOf('M') != -1) {
			strText += (intLoop? '':' '+ getEscape(strFilePath, 1) +' ') + getEscape(arrFileList[arrList[intLoop]][0], 1) + (intLoop == arrList.length-1? '':',');
		}

		if(strFunc.indexOf('P P') != -1) {
			strText += ' '+ getEscape(strFilePath, 1);
			strText += ' '+ getEscape(strFilePath, 1);
		}
	}

	objCode.value += strText;
	objCode.focus();

	objThis.selectedIndex = 0;

	if(strFunc.indexOf('N') != -1) {
		objCode.value += (strFunc.indexOf('M N') != -1? ' ':'') +'filename';
		objCode.selectionStart = objCode.value.length - 8;
		objCode.selectionEnd = objCode.value.length;
	}
}

function userTerminalCheck(objThis, objUser) {
	if(objThis.value) {
		get('fldTermFile').value = 'Save';

		if(objThis.value.substr(0, 8) == 'sign-in ') {
			var arrText = objThis.value.split(' '), intText = arrText.length, objElem = get('fldUserPass');

			if(intText == 3) {
				objElem.value += objThis.value.substr(arrText[1].length + 9);
				objThis.value = arrText[0] +' '+ arrText[1] +' ';
			}
			else objElem.value = '';
		}
	}
	else get('fldTermFile').value = 'Open';
}

function userTerminalClear() {
	var objElem = get('fldTermCode');
	objElem.value = '';
	objElem.focus();
	get('fldTermFile').value = 'Open';
	setWriteAt('aeTerminalEcho', '');
}

function userTerminalEcho(strText, strClass) {
	if(strClass == 'green' && strText.indexOf('/terminal') != -1) {
		ajaxRequest('user/terminal');
	}

	var objElem = get('aeTerminalEcho');
	objElem.innerHTML += (strClass? '<span class="'+ strClass +'">':'') + strText + (strClass? '</span><br />':'');
	var objElem = get('aeTerminalText');
	objElem.scrollTop = objElem.scrollHeight;
}

function userTerminalLoad(strText) {
	var arrText = strText.substr(strText.indexOf(':TEXT:') + 6).split('\n');

	arrUserCode = new Array();
	setWriteAt('fldTermFunc', '<option></option>');

	for(var intLoop = 0; intLoop < arrText.length; intLoop++) {
		if(arrText[intLoop]) {
			var arrName = arrText[intLoop].split('|');
			var strCode = arrText[intLoop].replace(/\|/g, "\n");

			arrUserCode.push(strCode);
			setWriteAt('fldTermFunc', '<option>'+ arrName[0] +'</option>', 1);
		}
	}
}

function userTerminalRun() {
	var objElem = get('fldTermCode'), arrCode = objElem.value.replace(/\$DATE\$/g, intCodeDate).replace(/\$TIME\$/g, intCodeTime).split("\n");
	objElem.value = '';
	objElem.focus();

	for(var intLoop = 0; intLoop < arrCode.length; intLoop++) {
		arrAjax = arrCode[intLoop].replace(/,/g, "|").replace(/  /g, ' ').split(' ');

		for(var intXoop = 1; intXoop < 5; intXoop++) {
			if(arrAjax[intXoop]) {
				arrAjax[intXoop] = getEscape((arrAjax[intXoop].indexOf('/') != -1 && arrAjax[intXoop].indexOf(':') == -1? 'D:':'')+ arrAjax[intXoop]);
			} 
		}

		switch(arrAjax[0]) {
			case 'browse': if(arrAjax[1]) ajaxRequest('file/browse&strPath='+ getEscape(arrAjax[1])); break;
			case 'compress': if(arrAjax[2]) ajaxRequest('file/compress&strPath='+ fileInfo(arrAjax[1], 'dirname') +'&strDest='+ arrAjax[2] +'&strFile='+ fileInfo(arrAjax[1], 'basename')); break;
			case 'copy': if(arrAjax[2]) ajaxRequest('file/copy&strPath='+ fileInfo(arrAjax[1], 'dirname') +'&strDest='+ arrAjax[2] +'&strFile='+ fileInfo(arrAjax[1], 'basename')); break;
			case 'create': if(arrAjax[1]) ajaxRequest('file/create&strPath='+ unescape(arrAjax[1]).substr(0, 3) +'&strFile='+ arrAjax[1]); break;
			case 'delete': if(arrAjax[1]) ajaxRequest('file/delete&strPath='+ fileInfo(arrAjax[1], 'dirname') +'&strFile='+ fileInfo(arrAjax[1], 'basename')); break;
			case 'download': if(arrAjax[1]) ajaxRequest('file/download&strPath='+ fileInfo(arrAjax[1], 'dirname') +'&strFile='+ fileInfo(arrAjax[1], 'basename')); break;
			case 'editor': if(arrAjax[1]) ajaxRequest('file/editor&strPath='+ fileInfo(arrAjax[1], 'dirname') +'&strFile='+ fileInfo(arrAjax[1], 'basename')); break;
			case 'extract': if(arrAjax[2]) ajaxRequest('file/extract&strPath='+ fileInfo(arrAjax[1], 'dirname') +'&strDest='+ arrAjax[2] +'&strFile='+ fileInfo(arrAjax[1], 'basename')); break;
			case 'move': if(arrAjax[2]) ajaxRequest('file/move&strPath='+ fileInfo(arrAjax[1], 'dirname') +'&strDest='+ arrAjax[2] +'&strFile='+ fileInfo(arrAjax[1], 'basename')); break;
			case 'rename': if(arrAjax[2]) ajaxRequest('file/rename&strPath='+ fileInfo(arrAjax[1], 'dirname') +'&strDest='+ fileInfo(arrAjax[2], 'dirname') +'&strFile='+ fileInfo(arrAjax[1], 'basename') +'&strName='+ fileInfo(arrAjax[2], 'basename')); break;
			case 'search': if(arrAjax[1]) ajaxRequest('file/search&strPath='+ fileInfo(arrAjax[1], 'dirname') +'&strFile='+ fileInfo(arrAjax[1], 'basename')); break;
			case 'sign-in': if(arrAjax[1]) ajaxRequest('user/sign/in&strUserName='+ arrAjax[1] +'&strUserPass='+ MD5(get('fldUserPass').value)); break;
			case 'sign-out': userSignReset(); break;
			case 'xcompress': if(arrAjax[3]) ajaxRequest('file/compress&strPath='+ arrAjax[1] +'&strDest='+ arrAjax[2] +'&strFile='+ arrAjax[3]); break;
			case 'xcopy': if(arrAjax[3]) ajaxRequest('file/copy&strPath='+ arrAjax[1] +'&strDest='+ arrAjax[2] +'&strFile='+ arrAjax[3]); break;
			case 'xdelete': if(arrAjax[2]) ajaxRequest('file/delete&strPath='+ arrAjax[1] +'&strFile='+ arrAjax[2]); break;
			case 'xextract': if(arrAjax[3]) ajaxRequest('file/extract&strPath='+ arrAjax[1] +'&strDest='+ arrAjax[2] +'&strFile='+ arrAjax[3]); break;
			case 'xmove': if(arrAjax[3]) ajaxRequest('file/move&strPath='+ arrAjax[1] +'&strDest='+ arrAjax[2] +'&strFile='+ arrAjax[3]); break;
			case 'xrename': if(arrAjax[4]) ajaxRequest('file/rename&strPath='+ arrAjax[1] +'&strDest='+ arrAjax[2] +'&strFile='+ arrAjax[3] +'&strName='+ arrAjax[4]); break;
		}
	}
}

function userTerminalSave(intCode) {
	var objElem = get('fldTermFile'), intFlag = objElem.value == 'Save'? 1:0, strText = get('fldTermCode').value, arrName = strText.split('\n');

	objElem.value = 'Open';
	ajaxRequest('file/editor&strPath=P:/&strFile=terminal'+ (intFlag? '&strText='+ getEscape('\n'+ strText.replace(/\n/g, '|')) +'&strOpen=a+':''));
}

function userTerminalSet(objThis) {
	if(objThis.selectedIndex) {
		var objCode = get('fldTermCode');
		objCode.value += arrUserCode[objThis.selectedIndex-1];
		objCode.focus();

		objThis.selectedIndex = 0;
	}
}

function userTips(intTips) {
	switch(intTips) {
		case 1: strText = 'Press "F6" key to toggle left panel.<br />Click folder\'s icon to open or refresh subfolder tree.'; break;
		case 2: strText = 'Hover any above files to know it\'s origin directory.'; break;
		case 3: strText = 'Press "Arrow - Up" or "Arrow - Down" key to go through stored address list.<br />Press "Ctrl + Arrow Left" key to set address to parent\'s folder<br />Press "Ctrl + Arrow Right" key to open the folder'; break;
		case 4: strText = 'You may drop the drag item on folder to move it.<br />Can move files and folders to folder tree on left panel, Press "F6" key to open it.'; break;
		case 5: strText = 'Type in username and press "Enter" key to create new user.<br />Default password for new user are base on username follow by 123 (demo123).'; break;
		case 6: strText = 'You may add your personalize user icon by uploading it as "icon.jpg" file'; break;
		default: strText = '';
	}

	if(intTips && intTips != intTipsCase) {
		intTipsCase = intTips;
		userTerminalEcho(strText, 'blue');
	}
}

document.oncontextmenu = userMouseMenu;
document.onmousedown = userMouseDown;
document.onmousemove = userMouseMove;
document.onmouseup = userMouseUp;
document.onkeydown = userKeyDown;
document.onkeyup = userKeyUp;
onresize = userResize;
onscroll = userScroll;
onerror = userError;