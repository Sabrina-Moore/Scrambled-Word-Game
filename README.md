# Word Unscramble Game
A react browser based word puzzle game where the player is given a scrambled word and must guess valid anagrams. An anagram is a word that can be rearranged into other words using the same letters (but not necissarily use all letters). The game uses external API's to generate a random word and validate the guess against a dictionary. The code also relies on Material UI components. 


# API's used
Random word generator API: https://random-word-api.herokuapp.com/home 
Dictionary API: https://dictionaryapi.dev/

# Game Flow

1. When the website loads and when the "New Word" button is pressed, the code fetches a random word from the API. 
2. The word is then scrambled using the Fisher-Yates shuffle algorithm.
3. The scrambled word is displayed.
4. Player enters their guess into a TextField component and hit the "Guess" button, which prompts two checks: LetterCeck and ValidWordCheck.
5. The guess is validated by checking first if the letters in the guess are also used in the scrambled word and then that prompts checking the dictionary API. 
6. Based on the validation, the game gives the user a corresponding helperText or error message. 
7. The guess, its correctness value, and points are shown in a guess history panel. 
8. Each round is one scrambled word and there is no limit to how many rounds or how many guesses a player can have. The game simply ends whenever they want to stop.
9. Game can be reset by refreshing the webpage. 
10. There are two optional popups that can be clicked to give more information on how to play the game and how the game works. 


<!-- # Game Features

There are two buttons, two modals, a textField and multiple box and containers to display information. History system. Checks system. 

-->


<!-- How to clone or use my repo-->

