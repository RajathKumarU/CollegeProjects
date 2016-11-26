<?php

/*
AjaxExplorer Copyright (C) 2007-2013 S.M.Sid Software

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General private License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. Head to
GNU site http://www.gnu.org/licenses/ for license copy.
*/

class ajaxExplorer {
	protected $arrEcho = array(array(), array(), array(), array());
	protected $strCurrPath, $strDestPath, $strFilePath, $strHrefPath, $strPagePath, $strPostPath, $strUserPath;

	public function __construct($strFile) {
		set_error_handler(array($this, 'ae_AlertError'));
		header('Content-Type: text/html; charset=utf-8');

		$this->strFilePath = $this->aeFileInfo(str_replace('\\', '/', $strFile), 'dirname');
		$this->strHrefPath = 'http'. (isset($_SERVER['HTTPS'])? 's':'') .'://'. $_SERVER['SERVER_NAME'] . ($_SERVER['SERVER_PORT'] != ':'. $_SERVER['SERVER_PORT']? '':'') . $this->aeFileInfo($_SERVER['SCRIPT_NAME'], 'dirname');
		$this->strPagePath = aeReqs('strPage', 'index');

		if($_SERVER['REQUEST_METHOD'] != 'POST' && $this->strPagePath != 'index' && $this->strPagePath != 'control/file/download') {
			header('Location: '. $this->strHrefPath);
			exit;
		}

		$this->ae_Session();
		$this->ae_Install();
		$this->ae_Database();
		$this->ae_CallPage();
		$this->ae_CallEcho();
	}

	private function ae_AlertFileAction($arrFile) {
		if($this->intConfFileLoop > 0 && aePost('strSkip') != 'maxfileread') {
			$intFile = 0;

			foreach($arrFile as $strFile) {
				if($strFile && file_exists($this->strCurrPath . $strFile)) {
					if(is_dir($this->strCurrPath . $strFile)) {
						$arrList[1][] = '/';

						for($intLoop = 0; $intLoop < count($arrList[1]); $intLoop++) {
							if($objFile = opendir($this->strCurrPath . $strFile . $arrList[1][$intLoop])) {
								while($strFSub = readdir($objFile)) {
									if(array_search($strFSub, $this->arrFileHide) === false) {
										if(is_dir($this->strCurrPath . $strFile . $arrList[1][$intLoop] . $strFSub)) {
											$arrList[1][] = $arrList[1][$intLoop] . $strFSub .'/';
										}

										$intFile++;

										if($intFile > $this->intConfFileLoop) {
											$this->arrEcho[0][] = '::WARN::';
											$this->arrEcho[2][] = "It would take long time to handle the request, cause it involves ". $this->intConfFileLoop ."+ files and folders\n\nDo you wish to proceed with ". str_replace(array('control/', '/'), array('', ' '), $this->strPagePath) ." request?";
											$this->ae_CallEcho();
										}
									}
								}

								closedir($objFile);
							}
						}

						unset($arrList);
					}
					else $intFile++;
				}
			}
		}
	}

	private function ae_AlertError($intType, $strName, $strFile, $intLine) {
		$this->arrEcho[0][] = 'Error (PHP) - '. $strName .' in '. $strFile .' on line '. $intLine;
		$this->ae_CallEcho();
	}

	private function ae_CallEcho() {
		$strEcho = '';

		foreach($this->arrEcho as $intLoop => $arrText) {
			foreach($arrText as $intXoop => $strText) {
				if($intLoop == 1) {
					$strText = ucfirst(str_replace(array('control/', '/'), array('', ' '), $this->strPagePath)) .' "'. ($this->strDestPath? $this->strDestPath:(strpos($strText, $this->strCurrPath) !== false? '':$this->strCurrPath)) . $strText .'"';
				}

				$strEcho .= $strText . ($intLoop > 1 || $intXoop == count($arrText) - 1? '':'|');
			}

			if($this->strPagePath != 'index' && $intLoop < 3) {
				$strEcho .= '::AJAX::';
			}
		}

		echo utf8_encode($strEcho);
		exit;
	}

	private function ae_CallPage() {
		$this->aeFilePermission('page');

		if($this->strConfTimeZone) {
			date_default_timezone_set($this->strConfTimeZone);
		}

		if($this->intFilePerm == 0) {
			$this->arrEcho[0][] = '::HALT::';
			$this->ae_CallEcho();
		}

		$this->aeFilePermission('0000');

		$this->strHrefIncludes = $this->strHrefPath .'/view/includes';
		$this->strHrefTemplate = $this->strHrefPath .'/view/ae.'. $this->strUserView;

		include $this->strFilePath . (strpos($this->strPagePath, 'control') === false? '/view/ae.'. $this->strUserView:'') .'/'. $this->strPagePath .'.php';

		$intFlag = isset($this->arrEcho[3][1]) && $this->arrEcho[3][1] == '::SHOW::'? 0:1;

		if($intFlag && file_exists($this->strCurrPath) && ($this->strCurrPath == $this->sesCurrPath || $this->strDestPath == $this->sesCurrPath) && ($this->sesCurrTime < fileatime($this->strCurrPath) || $this->sesCurrTime < filemtime($this->strCurrPath) || ($this->strDestPath && ($this->sesCurrTime < filemtime($this->strDestPath)) || $this->sesCurrTime < filemtime($this->strDestPath)))) {
			$this->aeFileBrowse();
		}
	}

