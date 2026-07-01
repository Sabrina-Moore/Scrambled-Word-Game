# Scrambled-word-Game
The player unscrambles a word. They can skip if they want, and they can see their guess history. 

# Structure

I'm making a game where the code calls a random word generator API, takes that word and scrambles it. The user then attempts to guess an anagram of the word (any valid word that uses the exact same letters) and the code checks if the letters are valid by fetching from a dictionary API to see if the word is a real word. 

The user interacts with a textField that also shows them an error maessage if the guess was invalid. The user can make multiple guesses and skip to a new word. There will also be a history panel on the side tracking their guesses. 

