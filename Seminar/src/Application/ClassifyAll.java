package Application;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

public class ClassifyAll {
	public static void main(String[] args) throws IOException {

		File allFiles = new File("E:/eclipse/workspace/Seminar/InpBenign/");
		String files[] = allFiles.list();

		PrintWriter resWriter = new PrintWriter(new FileWriter(
				"E:/eclipse/workspace/Seminar/Result1.txt"));
		PrintWriter andWriter = new PrintWriter(new FileWriter(
				"E:/eclipse/workspace/Seminar/andResult.txt"));

		for (int filenames = 0; filenames < files.length; filenames++) {

			String filename = files[filenames];
			int c = 0;
			double bytes = 0, kilobytes = 0, freq = 0;
			File f = new File("E:/eclipse/workspace/Seminar/InpBenign/"
					+ filename);
			bytes = f.length();
			kilobytes = (bytes / 1024);
			System.out.println(kilobytes);

			FileInputStream inputStream = null;
			PrintWriter pw = null;
			PrintWriter pw2 = null;
			try {
				inputStream = new FileInputStream(new File(
						"E:/eclipse/workspace/Seminar/InpBenign/" + filename));
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			}

			try {
				pw = new PrintWriter(new FileWriter(
						"E:/eclipse/workspace/Seminar/OutFiles/" + filename
								+ ".txt"));
				pw2 = new PrintWriter(new FileWriter(
						"E:/eclipse/workspace/Seminar/OutFiles/" + filename
								+ "1.txt"));
				int i, count = 0, j = 0;

				do {
					i = inputStream.read();
					if (i != -1) {
						// System.out.printf("%02X - ", i);
						pw.printf("%02X\t", i);
						pw2.print((char) i + "");
					}
					count++;
					j++;

					if (count == 16) {

						pw.println();
						// pw2.println();
						count = 0;
					}
				} while (i != -1);
				pw.close();
				pw2.close();
				BufferedReader br = new BufferedReader(new FileReader(
						"E:/eclipse/workspace/Seminar/OutFiles/" + filename
								+ ".txt"));
				String line, line1 = null, chk = "00000000";
				while ((line = br.readLine()) != null) {
					c++;
					if (c == 14) {
						String arr[] = line.split("\t");
						line1 = arr[8] + arr[9] + arr[10] + arr[11];
						System.out.println(line1);

					}
				}

				String ker = "KERNEL32";
				boolean bl = true;
				BufferedReader br1 = new BufferedReader(new FileReader(
						"E:/eclipse/workspace/Seminar/OutFiles/" + filename
								+ "1.txt"));
				while ((line = br1.readLine()) != null) {
					if (line.contains(ker)) {
						bl = false;
					}

				}
				if (bl == true) {
					System.out.println(files[filenames]
							+ " kernel32 SPYWARE!!!\n");
					resWriter.println((filenames + 1) + ". " + files[filenames]
							+ "\tkernel32 SPYWARE!");
				} //else {

					int dec = 0, linenum = 0, endnum = 0;
					String ln1, ln2, ln3, ln4;
					String startaddr, size;

					BufferedReader br2 = new BufferedReader(new FileReader(
							"E:/eclipse/workspace/Seminar/OutFiles/" + filename
									+ ".txt"));
					while ((ln1 = br2.readLine()) != null) {
						if (ln1.contains("2E\t74\t65\t78\t74")) {
							ln1 = ln1.replaceAll("\t", ",");
							ln2 = br2.readLine();
							ln2 = ln2.replaceAll("\t", ",");
							ln3 = ln1 + ln2;

							String array[] = ln3.split(",");
							for (int k = 0; k < array.length; k++) {

								if (array[k].equals("2E")
										&& array[k + 1].equals("74")
										&& array[k + 2].equals("65")
										&& array[k + 3].equals("78")
										&& array[k + 4].equals("74")) {
									startaddr = array[k + 15] + array[k + 14]
											+ array[k + 13] + array[k + 12];
									size = array[k + 19] + array[k + 18]
											+ array[k + 17] + array[k + 16];
									System.out.println(startaddr + "," + size);
									dec = Integer.parseInt(startaddr, 16);
									linenum = dec / 16;
									endnum = linenum
											+ (Integer.parseInt(size, 16)) / 16;

								}
							}
						}
					}
					br2.close();
					int cnt = 0, nopcnt = 0, andcnt = 0;
					br2 = new BufferedReader(new FileReader(
							"E:/eclipse/workspace/Seminar/OutFiles/" + filename
									+ ".txt"));
					while ((ln4 = br2.readLine()) != null) {
						cnt++;
						if (cnt > linenum && cnt < endnum) {

							String ar1[] = ln4.split("\t");
							for (int k = 0; k < ar1.length; k++) {
								if (ar1[k].equals("90")) {
									nopcnt++;
								} else if (ar1[k].equals("00")) {
									andcnt++;
								}
							}
						}
					}
					System.out.println(nopcnt);
					freq = nopcnt / kilobytes;
					System.out.println(freq);
					if (freq < 1) {
						System.out.println(files[filenames] + " SPYWARE\n");
						resWriter.println((filenames + 1) + ". "
								+ files[filenames] + "\tSPYWARE");
					} else {
						System.out.println(files[filenames] + " BENIGN\n");
						resWriter.println((filenames + 1) + ". "
								+ files[filenames] + "\tBENIGN");
					}
					andWriter.println((filenames + 1) + ". " + files[filenames]
							+ "\t\t" + (andcnt / kilobytes));
				//}
				br.close();br1.close();
			} catch (Exception e1) {
				e1.printStackTrace();

			}
			try {
				inputStream.close();
			} catch (IOException e2) {
				e2.printStackTrace();
			}
		}
		
		resWriter.close();
		andWriter.close();
	}
}