	private function ae_Database() {
		$dbsName = array('dbsConf', 'dbsUser', 'dbsLog1', 'dbsLog2', 'dbsLog3');
		$dbsFile = array('db/conf.ini', 'db/user.ini', 'log/user_activity.log', 'log/sign_activity.log', 'log/sign_failures.log');

		foreach($dbsName as $intLoop => $strName) {
			$this->$strName = $this->strFilePath .'/ae.'. $dbsFile[$intLoop];
		}

		if(!file_exists($this->dbsConf)) {
			echo '<strong>Unable to load database, please re-install application!</strong>';
			exit;
		}

		$arrConf = file($this->dbsConf);
		$arrData = array('intConfRecycleFile', 'intConfReplaceFile', 'intConfIndexesFile', 'intConfLogUser', 'intConfLogSign', 'intConfFileTime', 'intConfSignTime', 'intConfFileLoop', 'intConfMaxSize', 'strConfFilePath', 'strConfTimeZone', 'strConfFileHide', 'strConfFileDExt', 'strConfFileEExt', 'strConfFileBExt');

		foreach(explode("\t", $arrConf[0]) as $intLoop => $strInfo) {
			if(isset($arrData[$intLoop])) {
				$this->$arrData[$intLoop] = $strInfo;
			}
		}

		$this->arrFileHide = explode(',', '.,..,'. $this->strConfFileHide);

		$arrUser = file($this->dbsUser);
		$arrData = array('strUserName', 'strUserPass', 'strUserPath', 'intUserPerm', 'strUserView');

		foreach(explode("\t", $arrUser[$this->sesUserPKey]) as $intLoop => $strInfo) {
			if(isset($arrData[$intLoop])) {
				$this->$arrData[$intLoop] = $strInfo;
			}
		}
	}

	private function ae_Install() {
		if(file_exists($this->strFilePath .'/install.php')) {
			if(substr($this->strPagePath, 0, 7) == 'control') {
				$this->arrEcho[0][] = 'AjaxExplorer installation files detected, <a href="'. $this->strHrefPath .'/install.php">click here</a> to install it';
				$this->ae_CallEcho();
			}
			else header('location: '. $this->strHrefPath .'/install.php');
			exit;
		}
	}

	private function ae_Session($strName = '', $strData = '') {
		$arrSess = array('sesCurrPath' => '', 'sesCurrTime' => 0, 'sesUserPKey' => 0, 'sesPostPath' => '');

		if(!$strName) {
			session_start();

			if(!isset($_SESSION[$_SERVER['REMOTE_ADDR'] . $_SERVER['DOCUMENT_ROOT']]['sesUserPKey'])) {
				$_SESSION[$_SERVER['REMOTE_ADDR'] . $_SERVER['DOCUMENT_ROOT']] = $arrSess;
			}
		}

		if($strName && $strData) {
			$this->$strName = $_SESSION[$_SERVER['REMOTE_ADDR'] . $_SERVER['DOCUMENT_ROOT']][$strName] = $strData;
		} else {
			foreach($arrSess as $strName => $strValue) {
				$this->$strName = $_SESSION[$_SERVER['REMOTE_ADDR'] . $_SERVER['DOCUMENT_ROOT']][$strName];
			}
		}
	}

	private function aeConfSelect($intLoad) {
		if($intLoad == 1) {
			foreach(file($this->dbsUser) as $intLoop => $strUser) {
				if($intLoop) {
					if($strUser != "\n") {
						$arrUser = explode("\t", $strUser);
						$this->arrEcho[2][] = '|'. ($this->sesUserPKey == $intLoop || $this->sesUserPKey == 1? $arrUser[0] .':'. str_replace(':', '$3A$', $arrUser[2]) .':'. $arrUser[3] .':'. $arrUser[4]:'::');
					}
					else $this->arrEcho[2][] = '|';
				}
			}
		} else {
			if($this->sesUserPKey == 1) {
				$arrConf = file($this->dbsConf);
				$this->arrEcho[2][] = str_replace("\t", "|", $arrConf[0]);
			}
			else $this->arrEcho[0][] = 'You do not have the permission to open System Setting';
		}
	}

	private function aeConfUpdate($strConf) {
		$this->aeFilePermission('0016');

		if($this->aeFileWrite($this->dbsConf, str_replace('::CORE::', $this->strConfFilePath ."\t". $this->strConfTimeZone, $strConf))) {
			$this->arrEcho[0][] = '::LOAD::';
			$this->arrEcho[1][] = 'done';
		}
	}

	private function aeFileAccess($strCurrPath, $strDestPath = '') {
		$this->strCurrPath = $this->aeFileAppend($strCurrPath, 1);

		if($strDestPath) {
			$this->strDestPath = $this->aeFileAppend($strDestPath);
		}

		return $this->strCurrPath;
	}

	private function aeFileAppend($strPath, $intFlag = 0) {
		$strPath = $this->aeFileFilter($strPath, 'path');
		$arrPath = explode(':', $strPath);

		if($intFlag) {
			$this->strPostPath = $strPath;
		}

		switch($arrPath[0]) {
			case 'D': $strPath = $this->strConfFilePath . $this->strUserPath . $arrPath[1]; break;
			case 'L': if($this->sesUserPKey == 1) $strPath = $this->strFilePath .'/ae.log'. $arrPath[1]; break;
			case 'P': $strPath = $this->strFilePath .'/ae.user/'. $this->strUserName .'/myprofile'. $arrPath[1]; break;
			case 'R': $strPath = $this->strFilePath .'/ae.user/'. $this->strUserName .'/recyclebin'. $arrPath[1]; break;
			default:
				$this->arrEcho[0][] = 'File path does not exists: "'. ($strPath == ''? $arrPath[0] .':/':$strPath) .'"';
				$this->ae_CallEcho();
		}

		if(file_exists($strPath)) {
			if(!is_dir($strPath)) {
				$this->arrEcho[3][] = '::VIEW::<iframe id="aeContent" name="aeContent" src="'. $this->aeFileHref($strPath) .'"></iframe>';
				$this->ae_CallEcho();
			}
		} else {
			$this->arrEcho[0][] = 'File path does not exists: "'. ($strPath == ''? $arrPath[0] .':/':$strPath) .'"';
			$this->ae_CallEcho();
		}

		if($intFlag) {
			chdir($strPath);
		}

		return $strPath;
	}

