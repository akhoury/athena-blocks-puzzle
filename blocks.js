/*


Blocks puzzle
Your niece was given a set of blocks for her birthday, and she has decided to build a panel using 
3”×1” and 4.5”×1" blocks. For structural integrity, the spaces between the blocks must not line up
in adjacent rows. For example, the 13.5”×3” panel below is unacceptable, because some of the 
spaces between the blocks in the first two rows line up (as indicated by the dotted line).
There are 2 ways in which to build a 7.5”×1” panel, 2 ways to build a 7.5”×2” panel, 4 ways to 
build a 12”×3” panel, and 7958 ways to build a 27”×5” panel. How many different ways are there 
for your niece to build a 48”×10” panel? The answer will fit in a 64-bit integer. Write a program to 
calculate the answer. 
The program should be non-interactive and run as a single-line command which takes two 
command-line arguments, width and height, in that order. Given any width between 3 and 48 that 
is a multiple of 0.5, inclusive, and any height that is an integer between 1 and 10, inclusive, your 
program should calculate the number of valid ways there are to build a wall of those dimensions. 
Your program’s output should simply be the solution as a number, with no line-breaks or white 
spaces.
Your program will be judged on how fast it runs and how clearly the code is written. We will be 
running your program as well as reading the source code, so anything you can do to make this 
process easier would be appreciated.
Send the source code and let us know the value that your  program computes, your program’s 
running time, and the kind of machine on which you ran it.


Solution for a 48x10 Panel: 806844323190414
Running time:	0.035 seconds
System:	Intel i5-2410M 2.3GHz, 4GB RAM, 64bit Win 7

after some online reasearch
found a C version runs in 0.1s
      a Java that hangs when height over 8
      a Pearl version runs in 6.58s
	  a Haskell version runs in 0.5s 

Requirements to run the program:
Node.js needs to be installed; 
	which can be downloaded for free from: 	http://www.nodejs.org/#download
After install, just use a terminal to excute: 
	node ~path/athena.js 48 10 	
Or you can just copy the whole text and paste it in Chrome's Inspect Element console, 
but it may become slower to execute and you have to manually change the sampleWidth
and the sampleHeight values below for the desired values.
(may aslo work in firefox firebug <- not tested)
*/
var now = new Date();
//sample values
var  width, height, sampleWidth = 48, sampleHeight = 10;
//var numCPUs = require('os').cpus().length;
//console.log("System has " + numCPUs + " cpus");

if(typeof process == 'undefined')
{
	console.log("Using default values: width: " 
						+ sampleWidth + " height: " + sampleHeight );
	width = sampleWidth;
	height = sampleHeight;
}
else
{
	// takes in console arguments
	 width = process.argv[2];
	 height = process.argv[3];

	 if(width === undefined || height === undefined)
	 {
		console.log("Width or Height undefined, using sample values: width: " 
						+ sampleWidth + " height: " + sampleHeight );
		width = sampleWidth;
		height = sampleHeight;
	 }
}
 //block sizes
 var smallBlock = 3.0, bigBlock = 4.5;
 //few functions declarations .. 
//generates possible permutations of one row using the Permutation generator.
function generateSequence(list) {
	

	var current = PermutationGenerator.getStartSequence(list); // each lists totals permutation is -> factorial(n)/(factorial(x)*factorial(y))

	var count = 1;
	while (true) {
		perms[grandCount] = current; 
		grandCount++;
		current = PermutationGenerator.getNextSequence(current);
		if (current == null) {break; }
	}
}
// this nested loops function will be cused ONLY once on the first layer, or 1st level of the tree
// using bitcomparaison, which is fairly quick on a fairly small array (3329 comparaisons at most when the panel width grows to 48) 
 function firstTimeFittings(mbrdrs, brdrs)
 {
		var i,j;
		var mlngth = mbrdrs.length;
		var lngth = brdrs.length;
		var tot = lngth + mlngth
		var arr = [];
		for(i = 0; i < lngth+mlngth; i++)
			{
				arr[i] = {};
				arr[i].fits = [];
				
			}
		//	lngth
		 for(i = 0; i < lngth ; i++)
		 {
			var fit = arr[i].fits.length;
			for (j = 0; j < mlngth; j++)
			{	
				//console.log(i + "|" + j + "|" + mbrdrs[j] + "|"+ brdrs[i] +"|"+ ((mbrdrs[j] & brdrs[i]) == 0));
				if ( (mbrdrs[j] & brdrs[i]) == 0)
				{
					arr[i].fits[fit] = j+lngth;
					arr[j+lngth].fits[arr[j+lngth].fits.length] = i;
					fit++;
				}
			}
		}
		return arr;
}
//this function is used to clean up the borders array from the non-usefull data anymore, to save memory.
function cleanBorders(brdrs)
{ 	
	var i;
	var g = [];
	for(i = 0; i < brdrs.length; i++)
	{
		g[i] = brdrs[i].fits;
	}
	return g;
}
//this function prepares the "previous" array for the first time to be used
//by function breakTheWall()
function makeTinyPrevArray(brdrs)
{
	//console.log("\nPrev array (2nd row)\n");
	var i,j;
	var p = [];
	for(i = 0; i < brdrs.length; i++)
		p[i] = 0;
		
	for(i = 0; i < brdrs.length; i++)
	{
		//console.log(i+": "+brdrs[i]);
		for(j = 0; j < brdrs[i].length; j++)
		{
			p[brdrs[i][j]] = p[brdrs[i][j]] + 1 ;
		}
	}
	/* 
	console.log("");
	for(i = 0; i < p.length; i++)
		console.log(i+": "+p[i]);
	
	console.log("");
	*/
	
	return p; 
}
//This recursive function uses the benchBorders which is the 'borders' array, a prev array prepared before hand, 
// and how many rows or the height of the panel-2, since we computed the first 2 rows in firstTimeFittings
function breakTheWall(benchBorders, prevArray, rows)
{
	var i,j;
	var lgth = benchBorders.length;
	var nextArray = new Array();
	if(rows > 0)
	{
		for(i = 0; i < lgth; i++)
			nextArray[i] = 0;		
		for(i = 0; i < lgth; i++)
		{
			for(j = 0; j < benchBorders[i].length; j++)
			{
				nextArray[benchBorders[i][j]] = nextArray[benchBorders[i][j]] + prevArray[i];
			}
		}
		return breakTheWall(benchBorders, nextArray, rows-1);
	}
	else 
	{
		var panelTotal = 0;
		for(i = 0; i < prevArray.length; i++)
			panelTotal = panelTotal + prevArray[i];			
		return panelTotal;
	}
}
 // function variables
 var x, y, g, h, hh, j, ee, kk, s = 's', b = 'b', total = 0, elements = new Array(), grandCount = 0, 
		 perms = new Array(), borders = new Array();
