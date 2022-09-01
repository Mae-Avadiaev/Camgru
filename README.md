# Camgru
### Simplified Instagram clone

## Intro
I built this project as a part of École 42 course and to solidify my full stack knowledge as well as to create a fun tool for my friends to express theirselves. As a developer I wanted to try server-side template rendering technic and pure JS / CSS / HTML on the front.

## Links
* View App
* [Portfolio](https://mitia-avadiaev.github.io/)

## Front End
### Technologies used
* ES6 
* Axios 0.27
* HTML 5
* CSS

I have used original Instagram app as a look up. Media queries was used to achieve responsive views for mobile, tablet, and any size web browser.  

### Responsive Sizing: Desktop
[image]

± I displayed my navigation menu on the side for large windows.

### Responsive Sizing: Mobile
[image]

± At a certain breakpoint the navigation menu is displayed at the top. The text and image here is still displayed correctly as per screen size.


### Async requests and form validation
Axios was used to send requests and post data to the server. 

In the main gallery the limit of posts is 18 to fit all screen sizes. When the user comes to the end of the page new Axios request forms and new posts appear. 

[gif]

Client-side form validation was created for better user experience. Password is checked for length >= 8 symbols and Password confirm field to match the password.

[image]

### Optimistic UI and form with immediate submit

Due to specifics of server side rendering apps "like" and "comment" functions was not so smooth so I implemented optimistic UI to make them more natural and interactive.

[gif]

To gain more natural feeling of switching the mail settings I made this inputs submit immediately.

[gif]

### Photo-booth sticker drag with mouse and finger

[explain]

### Canvas image capturing and custom stickers

When capture button is pressed a drawn image on the canvas (photo) is turned into blob and packed in the form data along with the name of a superposable image (sticker) and its coordinates and upload on the server. 

[gif]

I also added functionality to add custom stickers. 

[image]
