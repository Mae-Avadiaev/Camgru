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

On desktops the position of mouse is captured on "mouse down" and new position of a sticker is calculated on "mouse move".

[gif]

On mobile devices distance between start of the sticker and "touch start" is calculated and on "touch move" it subtracts from touch coordinates to provide more natural drag experience without shifting.

[gif]

### Canvas image capturing and custom stickers

When capture button is pressed a drawn image on the canvas (photo) is turned into blob and packed in the form data along with the name of a superposable image (sticker) and its coordinates and upload on the server. 

[gif]

I also added functionality to add custom stickers. 

[image]

### Email notification design

[image]

## Back End 

### Technologies used
* Node.js 16.17
* Express 4.18
* MongoDB, mongoose 6.4
* bcryptjs 2.4
* ejs 3.1
* sharp 0.30
* nodemailer 6.7

### Data base design 

[image]

* User model contains email settings of a user.
* All the data is validated before save to DB.

### Document and query middleware
* Post model and Comment model is populated by user login and avatar before every query.
* Likes quantity of the Post model is calculated and updated before save and delete of a like.
* Comments quantity of the Post model is calculated and updated after save of a post. 
 
### Authentication and security
* All the passwords stored in the Data Base are encrypted by bcryptjs library.
* Authentication system is built using jsonwebtoken that is held in the cookies of a browser of a user. 
* Since password reset is less affected by the attacks, password reset token along with email conformation token are encrypted with more performant algorithm "sha256".
* Photo-booth, post view and user settings are protected routes and are available only by authenticated users. It is checked that a user still exists and that user didn't change their password after the token was issued.

### Error handling
I've created custom Error class that extends standard error one. Every instance has message, status code, status, and "is operational" flag. Depending on the location different values is assigned to an instance and different error controller behaviour is held:
* Operational, trusted error -> send message to client
* Programming or other unknown error -> don't leak error details

### Emails
Nodemailer and Sengrid service is used to send emails. 
* When user just signed up and need to confirm their email a mail with token is sent. 
* When user forgot their password a mail with password reset token is sent.
* When user got new like and user likes settings is "on" a notification is sent.
* When user got new comment and user comments settings is "on" a notification is sent.

### Photo
Multer library is used to upload image to memory storage and then it is processed by sharp library to resize, composite, bring to .jpeg, and save final image.

### Utils

