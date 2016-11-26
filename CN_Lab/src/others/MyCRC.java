package others;

import java.io.UnsupportedEncodingException;

public class MyCRC {

	public static void main(String[] args) throws UnsupportedEncodingException {
		int crc = 0xffff;
		int poly = 0x1021;

		byte[] b = "123456789".getBytes("ASCII");

		for (byte b1 : b) {
			for (int i = 0; i < 8; i++) {
				boolean bit = ((b1 >> (7 - i) & 1) == 1);
				boolean c15 = ((crc >> 15 & 1) == 1);

				crc <<= 1;

				if (bit ^ c15) {
					crc ^= poly;
				}
			}
		}
		crc &= 0xffff;

		System.out.println("CRC = " + Integer.toHexString(crc));

	}

}