	private function aeFileBrowse() {
		$this->aeFilePermission('0000');

		if($this->strPagePath == 'control/file/browse') {
			$this->ae_Session('sesCurrPath', $this->strCurrPath);
			$this->ae_Session('sesCurrTime', filemtime($this->strCurrPath));
			$this->ae_Session('sesPostPath', $this->strPostPath);
		} else {
			$this->strCurrPath = $this->sesCurrPath;
			$this->strPostPath = $this->sesPostPath;
			chdir($this->strCurrPath);
		}

		$this->arrEcho[3][] = '::ROOT::'. basename($this->strCurrPath) .'|folder|'. filemtime($this->strCurrPath) .'|'. $this->strPostPath .'|'. $this->strCurrPath .'|'. $this->aeFileHref();

		$arrList = array();

		if($objFile = opendir($this->strCurrPath)) {
			while($strFile = readdir($objFile)) {
				if($this->aeFileFilter($strFile)) {
					$arrList[is_dir($strFile)? 1:2][] = $strFile;
				}
			}

			$this->arrEcho[3][] = '::SHOW::';

			for($intLoop = 1; $intLoop < 3; $intLoop ++) {
				if(isset($arrList[$intLoop])) {
					sort($arrList[$intLoop]);

					foreach($arrList[$intLoop] as $strFSub) {
						$this->arrEcho[3][] = $strFSub .':'. ($intLoop == 2? filesize($strFSub):'folder') .':'. filemtime($strFSub) .':'. (filectime($strFSub) > time() - $this->intConfFileTime? 'new':(filemtime($strFSub) > time() - $this->intConfFileTime? 'chg':'nom')) .'|';
					}
				}
			}

			closedir($objFile);
		}
	}

	private function aeFileCompress($arrFile) {
		$this->aeFilePermission('0009');

		$this->ae_AlertFileAction($arrFile);
		$arrFile = $this->aeFileFilterMass($arrFile);

		require_once 'pclzip/library.php';

		if(count($arrFile) == 1) {
			$strDestPath = $this->strDestPath . $arrFile[0] .'.zip';
		} else {
			$strDestPath = $this->strDestPath . basename($this->strDestPath) .'.zip';
		}

		if(!file_exists($strDestPath) || $this->intConfReplaceFile) {
			$objPZip = new PclZip($strDestPath);

			foreach($arrFile as $strFile) {
							$this->arrEcho[1][] = $strFile;
				if($this->aeFileFilter($strFile) && file_exists($strFile)) {
					if(count($arrFile) == 1 || !is_dir($strFile)) {
						if($objPZip->add($strFile, PCLZIP_OPT_REMOVE_PATH, (is_dir($strFile)? $strFile:'')) != -1) {
							$this->arrEcho[1][] = $strFile;
						}
					} else {
						if($objPZip->add($strFile, PCLZIP_OPT_ADD_PATH, '', PCLZIP_OPT_REMOVE_PATH, $this->strCurrPath) != -1) {
							$this->arrEcho[1][] = $strFile;
						}
					}
				}
			}

			if(file_exists($strDestPath) && $this->strDestPath == $this->sesCurrPath) {
				$this->arrEcho[2][] = '::SHOW::'. basename($strDestPath) .':'. filesize($strDestPath) .':'. time() .'|';
			}
		}
		else $this->arrEcho[0][] = 'File already exist: "'. $strDestPath .'"';
	}

	private function aeFileCopy($arrFile) {
		$this->aeFilePermission('0001');
		$this->ae_AlertFileAction($arrFile);

		$intFlag = 0;
		$strCopy = $this->strCurrPath == $this->strDestPath? 'copy_':'';

		foreach($arrFile = $this->aeFileFilterMass($arrFile) as $strFile) {
			if(file_exists($this->strDestPath . $strCopy . $strFile)) {
				$intFlag = 1;
			}

			if(file_exists($strFile) && ($this->intConfReplaceFile || !$intFlag)) {
				if(is_dir($strFile)) {
					$arrList[1][] = '/';

					for($intLoop = 0; $intLoop < count($arrList[1]); $intLoop++) {
						if($objFile = opendir($strFile . $arrList[1][$intLoop])) {
							while($strFSub = readdir($objFile)) {
								if($this->aeFileFilter($strFSub)) {
									is_dir($strFile . $arrList[1][$intLoop] . $strFSub)? $arrList[1][] = $arrList[1][$intLoop] . $strFSub .'/':$arrList[2][] = $arrList[1][$intLoop] . $strFSub;
								}
							}

							closedir($objFile);
						}
					}

					if(mkdir($this->strDestPath . $strCopy . $strFile)) {
						$this->arrEcho[1][] = $strCopy . $strFile;
					}

					for($intLoop = 1; $intLoop < 3; $intLoop++) {
						if(isset($arrList[$intLoop])) {
							foreach($arrList[$intLoop] as $strFSub) {
								if(!file_exists($this->strDestPath . $strCopy . $strFile . $strFSub)) {
									if($intLoop == 2) {
										copy($strFile . $strFSub, $this->strDestPath . $strCopy . $strFile . $strFSub);
									} else if(!file_exists($this->strDestPath . $strCopy . $strFile . $strFSub)) {
										mkdir($this->strDestPath . $strCopy . $strFile . $strFSub);
									}
								}
							}
						}
					}

					unset($arrList);
				} else {
					if(copy($strFile, $this->strDestPath . $strCopy . $strFile)) {
						$this->arrEcho[1][] = $strCopy . $strFile;
					}
				}
			}
			else $this->arrEcho[0][] = 'File already exist: "'. $this->strDestPath . $strFile .'"';
		}
	}

