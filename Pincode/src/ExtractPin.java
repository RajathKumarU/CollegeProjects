import java.io.FileWriter;
import java.io.PrintWriter;

import com.jaunt.Elements;
import com.jaunt.UserAgent;

public class ExtractPin {
	public static void main(String[] args) {
		try {
			String area = "", pin = "";
			PrintWriter p = new PrintWriter(new FileWriter("DelhiPin.txt",true));
			UserAgent userAgent = new UserAgent();
			userAgent
					.visit("http://www.mapsofindia.com/pincode/india/delhi/west-delhi/");
			Elements e = userAgent.doc
					.findEvery("<table cellpadding=4 cellspacing=0 align=\"center\" border=\"0\" class=extrtable width=\"90%\">");
			String str1 = e.innerHTML();
			String htm[] = str1.split("</a>");
			for (int i = 0; i < htm.length - 1; i++) {
				if (i % 2 == 0) {
					String str2[] = htm[i].split(".html\">");
					area = str2[str2.length - 1].trim();
					System.out.print(area);
					p.print(area);
				} else {
					String str3[] = htm[i].split("</b>");
					String str4[] = str3[0].split("<b>");
					pin = str4[str4.length - 1].trim();
					System.out.println("," + pin);
					p.println("," + pin);
				}
			}
			p.close();
		} catch (Exception e1) {
			e1.printStackTrace();
		}
	}
}
