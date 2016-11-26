/*
AjaxExplorer Copyright (C) 2007-2012 S.M.Sid Software

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. Head to
GNU site http://www.gnu.org/licenses/ for license copy.
*/

function get(strName) {
	var objElem = document.all? document.all(strName):document.getElementById(strName);

	if(objElem) {
		return objElem;
	}

	return false;
}

function getEscape(strText, intFlag) {
	if(strText) {
		strText = strText.replace(/\+/g, '$2B$').replace(/ /g, '%20');

		return intFlag? strText:escape(strText);
	}

	return '';
}

function getIEClassName(strName) {
    var objBody = document.body.getElementsByTagName('*');
    var objElem = [], strRExp = new RegExp('(^| )'+ strName +'( |$)');

    for(var intLoop = 0; intLoop < objBody.length; intLoop++) {
        if(strRExp.test(objBody[intLoop].className)) {
			objElem.push(objBody[intLoop]);
		}
	}

	return objElem;
}

function getCookies(strName, strDefault) {
	if(document.cookie) {
		if(document.cookie.indexOf(strName +'=') != -1) {
			var intSub1 = document.cookie.indexOf(strName +'=') + strName.length + 1;
			var intSub2 = intSub1 == -1? document.cookie.length:document.cookie.indexOf(';', intSub1);

			return unescape(document.cookie.substring(intSub1, intSub2));
		}
	}

	return strDefault? strDefault:'';
}

function setColorAt(strName, strColor) {
	get(strName).style.color = strColor < 2? (strColor? '#333333':'#999999'):strColor;
}

function setCookies(strName, strValue) {
	var strDate = new Date();

	strDate.setDate(strDate.getDate() + 365);
	document.cookie = strName +'='+ escape(strValue) +'; expires='+ strDate.toGMTString();

	return strValue;
}

function setDisable(strName, intFlag) {
	var objElem = get(strName);
	objElem.disabled = intFlag? true:false;
	objElem.parentNode.style.color = intFlag? '#999999':'#000000';
}

function setDisplay(strName, strDisplay) {
	get(strName).style.display = strDisplay < 2? (strDisplay? 'block':'none'):strDisplay;
}

function setImageAt(strName, strValue) {
	get(strName).src = strValue;
}

function setInteger(strValue) {
	return parseInt(String(strValue).replace('px', ''));
}

function setOpacity(strName, strValue) {
	return intIExplore? get(strName).style.filter = 'alpha(opacity='+(strValue * 100)+')':get(strName).style.opacity = strValue;
}

function setValueAt(strName, strValue) {
	get(strName).value = strValue;
}

function setWidthAt(strName, strValue) {
	get(strName).style.width = strValue +'px';
}

function setWriteAt(strName, strText, intFlag) {
	get(strName).innerHTML = intFlag? (intFlag == 1? get(strName).innerHTML + strText:strText + get(strName).innerHTML):strText;
}