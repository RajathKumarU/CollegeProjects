import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

public class SortDelhi {
	public static void main(String[] args) {
		try {
			BufferedReader reader = new BufferedReader(new FileReader(
					"DelhiPin.txt"));
			PrintWriter p = new PrintWriter(new FileWriter("DelhiPin1.txt"));
			List<String> list = new LinkedList<String>();
			String line = "";

			while ((line = reader.readLine()) != null) {
				list.add(line);
			}
			Collections.sort(list);

			for (int i = 0; i < list.size(); i++) {
				p.println(list.get(i));
			}

			reader.close();
			p.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
