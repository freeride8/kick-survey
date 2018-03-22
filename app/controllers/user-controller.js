const bcrypt = require('bcrypt');
const UserError = require('./exceptions');

class UserController {
    constructor(data) {
        this.data = data;
    }
    /**
     * @description Takes a password in plain text and hashes it
     * @param {string} password
     * @return {string} Hashed password
     */
    hashPassword(password) {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
    /**
     * @description Compares the plain text password with a hashed one
     * @param {string} password Password in plain text
     * @param {string} hash Hashed password
     * @return {boolean} True if the passwords are the same.
     * False if the passwords are different
     */
    comparePasswords(password, hash) {
        return bcrypt.compare(password, hash);
    }
    /**
     * @description Creates a user entry in the database
     * @async
     * @throws Throws errors from the validations
     * @param {Object} user User object with properties from the register form
     * @return {Object} Created user
     */
    async createUser(user) {
        let password = null;
        let hashedPassword = null;
        let username = null;
        let email = null;
        try {
            username = await this.validateUsername(user.username);
        } catch (err) {
            throw err;
        }
        try {
            password = this.validatePasswords(user.password, user.rePassword);
        } catch (err) {
            throw err;
        }

        try {
            hashedPassword = this.hashPassword(password);
        } catch (err) {
            throw err;
        }

        try {
            email = await this.validateUserEmail(user.email);
        } catch (err) {
            throw err;
        }

        const firstName = user.firstName;
        const lastName = user.lastName;

        const userObject = {
            username,
            password: await hashedPassword,
            first_name: firstName,
            last_name: lastName,
            email,
        };

        return this.data.users.create(userObject);
    }
    /**
     * @description Checks whether the email is valid
     * @async
     * @throws {UserError}
     * @param {string} email String with a possible email
     * @return {UserError|string}
     */
    async validateUserEmail(email) {
        const usersEmailArray = [];
        try {
            await this.data.users.getAllEmails().map(async (userData) => {
                usersEmailArray.push(userData.email);
            });
        } catch (err) {
            throw err;
        }

        const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        const validateEmail = pattern.test(email);

        if (usersEmailArray.includes(email)) {
            throw new UserError.ExistingEmail();
        } else if (email === '') {
            throw new UserError.EmptyEmail();
        } else if (validateEmail === false) {
            throw new UserError.InvalidEmail();
        } else {
            return email;
        }
    }
    /**
     * @description Checks whether the username is valid
     * @async
     * @throws {UserError}
     * @param {string} username String with a possible username
     * @return {UserError|string}
     */
    async validateUsername(username) {
        const usernameArray = [];

        await this.data.users.getAllUsernames().map(async (userData) => {
            usernameArray.push(userData.username);
        });

        if (usernameArray.includes(username)) {
            throw new UserError.ExistingUsername();
        } else if (username === '') {
            throw new UserError.EmptyUsername();
        } else {
            return username;
        }
    }

    /**
     * @description Checks whether the password is valid
     * @throws {UserError}
     * @param {string} password String with the password
     * @param {string} confirmPassword String with the confirmation password
     * @return {UserError|string}
     */
    validatePasswords(password, confirmPassword) {
        if (password !== confirmPassword) {
            throw new UserError.NotMatchingPasswords();
        } else if (password.length < 4) {
            throw new UserError.ShortPassword();
        } else {
            return password;
        }
    }
}

module.exports = UserController;
