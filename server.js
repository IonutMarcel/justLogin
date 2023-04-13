if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const path = require("path");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");

const initializePassport = require("./passport-config");
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

const users = [];

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "views")));

app.use(
  "/css",
  express.static(path.join(__dirname, "registerForm", "views", "css"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      }
    },
  })
);

app.get("/", checkAuthenticated, (req, res) => {
  res.redirect("https://private-chat-app.herokuapp.com/") || process.env.PORT;
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.html");
});
// acceseaza main.js
app.get("/js/main.js", function (req, res) {
  res.sendFile(path.join(__dirname, "/main.js"));
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.html");
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
});

app.delete("/logout", (req, res) => {
  req.logOut(() => {
    res.redirect("/login");
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }
// const path = require("path");

// const express = require("express");
// const app = express();
// const bcrypt = require("bcrypt");
// const passport = require("passport");
// const flash = require("express-flash");
// const session = require("express-session");
// const methodOverride = require("method-override");

// const initializePassport = require("./passport-config");
// initializePassport(
//   passport,
//   (email) => users.find((user) => user.email === email),
//   (id) => users.find((user) => user.id === id)
// );

// const users = [];

// app.engine("html", require("ejs").renderFile);
// app.set("view engine", "html");

// app.use(express.urlencoded({ extended: false }));
// app.use(flash());
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(methodOverride("_method"));

// // Foloseste folderul static
// // app.use(
// //   express.static(path.join(__dirname, "public"), {
// //     setHeaders: function (res, path, stat) {
// //       if (path.endsWith(".css")) {
// //         res.set("Content-Type", "text/css");
// //       }
// //     },
// //   })
// // );

// // // serve static files from the public directory
// // app.use(express.static("application"));
// // // set the MIME type for CSS files
// // app.use(
// //   "/css",
// //   express.static(__dirname + "/application/public/css", {
// //     setHeaders: function (res, path, stat) {
// //       res.set("Content-Type", "text/css");
// //     },
// //   })
// // );

// // app.use(express.static(__dirname + "/application/public/css"));

// app.get("/", checkAuthenticated, (req, res) => {
//   res.redirect("http://localhost:5000");
// });

// // app.get("/", checkAuthenticated, (req, res) => {
// //   res.sendFile(__dirname + "/application/public/index.html");
// // });

// // app.get("/", checkAuthenticated, (req, res) => {
// //   res.render("index.html", { name: req.user.name });
// // });

// app.get("/login", checkNotAuthenticated, (req, res) => {
//   res.render("login.html");
// });

// app.post(
//   "/login",
//   checkNotAuthenticated,
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//     failureFlash: true,
//   })
// );

// app.get("/register", checkNotAuthenticated, (req, res) => {
//   res.render("register.html");
// });

// app.post("/register", checkNotAuthenticated, async (req, res) => {
//   try {
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     users.push({
//       id: Date.now().toString(),
//       name: req.body.name,
//       email: req.body.email,
//       password: hashedPassword,
//     });
//     res.redirect("/login");
//   } catch {
//     res.redirect("/register");
//   }
// });

// app.delete("/logout", (req, res) => {
//   req.logOut(() => {
//     res.redirect("/login");
//   });
// });

// function checkAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }

//   res.redirect("/login");
// }

// function checkNotAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return res.redirect("/");
//   }
//   next();
// }

// app.use(
//   express.static(path.join(__dirname, "public"), {
//     setHeaders: (res, filePath) => {
//       if (filePath.endsWith(".css")) {
//         res.setHeader("Content-Type", "text/css");
//       }
//     },
//   })
// );

// // app.get("/", (req, res) => {
// //   res.sendFile(path.join(__dirname, "public", "index.html"));
// // });

// app.listen(3000, () => {
//   console.log("Server started on port 3000");
// });

// // app.listen(3000);
