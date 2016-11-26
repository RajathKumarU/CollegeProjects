<!DOCTYPE html>
<html>
<head>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>

<title>Ajax Demo</title>
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
</head>
<style>
.select-style {
	border: 1px solid #ccc;
	width: 120px;
	border-radius: 3px;
	overflow: hidden;
	background: #fafafa url("img/icon-select.png") no-repeat 90% 50%;
}

.select-style select {
	padding: 5px 8px;
	width: 130%;
	border: none;
	box-shadow: none;
	background: transparent;
	background-image: none;
	-webkit-appearance: none;
}

.select-style select:focus {
	outline: none;
}
</style>
<style>
table, th, td {
	border: 1px solid black;
	border-collapse: collapse;
}

th, td {
	padding: 5px;
}
</style>
<body>

	<form action="">
		<div class="select-style" align="center">
			<select name="customers" onchange="showCustomer(this.value)">
				<option value="">Select a Student</option>
		<?php
		$con = @mysql_connect ( 'localhost', 'root', 'root' );
		
		if (! $con) {
			die ( 'could not connect: ' . mysql_error () );
		}
		mysql_select_db ( 'ajax', $con );
		
		$result = mysql_query ( "SELECT * FROM student;" );
		while ( $row = mysql_fetch_array ( $result ) ) {
			$usn = $row ['usn'];
			$name = $row ['name'];
			?>
			<option value="<?php echo $usn;?>"><?php echo $name;?></option>
			<?php
		}
		
		?>
			</select>
		</div>
	</form>
	<br>
	<br>
	<br>
	<div id="txtHint" align="center">Student info will be listed here</div>

	<script>
		function showCustomer(str) {
  			var xhttp;    
  			if (str == "") {
    			document.getElementById("txtHint").innerHTML = "";
    			return;
  			}
  			xhttp = new XMLHttpRequest();
  			xhttp.onreadystatechange = function() {
    			if (xhttp.readyState == 4 && xhttp.status == 200) {
     				document.getElementById("txtHint").innerHTML = xhttp.responseText;
    			}
  			};
  			xhttp.open("GET", "getstudent.php?usn="+str, true);
  			xhttp.send();
		}
	</script>

</body>
</html>
