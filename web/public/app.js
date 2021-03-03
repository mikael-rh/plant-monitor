const PLANT_COUNT = 8;

function createBar(name) {
    let className = name.toLowerCase();
    let bar = document.createElement("div");
    bar.className = "bar";
    let fill = document.createElement("div");
    fill.className = `bar-fill bar-${className}`;
    fill.innerHTML = `${name}: <span class="${className}"></span>`;

    bar.appendChild(fill);
    return bar;
}

function createSite() {
    let plants = document.getElementById("plants");

    for (let i = 0; i < PLANT_COUNT; i++) {
        let plant = document.createElement("div");

        $(plant)
            .attr("id", "plant" + i)
            .addClass("card plant")
            .html(
                `<b>Plant ${i + 1}</b>` +
                '<span class="label"><i class="fas fa-clock"></i>&nbsp;&nbsp;<span class="timestamp"></span>'
            );

        plant.appendChild(createBar("Moisture"));

        plants.appendChild(plant);
    }
}

function updatePlant(snapshot, index) {
    let plant = $(`#plant${index}`);
    if (snapshot.exists()) {
        let data = snapshot.val();
        plant.find(".timestamp").text(data["timestamp"].split(".")[0]);
        let moisture_percent = (data["soilMoisture"] * 100).toFixed(1) + "%";
        plant.find(".bar-moisture").css("width", moisture_percent);
        plant.find(".moisture").text(moisture_percent);
    } else {
        plant.find(".timestamp").text("Failed to fetch");
    }
}

document.addEventListener("DOMContentLoaded", _ => {
    createSite();

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

    let db = firebase.database();
    let root = db.ref();

    for (let i = 0; i < PLANT_COUNT; i++) {
        root.child("plants").child(`plant${i}`).child("latest").get()
            .then(x => updatePlant(x, i))
            .catch(function (error) {
                console.error(error);
            });

        let latest = firebase.database().ref(`plants/plant${i}/latest`);
        latest.on("value", x => updatePlant(x, i));
    }
});
