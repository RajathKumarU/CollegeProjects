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

function menuExecute(strMenu) {
	if(strMenu.substr(0, 4) == 'icon') {
		menuExecuteIcon(strMenu);
	}

	if(strMenu.substr(0, 4) == 'menu' && get(strMenu).style.color != 'rgb(153, 153, 153)') {
		menuExecuteTask(strMenu);
	} 
}

function menuExecuteIcon(strMenu) {
	if(strMenu != 'icon11' && get('frame_aeEditArea').style.display == 'inline') {
		fileEditor();
	}

	switch(strMenu) {
		case 'icon01': userBrowse(-1); break;
		case 'icon02': userBrowse(+1); break;
		case 'icon03': fileBrowse(-1); break;
		case 'icon04': fileTree(); break;
		case 'icon11': fileEditor(); break;
		case 'icon12': userTerminal(); break;
		case 'icon21': userSystem(1); break;
		case 'icon22': userSystem(2); break;
		case 'icon23': userSystem(3); break;
		case 'icon31': window.open('readme.html'); break;
		case 'icon32': userSignOut(); break;
		case 'icon41': window.open('http://jigsaw.w3.org/css-validator/validator?uri='+ location.href); break;
		case 'icon42': window.open('http://validator.w3.org/check?uri='+ location.href); break;
	}
}

function menuExecuteTask(strMenu) {
	intFPPointX = intFPPointY = 0;

	menuHideMini();
	userSystemHide();

	switch(strMenu) {
		case 'menu010': fileView('*'); break;
		case 'menu011': fileView('list'); break;
		case 'menu012': fileView('icon'); break;
		case 'menu013': fileView('tile'); break;
		case 'menu020': fileOpen();	break;
		case 'menu021': fileOpen('internal'); break;
		case 'menu022': fileOpen('newtab'); break;
		case 'menu023': fileOpen('download'); break;
		case 'menu024': fileOpen('editor'); break;
		case 'menu110': fileCopy(); break;
		case 'menu120': fileCopy(1); break;
		case 'menu130': filePaste(); break;
		case 'menu140': fileDelete(); break;
		case 'menu150': fileRename(); break;
		case 'menu210': fileSent(); break;
		case 'menu211': fileSent(); break;
		case 'menu212': fileZip('compress'); break;
		case 'menu213': fileZip('extract'); break;
		case 'menu310': fileBrowse(); break;
		case 'menu320': fileSort('*'); break;
		case 'menu321': fileSort('date'); break;
		case 'menu322': fileSort('name'); break;
		case 'menu323': fileSort('size'); break;
		case 'menu324': fileSort('type'); break;
		case 'menu410': fileCreate('file'); break;
		case 'menu411': fileCreate('file'); break;
		case 'menu412': fileCreate('folder'); break;
		case 'menu510': fileProperty(); break;
		case 'menu610': fileWallpaper(); break;
		case 'menu710': fileOpen('search'); break;
		case 'menu810': fileRestoreAll(); break;
		case 'menu820': fileRestore(); break;
		case 'menu830': fileEmptyBin(); break;
	}
}

