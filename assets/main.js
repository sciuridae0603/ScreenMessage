//Menu
var options = {
    "color": "",
    "background": "",
    "modes": [],
};

var colors = [
    "#ff4f4f",
    "#ff664f",
    "#ff984f",
    "#ffb64f",
    "#ffd64f",
    "#ffed4f",
    "#f6ff4f",
    "#d3ff4f",
    "#b9ff4f",
    "#9bff4f",
    "#98ff4f",
    "#7eff4f",
    "#58ff4f",
    "#4fff6c",
    "#4fff8d",
    "#4fffaa",
    "#4fffcd",
    "#4fffea",
    "#4ff9ff",
    "#4fd9ff",
    "#4fcdff",
    "#4fb3ff",
    "#4fa7ff",
    "#4f87ff",
    "#4f58ff",
    "#724fff",
    "#9b4fff",
    "#bc4fff",
    "#d64fff",
    "#f34fff",
    "#ff4fd3",
    "#ff4fa7",
    "#ff4f78"
]

var textarea = null;
var colorPicker = null;
var Intervals = {

};

Array.prototype.remove = function() {
    var toDelete = arguments[0];
    if (this.indexOf(toDelete)) {
        this.splice(this.indexOf(toDelete), 1);
    }
    return this;
};

function isMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
    }
    return false;
}


// Rainbow Functions
function startRainbow(type) {
    var el = (type == "background") ? document.body : textarea;
    Intervals[type + "rainbow"] = setInterval(() => {
        el.style[type] = colors[Math.floor(Math.random() * colors.length)]
    }, 150)
}

function stopRainbow(type) {
    if ((type + "rainbow") in Intervals) {
        clearInterval(Intervals[type + "rainbow"])
    }
}


// Color
function setColor(type, color) {
    var el = (type == "background") ? document.body : textarea;
    stopRainbow(type);
    if (color == "custom") {
        colorPicker.click()
        colorPicker.onchange = () => {
            el.style[type] = colorPicker.value;
            options[type] = colorPicker.value;
            setHash();
        }
    } else if (color == "rainbow") {
        startRainbow(type)
    } else {
        el.style[type] = color;
    }
    options[type] = color;
    setHash();
}

function fontColor(fontColor) {
    setColor("color", fontColor)
}

function background(backgroundColor) {
    setColor("background", backgroundColor)
}

// Modes
function pulse() {
    if (options.modes.includes("pulse")) {
        clearInterval(Intervals["pulse"]);
        textarea.style.opacity = "";
        removeMode("pulse");
    } else {
        options.modes.push("pulse");
        var status = true;
        Intervals["pulse"] = setInterval(() => {
            if (status) {
                textarea.style.opacity = 0;
                status = false;
            } else {
                textarea.style.opacity = 1;
                status = true;
            }
        }, 400)
    }
    setHash();
}

function blink() {
    if (options.modes.includes("blink")) {
        clearInterval(Intervals["blink"]);
        textarea.style.display = "";
        removeMode("blink");
    } else {
        options.modes.push("blink");
        var status = true;
        Intervals["blink"] = setInterval(() => {
            if (status) {
                textarea.style.display = "none";
                status = false;
            } else {
                textarea.style.display = "";
                status = true;
            }
        }, 400)
    }
    setHash();
}

function removeMode(modeName){
    if(options.modes.length == 1){
        options.modes.remove(0);
    }else{
        options.modes.remove(modeName);
    }
}

function mode(modeName) {
    if (modeName == "pulse") {
        pulse()
    }
    if (modeName == "blink") {
        blink()
    }
}

// ScreenMessage
function adjust() {

    test = document.getElementById("test");

    test.textContent = textarea.value;
    test.innerHTML == (textarea.value[textarea.value.length - 1] == "\n") ? test.innerHTML + "." : test.innerHTML;

    ratioX = (window.innerWidth) / test.offsetWidth;
    ratioY = (window.innerHeight) / test.offsetHeight;
    ratio = Math.min(ratioX, ratioY);
    fontSize = Math.floor(30 * ratio) + "px"
    textarea.style.fontSize = fontSize;
    newHeight = Math.ceil(test.offsetHeight * ratio);
    textarea.style.paddingTop = Math.floor((window.innerHeight - newHeight) / 2) + "px";
    textarea.style.paddingBottom = Math.floor((window.innerHeight - newHeight) / 2) + "px";
    newWidth = Math.ceil(test.offsetWidth * ratio);
    textarea.style.paddingLeft = Math.max(0, Math.floor((window.innerWidth - newWidth) / 2)) + "px";
    textarea.style.paddingRight = Math.max(0, Math.floor((window.innerWidth - newWidth) / 2)) + "px";
    setHash();
}

// Hash Data Utils
function setHash() {
    href = "#text=" + encodeURIComponent(document.getElementById("textarea").value);
    if (options.color) { href += ";color=" + encodeURIComponent(options.color); }
    if (options.background) { href += ";background=" + encodeURIComponent(options.background); }
    if (options.modes) { href += ";modes=" + encodeURIComponent(options.modes.join(",")); }
    window.location.hash = href;
}

function getHashData() {
    var data = {};
    window.location.hash.split(";").forEach(item => data[item.split("=")[0]] = item.split("=")[1]);
    if ("#text" in data) {
        textarea.textContent = decodeURIComponent(data["#text"])
    }
    if ("color" in data) {
        fontColor(decodeURIComponent(data["color"]));
    }
    if ("background" in data) {
        background(decodeURIComponent(data["background"]));
    }
    if ("modes" in data) {
        decodeURIComponent(data["modes"]).split(",").forEach(modeName => {
            mode(modeName)
        })
    }
}

// Init
function init() {
    textarea = document.getElementById("textarea");
    colorPicker = document.getElementById("colorPicker");

    getHashData()

    if (isMobile()) {
        var touchStartX = 0;
        var touchEndX = 0;
        document.addEventListener("touchstart", (e) => {
            touchStartX = e.touches[0].clientX;
        });
        document.addEventListener("touchmove", (e) => {
            touchEndX = e.touches[0].clientX;
        })
        document.addEventListener("touchend", (e) => {
            if (touchStartX <= touchEndX) {
                document.getElementById("sidepanel").style.left = "0";
            }
            if (touchStartX > touchEndX) {
                document.getElementById("sidepanel").style.left = "-18em";
            }
        });

    } else {
        document.addEventListener("mousemove", (e) => {
            if (e.pageX <= document.getElementById("sidepanel").offsetWidth) {
                document.getElementById("sidepanel").style.left = "0";
            }
            if (e.pageX > document.getElementById("sidepanel").offsetWidth) {
                document.getElementById("sidepanel").style.left = "-18em";
            }
        });
    }
    adjust();
}
