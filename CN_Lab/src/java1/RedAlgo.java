package java1;

import java.util.LinkedList;
import java.util.Random;

class red implements Runnable {
	Thread th;
	static int packet_limit = 10;

	static LinkedList<Integer> que = new LinkedList<Integer>();
	static double wq = 0.002;
	static double avg = 0;
	static int count = -1;
	static double min_thresh = 1;
	static double max_thresh = 3;
	static double maxp = 1.0 / 50;
	static int q = 0;

	public void init() {
		th = new Thread(this);
		th.start();

		int i = 0;
		while (true) {

			System.out.println(avg + "\t" + count);

			int packet = GetPacket();
			i++;
			boolean drop = false;

			if (min_thresh <= avg && avg < max_thresh) {
				count++;
				double pb = maxp * (avg - min_thresh)
						/ (max_thresh - min_thresh);
				double pa = pb / (1 - count * pb);
				System.out.println("prob = " + pa);
				if (pa > 0.5) {
					count = 0;
					drop = true;
					System.out.println("dropped " + i + " packet of size "
							+ packet);

				}
			} else if (max_thresh <= avg) {
				count = 0;
				drop = true;
				System.out
						.println("dropped " + i + " packet of size " + packet);

			} else {
				count = -1;
			}
			if (!drop) {
				que.add(packet);
				q += packet;

				avg = (1 - wq) * avg + wq * q;
			}

		}

	}

	public static int GetPacket() {

		System.out.println("Receiving packet..");

		try {
			Thread.sleep(new Random().nextInt(3 * 1000) + 1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		return (new Random().nextInt(21) + 10);
	}

	@Override
	public void run() {
		while (true) {
			try {

				Thread.sleep(3000);
				int item = que.removeFirst();
				q -= item;
				System.err.println("packet of size" + item
						+ " is transmitted from RED gateway" + q);

			} catch (Exception e) {
				if (q == 0) {
					avg = 0;
				}
			}
		}

	}

}

public class RedAlgo {
	public static void main(String[] args) {
		red rd = new red();
		rd.init();
	}
}
