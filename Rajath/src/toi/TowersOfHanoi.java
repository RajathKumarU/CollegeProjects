package toi;

import java.awt.*;
import java.awt.Graphics;
import java.awt.event.*;
import java.util.*;
import java.applet.Applet;

class TowersThread extends Thread
{
    TowersOfHanoi towers;
    int numDiscs = 3;
    
    TowersThread( TowersOfHanoi t, int n )
    {
        towers   = t;
        numDiscs = n;
    }


    /* *********************************************** */ 
    /* THIS IS THE SUBROUTINE YOU MUST WRITE!          */
    /* *********************************************** */     
    /* MoveDiscs(int from, int to, int aux, int n)     */
    /*                                                 */ 
    /* int from is the source tower                    */
    /* int to   is the destination tower               */
    /* int aux  is the auxiliary or intermediate tower */
    /* int n    is the number of discs to move         */    
    /* *********************************************** */
    /* You do NOT need to modify any code outside this */
    /* outside this subroutine.                        */
    /* *********************************************** */  
  
    public void MoveDiscs( int from, int to, int aux, int n )
    {

        /* ************************************ */
        /* ************************************ */
        /*           Add your code here         */
        /* ************************************ */
        /* ************************************ */

    }

    /* *********************************************** */    
    /* ********       END OF SUBROUTINE       ******** */
    /* *********************************************** */





    /* *********************************************** */    
    /* *********************************************** */    
    /*     IGNORE EVERYTHING FROM THIS POINT BELOW     */
    /* *********************************************** */    
    /* *********************************************** */    

    /* CALL THIS SUBROUTINE TO MOVE A SINGLE DISK
     * Parameters:  from: tower that you're moving top disk from
     *              to:   tower that you're moving top disk to
     */
    public void MoveSingleDisc( int from, int to )      
    {
        towers.selectTower(from);
        try {
            Thread.sleep(500);
        }
        catch (InterruptedException e) { System.exit(1); }
        towers.statusF.setText(towers.game.moveDisc(from, to));
        towers.numMoves.setInt( towers.game.getNumMoves() );
        towers.deselectTower();
        towers.tower[to].repaint();
        towers.tower[from].repaint();
        try {
            Thread.sleep(500);
        }
        catch (InterruptedException e) { System.exit(1); }
    }

    public void run()
    {
        MoveDiscs(0, 2, 1, numDiscs);        
    }
}
/*
  Towers of Hanoi applet taken directly from the work of
  Zane Purvis at NC State University

 */ 
public class TowersOfHanoi  extends Applet implements ActionListener
{

    /** array containing each of the tower canvas */
    TowerCanvas[] tower = new TowerCanvas[TowersOfHanoiGame.NUM_TOWERS]; 
    
    /** controls the flow of the game and makes sure user doesn't cheat */ 
    public TowersOfHanoiGame game; 
    
    // these are used during the selection and moving of discs.
    private int fromTower;
    private boolean sourceSelected = false;

    // Status text field
    TextField statusF;
    // Autosolve button
    Button bSolve;
    
    /** shows the number of moves the player has made. */
    IntField numMoves; 
      
    /** shows the number of discs in the current game */
    IntField numDiscsField;
    
           
    private final int DEFAULT_NUM_DISCS = 3;
  
    public void init() {
        int width = Integer.parseInt( getParameter("width") );
        int height = Integer.parseInt( getParameter("height") );
        int numDiscs = DEFAULT_NUM_DISCS;
        
        resize(width, height);        
        setLayout( new GridLayout(1,4) ); // prepare the UI for components
        
        game = new TowersOfHanoiGame(numDiscs); 

        // add each of the towers to the UI
        for (int i=0; i < game.NUM_TOWERS; i++){
            tower[i] = getTowerCanvas(i);
            add( tower[i] );
        }             
        
        add ( MakeStatusPanel() );
        numDiscsField.setInt( game.NUM_DISCS );
    }
    