	private function aeFileCreate($strFile) {
		$this->aeFilePermission('0001');
		$strFile = substr($strFile, 2);

		if(!file_exists($this->strCurrPath . $strFile)) {
			$arrFile = explode('/', $strFile);
			$intFile = count($arrFile) - 2;
			$strPath = '';

			for($intLoop = 1; $intLoop < $intFile+1; $intLoop++) {
				$strPath .= $arrFile[$intLoop] .'/';

				if(!file_exists($strPath) && mkdir($strPath)) {
					$this->arrEcho[1][] = $strPath;
				}
			}

			if($arrFile[$intLoop]) {
				if($this->aeFileFilter($strPath . $arrFile[$intLoop], 'cext')) {
					if($this->aeFileWrite($strPath . $arrFile[$intLoop])) {
						$this->arrEcho[1][] = $strPath . $arrFile[$intLoop];
					}
				}
				else $this->arrEcho[0][] = 'Unable to create file with these extensions: "'. $this->strConfFileBExt .'"';
			}
		}
		else $this->arrEcho[0][] = 'File already exist: "'. $strFile .'"';
	}

	private function aeFileDelete($arrFile) {
		$this->aeFilePermission('0004');

		foreach($this->aeFileFilterMass($arrFile) as $intId => $strFile) {
			if(strpos($this->strCurrPath, '/recyclebin/') !== false || !$this->intConfRecycleFile) {
				$this->ae_AlertFileAction($arrFile);

				if(strpos($this->strCurrPath, '/recyclebin/') !== false && file_exists($strFile)) {
					$strFDel = substr($strFile, 0, strpos($strFile, '$RB$'));
					$strTemp = time() . rand(100000, 999999);
					$strFile = rename($strFile, $strTemp)? $strTemp:$strFile;
				}

				if(is_dir($strFile)) {
					$arrList[1][] = '/';

					for($intLoop = 0; $intLoop < count($arrList[1]); $intLoop++) {
						if($objFile = opendir($strFile . $arrList[1][$intLoop])) {
							while($strFSub = readdir($objFile)) {
								if($this->aeFileFilter($strFSub)) {
									is_dir($strFile . $arrList[1][$intLoop] . $strFSub)? $arrList[1][] = $arrList[1][$intLoop] . $strFSub .'/':$arrList[2][] = $arrList[1][$intLoop] . $strFSub;
								}
							}

							closedir($objFile);
						}
					}

					for($intLoop = 2; $intLoop > 0; $intLoop--) {
						if(isset($arrList[$intLoop])) {
							rsort($arrList[$intLoop]);
							foreach($arrList[$intLoop] as $strFSub) {
								if(file_exists($strFile . $strFSub)) {
									$intLoop == 2? unlink($strFile . $strFSub):rmdir($strFile . $strFSub);
								}
							}
						}
					}

					unset($arrList);
					$intFlag = file_exists($strFile)? 0:1;
				} else {
					if(file_exists($strFile)) {
						$intFlag = unlink($strFile)? 1:0;
					}
					else $intFlag = 1;
				}
			} else {
				if(file_exists($strFile)) {
					$intFlag = rename($strFile, $this->strFilePath .'/ae.user/'. $this->strUserName .'/recyclebin/'. $strFile .'$RB$'. str_replace(array('/', ':'), array('$2F$', '$3A$'), $this->strCurrPath) .'$RB$'. time())? 1:0;
				}
				else $intFlag = 1;
			}

			if($intFlag) {
				$this->arrEcho[1][] = isset($strFDel)? $strFDel:$strFile;
			}
		}
	}

	private function aeFileDownload($strFile) {
		$this->aeFilePermission('0008');

		if(file_exists($this->strCurrPath . $strFile)) {
			if($this->aeFileFilter($strFile, 'cext')) {
				if($_SERVER['REQUEST_METHOD'] == 'POST') {
					$this->arrEcho[3][] = '::FILE::<iframe src="'. $_SERVER['SCRIPT_NAME'] .'?strPage=control/file/download&strPath='. $this->strPostPath .'&strFile='. $strFile .'" class="hide"></iframe>';
				} else {
					$strType = $this->aeFileInfo($strFile, 'extension');

					switch($strType) {
						case 'bmp':
						case 'gif':
						case 'jpg':
						case 'png':
							header('Content-Type: image/'. $strType);
						break;
						default:
							header('Content-Type: application/'. $strType);
						break;
					}

					header('Content-Disposition: attachment; filename="'. basename($strFile) .'"');
					readfile($this->strCurrPath . $strFile);
					exit;
				}
			}
			else $this->arrEcho[0][] = 'Unable to download file with these extensions: "'. $this->strConfFileBExt .'"';
		}
		else $this->arrEcho[0][] = 'File does not exist: "'. $strFile .'"';
	}

	private function aeFileEditor($strFile, $strText = '', $strOpen = 'w+') {
		if($this->aeFileFilter($strFile, 'cext')) {
			if(isset($_POST['strText'])) {
				unset($_POST['strText']);
				$this->aeFilePermission('0002');

				if(!file_exists($strFile)) {
					$this->aeFilePermission('0001');
				}

				if($this->aeFileWrite($strFile, stripslashes($strText), $strOpen)) {
					$this->arrEcho[1][] = $strFile;
				}
			} else {
				if(file_exists($strFile)) {
					$this->arrEcho[2][] = $this->strPostPath . $strFile .':TEXT:'. utf8_decode(file_get_contents($strFile));
				}
				else $this->arrEcho[0][] = 'File does not exist: "'. $strFile .'"';
			}
		}
		else $this->arrEcho[0][] = 'Unable to edit file with these extensions: "'. $this->strConfFileBExt .'"';
	}

