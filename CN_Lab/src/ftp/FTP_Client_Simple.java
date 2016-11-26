package ftp;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.RandomAccessFile;
import java.net.Socket;
import java.util.Scanner;

class FTP_Client_Simple {

	public static void main(String[] args) {
		String src_filename, dest_filename;
		Scanner in = new Scanner(System.in);

		System.out.println("Enter the filename to load");
		src_filename = in.nextLine();

		System.out.println("Enter full path name to save");
		dest_filename = in.nextLine();

		try {
			Socket client = new Socket("192.168.1.35", 2121);
			DataInputStream din = new DataInputStream(client.getInputStream());
			DataOutputStream dout = new DataOutputStream(
					client.getOutputStream());
			dout.writeUTF(src_filename);
			int ack = din.readInt();
			if (ack == 0)
				System.out.println("File not found...");
			else {
				System.out.println("File size = " + ack);
				byte[] data = new byte[ack];
				din.read(data, 0, ack);
				RandomAccessFile rd = new RandomAccessFile(dest_filename, "rw");
				rd.write(data);
				rd.close();
				System.out.println("File Downloaded(saved) successfully...");
			}
			client.close();
		} catch (Exception er1) {
			System.out.println(er1);
		}
		in.close();
	}
}
