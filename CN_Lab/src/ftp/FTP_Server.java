package ftp;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.RandomAccessFile;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;

class FileManager {
	public static byte[] GetContent(String file) {
		byte data[] = null;
		try {
			RandomAccessFile rd = new RandomAccessFile("D:/tasm/mp/" + file,
					"r");
			data = new byte[(int) rd.length()];
			rd.readFully(data);
			rd.close();
		} catch (Exception e) {
			System.out.println(e);
		}
		return data;
	}
}

class FTP_Server {
	@SuppressWarnings("resource")
	public static void main(String v[]) {
		ServerSocket s = null;

		try {
			s = new ServerSocket(2121);
			System.out.println("Socket created successfully at port 2121");
			System.out.println("Ip Address :" + InetAddress.getLocalHost());
		} catch (Exception e) {
			System.out.println(e);
			System.exit(0);
		}

		while (true) {
			try {
				Socket client = s.accept();
				System.out.println("Request received from " + client);
				DataInputStream din = new DataInputStream(
						client.getInputStream());
				DataOutputStream dout = new DataOutputStream(
						client.getOutputStream());

				String filename = din.readUTF();
				System.out.println("Request file  :" + filename);
				byte[] data = FileManager.GetContent(filename);
				if (data.length == 0)
					dout.writeInt(0);
				else {
					System.out.println("File size = " + data.length);
					dout.writeInt((int) data.length); // file found , so send
														// filesize
					dout.write(data, 0, data.length); // write content
				}
				din.close();
				dout.close();
				client.close();
			} catch (Exception e) {
				System.out.println(e);
			}
		}
	}
}
