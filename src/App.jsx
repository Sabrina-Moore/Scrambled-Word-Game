import { useEffect, useState } from 'react'
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
import './index.css';


//-----------------------------------------------------------------------------
//TODO: edge case issue where "incorrect" and "correct" helpertext not always updating on guesses

//TODO: do I need to change API's?

//TODO: edge case - are the random words too long to be solvable? do I need to control for length as well as commonality?
//let user choose length or difficulty? Slider? Options? 

//TODO: needs to generate a word on website load - currently only fetches word on button click

//-----------------------------------------------------------------------------
//fixed issues

//Issue fixed with text clutter by moving typography game instructions to a modal component "Click here for instructions"

//Issue fixed with linking scrambleWord function to searchForWord function: I misunderstood what I was 
//getting from the API - I thought I was getting a string, but I was actually receiving an array 
//so my split() method was wrong



function App() {

  const [word, setWord] = useState(""); //store random word from random word API - used in hash map conversion and checks

  const [guess, setGuess] = useState(""); //store user input

  const [scrambled, setScrambled] = useState(""); //store scrambled string

  const [isValidGuess, setIsValidGuess] = useState(""); //for textfield error message to user

  const [history, setHistory] = useState([]); //for populating the history array and panel


  //modal states
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const[open2nd, setOpen2nd] = useState(false);
  const handle2ndOpen = () => setOpen2nd(true);
  const handle2ndClose = () => setOpen2nd(false);

  //------------------------------------------------------------------------
  //get random word from API https://random-word-api.herokuapp.com/word with parameters for length or diff
  const searchForWord = () => {
    fetch(`https://random-word-api.herokuapp.com/word?length=5&number=1&diff=1`) //add user input for length instead
      .then((response) => (response.json()))
      .then((data) => {
        setWord(data[0]); //set word here for validity checks later
        scrambleWord(data[0]); //call scrambleWord function
      })
      .catch((error) => console.error(error));
  }
  console.log("searchForWord:", word);

  //TODO
  //need to do a validity check here before rendering the word - edge cases where the word form isn't appearing in
  //dicitonary API and so showing not valid
  //how to loop until valid?


  //------------------------------------------------------------------------
  //scramble word - fisher yates shuffle
  const scrambleWord = (tempWord) => {
    //convert word array to array of letters
    const scrambled = tempWord.split("");


    //shuffle
    for(let i = scrambled.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i+1));
      [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
    }

    

    //convert to string and return
    setScrambled(scrambled.join(""));

    console.log("ScrambleWord:", scrambled);
  }
  
 //------------------------------------------------------------------------
  //check valid letters
 //comparing two hash maps of frequencies of letters
  
 const LetterCheck = (word, guess) => {
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
      
      setIsValidGuess("Incorrect. Keep trying!");
      return false;
      }
    }
    return true;
  }



  //------------------------------------------------------------------------
  //check valid word using dictionary API
  const validWordCheck = (guess) => {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${guess}`)
      .then((response) => {
        if (!response.ok) {
        throw new Error("Not a valid word"); //moves to catch
      }
      return response.json();
      })
      .then((data) => {
        console.log("validWordCheck: valid word");
        setIsValidGuess("Correct, nice job!"); 
      })
      .catch((error) => {
        console.log("Uknown Error.");
        setIsValidGuess("Incorrect. Keep trying!");
      })
  }
  



  //------------------------------------------------------------------------
// history panel function for history array generation
//tracks both correct and incorrect guesses


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
              Word Guesser  
            </Typography>
            <Typography variant="subtitle1" sx={{gap: 3, color: 'white', textAlign: 'center'}}>
              Try to find the real word that has been scrambled. 
            </Typography>
            <Typography variant="subtitle1" sx={{gap: 3, color: 'white', textAlign: 'center'}}>
              Your guess does not have to use every letter. 
            </Typography>
            <Typography variant="subtitle1" sx={{gap: 3, color: 'white', textAlign: 'center'}}>
              Refresh the browser to start a new game.
            </Typography>

            <Button 
              sx = {{
              color: "#199229"
              }}
              onClick={handleOpen}>Click for Instructions
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
                <Typography variant="subtitle1" sx={{ color: 'white', textAlign: 'left' }}>
                  Guesses do not need to include every letter from the scrambled word, but they also can't contain any letters not in the scrambled word. 
                  There may be one or more possible real words that work for each scrambled word.  </Typography>
                <Typography variant="subtitle1" sx={{ color: 'white', textAlign: 'left' }}>
                  Winning conditions... </Typography>
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
            <Button 
              variant="contained"
              size="large"
              onClick={() => {
                console.log("User guesed:", guess);
                if(LetterCheck(word, guess)){
                  if (validWordCheck(guess)){
                    console.log("guess button: guess is valid");
                  }
                } else if (!LetterCheck(word,guess)){
                  console.log("guess button: Guess is invalid");}
                }}
              sx={{ 
                px: 4, 
                bgcolor: 'var(--accent)', 
                '&:hover': { bgcolor: 'var(--accent-border)' } 
                }}>
            Guess
          </Button>
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
      <Container>
        <Button 
            sx = {{
            color: "#199229"
            }}
            onClick={handle2ndOpen}>HOW THIS GAME WAS MADE
        </Button>
        {/* How this game was made modal */}
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
                width: 400,
                bgcolor: '#16171d',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
                }}>
                <Typography variant="subtitle1" sx={{ color: 'white', textAlign: 'left' }}>
                  Insert game description here. </Typography>
                <Typography variant="subtitle1" sx={{ color: 'white', textAlign: 'left'}}>
                <ul>
                  <li> Something here. </li>
                  <li> More optional stuff here.</li>
                </ul>
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'white', textAlign: 'left' }}>
                  The databases used to get the random word generator and to then check against the dictionary are not perfect and so may include mistakes. </Typography>
                <Typography variant="subtitle1" sx={{ color: 'white', textAlign: 'left'}}>
                  Think of this game as checking for "anagrams" which are words that can be rearranged into multiple other words: </Typography>
                <Typography variant="subtitle1" sx={{ color: 'white', textAlign: 'left'}}>
                <ul>
                  <li> "Listen" is a perfect anagram of "silent" because it uses every letter. </li>
                  <li> "Head" is a partial anagram of "lampshade" because it does not use all the letters.</li>
                </ul>
                </Typography>
              </Box>
            </Modal>
      </Container>
    </Box>
  </Box>

        {/* Right side of screen */}
      {/* History Panel */}
  <Box sx={{ flex: 1 }}>
  
  </Box>
</Box>

</>
)
}

export default App
