# Democoderacy
## The Worlds Nerdliest Game

### What?
Democoderacy, is a game/experiment of collaberative software development inspired by [Nomic](https://en.wikipedia.org/wiki/Nomic).

In short, Nomic is a game where every rule is changable. Every turn proposes new rules or rule changes. Ever rule is voted into or out of existence by the players.

Democoderacy is the same idea in the form of this GitHub repo. The code in the repo is the game. All of it is changable (even this README), but only if a majority of the contributors agree to the change.

Rules:

1. Any pull requests submitted to this repo are voted on by any members who have previously contributed to the project.
2. After a period of one week or when half of the contibutors (defined as exactly 50%) have voted in favor of the pull request, the pull request is accepted or closed based on the number of positive votes.
3. If 50% of votes are in favor of the pull request, the pull request is accepted.
4. If less than 50% of votes are in favor of the pull request, it is closed without merge.

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
