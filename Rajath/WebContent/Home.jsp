<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Home page</title>
</head>
<body>
	<form action="Home.jsp" method="post">
		<table bgcolor="yellow">
			<tr>
				<td>YourName</td>
				<td><input type="text" name="Lname"></td>
			</tr>
			<tr>
				<td>Password</td>
				<td><input type="password" name="Lpass"></td>
			</tr>
			<tr>
				<td><input type="submit" value="Login"></td>
			</tr>
		</table>
		<%
			try {
				String name = request.getParameter("Lname");
				String pass = request.getParameter("Lpass");
				boolean flag = false;

				if (name.equals("xyz") && pass.equals("abc")) {
					flag = true;
					session.setAttribute("sessName", name);
					session.setAttribute("sessPass", pass);
					response.sendRedirect("DemoPage.jsp");
				}

				if (flag == false && !(name.equals(pass.equals(null)))) {
					out.println("<h2><BR><font color=red>Invalid Name or password!!!</font></h2>");
				}

			} catch (Exception e) {

			}
		%>
	</form>
</body>
</html>