	private function aeFileExplore($intLoad) {
		$this->arrEcho[2][] = $intLoad .'|'. substr($this->strPostPath, 2) .'|';
		$arrList[1][] = '/';

		if($objFile = opendir($this->strCurrPath . $arrList[1][0])) {
			while($strFSub = readdir($objFile)) {
				if($this->aeFileFilter($strFSub) && is_dir($this->strCurrPath . $arrList[1][0] . $strFSub)) {
					$arrList[1][] = $arrList[1][0] . $strFSub .'/';
				}
			}

			closedir($objFile);
		}

		if(isset($arrList[1])) {
			sort($arrList[1]);
			foreach($arrList[1] as $intLoop => $strFSub) {
				if($intLoop) {
					$this->arrEcho[2][] = basename($strFSub).'|';
				}
			}
		}
	}

	private function aeFileExtract($arrFile) {
		$this->aeFilePermission('0001');

		require_once 'pclzip/library.php';

		foreach($this->aeFileFilterMass($arrFile) as $strFile) {
			$strDestPath = $this->strDestPath . $this->aeFileInfo($strFile, 'filename');

			if($this->aeFileFilter($strFile) && $this->aeFileInfo($strFile, 'extension') == 'zip' && file_exists($this->strCurrPath . $strFile) && !file_exists($strDestPath)) {
				$objPZip = new PclZip($this->strCurrPath . $strFile);

				if($objPZip->extract(PCLZIP_OPT_PATH, $strDestPath) != 0 && file_exists($strDestPath)) {
					$this->arrEcho[1][] = basename($strDestPath);
				}
			}
		}
	}

	private function aeFileFilter($strFile, $strCase = '') {
		if($strFile && array_search($strFile, $this->arrFileHide) === false) {
			switch($strCase) {
				case 'cext':
					return $this->sesUserPKey == 1 || !$this->aeFileInfo($strFile, 'extension') || strpos($this->strConfFileBExt, $this->aeFileInfo($strFile)) === false? true:false;
				case 'conf':
					return str_replace(array("\n", "\r", "\t"), '', $strFile);
				case 'file':
					return str_replace(array('\\', '"', '*', '?', '<', '>', '|', ':', '/'), '', basename($strFile));
				case 'path':
					return str_replace(array('./', '//'), '/', str_replace(array('\\', '"', '*', '?', '<', '>', '|', '..'), '', $strFile));
				case 'user':
					return str_replace(array('\\', '"', '*', '?', '<', '>', '|', ':', '/', ' '), '', basename($strFile));
				default:
					return basename($strFile);
			}
		}

		return false;
	}

	private function aeFileFilterMass($arrFile) {
		foreach($arrFile as $intLoop => $strFile) {
			if($strFile) {
				$arrFile[$intLoop] = $this->aeFileFilter($strFile, 'file');
			}
			else unset($arrFile[$intLoop]);
		}

		return $arrFile;
	}

	private function aeFileHref($strPath = '') {
		$arrRoot = explode('/', $strPath? $strPath:$this->strCurrPath);
		$intRoot = count(explode('/', $this->strFilePath)) - count(explode('/', $_SERVER['PHP_SELF'])) + 2;
		$strRoot = '';

		for($intLoop = $intRoot; $intLoop < count($arrRoot); $intLoop++) {
			$strRoot .= '/'. $arrRoot[$intLoop];
		}

		return 'http'. (isset($_SERVER['HTTPS'])? 's':'') .'://'. $_SERVER['SERVER_NAME'] . $strRoot;
	}

	private function aeFileInfo($strFile, $strCase = 'extension') {
		$arrInfo = pathinfo($strFile);
		return isset($arrInfo[$strCase]) && $arrInfo[$strCase] != '.'? $arrInfo[$strCase]:'';
	}

	private function aeFileMove($arrFile) {
		$this->aeFilePermission('0001');

		foreach($this->aeFileFilterMass($arrFile) as $intLoop => $strFile) {
			if(file_exists($this->strCurrPath . $strFile) && ($this->intConfReplaceFile || !file_exists($this->strDestPath . $strFile))) {
				if(rename($this->strCurrPath . $strFile, $this->strDestPath . $strFile)) {
					$this->arrEcho[1][] = $strFile;
				}
			}
			else $this->arrEcho[0][] = 'File already exist: "'. $this->strDestPath . $strFile .'"';
		}
	}

	private function aeFilePermission($strPerm) {
		if($strPerm == 'page') {
			$arrPage = array('index', 'control/user/select', 'control/user/sign/in', 'control/user/sign/out');

			foreach($arrPage as $strPage) {
				if($this->strPagePath == $strPage) {
					$this->intFilePerm = 1;
					return;
				}
			}

			$this->intFilePerm = $this->sesUserPKey > 0? 1:0;
		} else {
			$intFlag = 0;
			$strDoes = 'load';

			if($strPerm == '0001' && !($this->intUserPerm & 0x0001)) $intFlag = 1;
			if($strPerm == '0002' && !($this->intUserPerm & 0x0002)) $intFlag = 1;
			if($strPerm == '0004' && !($this->intUserPerm & 0x0004)) $intFlag = 1;
			if($strPerm == '0008' && !($this->intUserPerm & 0x0008)) $intFlag = 1;
			if($strPerm == '0009' && $this->intUserPerm < 9) $intFlag = 1;
			if($strPerm == '0016' && $this->intUserPerm < 16) $intFlag = 1;

			if($this->strPagePath != 'index') {
				$arrDoes = explode('/', $this->strPagePath);
				$strDoes = $arrDoes[2] .' '. $arrDoes[1] .' '. (isset($arrDoes[3])? $arrDoes[3]:'');
			}

			if($strPerm != '0000' && $this->intConfLogUser) {
				$this->aeFileWrite($this->dbsLog1, date('d-m-Y h:i:s') ."\t". $_SERVER['REMOTE_ADDR'] ."\t". $this->strUserName ."\t". $strDoes . ($intFlag? ' - no permission':'') ."\t". $this->strCurrPath ."\t". implode(' | ', $_POST) ."\n", 'a+');
			}
	 
			if($intFlag || count($this->arrEcho[0]) > 0 || $this->intFilePerm == 0) {
				if($this->strPagePath != 'control/file/upload') {
					if($intFlag || count($this->arrEcho[0]) == 0) {
						$this->arrEcho[0][] = 'You do not have the permission to '. $strDoes;
					}

					$this->ae_CallEcho();
				}
				else exit;
			}
		}
	}

