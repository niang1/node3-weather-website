const path = require("path");
const express = require("express");
const hbs = require("hbs");

const geocode = require("./utils/geocode.js");
const forecast = require("./utils/forecast.js");

const app = express();
const port = process.env.PORT || 3000;

//define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//use static directory to serve static files
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", { title: "Weather", name: "Andrew" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About", name: "Andrew" });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "Help text",
    title: "Help",
    name: "Andrew",
  });
});
app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address ",
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({
          error: error,
        });
      }
      forecast(latitude, longitude, (error, dataForecast) => {
        if (error) {
          return res.send({
            error: error,
          });
        }
        res.send({
          forecast: dataForecast,
          location: location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get("/help/*", (req, res) => {
  res.render("404", { errorMessage: "Help article not found" });
});

app.get("*", (req, res) => {
  res.render("404", { errorMessage: "Page Not Found !" });
});
app.listen(port, () => {
  console.log("Server started in port " + port);
});
