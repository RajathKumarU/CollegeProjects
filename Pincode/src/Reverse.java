import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.PrintWriter;

public class Reverse {
	public static void main(String[] args) {
		try {
			BufferedReader reader = new BufferedReader(new FileReader(
					"PunePin.txt"));
			PrintWriter p = new PrintWriter(new FileWriter("PunePin1.txt"));
			String line = "";

			while ((line = reader.readLine()) != null) {
				p.print(line.split(",")[1]);
				p.print(",");
				p.println(line.split(",")[0]);
			}

			reader.close();
			p.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
