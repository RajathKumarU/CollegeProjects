package ftp;

import java.awt.BorderLayout;
import java.awt.Container;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.RandomAccessFile;
import java.net.Socket;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;

@SuppressWarnings("serial")
class FTP_Client extends JFrame implements ActionListener {

	JTextField txtFilename, txtsaveas;
	JLabel lblFilename;
	JButton btn;

	@SuppressWarnings("deprecation")
	public FTP_Client() {
		super("File downloader");
		txtFilename = new JTextField(20);
		txtFilename.setText("count.asm");

		lblFilename = new JLabel("Filename");
		btn = new JButton("Load");
		btn.setToolTipText("Click to load file");

		txtsaveas = new JTextField(20);
		txtsaveas.setText("C:/Users/INTEL/Desktop");

		Container con = getContentPane();

		JPanel p = new JPanel();
		p.add(lblFilename);
		p.add(txtFilename);
		p.add(btn);

		JPanel p1 = new JPanel();
		p1.add(txtsaveas);
		con.add(BorderLayout.NORTH, p);
		con.add(BorderLayout.SOUTH, p1);

		btn.addActionListener(this);
		setSize(200, 200);
		show();
		addWindowListener(new WindowAdapter() {
			public void windowClosing(WindowEvent e) {
				System.exit(0);
			}
		});
	}

	public void actionPerformed(ActionEvent e) {
		if (e.getSource() == btn) {
			if (txtsaveas.getText().length() == 0
					|| txtFilename.getText().length() == 0) {
				JOptionPane
						.showMessageDialog(null,
								"Please specify file to download and target filename...");
				return;
			}
			try {
				Socket client = new Socket("192.168.1.35", 2121);
				DataInputStream din = new DataInputStream(
						client.getInputStream());
				DataOutputStream dout = new DataOutputStream(
						client.getOutputStream());
				dout.writeUTF(txtFilename.getText());
				int ack = din.readInt();
				if (ack == 0)
					JOptionPane
							.showMessageDialog(null, "File not found.......");
				else {
					System.out.println("File size = " + ack);
					byte[] data = new byte[ack];
					din.read(data, 0, ack);
					RandomAccessFile rd = new RandomAccessFile(
							txtsaveas.getText(), "rw");
					rd.write(data);
					rd.close();
					JOptionPane.showMessageDialog(null,
							"Downloaded successfully ...");

				}
				client.close();
			} catch (Exception er1) {
				System.out.println(er1);
			}
		}
	}

	public static void main(String v[]) {
		FTP_Client f = new FTP_Client();
		f.setBounds(100, 100, 500, 300);
	}
}
