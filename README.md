TypeRacer

A simple clone of a typing application inspired by play.typeracer.com

Here BackboneJS is used as the core in order to make the application more structured.

The entrire application consists of an index.html file which holds the structure and imports all the necessary files to make the application.

The application uses various CDNs for jQuery, Underscorejs, and Backbonejs while utilizing 3 custom javascript files. 

app.js holds a majority of the application logic.

data.js holds the passage prompts for the user to type.

settings.js holds the logic that adds the modal box at the beginning and ending of typing session.

I created a simple model as the base with a single attribute: text

Three View were created: Word View that represented a single word, Words View that represented a collection of Word Views, and Word Box View that represented the typing input area for the user.

A single collection was utilized that maintained all of the Word Views.

Views: Word, Words, WordBox

Collections: Words

Models: Word

