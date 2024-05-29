let gridParent = document.getElementById("grid-parent");


let iterationsEl = document.getElementById("iterations");
let avgEl = document.getElementById("avg");
let maxEl = document.getElementById("max");
let minEl = document.getElementById("min");
let emptyEl = document.getElementById("empty");
let totalEl = document.getElementById("total");

let total = 0;
let max = 0;
let min = Infinity;
let empty = 0;
let avg = 0;
let allIterations = [];

let delay = 10;

for (var i = 0; i < 64; i++) {
    let div = document.createElement("div");
    div.classList.add("grid-tile");
    div.id = "tile-" + i;
    gridParent.appendChild(div);
}

// Variable to track the index of the currently hovered element
let hoveredIndex = -1;

// Function to handle mouseover event
function handleMouseOver(index) {
    hoveredIndex = index;
}
function handleMouseOut(index) {
    hoveredIndex = -1;
}

// Function to check if mouse is hovering over a specific element
function isMouseHere(x) {
    return hoveredIndex === x;
}

// Attach mouseover event listener to each child element
document.querySelectorAll('#grid-parent > .grid-tile').forEach((element, index) => {
    element.addEventListener('mouseover', () => {
        handleMouseOver(index);
    });
    element.addEventListener("mouseout", () => {
        handleMouseOut();
    });
});

async function checkValues(values) {
    let result = false;
    for (let i = 0; i < values.length; i++) {
        let element = "tile-" + values[i];
        document.getElementById(element).classList.add("on");
        if (isMouseHere(values[i])) {
            result = true;
        }
    }
    await wait(delay);
    for (let i = 0; i < values.length; i++) {
        let element = "tile-" + values[i];
        document.getElementById(element).classList.remove("on");
    }
    return result;
}

function interpolateArray(start, end) {
    let values = [];
    for (let i = start; i < end + 1; i++) {
        values.push(i);
    }
    console.log(values);
    return values;
}

//CHANGE THIS PART OUT FOR YOUR CUSTOM FUNCTION

async function binarySearch() {
    let iterations = 0;
    let hasBeenDetected = false;
    let left = 0;
    let right = 63;
    let possibleValues = 64.0;

    while (left <= right) {
        iterations++;
        let mid = Math.round((left + right) / 2);
        possibleValues = possibleValues / 2.0;

        let detected = await checkValues(interpolateArray(mid, right))
        if (!hasBeenDetected && !detected && possibleValues < 0.251) {
            allIterations.push(iterations);
            return mid;
        }
        else if ((detected || hasBeenDetected) && possibleValues < 1.001) {
            allIterations.push(iterations);
            return mid;
        } else if (detected) {
            hasBeenDetected = true;
            left = mid + 1;
        } else {
            right = mid - 1;
        }
        await wait(delay);
    }
    allIterations.push(iterations);
    empty++;
    return -1;
}



async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function calcAvg(array1) {
    let array = [...array1];
    return array.reduce((a, b) => a + b) / array.length;
}

function displayData() {
    if (allIterations.length > 0) {
        let currIter = allIterations[allIterations.length - 1];
        iterationsEl.innerHTML =
            avgEl.innerHTML = calcAvg(allIterations);
        if (currIter > max) {
            max = currIter;
        }
        if (currIter < min && currIter > 0) {
            min = currIter;
        }
        maxEl.innerHTML = max;
        minEl.innerHTML = min;
        emptyEl.innerHTML = empty;
        totalEl.innerHTML = total;
    }
}

function Main(delay) {
    setTimeout(async () => {
        console.log(await binarySearch());
        Main(delay); // Restart the process after waiting
        total++;
        displayData();
    }, delay);
}

Main(200);