    public void actionPerformed(ActionEvent event)
    {
        Thread drawThread;
        Object cause = event.getSource();
        if (cause == bSolve)
        {
            statusF.setText("Solving "+ game.NUM_DISCS +
                            " discs");
            // restart game
            newGame(game.NUM_DISCS);
            drawThread = new TowersThread(this, game.NUM_DISCS);
            drawThread.start();
        }
    }

    
    /** 
     * Sets up the game w/ the correct # of discs and
     * sets up the user interface for the game. 
     */
    public void newGame(int numDiscs) {
        game = new TowersOfHanoiGame(numDiscs); 

        // edit each of the towers in the UI so it displays the new peg
        for (int i=0; i < game.NUM_TOWERS; i++){
            tower[i].setPeg(game, i);
            tower[i].repaint();
        }
        
        numMoves.setInt(0);
        numDiscsField.setInt(numDiscs);
        repaint();
    }
       
    /**
     * Generates a canvas representing a specific
     * tower in the game.
     *
     * @param towerNum
     *    specified which tower to represent
     *
     * @return a canvas representing the tower specified,
     *    including it's action listener
     */
    TowerCanvas getTowerCanvas(int towerNum) {
        TowerCanvas tower = new TowerCanvas(game, towerNum);
        tower.addMouseListener(new TowerEar(towerNum));
        return tower;
    }
   

    
    /**
     * Gets the panel showing the towers.
     *
     * @return <code>Panel</code> containing graphical, clickable 
     *    representations of each of the towers
     * <p>
     * NOTE:  This method should only be called after <code>game</code>
     *    has been initialized.     
     */
    Panel getTowerPanel() {
        Panel towerPanel = new Panel();
        towerPanel.setLayout( new GridLayout(1,game.NUM_TOWERS) );
              
        for (int i = 0; i < tower.length; i++) {
            tower[i] = new TowerCanvas(game,i);      
            tower[i].addMouseListener(new TowerEar(i));           
            towerPanel.add(tower[i]);      
        } 
        
        return towerPanel;   
    }
    
    
    /**
     * makes the panel showing game status.
     * <p>
     * NOTE:  This method should only be called after <code>game</code>
     *    has been initialized.     
     *
     * @return a <code>Panel</code> containing status of the game.
     *    This includes 
     *    the number of moves the player has made.
     */
    public Panel MakeStatusPanel()
    {
        // for the JSlider
        final int MIN_DISCS = 1;
        final int MAX_DISCS = 20;
        int tickSpacing = 2;       
  
        Panel statusPanel = new Panel();
        statusPanel.setLayout( new GridLayout(6, 1) );

        // add textfield for status
        statusPanel.add(new Label("Status:"));
        statusF = new TextField(20);
        statusF.setText("Click disk to move");
        statusPanel.add(statusF);

        // add autosolve button
        bSolve = new Button("AutoSolve");
        bSolve.addActionListener(this);
        statusPanel.add(bSolve);
        // add the number of moves the player has made
        numMoves = new IntField(3);
        numMoves.setLabel("Moves:");
        numMoves.setInt(game.getNumMoves());
        numMoves.setEditable(false);
        statusPanel.add(numMoves);        
        
        
        // add the disc selecter
        statusPanel.add( new Label("Number of discs:") );
        statusPanel.add(MakeSelector());
        
        
        return statusPanel;  
    }
    
    
    public Panel MakeSelector()
    {
        Panel selector = new Panel();
        selector.setLayout( new GridLayout(1,3) );
        
        // make - button...
        Button less = new Button("-");
        less.addActionListener( 
            new ActionListener() {
                public void actionPerformed( ActionEvent evt ) {
                    if (game.NUM_DISCS == 1) {
                        /* */                      
                    } else {
                        newGame(game.NUM_DISCS - 1);
                    }
                }
            }
        );
        
        // make + button...
        Button great = new Button("+");
        great.addActionListener( 
            new ActionListener() {
                public void actionPerformed( ActionEvent evt ) {
                    if (game.NUM_DISCS > 9) {
                        /* */                      
                    } else {
                        newGame(game.NUM_DISCS + 1);
                    }
                }
            }
        );
        
        numDiscsField = new IntField(2);
        numDiscsField.setEditable(false);
        
        selector.add(less);
        selector.add(numDiscsField);
        selector.add(great);
        
        return selector;        
    }

    

    

