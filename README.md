# Ping
This is a demo Node.js/Express/MongoDB/Angular (MEAN stack) app, written to gain experience in in these technologies.

## Dependencies:
* MongoDB installed
* Node.js and the following npm modules:
** Express
** BCrypt
** Mongoose
** Jade
** Passport
** Passport-Local
* A file in the root folder called 'secure_untracked_info.js' that contains the following exports:
** secretCookiePhrase, a string used to secure cookies
** credentials, an object containing an SSL certificate for the server

Deployment:
* Ensure that MongoDB is running on the default localhost location
* Elevate to su ('sudo su') and run 'run.sh' to start the server

## License:
Licensed under the MIT license : http://opensource.org/licenses/MIT
Portions of the code from passport-local, https://github.com/jaredhanson/passport-local/, used under the MIT license.