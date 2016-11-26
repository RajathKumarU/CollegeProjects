<?php

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

?><!DOCTYPE html>
<html lang='en' dir="ltr">
	<head>
		<title>AjaxExplorer - Loading...</title>

		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="author" content="SMSID Software" />
		<meta name="keywords" content="ajax,explorer,file,manager" />
		<meta name="description" content="Ajax File Manager - AjaxExplorer" />
		<!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"><![endif]-->

		<link rel="shortcut icon" href="<?php echo $this->strHrefIncludes; ?>/css/images/logo_ae.png" />
		<link rel="stylesheet" href="<?php echo $this->strHrefIncludes; ?>/css/reset.css" type="text/css" />
		<link rel="stylesheet" href="<?php echo $this->strHrefTemplate; ?>/css/style.css" type="text/css" />
		<!--[if IE]><link rel="stylesheet" href="<?php echo $this->strHrefTemplate; ?>/css/ieall.css" type="text/css" /><![endif]-->

		<script src="<?php echo $this->strHrefIncludes; ?>/js/ae.ajax.js" type="text/javascript"></script>
		<script src="<?php echo $this->strHrefIncludes; ?>/js/ae.base.js" type="text/javascript"></script>
		<script src="<?php echo $this->strHrefIncludes; ?>/js/ae.file.js" type="text/javascript"></script>
		<script src="<?php echo $this->strHrefIncludes; ?>/js/ae.menu.js" type="text/javascript"></script>
		<script src="<?php echo $this->strHrefIncludes; ?>/js/ae.user.js" type="text/javascript"></script>
		<script src="<?php echo $this->strHrefIncludes; ?>/js/md5.js" type="text/javascript"></script>
		<script src="<?php echo $this->strHrefIncludes; ?>/js/jquery/jquery.min.js" type="text/javascript"></script>
		<script src="<?php echo $this->strHrefIncludes; ?>/js/jquery/jquery.ui.widget.js" type="text/javascript"></script>
		<script src="<?php echo $this->strHrefIncludes; ?>/js/jquery/jquery.fileupload.js" type="text/javascript"></script>

		<script src="<?php echo $this->strHrefIncludes; ?>/js/editarea/edit_area_compressor.php?plugins" type="text/javascript"></script>
		<script type="text/javascript">
			/*<![CDATA[*/
			arrFileOpen[0] = '<?php echo $this->strConfFileDExt; ?>';
			arrFileOpen[1] = '<?php echo $this->strConfFileEExt; ?>';

			intCodeDate = <?php echo date('ymd'); ?>;
			intCodeTime = <?php echo time(); ?>;
			intUserPKey = <?php echo $this->sesUserPKey; ?>;
			strUserView = '<?php echo $this->strUserView; ?>';

			strCSSImage = '<?php echo $this->strHrefTemplate; ?>/css/images';
			strCSSImageExt = '<?php echo $this->strHrefIncludes; ?>/css/images/ext';

			window.onload = function() {
				editAreaLoader.init({
					id:'aeEditArea',
					allow_toggle:false,
					allow_resize:'no',
					is_multi_files:true,
					replace_tab_by_spaces:4,
					syntax:'basic',
					syntax_selection_allow:'basic,css,html,js,php,sql,xml',
					toolbar:'load, save, |, undo, redo, |, search, go_to_line, |, word_wrap, select_font, syntax_selection, highlight, reset_highlight',
					EA_load_callback:'fileAjaxInit',
					load_callback:'fileEditor',
					save_callback:'fileEditorSave'
				});

				$('#aeUpload').fileupload({
					url: 'index.php?strPage=control/file/upload',
					dataType: 'json',
					done: function (e, data) {
						$.each(data.result.files, function (index, file) {
							intFileList++;
							arrFileList[intFileList] = new Array(file.name, file.size, file.fctm, fileExtension(file.name, file.size), 'new');

							var intHttp = fileExists(intFileList);

							if(intHttp == 403 || intHttp == 404) {
								intFileList--;

								if(intHttp == 403) {
									fileBrowse();
								}
							}
							else fileDraw();
						});
					}
				});
			}

			window.onbeforeunload = function() {
				userExit();
			}
			/*]]>*/ 
		</script>
	</head>
	<body id="aeBody">
		<div id="aeAjax" class="hide">
			<img alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/layout/loader.gif" onclick="ajaxAbort()" />
			<div>This may take a while...</div>
			<div>You may stop the pending task by clicking on the loading animation icon</div>
		</div>

		<div id="aeHeader">
			<div id="aeMainMenu" class="border">
				<div class="alignright">
					<span id="icon00">
						<span id="keyinfo"></span>
						<img alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/keyboard.png" />
					</span>
					<img alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/layout/divider.gif" />
					<img id="icon41" alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/css3.png" class="icon" title="CSS3 Validated" />
					<img id="icon42" alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/html5.png" class="icon" title="HTML5 Validated" />
				</div>
				<img id="icon01" alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/backward.png" class="icon" title="Go Backward" />
				<img id="icon02" alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/forward.png" class="icon" title="Go Forward" />
				<img id="icon03" alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/upward.gif" class="icon" title="Go Upward" />
				<img id="icon04" alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/file.png" class="icon" title="FileTree" />
				<img alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/layout/divider.gif" />
				<img id="icon11" alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/editor.png" class="icon" title="File Editor" />
				<img id="icon12" alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/terminal.png" class="icon" title="Terminal" />
				<img alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/layout/divider.gif" />
				<img id="icon21" alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/account.gif" class="icon" title="System Account" />
				<img id="icon22" alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/cookies.gif" class="icon" title="System Cookies" />
				<img id="icon23" alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/setting.gif" class="icon" title="System Setting" />
				<img alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/layout/divider.gif" />
				<img id="icon31" alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/manual.gif" class="icon" title="User Manual" />
				<img id="icon32" alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/keys.gif" class="icon" title="Sign Out" />
				<img alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/layout/divider.gif" />
				<span id="aeFileRDir"></span>
				<span id="aeFileRoot"></span>
			</div>
			<div id="aeFilePath" class="border">
				<label><span>Address</span> <img id="imgFilePath" alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/file.png" /> <input id="fldFilePath" type="text" onblur="filePath(this, 0)" onfocus="filePath(this, 1)" onkeyup="filePathKey(this, event)" /></label> <img alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/browse.png" class="icon" onclick="fileBrowse()" />
			</div>
			<div id="divPathList"></div>
		</div>

		<div id="aeEntrance">
			<img alt="" src="<?php echo $this->strHrefIncludes; ?>/css/images/logo.png" class="margin" />
			<form onsubmit="userSignIn();return false;">
				<div><img alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/user.gif" /> <input id="fldUserName" type="text" class="signin" /></div>
				<div><img alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/keys.gif" /> <input id="fldUserPass" type="password" class="signin" /></div>
				<div><input type="submit" class="button" value="Sign In" /></div>
			</form>
			<img alt="" src="<?php echo $this->strHrefIncludes; ?>/css/images/smsid.gif" />
		</div>

		<div id="aeSideMenu">
			<div class="panel">
				<div class="head">
					<div class="icon" onclick="menuToogle(this)"></div>
					<div class="title">File and Folder Tasks</div>
				</div>
				<div id="aeFileMenu" class="area">
					<div id="menu000">
						<div id="menu010" class="menu"><div class="hint">Shift + V</div>View</div>
						<div id="menu01" class="popup">
							<div id="menu011" class="menu"><div class="hint">Shift + L</div>as Lists</div>
							<div id="menu012" class="menu"><div class="hint">Shift + I</div>as Icons</div>
							<div id="menu013" class="menu"><div class="hint">Shift + T</div>as Tiles</div>
						</div>
						<div id="menu020" class="menu"><div class="hint">Enter</div>Open</div>
						<div id="menu02" class="popup">
							<div id="menu021" class="menu"><div class="hint">Shift + 1</div>in Here</div>
							<div id="menu022" class="menu"><div class="hint">Shift + 2</div>in New Tab</div>
							<div id="menu023" class="menu"><div class="hint">Shift + 3</div>for Download</div>
							<div id="menu024" class="menu"><div class="hint">Shift + 4</div>with Text Editor</div>
						</div>
					</div>
					<div id="menu100"><hr />
						<div id="menu110" class="menu"><div class="hint">Ctrl + C</div>Copy</div>
						<div id="menu120" class="menu"><div class="hint">Ctrl + X</div>Move</div>
						<div id="menu130" class="menu"><div class="hint">Ctrl + V</div>Paste</div>
						<div id="menu140" class="menu"><div class="hint">Delete</div>Delete</div>
						<div id="menu150" class="menu"><div class="hint">Ctrl + R</div>Rename</div>
					</div>
					<div id="menu200"><hr />
						<div id="menu210" class="menu">Sent To</div>
						<div id="menu21" class="popup">
							<div id="menu211" class="menu">Main Directory</div>
							<div id="menu212" class="menu">Zip Compressed</div>
							<div id="menu213" class="menu">Zip Extraction</div>
						</div>
					</div>
					<div id="menu300"><hr />
						<div id="menu310" class="menu"><div class="hint">F5</div>Refresh</div>
						<div id="menu320" class="menu"><div class="hint">Shift + A</div>Arrange</div>
						<div id="menu32" class="popup">
							<div id="menu321" class="menu"><div class="hint">Shift + M</div>by Modified</div>
							<div id="menu322" class="menu"><div class="hint">Shift + N</div>by Name</div>
							<div id="menu323" class="menu"><div class="hint">Shift + S</div>by Size</div>
							<div id="menu324" class="menu"><div class="hint">Shift + E</div>by Type</div>
						</div>
					</div>
					<div id="menu400"><hr />
						<div id="menu410" class="menu"><div class="hint">Ctrl + F</div>New</div>
						<div id="menu41" class="popup">
							<div id="menu411" class="menu"><div class="hint">Ctrl + F</div>File</div>
							<div id="menu412" class="menu"><div class="hint">Ctrl + G</div>Folder</div>
						</div>
					</div>
					<div id="menu500"><hr />
						<div id="menu510" class="menu"><div class="hint">Ctrl + Z</div>Properties</div>
					</div>
					<div id="menu600"><hr />
						<div id="menu610" class="menu">Set as Wallpaper</div>
					</div>
					<div id="menu700"><hr />
						<div id="menu710" class="menu">Open Containing Folder</div>
					</div>
					<div id="menu800"><hr />
						<div id="menu810" class="menu">Restore File</div>
						<div id="menu820" class="menu">Restore pick items</div>
						<div id="menu830" class="menu"><div class="hint">Ctrl + D</div>Empty Recycle Bin</div>
					</div>
				</div>
			</div>

			<div class="panel">
				<div class="head">
					<div class="icon" onclick="menuToogle(this)"></div>
					<div class="title">Other Places</div>
				</div>
				<div class="area">
					<div class="link" onclick="fileBrowse('D:/')"><img alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/open.png" class="icon" />Main Directory</div>
					<div class="link" onclick="fileBrowse('P:/')"><img alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/user.gif" class="icon" />User Profiles</div>
					<div class="link" onclick="fileBrowse('R:/')"><img alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/rbin.gif" class="icon" />Recycle Bin</div>
				</div>
			</div>

			<div class="panel">
				<div class="head">
					<div class="icon" onclick="menuToogle(this)"></div>
					<div class="title">Search File</div>
				</div>
				<div class="area">
					<form onsubmit="fileSearch();return false;">
						<label class="margin">
							<span>All or part of the file name:</span>
							<input id="fldSearchWhat" type="text" class="input" />
						</label>
						<label class="margin">
							<span>Look in:</span>
							<select id="fldSearchAt" class="input lists" onchange="setDisable('fldSearchText', this.value != 0? 0:1)">
								<option value="0">This folder only</option>
								<option value="1">This folder & subfolders</option>
								<option value="2">Search entire site folders</option>
							</select>
						</label>
						<div ></div>
						<div class="margin">
							<label title="Search file content base on extension: <?php echo $this->strConfFileEExt; ?>"><input id="fldSearchText" type="checkbox" /><span>File content</span></label><br />
							<label><input id="fldSearchCase" type="checkbox" /><span>Match case</span></label>
						</div>
						<input type="submit" value="Search" />
					</form>
				</div>
			</div>

			<div class="panel">
				<div class="head">
					<div class="icon" onclick="menuToogle(this)"></div>
					<div class="title">Details</div>
				</div>
				<div class="area">
					<div id="divFileInfo"></div>
				</div>
			</div>
		</div>

		<div id="aeTreeMenu">
			<div class="explore">
				<div class="open"><span class="file" onmouseup="fileExplore('D:/', this, 0)"></span><span class="list" onmouseup="fileExplore('D:/')">Main Directory</span><span id="tree0"></span></div>
				<div class="user"><span class="list" onmouseup="fileExplore('P:/')">User Profiles</span></div>
				<div class="rbin"><span class="list" onmouseup="fileExplore('R:/')">Recycle Bin</span></div>
			</div>
		</div>

		<div id="aeSystMenu">
			<div id="page1" class="page">
				<div class="head">System Account</div>
				<div class="menu"><span id="syst11" onclick="userSystemTab(this, 0)">Detail</span><span onclick="userSystemTab(this, 1)">Profile</span><span onclick="userSystemTab(this, 2)">Manage Users</span></div>
				<div class="area">
					<div class="name"><img alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/account.gif" /> Account - <span id="syst10"></span></div>
					<div id="syst130">
						<fieldset><legend>Set Permission</legend>
							<label class="bold margin" title="To assign individual file path">
								<img id="syst131" alt="" src="<?php echo $this->strHrefIncludes; ?>/css/images/none.gif" class="alignright" />
								<span>File Path:</span><br /><input id="syst132" type="text" class="input2" onchange="userCheckPath(this)" />
							</label>
							<div class="bold">File Permission:</div>
							<div><label title="Allow compress*, copy, create, extract, and upload* files"><input id="syst133" type="checkbox" value="1" /><span>Create</span></label></div>
							<div><label title="Allow edit, move, rename, restore, and set files permission"><input id="syst134" type="checkbox" value="2" /><span>Modify</span></label></div>
							<div><label title="Allow delete and empty recycle bin"><input id="syst135" type="checkbox" value="4" /><span>Delete</span></label></div>
							<div><label title="Allow compress*, download, and upload* files"><input id="syst136" type="checkbox" value="8" /><span>Transfer</span></label></div>
							<div class="margin"></div>
							<div><input type="button" class="button" value="OK" onclick="userSetPermSave()" /> <input type="button" value="Cancel" class="button" onclick="userSystemHide(3)" /></div>
						</fieldset>
					</div>

					<div id="syst140">
						<fieldset><legend>Set Password</legend>
							<label class="bold margin">
								<span>New Password:</span>
								<input id="syst141" type="password" class="input2" />
							</label>
							<label class="bold margin">
								<span>Confirm Password:</span>
								<input id="syst142" type="password" class="input2" />
							</label>
							<div class="margin"></div>
							<div><input type="button" class="button" value="OK" onclick="userSetPassSave()" /> <input type="button" value="Cancel" class="button" onclick="userSystemHide(4)" /></div>
						</fieldset>
					</div>

					<div id="syst100">
						<div class="alignright">
							<img alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/editor.png" class="icon" title="Open Stored Cookie in Editor" onclick="fileEditorOpen('cookie', 'P:/')" />
							<img alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/editor.png" class="icon" title="Open Stored Terminal in Editor" onclick="fileEditorOpen('terminal', 'P:/')" />
						</div>
						<img id="syst101" alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/layout/avatar.png" class="link user" onclick="fileBrowse('P:/')" />
						<span id="syst102" class="bold"></span>
						<div class="clearfloat"></div>
						<fieldset><legend>File Path</legend>
							<img alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/server.gif" class="icon alignright" title="File Path Properties" onclick="fileProperty('/')" /><span id="syst103"></span>
						</fieldset>
						<fieldset><legend>File Permission</legend>
							<img id="syst104" alt="" src="<?php echo $this->strHrefIncludes; ?>/css/images/none.gif" class="alignright" /><div class="bold">Create</div>
							<img id="syst105" alt="" src="<?php echo $this->strHrefIncludes; ?>/css/images/none.gif" class="alignright" /><div class="bold">Modify</div>
							<img id="syst106" alt="" src="<?php echo $this->strHrefIncludes; ?>/css/images/none.gif" class="alignright" /><div class="bold">Delete</div>
							<img id="syst107" alt="" src="<?php echo $this->strHrefIncludes; ?>/css/images/none.gif" class="alignright" /><div class="bold">Transfer</div>
						</fieldset>
					</div>
					<div id="syst110">
						<fieldset>
								<legend>Change Theme</legend>
								<label><select id="syst111" class="input3" onchange="userSetTheme(this)"><?php echo $this->aeFileTheme(); ?></select></label>
						</fieldset>
						<fieldset class="bold">
							<legend>Change Password</legend>
							<label>
								<span>Old Password:</span>
								<input id="syst112" type="password" class="input2" />
							</label>
							<label>
								<span>New Password:</span>
								<input id="syst113" type="password" class="input2" />
							</label>
							<label>
								<span>Confirm Password:</span>
								<input id="syst114" type="password" class="input2" />
							</label>
						</fieldset>
					</div>

					<div id="syst120">
						<fieldset>
							<legend>Manage Users</legend>
							<div id="syst121"></div>
						</fieldset>
						<fieldset>
							<legend>New User</legend>
							<label><input id="syst122" type="text" class="input2" onfocus="userTips(5)" onkeyup="userCreate(this, event)" /></label>
						</fieldset>
					</div>
				</div>
				<div class="padding">
					<span class="alignright"><input type="button" class="button" value="OK" onclick="userSystemSave()" /> <input type="button" class="button" value="Cancel" onclick="userSystemHide()" /></span>
				</div>
			</div>

			<div id="page2" class="page">
				<div class="head">System Cookies</div>
				<div class="menu"><span id="syst21" onclick="userSystemTab(this, 0)">Directory</span><span onclick="userSystemTab(this, 1)">Clipboard</span><span onclick="userSystemTab(this, 2)">Others</span></div>
				<div class="area">
					<div class="name"><img alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/cookies.gif" /> Cookies - <span id="syst20"></span></div>
					<div id="syst200">
						<fieldset>
							<legend>Wallpaper Directory</legend>
							<label><input id="syst201" type="text" class="input2" /></label>
						</fieldset>
						<fieldset>
								<legend>Stored Directory</legend>
							<label>
								<textarea id="syst202" cols="50" rows="5" class="textarea"></textarea>
							</label>
						</fieldset>
					</div>

					<div id="syst210">
						<fieldset>
							<legend>Clipboard - Task</legend>
							<label><input id="syst211" type="text" class="input2" /></label>
						</fieldset>
						<fieldset>
							<legend>Clipboard - From</legend>
							<label><input id="syst212" type="text" class="input2" /></label>
						</fieldset>
						<fieldset>
							<legend>Clipboard - File List</legend>
							<label><textarea id="syst213" cols="50" rows="5"  class="textarea"></textarea></label>
						</fieldset>
					</div>

					<div id="syst220">
						<fieldset>
							<legend>FileTree Width</legend>
							<label><input id="syst221" type="text" class="input1" maxlength="3" /> <span>pixels</span></label>
						</fieldset>
						<fieldset>
							<legend>Double Click Speed</legend>
							<label><input id="syst222" type="text" class="input1" maxlength="3" /> <span>milliseconds</span></label>
						</fieldset>
						<fieldset>
							<legend>Display - Desktop File</legend>
							<label><span onclick="fileSort('*')">Arrange by <span id="syst223" class="bold"></span></span>, <span onclick="fileView('*')">View by <span id="syst224" class="bold"></span></span></label>
						</fieldset>
					</div>
				</div>
				<div class="padding">
					<span class="alignright"><input type="button" class="button" value="OK" onclick="userSystemSave()" /> <input type="button" class="button" value="Cancel" onclick="userSystemHide()" /></span>
				</div>
			</div>

			<div id="page3" class="page">
				<div class="head">System Setting</div>
				<div class="menu"><span id="syst31" onclick="userSystemTab(this, 0)">Basic</span><span onclick="userSystemTab(this, 1)">Features</span><span onclick="userSystemTab(this, 2)">File Rules</span></div>
				<div class="area">
					<div class="name"><img alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/setting.gif" /> Setting - <span id="syst30"></span></div>
					<div id="syst300">
						<fieldset><legend>Basic Setting</legend>
							<div><img alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/rbin.gif" class="icon alignright" title="Open Recycle Bin" onclick="fileBrowse('R:/')" /><label title="Allow each deleted files or folders to be place in user recycle bin directory"><input id="syst301" type="checkbox" /><span>Enable Recycle Bin</span></label></div>
							<div><label title="Allow existing file with the same name to be replace when uploading, moving or copying file"><input id="syst302" type="checkbox" /><span>Enable Replace File</span></label></div>
							<div><label title="Disabled, will be re-introduce in future release"><input id="syst303" type="checkbox" /><span>Enable Folder Indexing</span></label></div>
						</fieldset>
						<fieldset><legend>Log Activity Setting</legend>
							<div><img alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/editor.png" class="icon alignright" title="Open Log in Editor" onclick="fileEditorOpen('user_activity.log', 'L:/')" /><label title="Allow the system to keep track of changes made in any directory"><input id="syst304" type="checkbox" /><span>Log User Activity</span></label></div>
							<div><img alt="" src="<?php echo $this->strHrefTemplate; ?>/css/images/icon/editor.png" class="icon alignright" title="Open Log in Editor" onclick="fileEditorOpen('sign_activity.log', 'L:/')" /><label title="Allow the system to keep track of attempt made in signing-in"><input id="syst305" type="checkbox" /><span>Log Sign Activity</span></label></div>
						</fieldset>
					</div>

					<div id="syst310">
						<fieldset>
							<legend>File Highlight</legend>
							<label title="Allow the system to highlight file by it's recent created or modified time"><input id="syst311" type="text" class="input1" /> <span>seconds</span></label>
						</fieldset>
						<fieldset>
							<legend>Sign Failure - Retries</legend>
							<label title="Allow the system to block user who fail to sign-in by 3 times for 100 seconds by default"><input id="syst312" type="text" class="input1" /> <span>seconds</span></label>
						</fieldset>
						<fieldset>
							<legend>Maximum Mass File Read</legend>
							<label title="Allow the system to notify user if the files read (for copy, delete, etc) go over the specify number, can be set to zero to skip this features"><input id="syst313" type="text" class="input1" /> <span>files operation</span></label>
						</fieldset>
						<fieldset>
							<legend>Maximum Upload File Size</legend>
							<label title="Allow the system to limit the size of the upload file"><input id="syst314" type="text" class="input1" /> <span>kilobytes</span></label>
						</fieldset>
					</div>

					<div id="syst320">
						<fieldset>
							<legend>Hide Files</legend>
							<label title="Allow the system to exclude AjaxExplorer files and folders from all activity except compress"><input id="syst321" type="text" class="input2" /></label>
						</fieldset>
						<fieldset>
							<legend>File Extensions - Download</legend>
							<label title="Allow the system to open file for download file when user click menu 'Open' link, double click files, or when pressing 'Enter' key"><input id="syst322" type="text" class="input2" /></label>
						</fieldset>
						<fieldset>
							<legend>File Extensions - Editor</legend>
							<label title="Allow the system to open file for edit file when user click menu 'Open' link, double click files, or when pressing 'Enter' key"><input id="syst323" type="text" class="input2" /></label>
						</fieldset>
						<fieldset>
							<legend>Block File Extensions</legend>
							<label title="Allow the system to block specific file extension from being create, edit, rename, download, or upload (does not apply to admin user)"><input id="syst324" type="text" class="input2" /></label>
						</fieldset>
					</div>
				</div>
				<div class="padding">
					<span class="alignright"><input type="button" class="button" value="OK" onclick="userSystemSave()" /> <input type="button" class="button" value="Cancel" onclick="userSystemHide()" /></span>
				</div>
			</div>

			<div id="page4" class="page">
				<div class="head"><span id="syst401"></span> Properties</div>
				<div class="menu"><span id="syst41" onclick="userSystemTab(this, 0)">Detail</span><span onclick="userSystemTab(this, 1)">Permission</span></div>
				<div class="area">
					<div id="syst400">
						<img id="syst402" alt="" src="<?php echo $this->strHrefIncludes; ?>/css/images/none.gif" class="file alignright" /><span id="syst403" class="title"></span>
						<div id="syst404" class="margin"></div>
						<fieldset>
							<legend>Selected Item</legend>
							<div>Files: <span id="syst405"></span></div>
							<div>Folders: <span id="syst406"></span></div>
						</fieldset>
						<fieldset>
							<legend>Selected Size</legend>
							<div id="syst407"></div>
						</fieldset>
						<fieldset>
							<legend>Selected Location</legend>
							<div><input id="syst408" type="text" class="input2" /></div>
							<div><input id="syst409" type="text" class="input2" /></div>
						</fieldset>
					</div>

					<div id="syst410">
						<fieldset><legend>Owner Information</legend><span id="syst411">No file permission detected.</span></fieldset>
						<fieldset><legend>Owner Permission</legend><label><input id="syst431" type="checkbox" onclick="fileSetModeForm()" /><span>Read</span></label> &nbsp; <label><input id="syst432" type="checkbox" onclick="fileSetModeForm()" /><span>Write</span></label> &nbsp; <label><input id="syst433" type="checkbox" onclick="fileSetModeForm()" /><span>Execute</span></label></fieldset>
						<fieldset><legend>Group Permission</legend><label><input id="syst441" type="checkbox" onclick="fileSetModeForm()" /><span>Read</span></label> &nbsp; <label><input id="syst442" type="checkbox" onclick="fileSetModeForm()" /><span>Write</span></label> &nbsp; <label><input id="syst443" type="checkbox" onclick="fileSetModeForm()" /><span>Execute</span></label></fieldset>
						<fieldset><legend>Public Permission</legend><label><input id="syst451" type="checkbox" onclick="fileSetModeForm()" /><span>Read</span></label> &nbsp; <label><input id="syst452" type="checkbox" onclick="fileSetModeForm()" /><span>Write</span></label> &nbsp; <label><input id="syst453" type="checkbox" onclick="fileSetModeForm()" /><span>Execute</span></label></fieldset>
						<div class="alignright margin"><label><span>Change mode:</span> <input id="syst412" type="text" class="input1" maxlength="3" onblur="fileSetModeFormValidate(this.value)" onfocus="fileSetModeFormSave(this.value)" onkeyup="fileSetModeForm(this.value)" /></label></div>
						<div class="clearfloat"></div>
						<div><label><input id="syst413" type="checkbox" /><span>Apply changes to subfolders & files</span></label></div>
					</div>

					<div id="syst420"></div>
				</div>
				<div class="padding">
					<span class="alignright"><input type="button" class="button" value="OK" onclick="fileSetMode()" /> <input type="button" value="Cancel" class="button" onclick="userSystemHide()" /> <input id="syst499" type="button" class="button" value="Restore" onclick="userSystemHide();fileRestore()" /></span>
				</div>
			</div>
		</div>

		<div id="aeTerminal" class="mini">
			<div id="aeTerminalText">
				<div id="aeTerminalEcho"></div>
			</div>
			<div id="aeTerminalForm">
				<textarea id="fldTermCode" onkeyup="userTerminalCheck(this, event)"></textarea><br />
				Command :<select id="fldTermComm" onchange="userTerminalApply(this)">
					<option></option>
					<option value="browse P">browse [FILEPATH]</option>
					<option value="compress F P">compress [FILEPATH + FILENAME] [FILEPATH]</option>
					<option value="copy F P">copy [FILEPATH + FILENAME] [FILEPATH]</option>
					<option value="create P N">create [FILEPATH + FILENAME]</option>
					<option value="delete F">delete [FILEPATH + FILENAME]</option>
					<option value="download F">download [FILEPATH + FILENAME]</option>
					<option value="editor F">editor [FILEPATH + FILENAME]</option>
					<option value="extract F P">extract [FILEPATH + FILENAME] [FILEPATH]</option>
					<option value="move F P">move [FILEPATH + FILENAME] [FILEPATH]</option>
					<option value="rename F F">rename [FILEPATH + FILENAME] [FILEPATH + FILENAME]</option>
					<option value="search P N">search [FILEPATH + FILENAME]</option>
					<option value="sign-in S">sign-in [USERNAME] [USERPASS]</option>
					<option value="sign-out S">sign-out</option>
					<option value="xcompress P M">xcompress [FILEPATH] [FILEPATH] [MULTIPLE FILENAME]</option>
					<option value="xcopy P M">xcopy [FILEPATH] [FILEPATH] [MULTIPLE FILENAME]</option>
					<option value="xdelete M">xdelete [FILEPATH] [MULTIPLE FILENAME]</option>
					<option value="xextract P M">xextract [FILEPATH] [FILEPATH] [MULTIPLE FILENAME]</option>
					<option value="xmove P M">xmove [FILEPATH] [FILEPATH] [MULTIPLE FILENAME]</option>
					<option value="xrename P M N">xrename [FILEPATH] [FILEPATH] [MULTIPLE FILENAME] [FILENAME]</option>
					<option value="" disabled="disabled">$DATE$ - Add current date format YYMMDD [<?php echo date('ymd'); ?>]</option>
					<option value="" disabled="disabled">$TIME$ - Add current Unix timestamp [<?php echo time(); ?>]</option>
				</select>
				<input type="button" class="button" value="Run" onclick="userTerminalRun()" />
				<input type="button" class="button" value="Clear" onclick="userTerminalClear()" /> &nbsp; &nbsp; &nbsp;
				Load :<select id="fldTermFunc" onchange="userTerminalSet(this)"></select>
				<input id="fldTermFile" type="button" class="button" value="Open" onclick="userTerminalSave()" />
			</div>
		</div>

		<div id="aeDownload"></div>
		<div id="aeEditArea"></div>
		<div id="aeFileDrag"></div>

		<div id="aeDesktop"></div>
		<div id="aeMasking"></div>
		<div id="aePointer"></div>

		<input id="aeUpload" type="file" name="files[]" multiple="multiple" />
	</body>
</html>