    /**
     * Selects a tower as the source tower.  
     *
     * @param towerNum
     *    the number of tower to move the disc from.
     *    If <code>tower[towerNum]</code> is empty, then
     *    no changes occur.
     */
    public void selectTower(int towerNum) {
        
        // don't do anything if the tower clicked on is empty.
        if ( game.isTowerEmpty(towerNum) ) return; 
               
        fromTower = towerNum;
        tower[fromTower].setSelected(true);
        tower[fromTower].repaint();
        sourceSelected = true;        
    }
    
    
    /**  Deselects the currently selected tower (if any). */
    public void deselectTower() {
        tower[fromTower].setSelected(false);
        tower[fromTower].repaint();         
        sourceSelected = false;
    }
    
    
    /**
     * Moves a disc from one tower to another.
     *
     * @param from
     *    number of the tower to move the disc off of.
     * @param to
     *    number of the tower to move the disc to.
     */
    public void moveDisc(int from, int to)      
    {

        statusF.setText(game.moveDisc(from, to));
        numMoves.setInt( game.getNumMoves() );
        
        deselectTower();
        tower[to].repaint();
        tower[from].repaint();
            
    }
 
    
    
    
       
    /**   
     * Listens out for a mouse click on a tower.
     * (I love inner classes :)) 
     */
    class TowerEar extends MouseAdapter {
        /** the number of the tower this is to listen for */
        private final int TOWER_NUM;
        
        /** 
         * @param towerNum
         *    array index corresponding to position in <code>tower</code>
         *    array.  This ear listens and sends messages to that tower.
         */
        public TowerEar(int towerNum) {
            super();
            TOWER_NUM = towerNum;
        }
        
        public void mouseReleased(MouseEvent evt) {          
            if ( sourceSelected && (fromTower == TOWER_NUM) ) {
                // if they clicked the source tower as the target,
                // then deselect the tower this ear belongs to.
                deselectTower();
                statusF.setText("Deselected tower "+ TOWER_NUM);
            } else if (sourceSelected) {
                // if a source tower has already been selected,
                // then move the disc.
                moveDisc(fromTower, TOWER_NUM);        
                deselectTower();
            } else {
                // they haven't selected a source, so this is it.
                selectTower(TOWER_NUM);
                statusF.setText("Selected tower "+ TOWER_NUM);
            }
        }
    }
}

/**
 * This is an implementation of the legendary "Towers of Hanoi" game. 
 * <p>
 * 
 * <p>
 * The towers are implemented using an array of <code>Stack</code> objects.  
 * Each <code>Stack</code> holds several <code>Integer</code> objects, 
 * whose values correspond to the size of a disc.  A disc can be moved from 
 * one tower to another using the <code>moveDisc</code> method. 
 *
 * @author    <a href="mailto:zdpurvis@unity.ncsu.edu?subject=TowersOfHanoi">
 *            Zane D. Purvis</a> <br>
 *            December 20, 1999
 *   
 */
class TowersOfHanoiGame {

    /** number of pegs used in the game, by tradition 3. <p>
        NOTE:  If this value is changed, then getMinNumMoves will
        no longer return the correct result.  */
    public static final int NUM_TOWERS = 3; 
    
    /** 
     * Array of towers to hold the discs.  Each disc is represented 
     * by an <code>Integer</code> object whose value is the 
     * size of the disc. 
     */
    private Stack[] tower = new Stack[NUM_TOWERS];  
    
    /** number of discs in this game */
    public final int NUM_DISCS;                    
    
