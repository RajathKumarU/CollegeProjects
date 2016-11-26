<?php

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

$this->aeFileAccess(aePost('strPath'), aePost('strDest'));
$this->aeFileMove(aePost('strFile', '', 'array'));

?>