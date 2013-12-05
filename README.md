# Ping
A sample microblogging app using Node.js and Express. This application allows users to create accounts, log in, update others with public messages, and subscribe to friends' messages. It is immediately deployable using the included script.

This is a demo Node.js/Express/MongoDB/Angular (MEAN stack) app, originally started at a UCL hackathon, written to gain experience in in these technologies. It uses HTTPS only, and requires a certificate to be included. It uses Passport for authentication and Express's cookieSession for local persistence of sessions. The model and database access use Mongoose, which makes it relatively easy to build document schemas for MongoDB on the backend. The frontend is an Angular app that uses the REST API endpoints to update the application.

See the live demo of the app: https://ping.davidwinegar.com. Create an account or log in with the default account to try it out! Note that the certificate is self-signed, and you will get a warning when visiting it - use at your own risk.

### Dependencies:
* MongoDB installed
* Node.js and the following npm modules:
 * Express
 * BCrypt
 * Mongoose
 * Jade
 * Passport
 * Passport-Local
* A file in the root folder called 'secure_untracked_info.js' that contains the following exports:
 * secretCookiePhrase, a string used to secure cookies
 * credentials, an object containing an SSL certificate and private key for the server

### Deployment:
* Ensure that MongoDB is running on the default localhost location
* Elevate to su ('sudo su') and run 'run.sh' to start the server
 * Note that this runs the server on root - a bad idea, but necessary to access ports 80 and 443. A solution using iptables would be much more secure. Note that this doesn't have much more than toy security (no sanitization of database inputs, for example) and shouldn't be relied upon in an actual production environment.

### License:
Licensed under the MIT license : http://opensource.org/licenses/MIT

Portions of the code from passport-local, https://github.com/jaredhanson/passport-local/, used under the MIT license.