	private function aeFileProperty($arrFile) {
		$this->ae_AlertFileAction($arrFile);

		$intNum1 = 0;
		$intNum2 = 0;
		$intSize = 0;

		foreach($this->aeFileFilterMass($arrFile) as $intFile => $strFile) {
			if(file_exists($this->strCurrPath . $strFile)) {
				if($intFile == 0) {
					$this->arrEcho[2][] = fileowner($this->strCurrPath . $strFile) .'|'. filegroup($this->strCurrPath . $strFile) .'|'. substr(sprintf('%o', fileperms($this->strCurrPath . $strFile)), -3) .'|'. (is_dir($this->strCurrPath . $strFile)? 'folder:':'file:');
				}

				if(is_dir($this->strCurrPath . $strFile)) {
					$arrList[1][] = '/';

					for($intLoop = 0; $intLoop < count($arrList[1]); $intLoop++) {
						if($objFile = opendir($this->strCurrPath . $strFile . $arrList[1][$intLoop])) {
							while($strFSub = readdir($objFile)) {
								if($this->aeFileFilter($strFSub)) {
									if(is_dir($this->strCurrPath . $strFile . $arrList[1][$intLoop] . $strFSub)) {
										$intNum2++;
										$arrList[1][] = $arrList[1][$intLoop] . $strFSub .'/';
									} else {
										$intNum1++;
										$intSize += filesize($this->strCurrPath . $strFile . $arrList[1][$intLoop] . $strFSub);
									}
								}
							}

							closedir($objFile);
						}
					}

					unset($arrList);
				} else {
					$intNum1++;
					$intSize += filesize($this->strCurrPath . $strFile);
				}

				$this->arrEcho[2][] = basename($this->strCurrPath . $strFile) .':';
			}
		}

		$this->arrEcho[2][] = '|'. $intNum1 .'|'. $intNum2 .'|'. $intSize .'|'. ($arrFile[0] == '/'? 0:1);
	}

	private function aeFileRename($arrFile, $strName) {
		$this->aeFilePermission('0002');

		$strBase = $strName;

		foreach($this->aeFileFilterMass($arrFile) as $intLoop => $strFile) {
			if($this->aeFileFilter($strBase, 'cext')) {
				$strName = count($arrFile) >2? $this->aeFileInfo($strBase, 'filename') .' '. ($intLoop+1) . ($this->aeFileInfo($strBase, 'extension')? '.'. $this->aeFileInfo($strFile, 'extension'):''):$strName;

				if(!file_exists($this->strDestPath . $strName)) {
					if(rename($this->strCurrPath . $strFile, $this->strDestPath . $strName) && touch($this->strDestPath . $strName) && $this->strCurrPath == $this->strDestPath) {
						$this->arrEcho[1][] = basename($strName);
					}
				}
				else $this->arrEcho[0][] = basename($this->strDestPath . $strName) .' file already exist';
			}
			else $this->arrEcho[0][] = 'Unable to rename file with these extensions: "'. $this->strConfFileBExt .'"';
		}
	}

	private function aeFileRestore($arrFile) {
		$this->aeFilePermission('0002');

		foreach($this->aeFileFilterMass($arrFile) as $intLoop => $strFile) {
			if($this->aeFileFilter($strFile)) {
				$arrPath = explode('$RB$', $strFile);
				$strPath = str_replace(array('$2F$', '$3A$'), array('/', ':'), $arrPath[1]);

				$strFDel = substr($strFile, 0, strpos($strFile, '$RB$'));
				$strTemp = time() . rand(100000, 999999);
				$strFile = rename($strFile, $strTemp)? $strTemp:$strFile;

				if(file_exists($strFile)) {
					if(rename($this->strCurrPath . $strFile, $strPath . $arrPath[0])) {
						$this->arrEcho[1][] = isset($strFDel)? $strFDel:$strFile;
					}
				}
				else $this->arrEcho[0][] = 'Restore path does not exist: "'. (isset($strFDel)? $strFDel:$strFile) .'"';
			}
		}
	}

