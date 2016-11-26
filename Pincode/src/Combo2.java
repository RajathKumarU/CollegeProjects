import java.awt.BorderLayout;
import java.awt.EventQueue;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.border.EmptyBorder;
import javax.swing.JComboBox;

import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;

@SuppressWarnings("serial")
public class Combo2 extends JFrame {

	private JPanel contentPane;
	JComboBox<String> comboBoxCity = new JComboBox<String>();
	JComboBox<String> comboBoxArea = new JComboBox<String>();

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					Combo2 frame = new Combo2();
					frame.setVisible(true);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}

	/**
	 * Create the frame.
	 */
	public Combo2() {
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 450, 300);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		contentPane.setLayout(new BorderLayout(0, 0));
		setContentPane(contentPane);

		JPanel panel = new JPanel();
		contentPane.add(panel, BorderLayout.CENTER);

		comboBoxCity.setActionCommand("Selected");
		comboBoxCity.addItem("Mysore");
		comboBoxCity.addItem("Banglore");

		comboBoxCity.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				if (comboBoxCity.getActionCommand().equals("Selected")) {
					comboBoxArea.removeAllItems(); // important task
					System.out.println("Hello");
					if (comboBoxCity.getSelectedItem().equals("Mysore")) {
						comboBoxArea.addItem("KuvempuNagar");
						comboBoxArea.addItem("RamakrishnaNagar");
					} else {
						comboBoxArea.addItem("Indiranagar");
						comboBoxArea.addItem("Whitefield");
					}
				}
			}
		});
		panel.add(comboBoxCity);
		panel.add(comboBoxArea);
	}

}