    /** number of successful moves */
    private int numMoves = 0; 
       
             
    /**
     * Creates a new TowersOfHanoi game with specified number of discs.
     *
     * @param numDiscs    
     *    number of discs to be moved around in this game.  
     *    If <code>numDiscs < 1</code>, then a default of 3 is used.
     */
    public TowersOfHanoiGame(int numDiscs){
        
        // check to see that this is a valid number of discs
        if (numDiscs < 1) {
            NUM_DISCS = 3;
        } else {
            NUM_DISCS = numDiscs;
        }
              
        // initialize the tower array 
        for (int i = 0; i < tower.length; i++) tower[i] = new Stack();
        
        // add all discs to tower[0] in order of size, with smallest last
        // (smallest on top) 
        for (int i = 0; i < NUM_DISCS; i++){
            tower[0].push( new Integer(NUM_DISCS - i) );       
        }
    }    
    
    
    /**
     * Moves a disc from one tower to another.  Towers are numbered
     * from 0 to (NUM_TOWERS - 1).  Discs are always placed on the
     * top of tower.  A disc cannot be placed on a tower whose
     * size is less than its own.  
     *
     * @param fromTower    tower to move the disc from
     * @param toTower      tower to place the disc on
     * @exception EmptyTowerException    
     *    attempt to move a disc off an empty tower
     * @exception LargeOnSmallDiscException     
     *    attempt to place a disc on a smaller disc
     * @exception GameWonException    
     *    thrown when the game is won
     */
    public String moveDisc(int fromTower, int toTower) 
    {
        
        // it makes no sense to move a disc right back onto the 
        // tower is already on.  
        if ( fromTower == toTower ) return "Nonsense move!";
        
        // can't move a disc off an empty tower
        if ( isTowerEmpty(fromTower) ){
            return "Empty tower!";
            
        // make sure the destination tower is not empty since
        // you can't peek at an empty <code>Stack</code>   
        // Then, compare disc sizes -- can't place large on small.    
        } else if ( !isTowerEmpty(toTower)  &&  
                    ( ( (Integer)tower[fromTower].peek() ).intValue() > 
                     ( (Integer)tower[toTower].peek() ).intValue()) ) {
            // cannot put a large disc on top of a smaller one
            return "Illegal move!";
        
        // This is a legal move...    
        } else {
            // move disc from tower[fromTower] to tower[toTower]
            tower[toTower].push( tower[fromTower].pop() );
            numMoves++;  // update # of sucessful moves
            if ( hasWon() ) 
              return "Game Won!!!";
            return "Legal move.";
        }
    }
    
    
    /**
     * Has game been won?
     * The game has been won when all of the discs are on a single
     * tower that is not the tower that they all started on  
     * (<code>tower[0]</code>).
     *
     * @return <code>true</code> if the game has been won, 
     *         else <code>false</code>.
     */
    public final boolean hasWon() {
        // check each tower except for 0 (all discs started on 0)
        // to see if it contains all discs.
        // if so, then the game is won.
        for (int i=1; i < NUM_TOWERS; i++) {
            if ( tower[i].size() == NUM_DISCS ) {
                return true;  // the game is won 
            }         
        }         
        return false;  // game has not been won
    }
    
    
    /**
     * How many legal moves were made?
     *
     * @return number of successful moves made in game.
     */
    public int getNumMoves() {
        return numMoves;
    }
    
    
    /**
     * What's the minimum number of moves required to win
     * a game with this many discs?.
     * 
     * If n is the number of discs, then it will take
     * 2<super>n</super> - 1 moves minimum to win the game.  
     *
     * @param n
     *    the number of discs in a game
     * @return the minimum number of moves required to win
     *    a Towers of Hanoi game with <code>numDiscs</code>
     *    discs.  
     */
    public static int getMinNumMoves(int n) {
        return ((int)java.lang.Math.pow( (double)2, (double)n ) - 1);
    }
    
    
    /**
     * What's the minimum number of moves required to win this game?
     *
     * @return the minimum number of moves required to win this game,
     *    considering the number of discs used in this game.   
     */
    public int getMinNumMoves() {
        return getMinNumMoves(NUM_DISCS);
    }