	private function aeFileSearch($strFile, $intCase, $intText) {
		$this->arrEcho[3][] = '::ROOT::'. basename($this->strCurrPath) .'|folder|'. filemtime($this->strCurrPath) .'|'. $this->strPostPath .'|'. $this->strCurrPath .'|'. $this->aeFileHref();
		$strFile = $intCase? $strFile:strtolower($strFile);
		$arrList[0][] = '';

		for($intLoop = 0; $intLoop < count($arrList[0]); $intLoop++) {
			if($objFile = opendir($this->strCurrPath . $arrList[0][$intLoop])) {
				while($strFSub = readdir($objFile)) {
					if($this->aeFileFilter($strFSub)) {
						if(is_dir($this->strCurrPath . $arrList[0][$intLoop] . $strFSub)) {
							$arrList[0][] = $arrList[0][$intLoop] . $strFSub .'/';

							if(strpos($intCase? $strFSub:strtolower($strFSub), $strFile) !== false) {
								$arrList[1][] = $arrList[0][$intLoop] . $strFSub;
							}
						} else {
							if(strpos($intCase? $strFSub:strtolower($strFSub), $strFile) !== false || ($intText && $this->aeFileFilter($strFSub, 'cext') && filesize($this->strCurrPath . $arrList[0][$intLoop] . $strFSub) < 999999 && strpos($intCase? file_get_contents($this->strCurrPath . $arrList[0][$intLoop] . $strFSub):strtolower(file_get_contents($this->strCurrPath . $arrList[0][$intLoop] . $strFSub)), $strFile) !== false)) {
								$arrList[2][] = $arrList[0][$intLoop] . $strFSub;
							}
						}
					}
				}

				closedir($objFile);
			}
		}

		$this->arrEcho[3][] = '::SHOW::';

		for($intLoop = 1; $intLoop < 3; $intLoop++) {
			if(isset($arrList[$intLoop])) {
				sort($arrList[$intLoop]);

				foreach($arrList[$intLoop] as $strFSub) {
					$this->arrEcho[3][] = substr($this->strPostPath, 2) . $strFSub .':'. ($intLoop == 2? filesize($this->strCurrPath . $strFSub):'folder') .':'. filemtime($this->strCurrPath . $strFSub) .'|';
				}
			}
		}
	}

	private function aeFileSetMode($arrFile, $intMode, $intLoad) {
		$this->aeFilePermission('0002');
		$this->ae_AlertFileAction($arrFile);

		foreach($this->aeFileFilterMass($arrFile) as $intId => $strFile) {
			if($strFile && file_exists($this->strCurrPath . $strFile)) {
				if($intLoad && is_dir($this->strCurrPath . $strFile)) {
					$arrList[1][] = '/';

					for($intLoop = 0; $intLoop < count($arrList[1]); $intLoop++) {
						if($objFile = opendir($this->strCurrPath . $strFile . $arrList[1][$intLoop])) {
							while($strFSub = readdir($objFile)) {
								if($this->aeFileFilter($strFSub)) {
									is_dir($this->strCurrPath . $strFile . $arrList[1][$intLoop] . $strFSub)? $arrList[1][] = $arrList[1][$intLoop] . $strFSub .'/':$arrList[2][] = $arrList[1][$intLoop] . $strFSub;
								}
							}

							closedir($objFile);
						}
					}

					for($intLoop = 1; $intLoop < 3; $intLoop++) {
						if(isset($arrList[$intLoop])) {
							foreach(array_reverse($arrList[$intLoop]) as $strFSub) {
								chmod($this->strCurrPath . $strFile . $strFSub, octdec($intMode));
							}
						}
					}

					unset($arrList);
				}

				if(chmod($this->strCurrPath . $strFile, octdec($intMode))) {
					$this->arrEcho[1][] = $strFile;
				}
			}
		}
	}

	private function aeFileTheme() {
		$strText = '';

		if($objFile = opendir($this->strFilePath .'/view/')) {
			while($strFile = readdir($objFile)) {
				if(strpos($strFile, 'ae.') !== false) {
					$strText .= '<option value="'. substr($strFile, 3) .'"> '. substr($strFile, 3) .'</option>';
				}
			}

			closedir($objFile);
		}

		return $strText;
	}

	private function aeFileWrite($strFile, $strText = '', $strOpen = 'w+') {
		if(($objFile = fopen($strFile, $strOpen)) && fwrite($objFile, $strText)) {
			fclose($objFile);
			return true;
		}

		return false;
	}

	private function aeFileUpload() {
		$this->aeFilePermission('0009');

		require $this->strFilePath .'/model/upload.php';
		$upload_handler = new UploadHandler(array('upload_dir' => $this->strCurrPath, 'max_file_size' => $this->intConfMaxSize * 1024, 'accept_file_types' => '/(.|\/)('. ($this->sesUserPKey == 1? '~':str_replace(',', '|', $this->strConfFileBExt)) .')$/i'));

		exit;
	}

	private function aeUserChangePass($strUserPass, $strUserPNew) {
		$strText = '';

		if($strUserPass == $this->strUserPass) {
			foreach(file($this->dbsUser) as $intLoop => $strUser) {
				if($intLoop == $this->sesUserPKey) {
					$arrData = explode("\t", $strUser);
					$strText.= $arrData[0] ."\t". $strUserPNew ."\t". $arrData[2] ."\t". $arrData[3] ."\t". $arrData[4] ."\t\n";
				}
				else $strText.= $strUser;
			}

			if($this->aeFileWrite($this->dbsUser, $strText)) {
				$this->arrEcho[1][] = $arrData[0];
			}
		}
		else $this->arrEcho[0][] = 'Unable to change password, given password is incorrect';	
	}

	private function aeUserChangeView($strUserView) {
		$strText = '';

		foreach(file($this->dbsUser) as $intLoop => $strUser) {
			if($intLoop == $this->sesUserPKey) {
				$arrData = explode("\t", $strUser);
				$strText.= $arrData[0] ."\t". $arrData[1] ."\t". $arrData[2] ."\t". $arrData[3] ."\t". $strUserView ."\t\n";
			}
			else $strText.= $strUser;
		}

		$this->aeFileWrite($this->dbsUser, $strText);
	}

	private function aeUserCreate($strUserName) {
		$this->aeFilePermission('0016');

		$strUserName = $this->aeFileFilter($strUserName, 'user');

		foreach(array('', 'myprofile', 'recyclebin') as $intLoop => $strFile) {
			$strPath = $this->strFilePath .'/ae.user/'. $strUserName .'/'. $strFile;
			if(!file_exists($strPath) && mkdir($strPath) && $intLoop == 1) {
				$this->aeFileWrite($strPath .'/terminal');
			}
		}

		if($this->aeFileWrite($this->dbsUser, "\n". $strUserName ."\t". md5($strUserName .'123') ."\t\t0\t". $this->strUserView ."\t", 'a+')) {
			$this->arrEcho[2][] = $strUserName .'::0';
		}
	}

