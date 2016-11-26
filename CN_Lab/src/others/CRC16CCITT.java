package others;

import java.io.UnsupportedEncodingException;

public class CRC16CCITT {

	public static void main(String[] args) throws UnsupportedEncodingException {
		int crc = 0xFFFF; // initial value
		int polynomial = 0x1021; // 0001 0000 0010 0001 (0, 5, 12)

		//byte[] bytes = "123456789".getBytes("ASCII");

		byte[] bytes = args[0].getBytes();
		for (byte b : bytes) {
			System.out.println(b);
		}

		for (byte b : bytes) {
			for (int i = 0; i < 8; i++) {
				boolean bit = ((b >> (7 - i) & 1) == 1);
				boolean c15 = ((crc >> 15 & 1) == 1);
				crc <<= 1;
				if (c15 ^ bit)
					crc ^= polynomial;
			}
		}

		crc &= 0xffff;
		System.out.println("CRC16-CCITT = " + Integer.toHexString(crc));
	}

}
