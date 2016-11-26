<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Demo page</title>
</head>
<body>
	<%
		String name = (String) session.getAttribute("sessName");
		String pass = (String) session.getAttribute("sessPass");
		String reqNme = request.getParameter("Lname");
	%>

	<h2>
		Name : <%=name%>
	</h2>
	<h2>
		Password : <%=pass%>
	</h2>
	<h2>
		Req Name : <%=reqNme%>
	</h2>
	
	<a href="AnotherPage.jsp">Go to another page</a>
</body>
</html>