	private function aeUserCookie($strCook, $strFile = '') {
		if($strFile) {
			$strCook = file_exists($strFile)? file_get_contents($strFile):'';
		}

		if($strCook) {
			foreach(explode('; ', $strCook) as $strCook) {
				$arrCook = explode('=', $strCook);

				if($arrCook[0] != 'PHPSESSID') {
					setcookie($arrCook[0], $strFile? $arrCook[1]:'', $strFile? time() + 3600:0);
				}
			}
		}
	}

	private function aeUserDelete($intUserPKey) {
		$this->aeFilePermission('0016');

		$arrUser = file($this->dbsUser);
		$strText = '';

		foreach($arrUser as $intLoop => $strUser) {
			$strText .= $intLoop == $intUserPKey? (count($arrUser)-1 > $intLoop? "\n":""):$strUser;
		}

		if($this->aeFileWrite($this->dbsUser, $strText)) {
			$this->arrEcho[2][] = $intUserPKey;
		}
	}

	private function aeUserSelect() {
		if($this->sesUserPKey != 0) {
			$this->aeUserCookie('', $this->strFilePath .'/ae.user/'. $this->strUserName .'/myprofile/cookie');
		}

		$this->arrEcho[2][] = $this->sesUserPKey .'|'. $this->intUserPerm .'|'. $this->strUserView;
	}

	private function aeUserSession($strCook, $intFlag = 1) {
		if($this->sesUserPKey != 0) {
			$this->aeFileWrite($this->strFilePath .'/ae.user/'. $this->strUserName .'/myprofile/cookie', substr($strCook, 0, strpos($strCook, 'PHPSESSID') - 2));
			$this->aeUserCookie($strCook);
		}

		if($intFlag) exit;
	}

	private function aeUserSignIn($strUserName, $strUserPass) {
		$intFail = 1;
		$intTime = 0;
		$strText = '';

		if(file_exists($this->dbsLog3)) {
			foreach(array_reverse(file($this->dbsLog3)) as $strLogs) {
				$arrLogs = explode("\t", $strLogs);

				if($arrLogs[0] + $this->intConfSignTime > time()) {
					$strText = $strLogs . $strText;

					if($arrLogs[1] == $_SERVER['REMOTE_ADDR']) {
						$intFail++;
						$intTime = $arrLogs[0] + $this->intConfSignTime - time();
					}
				}
				else break;
			}
		}

		$this->aeFileWrite($this->dbsLog3, $strText);

		if($intFail < 4) {
			if($strUserName && $strUserPass) {
				foreach(file($this->dbsUser) as $intLoop => $strUser) {
					if(strpos($strUser, $strUserName ."\t". $strUserPass ."\t") == 0 && strpos($strUser, $strUserName ."\t". $strUserPass ."\t") !== false) {
						$this->ae_Session('sesUserPKey', $intLoop);
						$intFail = 0;
						break;
					}
				}
			}

			if($intFail) {
				$this->aeFileWrite($this->dbsLog3, time() ."\t". $_SERVER['REMOTE_ADDR'] ."\t\n", 'a+');
				$this->arrEcho[0][] = 'Login Failed! Invalid username/password combination.';
			}
			else $this->arrEcho[2][] = 'ok';

			if($this->intConfLogSign) {
				$this->aeFileWrite($this->dbsLog2, date('d-m-Y h:i:s') ."\t". $_SERVER['REMOTE_ADDR'] ."\t". $strUserName ." sign-". ($this->sesUserPKey? 'in':'fail') ."\n", 'a+');
			}
		}
		else $this->arrEcho[0][] = 'Login Blocked! Retry in '. $intTime .' seconds.';
	}

	private function aeUserSignOut() {
		if($this->intConfLogSign) {
			$this->aeFileWrite($this->dbsLog2, date('d-m-Y h:i:s') ."\t". $_SERVER['REMOTE_ADDR'] ."\t". $this->strUserName ." sign-out\n", 'a+');
		}

		session_destroy();
	}

	private function aeUserStatus() {
		echo '$**$';
		flush();
		ob_flush();

		if(connection_status() != CONNECTION_NORMAL) {
			exit;
		}
	}

	private function aeUserUpdate($intUserPKey, $strUserPass, $strUserPath, $intUserPerm) {
		$this->aeFilePermission('0016');

		$arrUser = file($this->dbsUser);
		$intPMax = count($arrUser)-1;
		$strText = '';

		foreach($arrUser as $intLoop => $strUser) {
			if($intLoop > 1 && $intLoop == $intUserPKey) {
				$arrData = explode("\t", $strUser);
				$strText .= $arrData[0] ."\t". ($strUserPass? $strUserPass ."\t". $arrData[2] ."\t". $arrData[3]:$arrData[1] ."\t". $this->aeFileFilter($strUserPath, 'path') ."\t". ($intUserPerm > 15? 15:$intUserPerm)) ."\t". $arrData[4] ."\t". ($intPMax > $intLoop? "\n":"");
			}
			else $strText .= $strUser;
		}

		$this->aeFileWrite($this->dbsUser, $strText);
	}
}

function aeData($strData, $strCase = '') {
	$strData = str_replace('$2B$', '+', urldecode($strData));

	if($strCase == 'array') {
		return explode('|', $strData);
	}

	return $strData;
}

function aePost($strName, $strData = '', $strCase = '') {
	return aeData(isset($_POST[$strName])? $_POST[$strName]:$strData, $strCase);
}

function aeReqs($strName, $strData = '', $strCase = '') {
	return aeData(isset($_REQUEST[$strName])? $_REQUEST[$strName]:$strData, $strCase);
}

?>