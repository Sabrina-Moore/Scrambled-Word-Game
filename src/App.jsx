import { useEffect, useState } from 'react'
import React from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import './App.css'


//finish and correct states and state variables
//write check conditions logic
//write panel history feature logic

//TODO: edge case - are the random words too long to be solvable? do I need to control for length as well as commonality?


//TODO: needs to generate a word on website load - currently only fetches word on button click
//let user choose length or difficulty? Slider? Options? 

//Issue fixed with linking scrambleWord function to searchForWord function: I misunderstood what I was 
//getting from the API - I thought I was getting a string, but I was actually receiving an array 
//so my split() method was wrong



function App() {

  const [word, setWord] = useState(""); //store random word from random word API for hash map conversion

  const [guess, setGuess] = useState(""); //store user input

  const [scrambled, setScrambled] = useState(""); //store scrambled string

  //------------------------------------------------------------------------
  //get random word from API https://random-word-api.herokuapp.com/word with parameters for length or diff
  const searchForWord = () => {
    fetch(`https://random-word-api.herokuapp.com/word?number=1&diff=2`)
      .then((response) => (response.json()))
      .then((data) => {
        setWord(data[0]); //set word here for validity checks later
        scrambleWord(data[0]); //call scrambleWord function
      })
      .catch((error) => console.error(error));
  }
  console.log(word);

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

    console.log(scrambled);
  }

  //------------------------------------------------------------------------
  //check valid letters
 //comparing two hash maps of frequencies of letters
  
 


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
        {scrambled}
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

{/*TODO: History Panel */}
    </>
  )
}

export default App
