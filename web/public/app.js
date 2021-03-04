const PLANT_COUNT = 8;

function clamp(val, min, max) {
    return Math.max(Math.min(val, max), min);
}

function createBar(content, unit = "", min = 0, max = 1) {
    // Create a valid name from content string
    let name = content.toLowerCase().replace(/ /g, "-");

    let bar = $(`<div class="bar-frame"></div>`);
    bar.html(`<div class="label bar-tick">${min}</div>` +
        `<div class="label bar-tick" style="right:0;">${max}</div>`);

    let fill = $(`<div class="bar bar-${name}"></div>`);
    fill.html(`${content}: <span class="bar-value"></span>${unit}`);
    fill.data("min", min).data("max", max).data("unit", unit);
    bar.append(fill);

    return bar;
}

function createSite() {
    let plants = $("#plants");

    for (let i = 0; i < PLANT_COUNT; i++) {
        let plant = $(`<div class="card plant" id="plant${i}"></div>`);
        plant.html(
            `<b>Plant ${i + 1}</b>` +
            '<span class="label" style="float:right;"><i class="fas fa-clock"></i>&nbsp;&nbsp;<span class="timestamp"></span>'
        );
        plant.append(createBar("Moisture", "%", 0, 1));

        plants.append(plant);
    }
}

/**
 * Resizes bar and updates content
 * @param bar jQuery object
 * @param value float
 */
function updateBar(bar, value) {
    let min = bar.data("min");
    let max = bar.data("max");
    let unit = bar.data("unit");

    let width = (value - min) / (max - min);
    bar.css("width", (width * 100) + "%");

    let fmtValue = value;
    if (unit === "%") fmtValue *= 100;
    bar.find(".bar-value").text(fmtValue.toFixed(1));
}

function updatePlant(snapshot, index) {
    let plant = $(`#plant${index}`);
    if (snapshot.exists()) {
        let data = snapshot.val();
        plant.find(".timestamp").text(data["timestamp"].split(".")[0]);
        // Display soil moisture in percent
        updateBar(plant.find(".bar-moisture"), data["soilMoisture"]);
    } else {
        plant.find(".timestamp").text("Failed to fetch");
    }
}

function updateTheme() {
    let darkTheme = localStorage.getItem("theme") === "dark";
    let symbol = darkTheme ? "sun" : "moon";
    $("#theme-button").html(`<i class='fas fa-${symbol}'></i>`);
    $("body").toggleClass("dark-theme", darkTheme);
}

document.addEventListener("DOMContentLoaded", _ => {
    createSite();
    updateTheme();

    $("#theme-button").click(() => {
        localStorage.setItem("theme", localStorage.getItem("theme") === "dark" ? "light" : "dark");
        updateTheme();
    });

    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyCa-WgNxaUU1jv81pVC6ajXOo493e8zY2w",
        authDomain: "eit-gruppe-3.firebaseapp.com",
        databaseURL: "https://eit-gruppe-3-default-rtdb.firebaseio.com",
        projectId: "eit-gruppe-3",
        storageBucket: "eit-gruppe-3.appspot.com",
        messagingSenderId: "571619157604",
        appId: "1:571619157604:web:71df7292d860c0f1daa171"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    for (let i = 0; i < PLANT_COUNT; i++) {
        let latest = firebase.database().ref(`plants/plant${i}/latest`);

        // Fetch latest data
        latest.get()
            .then(x => updatePlant(x, i))
            .catch(function (error) {
                console.error(error);
            });

        // Fetch latest data on value change
        latest.on("value", x => updatePlant(x, i));
    }
});