var jS=0, jB=0,	 Sborders =[]; Bborders = [];
	 
	var PermutationGenerator = (function () {
		
		var self = {};

		// Get start sequence of given array
		self.getStartSequence = function (list) {
			return list.slice(0).sort();
		};

		// Get next sequence from given array
		// Ref: http://en.wikipedia.org/wiki/Permutation#Systematic_generation_of_all_permutations
		self.getNextSequence = function (list) {
			
			// Make clone
			var a = list.slice(0);

			//The following algorithm generates the next permutation lexicographically after a given permutation. It changes the given permutation in-place.
			//  1. Find the largest index k such that a[k] < a[k + 1]. If no such index exists, the permutation is the last permutation.
			var k = -1;
			for (var i = 0; i < a.length - 1; ++i) {
				if (a[i] < a[i + 1]) { k = i; }
			}
			if (k == -1) return null; // means this is the last one

			//  2. Find the largest index l such that a[k] < a[l]. Since k + 1 is such an index, l is well defined and satisfies k < l.
			var l = -1;
			for (var i = 0; i < a.length; ++i) {
				if (a[k] < a[i]) { l = i };
			}
			if (l == -1) return null; // impossible

			//  3. Swap a[k] with a[l].
			var tmp = a[k]; a[k] = a[l]; a[l] = tmp;

			//  4. Reverse the sequence from a[k + 1] up to and including the final element a[n].
			var next = a.slice(0, k + 1).concat(a.slice(k + 1).reverse());
			
			return next;
		};

		return self;
	} ());

function initialCombinations()
{
	 //checking for correct combinations
	 for(x = 0, y = 0 ; x < parseInt(width/smallBlock)+1; x++)
	 {
	  y = (width-smallBlock*x)/bigBlock;
	  if ( ((width-smallBlock*x)%bigBlock) == 0) 
	  { 
	   var n = x+y;
	   g = 0;
	   for(;g<x;g++)
		elements[g] = s;
	   for(h = g; h < n; h++)
		elements[h] = b;
		generateSequence(elements);	
	  }    
	 }
}
function bitReplace()
{
	 //replacing the blocks chars by bit representations
	for(j = 0; j < perms.length; j++)
	{
		var t = perms[j];
		var tmp = '';	
		for (hh = 0; hh < t.length-1; hh++)
		{
			if(t[hh]=='s')
			{
				tmp = '10';
			}
			else if(t[hh] == 'b')
			{	
				tmp = '100';
			}
			
			if(hh == 0)
			{
				borders[j] = tmp;	
			}
			else 
			{
				borders[j] = tmp+borders[j];
			}
		}
		borders[j] = parseInt(borders[j], 2);
		if (t[0] == 's') {
			Sborders[jS] = borders[j];
			jS++;
			} 
			else {
			Bborders[jB] = borders[j];
			jB++;
			}	
	}
}
if((width == smallBlock) || (width == bigBlock))
{
	console.log('1');
}
else 
{
	initialCombinations();
	bitReplace();
	//Only the first layer gets bitwise-bruteForced comparaison with the second
	borders = firstTimeFittings(Sborders, Bborders);
	if(height > 1)
	{
		//final preps
		borders = cleanBorders(borders);
		var prev = makeTinyPrevArray(borders);
		//final call, HEIGHT-2 since the first two rows were computed previously.
		console.log(breakTheWall(borders, prev, height-2));
	}
	else
	{
		console.log(borders.length);
	}
}
console.log("\n" + ((new Date())-now)/1000 + " seconds.");
 
