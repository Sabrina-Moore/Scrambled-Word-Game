import { useEffect, useState, useRef } from 'react'
import React from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

import Modal from '@mui/material/Modal';
import Snackbar from '@mui/material/Snackbar';
import './index.css';


//-----------------------------------------------------------------------------

//Stretch milestones: guess panel tracking correct and points, points system, answer snackbar, enter key, scoreboard/leaderboard

//TODO: make enter key also activate guess

//TODO: edge case - are the random words too long to be solvable? do I need to control for length as well as commonality?
//let user choose length or difficulty? Slider? Options? 

//-----------------------------------------------------------------------------
//fixed issues

//Added feature for points system and tracking 

//Issue fixed with edge case where duplicate guesses were adding to total points despite alreadyGuessed check, fixed by handling inside handleGuess()

//issue fixed with streamlining functions and things not executing at the right step - created new function handleGuess() to run states and most execution

//issue fixed with edge case where capital letters not read in user guess - set word and guess to lower in letterCheck()

//Issue fixed with edge case where word generator was using words not found in dictionary API, so added additional dictionary check in searchForWord

//Issue fixed of how to show the real answer - created a snackbar that allows the user to optionally see the real answer

//Issue fixed where site needs to generate a word on website load - currently only fetches word on button click

//Issue fixed where "incorrect" and "correct" helpertext not always updating on guesses

//issue fixed where the guess history panel needs to scroll through containers without container resizing

//Issue fixed with text clutter by moving typography game instructions to a modal component "Click here for instructions"

/*Issue fixed with linking scrambleWord function to searchForWord function: I misunderstood what I was 
getting from the API - I thought I was getting a string, but I was actually receiving an array 
so my split() method was wrong*/



function App() {

  const [word, setWord] = useState(""); //store random word from random word API - used in hash map conversion and checks

  const [guess, setGuess] = useState(""); //store user input

  const [scrambled, setScrambled] = useState(""); //store scrambled string

  const hasInitialized = useRef(false); //to render a scrambled word on website load

  const [isValidGuess, setIsValidGuess] = useState(""); //for textfield error message to user

  const [history, setHistory] = useState([]); //for populating the history array and panel

  const [points, setPoints] = useState(0); //for points

 //------------------------------------------------------------------------
  //rendering check on website load
  useEffect(() => {
  if (hasInitialized.current) return;
  hasInitialized.current = true;

  searchForWord();
}, []);


  //modal states
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const[open2nd, setOpen2nd] = useState(false);
  const handle2ndOpen = () => setOpen2nd(true);
  const handle2ndClose = () => setOpen2nd(false);

  const [openSnackBar, setOpenSnackBar] = useState(false);
  const handleSnackBarClick = () => {setOpenSnackBar(true)};
  const handleSnackBarClose = () => {setOpenSnackBar(false)};

  //------------------------------------------------------------------------
  //get random word from API https://random-word-api.herokuapp.com/word with parameters for length or diff
  //call scrambleWord
  const searchForWord = async () => { //async function
    try { //if no error
      let valid = false; //don't have a valid word yet
      let word = "";

      while (!valid) { //loop until dictionary returns valid word response
        const result = await fetch( //returns a response from word generator
          `https://random-word-api.herokuapp.com/word?number=1&diff=1`
        );

        const data = await result.json(); //stores response (array) from word generator
        word = data[0]; //generator returns an array, and we store the first item in word

        const dictionaryResult = await fetch( //stores response from dictionary
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );

        if (dictionaryResult.ok) { //if true (response is not a 404 error), stop loop
          valid = true;
        }
      }

      //outside of loop if valid
      setWord(word); //saves into state
      console.log("searchForWord", word)

      const scrambled = scrambleWord(word); //call scrambleWord
      setScrambled(scrambled); //set result of scrambleWord and triggers render

      setHistory(prev => [ //add new round to history
      ...prev, 
      {
        word, //original to be pushed when round
        scrambled,
        guesses: []
      }
    ]);
      } catch(error){
        console.error(error);
      }
  };

  //must fetch random word
  //validate word via dictionary API (edge case issue where random word generator generates a word not found in dictionary - often because of tenses)
  //if valid, setWord, call scrambleWord and setScrambled
  //if invalid, loop

  //------------------------------------------------------------------------
  //scramble word - fisher yates shuffle
  const scrambleWord = (tempWord) => {
    //convert word array to array of letters
    const scrambledArr = tempWord.split("");

    //shuffle
    for(let i = scrambledArr.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i+1));
      [scrambledArr[i], scrambledArr[j]] = [scrambledArr[j], scrambledArr[i]];
    }

    console.log("ScrambleWord:", scrambledArr);

    //convert to string and return
    return scrambledArr.join("");
  }
  
  //------------------------------------------------------------------------
