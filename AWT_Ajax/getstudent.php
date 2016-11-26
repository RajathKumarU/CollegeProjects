<head>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
</head>

<style type="text/css">
table.gridtable {
	font-family: verdana, arial, sans-serif;
	font-size: 20px;
	color: #333333;
	border-width: 1px;
	border-color: #666666;
	border-collapse: collapse;
}

table.gridtable th {
	border-width: 1px;
	padding: 8px;
	border-style: solid;
	border-color: #666666;
	background-color: #dedede;
}

table.gridtable td {
	border-width: 1px;
	padding: 8px;
	border-style: solid;
	border-color: #666666;
	background-color: #ffffff;
}
</style>
<script type="text/javascript">
$(function(){
		
		//acknowledgement message
	    var message_status = $("#status");
	    $("td[contenteditable=true]").blur(function(){
		    
	        var field_userid = $(this).attr("id") ;
	        var value = $(this).text() ;
	        $.post('editstudent.php' , field_userid + "=" + value, function(data){
	            if(data != '')
				{
					message_status.show();
					message_status.text(data);
					//hide the message
					setTimeout(function(){message_status.hide()},3000);
				}
	        });
	    });
});
</script>
<table class="gridtable">
<?php
$usn = $_GET ['usn'];

$con = @mysql_connect ( 'localhost', 'root', 'root' );

if (! $con) {
	die ( 'could not connect: ' . mysql_error () );
}
mysql_select_db ( 'ajax', $con );

$result = mysql_query ( "SELECT * FROM student where usn='$usn';" );
while ( $row = mysql_fetch_array ( $result ) ) {
	$usn = $row ['usn'];
	$name = $row ['name'];
	$sr_number = $row ['sr_number'];
	$semester = $row ['semester'];
	$branch = $row ['branch'];
	$college = $row ['college'];
	$university = $row ['university'];
	?>
	<tr>
		<th>Student Name</th>
		<td id="name:<?php echo $usn;?>" contenteditable="true"><?php echo $name;?></td>
	</tr>
	<tr>
		<th>USN Number</th>
		<td><?php echo $usn;?></td>
	</tr>
	<tr>
		<th>SR Number</th>
		<td id="sr_number:<?php echo $usn;?>" contenteditable="true"><?php echo $sr_number;?></td>
	</tr>
	<tr>
		<th>Semester</th>
		<td id="semester:<?php echo $usn;?>" contenteditable="true"><?php echo $semester;?></td>
	</tr>
	<tr>
		<th>Branch</th>
		<td id="branch:<?php echo $usn;?>" contenteditable="true"><?php echo $branch;?></td>
	</tr>
	<tr>
		<th>College</th>
		<td id="college:<?php echo $usn;?>" contenteditable="true"><?php echo $college;?></td>
	</tr>
	<tr>
		<th>University</th>
		<td id="university:<?php echo $usn;?>" contenteditable="true"><?php echo $university;?></td>
	</tr>
	<?php 
}

?>
</table>

