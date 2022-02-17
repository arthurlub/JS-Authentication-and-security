const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });
// mongoose Users schema (table)
const userSchema = {
	email: String,
	password: String,
};
// mongoose User model (this is actually a js object that used to: represent a row in the table/ find a row in a table....)
const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
	res.render("home");
});

app.get("/login", function (req, res) {
	res.render("login");
});

app.get("/register", function (req, res) {
	res.render("register");
});

// when the user registered it will send the user and the password values to here
app.post("/register", function (req, res) {
	const newUser = new User({
		email: req.body.username,
		password: req.body.password,
	});
	newUser.save(function (err) {
		if (err) {
			console.log(err);
		} else {
			res.render("secrets"); // this will show me secret page, but will not redirect me to a new route!!! it will be on the this route (http://localhost:3000/register)
		}
	});
});

app.post("/login", function (req, res) {
	const username = req.body.username;
	const password = req.body.password;
	// we will check in our db if there is a user name with this password
	User.findOne({ email: username }, function (err, foundUser) {
		if (err) {
			console.log(err);
		} else {
			if (foundUser) {
				if (foundUser.password === password) {
					res.render("secrets"); // if so, we will render him the secret page (on the same route - http://localhost:3000/login)
				}
			}
		}
	});
});

app.listen(3000, function () {
	console.log("Server started on port 3000.");
});
