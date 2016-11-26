package java1;

import java.awt.BorderLayout;
import java.awt.Container;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.LinkedList;
import java.util.Random;

import javax.swing.JApplet;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JProgressBar;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;

@SuppressWarnings("serial")
public class RedAlgorithm extends JApplet implements ActionListener {
	JButton b1, b2, b3;
	JTextArea ta1, ta2;
	JLabel l1, l2, l3;
	JPanel p1, p2, p3, p4;
	Container con;
	JScrollPane j1, j2;
	JProgressBar bar;

	Thread t1, t2;
	int packet_limit;
	LinkedList<Integer> que;
	double wq;
	double avg;
	int count;
	double min_thresh;
	double max_thresh;
	double maxp;
	int q;
	String text1, text2;
	boolean flag;

	public void initialize() {

		packet_limit = 10;
		que = new LinkedList<Integer>();
		wq = 0.002;
		avg = 0;
		bar.setValue((int) avg);
		count = -1;
		min_thresh = 1;
		max_thresh = 3;
		maxp = 1.0 / 50;
		q = 0;
		text1 = "";
		text2 = "";
		flag = false;
	}

	public void init() {

		ta1 = new JTextArea(20, 30);
		ta2 = new JTextArea(20, 30);
		j1 = new JScrollPane(ta1, 20, 30);
		j2 = new JScrollPane(ta2, 20, 30);

		b1 = new JButton("Start");
		b2 = new JButton("Stop");
		b3 = new JButton("Reset");

		l1 = new JLabel("Incoming line");
		l2 = new JLabel("Outgoing line");
		l3 = new JLabel("Average");

		p1 = new JPanel();
		p2 = new JPanel();
		p3 = new JPanel();
		p4 = new JPanel();

		bar = new JProgressBar(0, 3);

		con = getContentPane();

		p1.add(l1);
		p1.add(j1);
		con.add(p1, BorderLayout.WEST);

		p2.add(l2);
		p2.add(j2);
		con.add(p2, BorderLayout.EAST);

		p3.add(b1);
		p3.add(b2);
		p3.add(b3);
		con.add(p3, BorderLayout.NORTH);

		p4.add(l3);
		p4.add(bar);
		con.add(p4, BorderLayout.CENTER);

		b1.addActionListener(this);
		b2.addActionListener(this);
		b3.addActionListener(this);

	}

	@SuppressWarnings("deprecation")
	@Override
	public void actionPerformed(ActionEvent e) {
		if (e.getActionCommand().equals("Start")) {

			Runnable r1 = new Runnable() {
				public void run() {
					System.out.println("Running T1");
					int i = 0;
					while (true) {
						text1 += "Average = " + avg + "\t" + "Count = " + count
								+ "\n";
						ta1.setText(text1);

						int packet = GetPacket();
						i++;
						boolean drop = false;

						if (min_thresh <= avg && avg < max_thresh) {
							count++;
							double pb = maxp * (avg - min_thresh)
									/ (max_thresh - min_thresh);
							double pa = pb / (1 - count * pb);

							text1 += "prob = " + pa + "\n";
							ta1.setText(text1);

							if (pa > 0.5) {
								count = 0;
								drop = true;

								text1 += "dropped " + i + " packet of size "
										+ packet + "\n";
								ta1.setText(text1);

							}
						} else if (max_thresh <= avg) {
							count = 0;
							drop = true;

							text1 += "dropped " + i + " packet of size "
									+ packet + "\n";
							ta1.setText(text1);
						} else {
							count = -1;
						}

						if (!drop) {
							que.add(packet);
							q += packet;
							avg = (1 - wq) * avg + wq * q;
							bar.setValue((int) avg);
						}
					}
				}
			};

			Runnable r2 = new Runnable() {
				@SuppressWarnings("static-access")
				public void run() {
					System.out.println("Running T2");
					while (true) {
						try {
							t2.sleep(3000);
							int item = que.removeFirst();
							q -= item;

							text2 += "packet of size" + item
									+ " is transmitted from RED gateway" + q
									+ "\n";
							ta2.setText(text2);
						} catch (Exception e) {
							if (q == 0) {
								avg = 0;
								bar.setValue((int) avg);
							}
						}
					}
				}
			};

			if (!flag) {
				System.out.println("Start clicked");
				t1 = new Thread(r1, "InputThread");
				t2 = new Thread(r2, "OutputThread");
				initialize();
				t1.start();
				t2.start();
				flag = true;
			} else {
				t1.resume();
				t2.resume();
			}

		}
		if (e.getActionCommand().equals("Stop")) {
			System.out.println("Stop clicked");
			t1.suspend();
			t2.suspend();
		}
		if (e.getActionCommand().equals("Reset")) {
			System.out.println("Reset clicked");
			t1.stop();
			t2.stop();
			ta1.setText("");
			ta2.setText("");
			ta1.setText("Click Start to start RED Gateway");
			initialize();
		}
	}

	@SuppressWarnings("static-access")
	public int GetPacket() {

		text1 += "Receiving packet...\n";
		ta1.setText(text1);

		try {
			t1.sleep(new Random().nextInt(3000) + 1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return (new Random().nextInt(21) + 10);
	}

}
