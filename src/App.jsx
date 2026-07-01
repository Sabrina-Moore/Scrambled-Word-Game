import { useEffect, useState } from 'react'
import React from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import './App.css'


//TODO: scramble logic
//finish states and state variables
//check conditions
//add panel history


function App() {

  const [word, setWord] = useState(""); //store random word from random word API

  const [guess, setGuess] = useState(""); //store user input

  const [scrambled, setScrambled] = useState(""); //store scrambled string

  //------------------------------------------------------------------------
  //get random word

  

  //------------------------------------------------------------------------
  //scramble word - fisher yates shuffle






  //------------------------------------------------------------------------
  //check valid letters

  
  //hash maps
  const wordMap = new Map (); //for frequency of letters in scrambled word

  const guessMap = new Map (); //for frequency of letters in guess

  
  //------------------------------------------------------------------------
  //check valid word using dictionary API



  //------------------------------------------------------------------------
  //TODO: history panel array

  return (
    <>
    <Container maxWidth="sm">
      <Typography 
      variant="h3"
      component="h1"
      sx={{ 
        fontWeight: 700, 
        textAlign: 'center',
        color: 'white',
        mb: 1
        }}>
        Anagram Guesser  </Typography>
      <Typography variant="subtitle1" sx={{ color: 'white', textAlign: 'center'}}>
        Unscramble the word. </Typography>
      <Typography variant="body2" sx={{ color: 'white', textAlign: 'center' }}>
        Each word may have multiple possible options, but each will require using every letter. </Typography>
    </Container>


{/*Scrambled word */}
    <Container>
      <Box
      className="counter" style={{padding: '10px 24px', letterSpacing: '2px', fontWeight: 'bold' }}>
        Filler word
      </Box>
    </Container>

{/*Text field and user input */}
    <TextField 
    id="outlined-error-helper-text" 
    label="Type guess here" 
    defaultValue=""
    helperText="Incorrect entry."
    variant="outlined"
    onChange={(e) => setGuess(e.target.value)}
   sx={{color: "white"}}
   />


{/*Buttons*/}
  <Stack spacing={2} direction="row">
    <Button 
    variant="contained"
    size="large"
    onClick={() => {
      console.log("User guesed:", guess);
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
      setGuess(""); //clear guess
      searchWord(); //fetch a new word
    }}
    sx={{ 
            px: 4, 
            bgcolor: 'var(--accent)', 
            '&:hover': { bgcolor: 'var(--accent-border)' } 
          }}>
      New Word
    </Button>
  </Stack>

{/*TODO: History Panel */}
    </>
  )
}

export default App