    /** Is a specified tower empty? */
    public boolean isTowerEmpty(int towerNum) {
        return tower[towerNum].isEmpty();
    }

    
    /**
     * Gets the number of discs in a specified tower.
     * Towers are numbered 0 through (NUM_TOWERS-1)     
     * 
     * @param tower
     *     the number of the tower of interest.
     * @return number of discs in the specified tower.
     */
    public int getTowerSize(int towerNum) {
        return tower[towerNum].size();
    }
    
    
    /** 
     * Gets the size of a disc in a specified tower.
     * Towers are numbered 0 through (NUM_TOWERS-1)
     *
     * @param towerNum
     *    the number of the tower of interest.
     * @param index
     *    the position in the tower of interest that the
     *    disc is located at.
     * @return size of the specified disc.  
     * @see getTowerSize
     */
    public int getDiscSize(int towerNum, int index) {
        Integer disc = (Integer) tower[towerNum].elementAt(index);
        return disc.intValue();
    }     
}

/**
 * A <code>TowerCanvas</code> object is used to graphically 
 * represent one of the towers in a <code>TowersOfHanoi</code> 
 * object.  Each disc is represented by a rectangle.  The size
 * of each disc is determined by the total number of
 * discs in the <code>TowersOfHanoi</code> object and the
 * size of the graphics context allotted to it.
 *
 * @see TowersOfHanoi
 *
 * @author   <a href="mailto:zdpurvis@unity.ncsu.edu?subject=TowerCanvas">
 *           Zane D. Purvis </a><br>
 *           December 22, 1999
 */
class TowerCanvas extends Canvas {
 
    /** if this tower has been clicked on as a source tower,
     *  then it should draw itself differently. */
    private boolean selected = false;
    
    
    /** Reference to the <code>TowersOfHanoi</code>
     *  object this helps to represent. */
    private TowersOfHanoiGame game;
      
    /** The number (or index) of the tower in <code>game</code>
     *  this represents. */
    private int pegNum;
    
    
    /** The color of the discs */
    private Color discColor = Color.orange;   
    private Color selectedDiscColor = Color.red;
    /** height, in pixels, of the platform. */
    private int platformHeight = 3;   
 
    private final int ROUND_FACTOR = 3;
    /**
     * Creates a new <code>TowerCanvas</code> when given
     * the <code>TowersOfHanoi</code> object and the
     * index of the tower to represent.
     *
     * @param game     
     *    the game this tower is linked to.
     * @param peg 
     *    index of the tower in <code>game</code>
     *    this tower represents.
     */
    public TowerCanvas(TowersOfHanoiGame game, int peg) {
        setPeg(game, peg);
    }  
    
    
    /**
     * Sets the peg that this canvas represents.
     *
     * @param game
     *    A <code>TowersOfHanoi</code> that contains the peg this
     *    is to represent.
     * @param peg
     *    The peg in <code>game</code> that this canvas is to represent.
     */
    public void setPeg(TowersOfHanoiGame game, int pegNum) {
        this.game = game;
        this.pegNum = pegNum;
    }
    
    
    /** 
     * Sets the platform height in pixels.  
     *
     * @param h
     *    The height of the platform in pixels.  This affects the size
     *    of the discs.  If negative, the previous height of the 
     *    platforms is retained.  
     */
    public void setPlatformHeight(int h) {
        if (platformHeight > 0) {
            platformHeight = h;
        }
    }
    
    /**
     * Gets the platform height in pixels.
     *
     * @return Platform height in pixels.  The default is 3.
     */ 
    public int getPlatformHeight() {
        return platformHeight;
    }
    
    
    /** Sets the color used to draw the discs. */
    public void setDiscColor(Color discColor) {
        this.discColor = discColor;
    }
    
    /** Gets the color used to draw the discs */
    public Color getDiscColor() {
        return discColor;
    }
    
    /** Is the tower this Canvas represents empty? */
    public boolean isEmpty() {
        return game.isTowerEmpty(pegNum);
    }
    
    /** 
     * Returns the number of discs in the tower this canvas
     * represents. 
     */     
    public int getNumDiscs() {
        return game.getTowerSize(pegNum);
    }
    
    /** Selects the top-most disc on this peg. 
     * @param sel
     *    Whether or not the top-most disc on this peg
     *    is selected.
     */
    public void setSelected(boolean sel) {
        selected = sel;
    }
    
