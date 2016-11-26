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

function fileAjaxInit() {
	userAccess(intUserPKey);
	editAreaLoader.hide('aeEditArea');

	var objElem = new Image(); 
	objElem.src = strCSSImageExt +'/non.png';

	var objElem = get('aeBody').style;
	objElem.visibility = 'visible';
	objElem.overflow = 'auto';

	document.title = 'AjaxExplorer';

	setDisable('fldSearchText', 1);
	setDisable('syst303', 1);

	userScreen();
	userElement();
}

function fileBrowse(strPath, intFlag) {
	if(strPath == '-1') {
		if(strFilePath.length < 4) {
			return;
		}

		strPath = strFilePath.substr(0, strFilePath.substr(0, strFilePath.length-1).lastIndexOf('/')) +'/';
	}

	if(strPath == 'P:/') {
		userTips(6);
	}

	var strTemp = strPath;
	var strPath = unescape(strPath == undefined? get('fldFilePath').value:(intFlag? strFilePath + strPath:strPath));
	intFileEdit = intFileMark = intFileOpen = intFileOver = intFilePick = intFPPointX = intFPPointY = 0;

	if(strPath.indexOf(':/') == -1) {
		strPath = 'D:/'+ strPath;
	}

	if(intPathLoad && strTemp != undefined) {
		intPathList = arrPathHist.length;
		arrPathHist.push(strPath.replace(/\/\//g, '/'));
		if((','+ arrPathList.toString().toLowerCase() +',').indexOf(','+ strPath.toLowerCase() +',') == -1) {
			arrPathList.push(strPath.replace(/\/\//g, '/'));
		}
	}

	userSystemHide();
	filePointer(0, 0);
	setWriteAt('aeDesktop', '');
	setWriteAt('aeDownload', '');
	setDisplay('divPathList', 0);
	setCookies('aeFilePath', strPath);
	setCookies('aePathList', arrPathList.toString());

	intPathLoad = 1;

	get('fldFilePath').value = strFilePath = strPath;
	ajaxRequest('file/browse&strPath='+ getEscape(strFilePath));
}

function fileCopy(intFlag) {
	if(strFilePath == 'R:/') {
		return;
	}

	var strFileList = '';

	setWriteAt('keyinfo', intFlag? 'Move':'Copy');

	for(var intLoop = 1; intLoop <= intFileList; intLoop++) {
		var objFile = get('item'+ intLoop);

		if(objFile) {
			get(String(intLoop)).className = 'over';

			if(objFile.className == 'mark') {
				strFileList += arrFileList[intLoop][0] +',';
				intFlag? get(String(intLoop)).className = 'drag':0;
			}
		}
	}

	if(strFileList) {
		setCookies('aeClipFile', strFileList);
		setCookies('aeClipFrom', strFilePath);
		setCookies('aeClipTask', intFlag? 'move':'copy');
	}
}

function fileCreate(strCase) {
	fileHandler('show', ':'+ (strCase == 'file'? 0:strCase) +':0:new');

	intFileMenu = intFileList;

	fileSelect(intFileMenu, 1);
	fileRename(strCase);
	fileDetail(0);
}

function fileDelete() {
	if(intFileMark) {
		if(confirm('Delete selected files?')) {
			intFileMark = intFileMenu = 0;

			ajaxRequest('file/delete&strPath='+ getEscape(strFilePath) +'&strFile='+ getEscape(fileSelectList('post').join('|')));
		}
	}
}

function fileDetail(intFile) {
	userTips(strFilePath == 'R:/'? 2:(strAjaxPost == 'strPath=D:/&intLoad=0'? 1:0));
	intFile = intFile? intFile:0;

	if(arrFileList[0]) {
		var intSize = arrFileList[intFile][1];

		setWriteAt('divFileInfo', '<div class="title">'+ fileName(arrFileList[intFile][0]) +'</div>'+ fileExtensionInfo(arrFileList[intFile][3], intFile) +'<br /><br />Modified: '+ fileTime(intFile) + (intSize != 'folder'? '<br /><br />Size: '+ fileSize(intSize):''));
	}
}


function fileDisk(strPath) {
	arrPath = strPath.split('');
	strPath = strFilePath.substr(0, 1);

	for(intLoop = 0; intLoop < arrPath.length; intLoop++) {
		if(arrPath[intLoop] == strPath) {
			return true;
		}
	}

	return false;
}

function fileDiskAt() {
	return strFilePath.substr(0, 2);
}

function fileDrag(intPt1X, intPt1Y) {
	intFileDrop = 0;
	filePointer(0, 0);

	if(intFileTree) {
		setOpacity('aeTreeMenu', 0.7);
	}

	var objDrag = get('item'+ intFileDrag).style, intPt2X = intFileTree? intFGPointX:intDSPointX;

	objDrag.left = (intPt1X < intPt2X? intPt2X:(intPt1X + intFDPointX + 3 < intSDPointX? intPt1X:intSDPointX - intFDPointX + 3)) +'px';
	objDrag.top = (intPt1Y < intDSPointY? intDSPointY:(intPt1Y + intFDPointY + 1 < intSDPointY? intPt1Y:intSDPointY - intFDPointY + 1)) +'px';

	//get('aeFileDrag').innerHTML = '+ '+ fileSelectList('drag');
	//var objDrag = get('aeFileDrag').style, intPt2X = intFileTree? intFGPointX:intDSPointX;

	//objDrag.display = 'block';
	//objDrag.left = (intPt1X < intPt2X? intPt2X:(intPt1X + 106 < intSDPointX? intPt1X:intSDPointX - 107)) +'px';
	//objDrag.top = (intPt1Y < intDSPointY? intDSPointY:(intPt1Y + 18 < intSDPointY? intPt1Y:intSDPointY - 19)) +'px';

	for(var intLoop = 1; intLoop <= intFileList; intLoop++) {
		if(intLoop != intFileDrag && intLoop != intFileOver) {
			var objFile = get('item'+ intLoop);

			if(objFile && objFile.className == 'item') {
				var objFile = objFile.style, intPt1X = setInteger(objDrag.left), intPt1Y = setInteger(objDrag.top), intPt2X = setInteger(objFile.left), intPt2Y = setInteger(objFile.top); 

				if(intPt2X < intPt1X + intFGPointX && intPt2Y < intPt1Y + intFGPointY && intPt2X > intPt1X - intFDPointX && intPt2Y > intPt1Y - intFDPointY) {
					if(arrFileList[intLoop][3] == 'dir') {
						filePointer(intPt2X, intPt2Y);
						intFileDrop = intLoop;
					}

					break;
				}
			}
		}
	}
}

function fileDraw() {
	var strText = '';

	for(var intLoop = 1; intLoop <= intFileList; intLoop++) {
		if(arrFileList[intLoop][0] != undefined) {
			strText += '<div id="item'+ intLoop +'" class="item" title="'+ fileTitle(intLoop) +'" style="width:'+ intFDPointX +'px;height:'+ intFDPointY +'px;"><div id="'+ intLoop +'" class="over" title=""></div><div id="item'+ intLoop +'-view"><img id="item'+ intLoop +'-icon" alt="" src="'+ strCSSImageExt +'/non.png" class="'+ strFileView +'" /></div><div id="item'+ intLoop +'-stat" class="stat '+ arrFileList[intLoop][4] +'"><div id="item'+ intLoop +'-name" class="name align'+ strFileLine +'">'+ fileName(arrFileList[intLoop][0]) +'</div><div id="item'+ intLoop +'-data" style="display:'+strFileInfo +'">'+ (arrFileList[intLoop][1] == 'folder'? 'folder':(strFileSort == 'date'? fileTime(intLoop, 1):fileSize(arrFileList[intLoop][1]))) +'</div></div></div>'
		}
	}

	setWriteAt('aeDesktop', strText);
	fileSort();	

	for(var intLoop = 1; intLoop <= intFileList; intLoop++) {
		fileImage(intLoop);
	}
}

function fileDrawList(strText) {
	setWriteAt('aeDesktop', strText);

	for(var intLoop = 1; intLoop <= intFileList; intLoop++) {
		fileImage(intLoop);
	}
}

function fileDrop() {
	if(intFileDrop && arrFileList[intFileDrop][3] == 'dir') {
		fileMoving();
	}

	if(intFileTree) {
		setOpacity('aeTreeMenu', 1);
	}

	fileSelectList('drop');
	intFileDrag = intFileDrop = 0;
	//get('aeFileDrag').style.display = 'none';
}

function fileEditor() {
	if(get('frame_aeEditArea').style.display == 'inline') {
		get('aeBody').style.overflow = 'auto';
		editAreaLoader.hide('aeEditArea');
	} else {
		get('aeBody').style.overflow = 'hidden';
		editAreaLoader.show('aeEditArea');
	}
}

function fileEditorLoad(strText) {
	if(strText) {
		arrText = strText.split(':TEXT:');

		get('aeBody').style.overflow = 'hidden';

		editAreaLoader.show('aeEditArea');
		editAreaLoader.openFile('aeEditArea', {id:arrText[0], text:arrText[1]});
	}
}

function fileEditorOpen(strFile, strPath) {
	ajaxRequest('file/editor&strPath='+ getEscape(strPath) +'&strFile='+ getEscape(strFile));
}

function fileEditorSave(strName, strText) {
	strFile = editAreaLoader.getCurrentFile('aeEditArea').id;
	ajaxRequest('file/editor&strPath='+ getEscape(fileInfo(strFile, 'dirname')) +'&strFile='+ getEscape(fileInfo(strFile, 'basename')) +'&strText='+ getEscape(strText));
}

function fileEmptyBin() {
	fileSelectAll();
	fileDelete();
}

function fileExists(intFile){
	var objHttp = new XMLHttpRequest();
	objHttp.open('HEAD', (arrFileList[intFile][0].indexOf('/') == -1? strFileHref:'') + arrFileList[intFile][0], false);
	objHttp.send();

	return objHttp.status;
}

function fileExplore(strPath, objElem, intLoad) {
	if(intLoad == undefined) {
		if(intFileDrag) {
			if(strPath.substr(0, 1) == 'R') {
				fileDelete();
			}
			else fileMoving(strPath);
		}
		else fileBrowse(strPath);
	} else {
		objElem.parentNode.style.backgroundImage = 'url('+ strCSSImage +'/icon/open.png)';
		ajaxRequest('file/explore&strPath='+ strPath +'&intLoad='+ intLoad);
	}
}

function fileExtension(strName, strType) {
	strName = fileName(strName);

	return strType == 'folder'? 'dir':strName.slice(strName.lastIndexOf('.')+1).toLowerCase();
}

function fileExtensionImage(intFile, strFExt) {
	var strFExt = intFile.length == 0? strFExt:arrFileList[intFile][3];
	var strFExt = strFileView == 'icon' && (strFExt == 'gif' || strFExt == 'ico' || strFExt == 'jpg' || strFExt == 'jpeg' || strFExt == 'png')? '---':strFExt;

	switch(strFExt) {
		case '---': return '';
		case 'ac3':
		case 'ade':
		case 'adp':
		case 'ai':
		case 'aiff':
		case 'asf':
		case 'avi':
		case 'bat':
		case 'bin':
		case 'bmp':
		case 'cab':
		case 'cal':
		case 'css':
		case 'dat':
		case 'dir':
		case 'dll':
		case 'doc':
		case 'docx':
		case 'exe':
		case 'gif':
		case 'html':
		case 'ico':
		case 'ifo':
		case 'ini':
		case 'iso':
		case 'java':
		case 'jpg':
		case 'js':
		case 'log':
		case 'mid':
		case 'mov':
		case 'mp3':
		case 'mp4':
		case 'mpeg':
		case 'pdf':
		case 'php':
		case 'png':
		case 'ppt':
		case 'pptx':
		case 'psd':
		case 'rar':
		case 'tiff':
		case 'ttf':
		case 'txt':
		case 'vob':
		case 'wav':
		case 'wma':
		case 'wmv':
		case 'xls':
		case 'xlsx':
		case 'xml':
		case 'xsl':
		case 'zip': return strFExt;
		case '7z':
		case 'gz':  return 'zip';
		case 'htm': return 'html';
		case 'jpg': return 'jpeg';
		case 'mpg':	return 'mpeg';
		case 'rtf': return 'ttf';
		default:	return 'non';
	}
}

function fileExtensionInfo(strFExt, intFile) {
	var strText = '';

	if(intFile) {
		strText = !intUserMenu && (strFExt == 'gif' || strFExt == 'ico' || strFExt == 'jpg' || strFExt == 'jpeg' || strFExt == 'png')? '<br /><img alt="" class="preview" src="'+ strFileHref + arrFileList[intFile][0] +'" />':'';
	}

	switch(strFExt) {
		case 'adp':	return 'Microsoft Access Project';
		case 'avi':	return 'Video Clip';
		case 'bmp':	return 'Bitmap Image';
		case 'css':	return 'Cascading Style Sheet';
		case 'dir':	return 'File Folder';
		case 'dll':	return 'Dynamic Link Library';
		case 'doc':
		case 'docx':return 'Microsoft Document';
		case 'exe':	return 'Executable File';
		case 'gif':	return 'GIF Image'+ strText;
		case 'htm':
		case 'html':return 'HTML Document';
		case 'ico':	return 'Icon Image'+ strText;
		case 'js':	return 'Java Script';
		case 'jpg':
		case 'jpeg':return 'JPEG Image'+ strText;
		case 'log':	return 'Text Document';
		case 'mdb':	return 'Microsoft Access Application';
		case 'mdw':	return 'Microsoft Access Workgroup';
		case 'mov':	return 'Adobe Quick Player';
		case 'mp3':	return 'MPEG Audio Stream';
		case 'pdf':	return 'Adobe Acrobat Document';
		case 'png':	return 'PNG Image'+ strText;
		case 'php':	return 'PHP File';
		case 'ppt':			
		case 'pptx':return 'Microsoft Powerpoint';
		case 'psd':	return 'Adobe Photoshop Format';
		case 'pub':	return 'Microsoft Publish';
		case 'rar':	return 'WinRaR Archive';
		case 'rtf':	return 'Rich Text Format';
		case 'sql':	return 'SQL File';
		case 'swf':	return 'Adobe Flash';
		case 'ttf':	return 'TrueType Font';
		case 'txt':	return 'Text Document';
		case 'vdx':	return 'Vector Graphic File';
		case 'vsd':	return 'Microsoft Visio Drawing';
		case 'wav':	return 'Waveform Audio';
		case 'wma':	return 'Windows Media Audio';
		case 'wmv':	return 'Windows Media Video';
		case 'xls':
		case 'xlsx':return 'Microsoft Excel';
		case 'xml':	return 'XML Document';
		case 'zip':	return 'Zip Archive';
		default:	return 'File';
	}
}

function fileHandler(strCase, strFile) {
	switch(strCase) {
		case 'file':
			setWriteAt(intFileOpen? 'Download'+ intFileOpen:'aeDownload', strFile +'<div id="Download'+ (intFileOpen += 1) +'"></div>', 1);
			break;
		case 'root':
			intFileList = 0;
			intPathLoad = 1;

			var arrPart = strFile.split('|');
			arrFileList[0] = Array(arrPart[0], arrPart[1], arrPart[2], 'dir');

			get('fldFilePath').value = strFilePath = arrPart[3];
			strFullPath = arrPart[4];
			strFileHref = arrPart[5];

			var strFImg = 'file.png';

			switch(fileDiskAt()) {
				case 'L:': strFImg = 'editor.png'; break;
				case 'P:': strFImg = 'user.gif'; break;
				case 'R:': strFImg = 'rbin.gif'; break;
			}

			var objElem = get('imgFilePath'); 
			objElem.src = strCSSImage +'/icon/'+ strFImg;
			objElem.title = strFullPath;

			fileRoot();
			fileView();
			userScreen();
			break;
		case 'show':
			var arrFile = strFile.split('|'), strText = '';

			for(var intLoop = 0; intLoop < arrFile.length; intLoop++) {
				if(arrFile[intLoop]) {
					var arrPart = arrFile[intLoop].split(':');
					intFlag = 0;

					for(var intXoop = 1; intXoop <= intFileList; intXoop++) {
						if(arrFileList[intXoop][0] == arrPart[0]) {
							intFlag = 1;
							break;
						}
					}

					if(intFlag == 0) {
						intFileList++;
						arrFileList[intFileList] = new Array(arrPart[0], arrPart[1], arrPart[2], fileExtension(arrPart[0], arrPart[1]), arrPart[3]);
					}
				}
			}

			fileDraw();
			break;
		case 'view':
			var objElem = get('aeDesktop');
			objElem.innerHTML = strFile;
			objElem.style.height = intWDPointY +'px';
			userScreen();
			break;
	}
}

function fileImage(intFile) {
	var strFExt = fileExtensionImage(intFile);

	get('item'+ intFile +'-icon').src = strFExt? strCSSImageExt +'/'+ strFExt +'.png':(arrFileList[intFile][0].indexOf('/') == -1? strFileHref:'') + arrFileList[intFile][0];
}

function fileInfo(strFile, strCase) {
	intFind = strFile.lastIndexOf('/') + 1;

	switch(strCase) {
		case 'dirname': return strFile.substr(0, intFind);
		case 'basename': return strFile.substr(intFind);
	}
}

function fileLoad(strText) {
	if(strText)
	if(strText.indexOf('::') != -1) {
		var arrTask = strText.split('::');

		for(var intLoop = 1; intLoop < arrTask.length; intLoop += 2) {
			fileHandler(arrTask[intLoop].toLowerCase(), arrTask[intLoop + 1]);
		}
	}
}

function fileMoving(strPath) {
	if(!strPath && intFileOver) {
		intFileOver = intFileDrop;
	}

	ajaxRequest('file/move&strPath='+ getEscape(strFilePath) +'&strDest='+ getEscape(strPath? strPath:strFilePath + arrFileList[intFileOver][0]+'/') +'&strFile='+ getEscape(fileSelectList('post').join('|')));
}

function fileName(strName) {
	if(strName.indexOf('/') != -1) {
		strName = fileInfo(strName, 'basename');
	}

	if(strName.indexOf('$RB$') != -1) {
		strName = strName.substr(0, strName.indexOf('$RB$'));
	}

	return strName;
}

function fileOpen(strType) {
	if(strFilePath == 'R:/') {
		return;
	}

	if(intFileTime) {
		clearTimeout(intFileTime);
	}

	intFilePick = intFileEdit = 0;
	var arrList = fileSelectList();

	for(intLoop = 0; intLoop < arrList.length; intLoop++) {
		var intFile = arrList[intLoop];

		switch(strType) {
			case 'download':
			case 'editor':
			case 'newtab':
			case 'search':
				fileOpenMethod(strType, intFile);
				break;
			case 'internal':
				fileOpenMethod(strType, intFileMenu);
				return;
			default:
				if(arrFileList[intFile][0].indexOf('/') != -1) {
					fileOpenMethod('search', intFile);
					return;
				} else if(arrFileOpen[0].indexOf(arrFileList[intFile][3]) != -1) {
					fileOpenMethod('download', intFile);
				} else if(arrFileOpen[1].indexOf(arrFileList[intFile][3]) != -1) {
					fileOpenMethod('editor', intFile);
				} else if(arrFileList[intFile][0]) {
					fileOpenMethod('internal', intFile);
					return;
				} else {
					fileOpenMethod('newtab', intFile);
				}
		}
	}
}

function fileOpenMethod(strType, intFile) {
	if(arrFileList[intFile][0].indexOf('/') != -1) {
		strFile = strType == 'newtab'? arrFileList[intFile][0]:fileInfo(arrFileList[intFile][0], 'basename');
		strPath = fileDiskAt() + fileInfo(arrFileList[intFile][0], 'dirname');
	} else {
		strFile = arrFileList[intFile][0];
		strPath = strFilePath;
	}

	switch(strType) {
		case 'download':
			ajaxRequest('file/download&strPath='+ getEscape(strPath) +'&strFile='+ strFile);
			return;
		case 'editor':
			ajaxRequest('file/editor&strPath='+ getEscape(strPath) +'/&strFile='+ getEscape(strFile));
			break;
		case 'internal':
			fileBrowse(arrFileList[intFile][0] + (arrFileList[intFile][3] == 'dir'? '/':''), 1);
			break;
		case 'newtab':
			window.open((arrFileList[intFile][3] != 'dir'? strFileHref:'?'+ strPath) + strFile);
			break;
		case 'search':
			fileBrowse(strPath + (arrFileList[intFile][3] == 'dir'? strFile +'/':''));
			break;
	}
}

function filePath(objElem, intFlag) {
	setDisplay('divPathList', intFlag);

	if(intFlag) {
		userTips(3);
		filePathList(objElem);
	}
}

function filePathKey(objElem, objUser) {
	if(intIExplore) {
		objUser = objUser || event;
	}

	switch(objUser.keyCode) {
		case 13:
			objElem.blur();
			fileBrowse();
			break;
		case 37:
			if(intUserHKey == 2 && objElem.value != '/') {
				objElem.value = objElem.value.substr(0, objElem.value.substr(0, objElem.value.length-2).lastIndexOf('/')) +'/';
			}
			break;
		case 38:
			if(arrPathOpen.length > 1) {
				intPathOpen--;
			}
			else return;
			objElem.value = arrPathOpen[intPathOpen = intPathOpen > 1? intPathOpen:1];
			break;
		case 39:
			if(intUserHKey == 2) {
				fileBrowse();
			}
			break;
		case 40:
			if(arrPathOpen.length > intPathOpen+1) {
				intPathOpen++;
			}
			else return;
			objElem.value = arrPathOpen[intPathOpen = intPathOpen <= arrPathOpen.length? intPathOpen:arrPathOpen.length-1];
			break;
		default:
			filePathList(objElem);
	}
}

function filePathList(objElem) {
	var strText = '';

	intPathOpen = 1;
	arrPathList.sort();
	arrPathOpen = Array('0');

	for(var intLoop = 0; intLoop < arrPathList.length; intLoop++) {
		var strPath = arrPathList[intLoop];

		if(strPath.indexOf(objElem.value) != -1) {
			strText += '<div class="highlight" onmousedown="fileBrowse(\''+ getEscape(strPath) +'\');">'+ strPath +'</div>';
			arrPathOpen.push(strPath);
		}
	}

	setWriteAt('divPathList', strText);
}

function filePaste() {
	if(getCookies('aeClipTask') && getCookies('aeClipFrom') && getCookies('aeClipFile')) {
		ajaxRequest('file/'+ getCookies('aeClipTask') +'&strPath='+ getEscape(getCookies('aeClipFrom')) +'&strDest='+ getEscape(strFilePath) +'&strFile='+ getCookies('aeClipFile').replace(/,/g, '|'));

		if(getCookies('aeClipTask') == 'move') {
			setCookies('aeClipFile', '');
			setCookies('aeClipFrom', '');
			setCookies('aeClipTask', '');
			setWriteAt('keyinfo', '');
		}
	}
}

function filePick() {
	if(strFilePath == 'R:/') {
		return;
	}

	var arrList = fileSelectList();

	for(var intLoop = 0; intLoop < arrList.length; intLoop++) {
		get(String(arrList[intLoop])).className = 'drag';

		if(intFileOver == arrList[intLoop]) {
			intFileDrag = arrList[intLoop];
			intFPPointX = intFPPointY = 0;

			objFile = get('item'+ arrList[intLoop]).style;
			intFMPointX = setInteger(objFile.left);
			intFMPointY = setInteger(objFile.top);
		}
	}

	userTips(4);
}

function filePointer(intPt1X, intPt1Y, intPt2X, intPt2Y) {
	var objElem = get('aePointer').style;
	objElem.display = intPt1X? 'block':'none';
	objElem.left = intPt1X +'px';
	objElem.top = intPt1Y +'px';

	if(intPt1Y != undefined && intPt2X == 1) {
		intSTop = Math.round((intWDPointY - intDSPointY - intFGPointY) / ((intFDPointY + intFGPointY) * 3));

		var intCalc = intPt1Y - intDSPointY - (intFDPointY + intFGPointY) * intSTop - intFGPointY;
		document.documentElement.scrollTop = intCalc;
		document.body.scrollTop = intCalc;
	}

	if(intPt2Y != undefined) {
		objElem.width = intPt2X - (intIExplore? 0:2) +'px';
		objElem.height = intPt2Y - (intIExplore? 0:2) +'px';
	}
}

function fileProperty() {
	var strFile = fileSelectList('post').join('|');

	ajaxRequest('file/property&strPath='+ getEscape(strFilePath) +'&strFile='+ getEscape(strFile? strFile:'/'));
}

function filePropertyLoad(strText) {
	if(!strText) {
		return;
	}

	var arrText = strText.split('|');
	var arrFile = arrText[3].split(':');

	intUserMenu = 1;

	if(arrFile.length > 3) {
		var strFile = 'Multiple Files ('+ (arrFile.length-2) +')';
		var strInfo = fileName(arrFile[1]) +', '+ fileName(arrFile[2]) + (fileName(arrFile[3])? ', '+ fileName(arrFile[3]):'') +' ...';
		var strFImg = 'non.png';
	} else {
		var strFExt = fileExtension(arrFile[1], arrFile[0]);
		var strFile = fileName(arrFile[1]);
		var strInfo = fileExtensionInfo(strFExt);
		var strFImg = fileExtensionImage('', strFExt) +'.png';
	}

	setWriteAt('syst401', strFile);
	setImageAt('syst402', strCSSImageExt +'/'+ strFImg);
	setWriteAt('syst403', strFile);
	setWriteAt('syst404', strInfo);
	setWriteAt('syst405', arrText[4]);
	setWriteAt('syst406', arrText[5]);
	setWriteAt('syst407', fileSize(arrText[6]));
	setValueAt('syst408', strFileHref + (strFExt && arrText[7] == '1'? strFile + (arrFile[0] == 'folder'? '/':''):''));
	setValueAt('syst409', strFullPath + (strFExt && arrText[7] == '1'? strFile + (arrFile[0] == 'folder'? '/':''):''));
	setDisplay('syst499', intFileMark && fileDisk('R')? 'inline':0);

	if(arrText[0] != '0') {
		setWriteAt('syst411', arrText[0] +' in group '+ arrText[1]);
		setDisable('syst413', arrFile[0] == 'folder'? 0:1);
		
		fileSetModeForm(arrText[2]);
	}
	else fileSetModeForm(-1);

	userSystem(4);
}

function fileRename(strCase) {
	if(!fileDisk('R') && !intFileEdit && intFileMenu && arrFileList[intFileMenu][0].indexOf('/') == -1) {
		var objFile = get('item'+ intFileMenu);

		if(objFile) {
			if(objFile.className == 'mark') {
				if(strCase != 'timer') {
					intFileEdit = intFileMenu;
					setWriteAt('item'+ intFileEdit +'-name', '<input id="item'+ intFileEdit +'-edit"'+ (strCase? ' alt="'+ strCase +'"':'') +' type="text" value="'+ arrFileList[intFileEdit][0] +'" onblur="fileRenaming()" />');
					get('item'+ intFileEdit +'-edit').select();
					userFocus();
				}
				else intFileTime = setTimeout('fileRename()', intFileCtrl? intUserMSpd:0);
			}
		}
	}
}

function fileRenaming() {
	var objElem = get('item'+ intFileEdit +'-edit'), strName = objElem.value;

	if(objElem.alt) {
		arrFileList[intFileEdit][0] = strName;
		setWriteAt('item'+ intFileEdit +'-name', strName);

		if(strName) {
			ajaxRequest('file/create&strPath='+ getEscape(strFilePath.substr(0, 3)) +'&strFile='+ getEscape(strFilePath + strName) + (objElem.alt == 'file'? '':'/'));
			arrFileList[intFileEdit][3] = fileExtension(strName, arrFileList[intFileEdit][1]);
			fileImage(intFileEdit);
		} else {
			var objFile = get('item'+ intFileEdit);
			objFile.innerHTML = objFile.className = objFile.id = '';
			intFileList--;

			setDisplay('aePointer', 0);
		}
	} else {
		setWriteAt('item'+ intFileEdit +'-name', arrFileList[intFileEdit][0]);

		if(strName && strName != arrFileList[intFileEdit][0]) {
			ajaxRequest('file/rename&strPath='+ getEscape(strFilePath) +'&strFile='+ getEscape(fileSelectList('post').join('|')) +'&strName='+ getEscape(strName));
		}
	}

	intFileEdit = 0;
}

function fileRestore() {
	ajaxRequest('file/restore&strPath='+ getEscape(strFilePath) +'&strFile='+ getEscape(fileSelectList('post').join('|')));
}

function fileRestoreAll() {
	fileSelectAll();
	fileRestore();
}

function fileRoot() {
	if(strFileRoot && strFileRoot.indexOf(strFilePath) == -1) {
		strFileRoot = strFilePath;
	}

	var arrPath = strFilePath.split('/'), arrRoot = strFileRoot.split('/'), strPath = fileDiskAt() + '/', strRoot = '<span class="active" title="'+ strPath +'" onclick=fileBrowse("'+ strPath +'");>'+ fileDiskAt() +'</span>';

	for(var intLoop = 1; intLoop < arrPath.length-1; intLoop++) {
		strRoot += '<span onclick="fileRootDir(\''+ strPath +'\')">></span>';
		strPath += arrPath[intLoop] +'/';
		strRoot += '<span class="active" title="'+ strPath +'" onclick="fileBrowse(\''+ strPath +'\')">'+ (arrPath.length < 5 || (arrPath.length > 4 && intLoop > arrPath.length-6)? arrPath[intLoop]:'...') +'</span>';
	}

	if(strFileRoot) {
		for(var intLoop = arrPath.length-1; intLoop < arrRoot.length-1; intLoop++) {
			strRoot += '<span onclick="fileRootDir(\''+ strPath +'\')">></span>';
			strPath += arrRoot[intLoop] +'/';
			strRoot += '<span title="'+ strPath +'" onclick="fileBrowse(\''+ strPath +'\')">'+ (intLoop < arrPath.length+2? arrRoot[intLoop]:'...') +'</span>';
		}
	}

	strFileRoot = strPath;
	setDisplay('aeFileRDir', 0);
	setWriteAt('aeFileRoot', strRoot);
}

function fileRootDir(strRoot) {
	var strText = '';

	arrPathList.sort();

	for(var intLoop = 0; intLoop < arrPathList.length; intLoop++) {
		var strPath = arrPathList[intLoop];

		if(strPath.indexOf(strRoot) != -1 && strFilePath.indexOf(strPath) == -1 && strPath.split('/').length == strRoot.split('/').length+1) {
			strText += '<div class="link" onclick="fileBrowse(\''+ strPath +'\')">'+ strPath.replace(strRoot, '/') +'</div>';
		}
	}

	var objThis = get('aeFileRDir');

	objThis.style.display = strText? 'block':'none';

	if(strText) {
		objThis.innerHTML = strText;
		objThis.style.left = intMPPointX +'px';
	}
}

function fileSearch() {
	var intCase = get('fldSearchAt').value;

	if(!fileDisk('DLP') || (intCase != 0 && get('fldSearchWhat').value == '')) {
		return;
	}

	switch(intCase) {
		case '1':
			var strPath = strFilePath;
			break;
		case '2':
			var strPath = fileDiskAt() +'/';
			break;
		default:
			fileSearchLocal();
			return;
	}

	intFileEdit = intFileMark = intFileOver = intFilePick = intFPPointX = intFPPointY = 0;

	ajaxRequest('file/search&strPath='+ getEscape(strPath) +'&strFile='+ getEscape(get('fldSearchWhat').value) +'&intCase='+ (get('fldSearchCase').checked? 1:0) +'&intText='+ (get('fldSearchText').checked? 1:0));
	get('fldFilePath').value = strFilePath = strPath;
	userSystemHide();
}

function fileSearchLocal() {
	var intFlag = get('fldSearchCase').checked? 1:0, strFind = get('fldSearchWhat').value;

	if(!intFlag) {
		strFind = strFind.toLowerCase();
	}

	for(var intLoop = 1; intLoop <= intFileList; intLoop++) {
		var strItem = 'item'+ intLoop;

		if(get(strItem)) {
			setDisplay(strItem, ((intFlag? arrFileList[intLoop][0]:arrFileList[intLoop][0].toLowerCase()).indexOf(strFind) != -1? 1:0));
		}
	}

	fileSort();
}

function fileSelect(intFile, intFlag) {
	intFile = intFile? intFile:intFileOver;
	var objFile = get('item'+ intFile);

	if(objFile) {
		if(objFile.className != 'mark' || intUserHKey != 2) {
			intFileMark = intFilePark = intFile;
			objFile.className = 'mark';

			fileDetail(intFile);
			filePointer(setInteger(objFile.style.left), setInteger(objFile.style.top), intFlag);
		}
		else objFile.className = 'item';
	}
}

function fileSelectAll() {
	var intItem = intSize = 0;

	for(var intLoop = 1; intLoop <= intFileList; intLoop++) {
		var objFile = get('item'+ intLoop);

		if(objFile) {
			if(objFile.style.display != 'none') {
				objFile.className = 'mark';
				intSize -= arrFileList[intLoop][3] == 'dir'? 0:-arrFileList[intLoop][1];
				strFileMark += ':'+ intLoop +':';
				intItem++;
			}
		}
	}

	strFileSBox = strFileMark;

	menuGenerate();

	if(intItem) {
		intFileMark = 1;
		setWriteAt('divFileInfo', intItem +' Items selected<br /><br />Total Size: '+ fileSize(intSize));
	}
}

function fileSelectBox() {
	var intItem = intPt1X = intPt2X = intPt1Y = intPt2Y = intSize = 0;
	intFileSBox = 1;

	if(intMPPointX + intSPPointX > intFPPointX ) {
		intPt1X = intFPPointX;
		intPt2X = intMPPointX + intSPPointX;
	} else {
		intPt1X = intMPPointX + intSPPointX;
		intPt2X = intFPPointX;
	}

	if(intMPPointY + intSPPointY > intFPPointY) {
		intPt1Y = intFPPointY;
		intPt2Y = intMPPointY + intSPPointY;
	} else {
		intPt1Y = intMPPointY + intSPPointY;
		intPt2Y = intFPPointY;
	}

	if(intPt1X < intDSPointX) intPt1X = intDSPointX;
	if(intPt2X > intSDPointX) intPt2X = intSDPointX;
	if(intPt1Y < intDSPointY) intPt1Y = intDSPointY;
	if(intPt2Y > intSDPointY) intPt2Y = intSDPointY;

	objElem = get('aeMasking').style;
	objElem.top = intPt1Y +'px';
	objElem.left = intPt1X +'px';
	objElem.width = intPt2X - intPt1X +'px';
	objElem.height = intPt2Y - intPt1Y +'px';
	objElem.display = 'block';

	for(var intLoop = 1; intLoop <= intFileList; intLoop++) {
		var objFile = get('item'+ intLoop);

		if(objFile) {
			if(objFile.style.display != 'none') {
				var strName = '', intPt3X = setInteger(objFile.style.left), intPt3Y = setInteger(objFile.style.top);
				var intIsIn = intPt2X > intPt3X - 2 && intPt1X < intPt3X + intFDPointX && intPt2Y > intPt3Y - 2 && intPt1Y < intPt3Y + intFDPointY? 1:0;
				var intIsIt = strFileSBox.indexOf(':'+ intLoop +':') == -1? 0:1;

				if(strName = strFileMark.indexOf(':'+ intLoop +':') == -1? (intIsIn? 'mark':'item'):(intIsIn? (intUserHKey == 2 && intIsIt? 'item':'mark'):((intUserHKey == 1 && intIsIt) || (intUserHKey == 2 && intIsIt)? 'mark':'item'))) {
					objFile.className = strName;
				}

				if(strName == 'mark') {
					intItem++;
					intSize -= arrFileList[intLoop][3] == 'dir'? 0:-arrFileList[intLoop][1];

					if(strFileMark.indexOf(':'+ intLoop +':') == -1) {
						strFileMark += ':'+ intLoop +':';
					}
				} else if((intUserHKey != 2 || strFileSBox.indexOf(':'+ intLoop +':') == -1) && strFileMark.indexOf(':'+ intLoop +':') != -1) {
					strFileMark = strFileMark.replace(':'+ intLoop +':', '');
				}
			}
		}
	}

	if(intItem) {
		intFileMark = 1;
		setWriteAt('divFileInfo', intItem +' Items selected<br /><br />Total Size: '+ fileSize(intSize));
	}
}

function fileSelectList(strCase) {
	var arrList = new Array();
	var intFile = 0;

	for(var intLoop = 1; intLoop <= intFileList; intLoop++) {
		var objFile = get('item'+ intLoop);

		if(objFile && objFile.className == 'mark') {
			switch(strCase) {
				case 'drag':
					intFile++;
					break;
				case 'drop':
					get(String(intLoop)).className = 'over';
					break;
				case 'post':
					arrList.push(arrFileList[intLoop][0]);
					break;
				default:
					arrList.push(intLoop);
					break;
			}
		}
	}

	if(strCase == 'drag') {
		arrList.push('Move '+ intFile +' file'+ (intFile > 1? 's':''));
	}

	return arrList;
}

function fileSelectNone() {
	intFileMark = 0;

	for(var intLoop = 1; intLoop <= intFileList; intLoop++) {
		var objFile = get('item'+ intLoop);

		if(objFile) {
			objFile.className = 'item';
		}
	}
}

function fileSent() {
	ajaxRequest('file/copy&strPath='+ getEscape(strFilePath) +'&strDest=D:/&strFile='+ getEscape(fileSelectList('post').join('|')));
}

function fileSetMode() {
	userSystemHide();

	if(intFileMode == 1) {
		intFileMode = 0;

		ajaxRequest('file/setmode&strPath='+ getEscape(strFilePath) +'&strFile='+ getEscape(fileSelectList('post').join('|')) +'&intMode=0'+ get('syst412').value +'&intLoad='+ (get('syst413').checked? 1:0));
	}
}

function fileSetModeForm(strMode) {
	if(strMode == -1) {
		for(var intLoop = 3; intLoop < 6; intLoop++) {
			get('syst4'+ intLoop +'1').disabled = true;
			get('syst4'+ intLoop +'2').disabled = true;
			get('syst4'+ intLoop +'3').disabled = true;
		}

		setDisable('syst412', 1);
		setDisable('syst413', 1);
	} else if(strMode) {
		intFileMode = 1;

		var arrMode = strMode.split('');

		for(var intLoop = 3; intLoop < 6; intLoop++) {
			get('syst4'+ intLoop +'1').checked = arrMode[intLoop-2] & 0x0004? 'checked':'';
			get('syst4'+ intLoop +'2').checked = arrMode[intLoop-2] & 0x0002? 'checked':'';
			get('syst4'+ intLoop +'3').checked = arrMode[intLoop-2] & 0x0001? 'checked':'';
		}

		get('syst412').value = strMode;
	} else {
		intFileMode = 1;

		var intMChk = 0, strMode = '';

		for(var intLoop = 3; intLoop < 6; intLoop++) {
			for(var intXoop = 1; intXoop < 4; intXoop++) {
				intMChk += get('syst4'+ intLoop + intXoop).checked? (intXoop == 1? 4:(intXoop == 2? 2:1)):0;
			}

			strMode += intMChk;
			intMChk = 0;
		}

		get('syst412').value = strMode;
	}
}

function fileSetModeFormSave(strMode) {
	strFileMode = strMode;
}

function fileSetModeFormValidate(strMode) {
	intFileMode = 1;

	var arrMode = strMode.split(''), intFlag = 0;

	for(var intLoop = 0; intLoop < 3; intLoop++) {
		if(arrMode[intLoop]>7 || isNaN(arrMode[intLoop])) {
			intFlag = 1;
		}
	}

	if(intFlag) {
		fileSetModeForm(strFileMode);
	}
}

function fileSize(intSize) {
	var intLoop = intSRem = 0;

	while(intSize > 1024) {
		intSRem = intSize % 1000;
		intSize = intSize / 1024;
		intLoop++;
	}

	return Math.round(intSize - 0.49) + (intLoop? '.'+ (intSRem > 99? '':(intSRem > 9? '0':'00')) + Math.round(intSRem):'') +' '+ arrFileSize[intLoop];
}

function fileSort(strSort) {
	filePointer(0, 0);

	if(strSort == '*') {
		strSort = strFileSort == 'name'? 'size':(strFileSort == 'size'? 'type':(strFileSort == 'type'? 'date':'name'));
	}

	if(strSort == undefined) {
		intFileRows = 0;
		var intCols = 1, intFlag = 0, intPt1X = intDSPointX + intFGPointX, intPt1Y = intDSPointY + intFGPointY;

		for(var intLoop = 1; intLoop <= intFileList; intLoop++) {
			var objFile = get('item'+ intLoop);

			if(objFile) {
				if(objFile.style.display != 'none') {
					if(!intFlag) {
						intFileRows++;
					}

					intCols++
					objFile.style.left = intPt1X +'px';
					objFile.style.top = intPt1Y +'px';

					if(intPt1X + intDSPointX + intFDPointX > intWDPointX + intDSPointX - intFDPointX - intFGPointX - 14) {
						intCols = 1;
						intFlag = 1;
						intPt1X = intDSPointX + intFGPointX;
						intPt1Y += intFDPointY + intFGPointY;
					}
					else intPt1X += intFDPointX + intFGPointX;
				}
			}
		}

		if(!intIExplore) {
			get('aeDesktop').style.height = (intPt1Y > intWDPointY? intPt1Y + 160:(intPt1Y > intWDPointY - 160? intWDPointY + 160:intWDPointY)) +'px';
		}

		userScreen();
	} else {
		strFileSort = strSort = strSort? strSort:strFileSort;
		var intSort = strSort == 'name'? 0:(strSort == 'size'? 1:(strSort == 'date'? 2:3)), strText = '';

		setWriteAt('aeDesktop', '');

		for(var intLoop = 1; intLoop <= intFileList; intLoop++) {
			for(var intXoop = intLoop + 1; intXoop <= intFileList; intXoop++) {
				if(arrFileList[intLoop][3] != 'dir' && arrFileList[intXoop][3] != 'dir') {
					strChk1 = intSort == 1 || intSort == 2? parseInt(arrFileList[intLoop][intSort]):arrFileList[intLoop][intSort];
					strChk2 = intSort == 1 || intSort == 2? parseInt(arrFileList[intXoop][intSort]):arrFileList[intXoop][intSort];

					if(strChk1 > strChk2) {
						var arrTemp = arrFileList[intLoop];
						arrFileList[intLoop] = arrFileList[intXoop];
						arrFileList[intXoop] = arrTemp;
					}
				}
			}
		}

		fileDraw();
	}

	menuGenerate();
	setWriteAt('syst223', strFileSort);
	setWriteAt('syst224', strFileView);
	setCookies('aeFileSort', strFileSort);
	setCookies('aeFileView', strFileView);
}

function fileTime(intFile, intFlag) {
	strDate = new Date();
	strDate.setTime(arrFileList[intFile][2] * 1000);

	var arrDate = String(strDate).split(intIExplore? ' U':' G');

	if(intFlag) {
		return (strDate.getMonth()+1) +'/'+ strDate.getDate() +'/'+ arrDate[0].substr(-13);
	}
	else return arrDate[0];
}

function fileTitle(intFile) {
	var strName = arrFileList[intFile][0];

	if(strName.indexOf('/') != -1) {
		return 'Located at: '+ fileInfo(strName, 'dirname');
	}

	if(fileDisk('R')) {
		return 'Deleted at: '+ strName.replace(/\$2F\$/g, '/').replace(/\$3A\$/g, ':').replace(/\$RB\$/g, '').slice(strName.indexOf('$RB$'), -10);
	}

	else return '';
}

function fileTree() {
	fileTreeResize(intFileTree);

	intFileTree = intFileTree? 0:1

	if(get('tree0').innerHTML == '') {
		userTips(1);
		ajaxRequest('file/explore&strPath=D:/&intLoad=0');
	}

	get('icon04').src = strCSSImage +'/icon/'+ (intFileTree? 'open':'file') +'.png';
	setWidthAt('aeSideMenu', intFileTree? 0:intDSPointX);
	setDisplay('aeTreeMenu', intFileTree);
}

function fileTreeBrowse(strFile) {
	var arrFile = strFile.split('|'), strText = '';

	for(var intLoop = 2; intLoop < arrFile.length-1; intLoop++) {
		var intFlag = strFilePath.indexOf(arrFile[1].substr(2) + arrFile[intLoop]);
		intFileTree++;

		strText += '<div'+ (intFlag != -1? ' class="open"':'') +'><span class="file" onmouseup="fileExplore(\'D:'+ getEscape(arrFile[1] + arrFile[intLoop]) +'/\', this, '+ intFileTree +')"></span><span class="list" onmouseup="fileExplore(\'D:' + arrFile[1] + arrFile[intLoop] +'/\')">'+ fileName(arrFile[intLoop]) +'</span><span id="tree'+ intFileTree +'"></span></div>';

		if(intFlag != -1) {
			ajaxRequest('file/explore&strPath=D:'+ getEscape(arrFile[1] + arrFile[intLoop]) +'/&intLoad='+ intFileTree);

		}
	}

	setWriteAt('tree'+ arrFile[0], strText);
}

function fileTreeResize(intFlag) {
	intDSPointX = intFlag? intDSPointZ:intTDPointX;

	var objElem = get('aeTreeMenu'), intPt1X = intDSPointX - 3;
	objElem.style.width = intPt1X > 0? intPt1X +'px':0;
	objElem.className = intDSPointX > 20? '':'hide';

	fileSort();
	userElement();
	setCookies('aeTDPointX', intTDPointX);
}

function fileView(strView) {
	if(strView == '*') {
		strView = strFileView == 'tile'? 'list':(strFileView == 'list'? 'icon':'tile');
	}

	strFileView = strView = strView? strView:strFileView;

	switch(strView) {
		case 'list':
			intFDPointX = 540;
			intFDPointY = 22;
			strFileInfo = 'none';
			strFileLine = 'left';
			break;
		case 'icon':
			intFDPointX = 104;
			intFDPointY = 122;
			strFileInfo = 'none';
			strFileLine = 'center';
			break;
		case 'tile':
			intFDPointX = 264;
			intFDPointY = 54;
			strFileInfo = 'block';
			strFileLine = 'left';
			break;
	}

	filePointer(0, 0, intFDPointX, intFDPointY);

	for(var intLoop = 1; intLoop <= intFileList; intLoop++) {
		var strItem = 'item'+ intLoop;
		var objFile = get(strItem);

		if(objFile) {
			objFile.style.width = intFDPointX +'px';
			objFile.style.height = intFDPointY +'px';

			get(strItem +'-icon').className = strView;
			get(strItem +'-data').style.display = strFileInfo;
			get(strItem +'-name').className = 'name align'+ strFileLine;
			fileImage(intLoop);
		}
	}

	fileSort();
}

function fileWallpaper(strFile) {
	get('aeBody').style.backgroundImage = 'url('+ setCookies('aeFileWall', strFile != undefined? strFile:strFileHref + arrFileList[intFileMenu][0].replace(strFilePath.substr(2), '')) +')';
}

function fileZip(strPage) {
	ajaxRequest('file/'+ strPage +'&strPath='+ getEscape(strFilePath) +'&strFile='+ getEscape(fileSelectList('post').join('|')));
	fileSelectNone();
}