function menuGenerate() {
	var intFlag = 1, strFExt = '';

	if(arrFileList[1] && arrFileList[1][0]) {
		var intFlag = arrFileList[1][0].indexOf('/') == -1? 1:0;
	}

	if(intFileOver) {
		var strFExt = arrFileList[intFileOver][3];
	}

	setColorAt('menu011', strFileView != 'list'? 1:0);
	setColorAt('menu012', strFileView != 'icon'? 1:0);
	setColorAt('menu013', strFileView != 'tile'? 1:0);
	setDisplay('menu020', fileDisk('DLP') && (intFileMark || intFileOver)? 1:0);
	setColorAt('menu021', fileDisk('DP') && intFileOver? 1:0);
	setColorAt('menu022', fileDisk('DP') && intFileOver? 1:0);
	setColorAt('menu023', fileDisk('DLP') && intFileOver && strFExt != 'dir'? 1:0);
	setColorAt('menu024', fileDisk('DLP') && intFileOver && strFExt != 'dir'? 1:0);
	setDisplay('menu100', fileDisk('DP') && intFlag? 1:0);
	setColorAt('menu110', fileDisk('DP') && intFileMark? 1:0);
	setColorAt('menu120', fileDisk('DP') && intFileMark? 1:0);
	setColorAt('menu130', fileDisk('DP') && getCookies('aeClipTask')? 1:0);
	setColorAt('menu140', fileDisk('DP') && intFileMark? 1:0);
	setColorAt('menu150', fileDisk('DP') && intFileMark? 1:0);
	setDisplay('menu200', fileDisk('DP') && intFileMark? 1:0);
	setColorAt('menu211', intFileOver? 1:0);
	setColorAt('menu212', intFileMark? 1:0);
	setColorAt('menu213', intFileMark && strFExt == 'zip'? 1:0);
	setDisplay('menu300', !intFileOver? 1:0);
	setColorAt('menu310', intFlag? 1:0);
	setColorAt('menu321', strFileSort != 'date'? 1:0);
	setColorAt('menu322', strFileSort != 'name'? 1:0);
	setColorAt('menu323', strFileSort != 'size'? 1:0);
	setColorAt('menu324', strFileSort != 'type'? 1:0);
	setDisplay('menu400', fileDisk('DP') && !intFileOver && intFlag? 1:0);
	setDisplay('menu500', intFlag? 1:0);
	setDisplay('menu600', fileDisk('DP') && (strFExt == 'gif' || strFExt == 'jpg' || strFExt == 'jpeg' || strFExt == 'png')? 1:0);
	setDisplay('menu700', !intFlag && intFileOver? 1:0);
	setDisplay('menu800', fileDisk('R')? 1:0);
	setColorAt('menu820', fileDisk('R') && intFileMark? 1:0);
}

function menuHide() {
	if(strMiniMenu) {
		setDisplay(strMiniMenu, 0);
		strMiniMenu = '';
	}
}

function menuHideMini() {
	get('aeFileMenu').className = 'area';
}

function menuLoad() {
	var objElem = intIExplore? getIEClassName('panel'):document.getElementsByClassName('panel');
	var strData = getCookies('aeMenuLoad');

	for(var intLoop = 0; intLoop < objElem.length; intLoop++) {
		if(strData.substr(intLoop, 1) == 0) {
			objElem[intLoop].className = 'panel'+ (intUserPKey? ' show':'');
		}
	}
}

function menuShow(strMenu) {
	var objElem = get(strMenu = strMenu.substr(0, 6));

	if(strMenu != strMiniMenu) {
		menuHide(strMiniMenu);
	}

	if(objElem) {
		strMiniMenu = strMenu;

		objElem.style.display = 'block';

		if(objElem.parentNode.parentNode.className == 'mini') {
			objElem.style.left = (objElem.parentNode.parentNode.offsetLeft + (objElem.parentNode.parentNode.offsetLeft > intSDPointX - 280? -140:130)) +'px';
			objElem.style.top = (objElem.parentNode.parentNode.offsetTop + objElem.parentNode.offsetTop) +'px';
		}
	}
}

function menuShowMini() {
	var objElem = get('aeFileMenu');
	objElem.className = 'mini';
	objElem.style.left = (intWDPointX > intMPPointX + objElem.offsetWidth? (intMPPointX > intDSPointX? intMPPointX:intDSPointX):intMPPointX - objElem.offsetWidth) +'px';
	objElem.style.top = (intWDPointY > intMPPointY + objElem.offsetHeight + 58? (intMPPointY > intDSPointY? intMPPointY:intDSPointY):intMPPointY - objElem.offsetHeight) +'px';

	menuGenerate();
	userSystemHide();
}

function menuToogle(objThis, intFlag) {
	var objMenu = objThis.parentNode.parentNode;

	objMenu.className = objMenu.className == 'panel' || intFlag? 'panel show':'panel';

	if(intFlag != 1) {
		var objElem = intIExplore? getIEClassName('panel'):document.getElementsByClassName('panel');
		var strData = '';

		for(var intLoop = 0; intLoop < objElem.length; intLoop++) {
			strData += objElem[intLoop].className == 'panel'? 1:0;
		}

		setCookies('aeMenuLoad', strData);
	}
}