    /** Does this peg contain a disc that is selected? */
    public boolean isSelected() {
        return selected;
    }
    
    
    /** 
     * Paints the tower to a graphics context.
     * Each disc on the tower is represented by a rectangle.
     * The size of each rectangle is dependant on the total
     * number of discs in the TowersOfHanoi game and the 
     * size of this component.
     * 
     * @param g    a graphics context
     */
    public void paint(Graphics g) {  
        // -- Draws the base and vertical peg --
        int scaleFactor = getSize().width / game.NUM_DISCS;
        int center = getSize().width / 2;
        
        // the height of a disc.  
        // +1 is to accomodate for the white
        // area above the peg.  
        int discHeight = (getSize().height - platformHeight) 
                               / (game.NUM_DISCS + 1);
                               
        // draw the peg.  There is a discHeight space above the peg.
        g.setColor( new Color(92, 61, 36) ); // 92,61,36 is burnt sienna
        g.fill3DRect( (center-(platformHeight/2)), discHeight, 
                      platformHeight*2, getSize().height, true );
        
        // draw the base
        g.fill3DRect( 0, getSize().height-platformHeight, 
                   getSize().width, platformHeight, true);
        
        

        // -- Draws the discs. --        
        int discSize;  // relative size of disc being drawn
        
        // dimensions of graphical representation of disc
        int discWidth; // actual width of disc being drawn

        // coordinate of upper-left corner of graphical disc
        int startX;  
        int startY;
        boolean sel = false; // used when drawing a "selected" disc

        g.setColor( discColor );
            
        // draw each disc, starting with the bottom of tower
        // may have to draw the last one (top) differently 
        // if this tower is selected.
        for (int i = 0; i < game.getTowerSize(pegNum); i++) {
            discSize = game.getDiscSize(pegNum, i);
            discWidth = scaleFactor * discSize;
       
            startX = center - (discWidth / 2);
            startY = getSize().height - ((i+1) * discHeight) 
                     - platformHeight;
                     
            // if this tower is selected and it's the top disc,
            // then set the bevel to false (going in)
            if ( selected && ( (game.getTowerSize(pegNum)-1) == i) ) {
               sel = true;
            }
            
            // this draws the disc
            if (sel)
                // draw selected disc another color
                g.setColor(selectedDiscColor);
                
            g.fillRoundRect(startX+1, startY, discWidth, discHeight,
                            discWidth/ROUND_FACTOR,discHeight/ROUND_FACTOR);
           
        }                
    }
}

// TowersOfHanoi.java
//
// Taken from applet created by Zane D. Purvis
//
// Provides a graphical user interface for a TowersOfHanoi object that is 
// available using a Java 1.1 compatible web-browser.


/* Eric Jewart
   11/13/97
*/
// mod 7/22/99 dr

class IntField extends java.awt.Panel
{
    private TextField myField;
    private Label myLabel;

    public IntField()
    {
	myField = new TextField();
	setLayout(new BorderLayout());
	add("Center", myField);
    }

    public IntField(int cols)
    {
	myField = new TextField(cols);
	setLayout(new BorderLayout());
	add("Center", myField);
    }

    public IntField(int num, int cols)
    {
	myField = new TextField("" + num, cols);
	setLayout(new BorderLayout());
	add("Center", myField);
    }

    public int getInt()
    {
        try
        {
            int num = Integer.parseInt(myField.getText());
            return num;
        }
        catch (NumberFormatException ex)
        {
            return 0;
        }
    }

    public void setInt(int num)
    {
        myField.setText(Integer.toString(num));
    }

    public void setInt()		// dr
    {					// dr
        myField.setText("");		// dr
    }					// dr
        
    public void addLabel(String lab)		
    {
	if (myLabel == null) {
	    myLabel = new Label(lab);
	    remove(myField);
	    add("West", myLabel);
	    add("Center", myField);
	}
	else myLabel.setText(lab);
    }

    public void setLabel(String lab)
    {
	addLabel(lab);
    }

    public void setEditable(boolean b)
    {
	myField.setEditable(b);
    }

    public int getColumns()
    {
	return myField.getColumns();
    }
}

