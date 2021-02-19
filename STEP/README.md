# Programming with Javascript #

This repo contains the course materials for **Programmiertes Entwerfen 1 und Programmiersprachen 1**. There is basic education material as well as folders with exercises for the students.

The general structure is as follows:

    root directory           administrative files and the more important all the .html files (our documents)
    |- css directory         stylesheet files for look and feel of our documents
    |- img directory         images of various types
    |- data directory        data files to be processed by our javascript programs
    |- js directory          javascript files for the actual programming
    |- libraries directory   javascript library files from others with ready-made functionality

Why such a structure? To keep everything nice and tidy. Programming tends to get complicated with a lot of files around
and this structure at least keeps similar things together.   

### What is a Javascript program? ###
A javascript program is a text structured according to some rules (syntax), which is understood
(interpreted) and according to its logic executed by another program - in our case "a browser".
The context of the execution (the browser) provides means to allow modifications of its contents
(the HTML document) in order to provide a dynamic user experience.

Wow - what a complex ...

Simply put: A browser displays a document (page), which is modified by an automated process. This
process can react to user interaction. The logic of the process is written as a javascript program.

In our specific case there are 3 parts, which add to the final view presented in the browser:
 - HTML document (what is shown)
 - CSS sylesheet (how is it shown)
 - Javascript (how it is dynamically created and modified)      

A javascript program text consists of Keywords (fixed parts defined by the language javascript) and
free parts, which a programmer can use as needed and useful for the programs purpose. Such a
program consists of the following elements:

    Program
    |- Comment
    |- Operator
    |- Special Character
    |- Variable
      |- Name
      |- Value
      |- Global
      |- Local
      |- Type
        |- Number
        |- String
        |- Boolean
        |- Array
        |- Object
        |- Function
          |- Definition
          |- Call
          |- Parameter
          |- Caller
          |- Return Value
    |- Statement
    |- Control-Structures
      |- for loop
      |- if
      |- Conditions
      |- ...
