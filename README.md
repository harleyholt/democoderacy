# Democoderacy
## The Worlds Nerdliest Game

### What?
Democoderacy (alternately, Nomicode), is a game/experiment of collaberative software development inspired by [Nomic](https://en.wikipedia.org/wiki/Nomic).

In short, Nomic is a game where every rule is changable. Every turn proposes new rules or rule changes. Ever rule is voted into or out of existence by the players.

Democoderacy is the same idea in the form of this GitHub repo. The code in the repo is the game. All of it is changable (even this README), but only if a majority of the contributors agree to the change.

To start, the code implements the following:
1. All contributors start with 1 point and their winner flag set to false.
1. Any contributor whose point field is greater than or equal to 21 has their winner flag set to true.
1. The first contributor to have their winner flag set to true is the winner.

These are all changable rules. There is no garantee that the code will implement the rules as stated here at the time you are viewing this. The code is the source of truth.

### How do I play the game?
Submit pull requests. All contributors will vote on the pull request and it will either be accepted or it will be closed.

### How do I earn points?
I don't really know. It's up to contributors to implement point gain, loss, etc. The game is whatever the contributors decide to accept in the form of code.

### How do I win?
The first person who is marked the winner is the winner.

### No, but really though
Contibutors are free to change all code, text, and configuration in this repo. If the contributors vote to completely change the implementation and the game... well, what am I supposed to do?
