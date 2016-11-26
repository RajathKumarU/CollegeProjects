<?php 

$con = @mysql_connect ( 'localhost', 'root', 'root' );

if (! $con) {
	die ( 'could not connect: ' . mysql_error () );
}
mysql_select_db ( 'ajax', $con );

if(!empty($_POST))
{
	foreach($_POST as $field_name => $val)
	{
		//clean post values
		$field_userid = strip_tags(trim($field_name));
		$val = strip_tags(trim(mysql_real_escape_string($val)));

		//from the fieldname:usn we need to get usn
		$split_data = explode(':', $field_userid);
		$usn = $split_data[1];
		$field_name = $split_data[0];
		if(!empty($usn) && !empty($field_name) && !empty($val))
		{
			mysql_query("UPDATE student SET $field_name = '$val' WHERE usn = '$usn'") or mysql_error();
			echo "Updated";
		} else {
			echo "Invalid Requests1";
		}
	}
} else {
	echo "Invalid Requests2";
}
?>