//streamline checks

 //------------------------------------------------------------------------
  //check valid letters
 //comparing two hash maps of frequencies of letters
  
 const letterCheck = (word, guess) => {
    word = word.toLowerCase(); //for capital letter edge case with user guesses
    guess = guess.toLowerCase();

    //hash maps
    const wordMap = new Map (); //for frequency of letters in the original word array
    //word is ['g', 'r', 'a', 's', 's,']
    const guessMap = new Map (); //for frequency of letters in guess string (string is still itterable)
    //guess is "grass"
  
    //populate hash maps
    for (const char of word){
      wordMap.set(char, (wordMap.get(char) || 0) + 1) //if word exists, char + 1, if word doesn't exist, + 1
    }
    console.log("word map:", wordMap);
  
    //want the output of "grass" to be g 1, r 1, a 1, s 2
    for (const char of guess){
      guessMap.set(char, (guessMap.get(char) || 0) + 1);
    }
    console.log("Guess map:", guessMap);
  
   //compare frequencies
   //guess does not need to include every letter in the original, but can only include letters provided by the original
    for (const [letter, count] of guessMap) { //destructuring
      if ((wordMap.get(letter) || 0) < count) { //if original word contains at least as many occurences of that letter
        return false;
      }
    }
    return true;
  }


  //------------------------------------------------------------------------
  //check valid word using dictionary API
   const validWordCheck = async (guess) => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${guess}`
      );

      return response.ok;
    } catch(error) {
      return false;
    }
  };

   //------------------------------------------------------------------------
   //helper function to handle states and function execution
   const handleGuess = async () => {
    console.log("User guessed:", guess);

  //letter check
  if (!letterCheck(word, guess)) {
    setIsValidGuess("Try again using only the letters from the scrambled word.");
    console.log("Guess invalid (letter check)");
    return;
  }
  //dictionary API check
  const isRealWord = await validWordCheck(guess);

  if (!isRealWord) {
    setIsValidGuess("Not a real word, but keep trying!");
    historyPanel(guess, false, 0);
    setGuess("");
    console.log("Guess not in dictionary");
    return;
  } 

  const guessAdded = historyPanel(guess, true, guess.length);

  if (guessAdded){
    setIsValidGuess("Correct, nice job!");
    setPoints(prev => prev + guess.length);
  } else {
    setIsValidGuess("You already guessed that word.")
  }
  setGuess(""); //refresh textfield to blank
};
  
  //------------------------------------------------------------------------
// history panel function for history array generation
//tracks both correct and incorrect guesses
 const historyPanel = (guess, value, points) => { //updates history state with new guess
  let guessAdded = false;

  setHistory(prev => {
    if (prev.length === 0) return prev; //if there is no history, do nothing

    const updated = [...prev]; //copy the history array
    const currentRound = updated[updated.length - 1]; //gets the current round  (last element is current round)

    const alreadyGuessed = currentRound.guesses.some( //checks if guess is already in current round
      g => g.guess.toLowerCase() === guess.toLowerCase()
    );

    if (alreadyGuessed){
      guessAdded = false;
      return prev; //if already guessed, do nothing
    }
    
    currentRound.guesses.push({ guess, value, points }); //update state for history rendering
    guessAdded = true;

    return updated;
  });

  return guessAdded;
};

  //------------------------------------------------------------------------
  return (
    <>
    <Box sx={{ display: "flex", gap: 8, p:3, alignItems: "flex-start"}}>
      {/*Left side of screen */}
      <Box sx={{ flex: 1 }}>
          <Container maxWidth="sm">
             {/* Intro text */}
            <Typography 
              variant="h3"
              component="h1"
              sx={{ 
                fontWeight: 700, 
                textAlign: 'center',
                color: 'white',
                mb: 1
                }}>
              Anagramble
            </Typography>
            <Typography variant="subtitle1" sx={{gap: 3, color: 'white', textAlign: 'center'}}>
              Try to find the real word that has been scrambled. 
            </Typography>
            <Typography variant="subtitle1" sx={{gap: 3, color: 'white', textAlign: 'center'}}>
              Your guess does not have to use every letter. 
            </Typography>
            <Typography variant="subtitle1" sx={{gap: 3, color: 'white', textAlign: 'center'}}>
              You can make as many guesses as you want each round to get more points.
            </Typography>
            <Typography variant="subtitle1" sx={{gap: 3, color: 'white', textAlign: 'center'}}>
              Refresh the browser to start a new game.
            </Typography>

            <Button 
              sx = {{
              color: "#199229"
              }}
              onClick={handleOpen}>How To Play
            </Button>

            {/*Game instructions modal */}
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              >
              <Box
                sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: '#16171d',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
                }}>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{textAlign: 'center'}}>
                  How To Play
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'white', textAlign: 'left'}}>
                <ul>
                  <li> Guesses do not need to include every letter from the scrambled word, but they also can't contain any letters not in the scrambled word.  </li>
                  <li> The scrambled word may be in any tense. For example, the dictionary treats "reals" as legitimate. </li>
                  <li> There may be one or more possible real words that work for each scrambled word.</li>
                  <li> For each valid word you guess, you will get points equal to the number of letters.</li>
                </ul>
                </Typography>
                  <Typography variant="subtitle1" sx={{ color: 'white', textAlign: 'left' }}>
                  Play until you beat your personal high score, or until you don't want to play anymore. Thanks for trying my game! </Typography>
              </Box>
            </Modal>
          </Container>
        <Box>

          {/*scrambled word and Text field/user input */}
        <Box
          sx={{
            gap: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            }}>
              {/*Scrambled word */}
          <Container>
            <Box className="visual-box" >
              {scrambled}
            </Box>
          </Container>

          <TextField 
            id="outlined-error-helper-text" 
            label="Type guess here" 
            value={guess}
            helperText={isValidGuess}
            variant="outlined"
            onChange={(e) => setGuess(e.target.value)}
            sx={{
              width: '100%',
              maxWidth: '300px',
              input: { color: 'white', textAlign: 'center' },
              label: { color: 'white' },
              //helper text
              '& .MuiFormHelperText-root': {
                color: 'white', 
                textAlign: 'center'
              },
              //outline border
              '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'var(--accent)' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'var(--accent)' }, 
              }
              }}/>
        </Box>
       {/*Buttons*/}
        <Box
          sx={{
            minHeight: '10vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            }}>
          <Stack spacing={2} direction="row">
            {/*Guess button */}
            <Button 
              variant="contained"
              size="large"
              onClick={handleGuess}
              sx={{ 
                px: 4, 
                bgcolor: 'var(--accent)', 
                '&:hover': { bgcolor: 'var(--accent-border)' } 
                }}>
            Guess
          </Button>
          {/*New Word button */}
          <Button 
            variant="contained"
            size="large"
            onClick={() => {
              setGuess(""); //clears guess
              searchForWord(); //fetch a new word
            }}
            sx={{ 
              px: 4, 
              bgcolor: 'var(--accent)', 
              '&:hover': { bgcolor: 'var(--accent-border)' } 
            }}>
          New Word
          </Button>
        </Stack>
      </Box>

        {/* How this game was made modal */}
      <Container>
        <Button 
            sx = {{
            color: "#199229"
            }}
            onClick={handle2ndOpen}>HOW DOES THE GAME WORK
        </Button>
        <Modal 
              open={open2nd}
              onClose={handle2ndClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              >
              <Box
                sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 500,
                bgcolor: '#16171d',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
                }}>
                <Typography variant="subtitle1" sx={{ color: 'white', textAlign: 'left'}}>
                  This game uses an API - think of it like a database stored on the internet - to generate a random word. </Typography>
                <Typography variant="subtitle1" sx={{ color: 'white', textAlign: 'left' }}>
                  The code then scrambles the word randomly and the player can make their guess by typing in the textfield and pressing a button.  </Typography>
                  <Typography variant="subtitle1" sx={{ color: 'white', textAlign: 'left'}}>
                <ul>
                  <li> The Guess button prompts a series of checks to see if:
                    <ul>
                      <li> the letters in the guess match the original word </li> 
                      <li> the guess is a real word using another API that has the dictionary </li> 
                    </ul>
                  </li>
                  <li> The New Word button prompts a new round where the word generation happens all over again. </li>
                </ul>
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'white', textAlign: 'left' }}>
                  Every time you hit the guess button, so long as the letters are valid, the guess history will update and keep track of your score.</Typography>
               <br/>
                <Typography variant="subtitle1" sx={{ color: 'white', textAlign: 'left' }}>
                  These APIs are not perfect and may produce a word that isn't actually real.
                </Typography>
              </Box>
            </Modal>
      </Container>
    </Box>
  </Box>

        {/* Right side of screen */}
      {/* History Panel as a vertical scroll container*/}
  <Box sx={{ flex: 1 }}>
  <Card
    sx={{
      width: 320,
      height: "80vh",
      bgcolor: "#16171d",
      color: "white",
      border: "1px solid #333",
      position: "sticky",

      display: "flex",
      flexDirection: "column",
    }}
  >
    <CardContent sx={{ display: "flex", flex: 1, flexDirection: "column" }}>
      <Typography variant="h5" gutterBottom>
        Guess History
      </Typography>

      {/* Vertical scroll container */}
  <Box
  sx={{
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    maxHeight: "65vh",
  }}
>
  {history.map((round, roundIndex) => (
    <Box key={roundIndex} sx={{ mb: 3 }}>
      
      {/* Round header */}
      <Typography
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          color: "#90caf9",
          mb: 1,
          letterSpacing: 2,
        }}
      >
       {(round.scrambled ?? "").toUpperCase()}
      </Typography>

      {/* guesses */}
      {round.guesses.map((item, index) => (
        <Card key={index} sx={{ mb: 1, color: "white", bgcolor: "#22242c" }}>
          <CardContent
            sx={{
              py: 1,
              pb: 1,
              display: "flex",
              alignItems: "center",
              gap: 4,
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2">
              {item.guess}
            </Typography>

            <Typography
              variant="body2"
              color={item.value ? "success.main" : "error.main"}
            >
              {item.value ? "✓" : "x"}
            </Typography>
            <Typography variant="body2">
            + {item.points} points
            </Typography>
          </CardContent>
        </Card>
        ))}
        </Box>
      ))}
      </Box>
    </CardContent>
  </Card>
  
  {/* Right side underneath history panel */}
  <Box 
  sx={{ 
    mt: 2, 
    width: 320,
    display: "flex", 
    justifyContent: "space-between",
    alignItems: "center",
    }}>
      
    {/* Total points */}
    <Card sx={{
      minWidth: 120,
      px: 2,
      py: 1,
      bgcolor: "#22242c",
      color: "white",
      textAlign: "center",
      gap: 4
      }}>
      Total Points: {points} 
    </Card>
    {/*Snackbar popup with original word */}
    <Button 
      variant="contained" 
      onClick={handleSnackBarClick}>Answer</Button>
      <Snackbar
      open={openSnackBar}
      autoHideDuration={6000} //6 seconds
      onClose={handleSnackBarClose}
      message={word}
    />
  </Box>

  </Box>
</Box>
</>
)
}

export default App
