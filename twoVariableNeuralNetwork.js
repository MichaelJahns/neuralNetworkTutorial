//Training Set, length and width of petals and type of flower
const dataA1 = [2.0, 1.5, 0]
const dataA2 = [1.5, 2.0, 0]
const dataA3 = [2.5, 1.5, 0]
const dataA4 = [2.0, 1.0, 0]
const dataA5 = [1.5, 1.0, 0]

const dataB1 = [1.5, 2.5, 1]
const dataB2 = [3.0, 1.5, 1]
const dataB3 = [3.0, 2.5, 1]
const dataB4 = [3, 1.0, 1]
const dataB5 = [2.0, 2.0, 1]

const unknown = [.75, .75]

const trainingSet = [dataA1, dataA2, dataA3, dataA4, dataA5, dataB1, dataB2, dataB3, dataB4, dataB5]

function sigmoid(input) {
    return 1 / (1 + Math.exp(-input));
}

function train() {
    let w1 = Math.random() * .2 - .1;
    let w2 = Math.random() * .2 - .1;
    let b = Math.random() * .2 - .1;
    learning_rate = 0.1

    console.log('Training Begining')

    for (let iterations = 0; iterations < 50000; iterations++) {
        if (iterations % 1000 === 0) {
            console.log(iterations)
        }
        let randomIndex = Math.floor(Math.random() * trainingSet.length)
        let randomTrainer = trainingSet[randomIndex];
        let trainerType = randomTrainer[2];

        //The sum of all of our parameters
        let z = w1 * randomTrainer[0] + w2 * randomTrainer[1] + b;
        //Our supposed line of best fit?
        let pred = sigmoid(z)

        // Test of if our prediction accurately got at the pattern, cost always equates to a 1 or 0
        let cost = (pred - trainerType) ** 2;

        //We begin to find the partials, that is the amount of influence each parameter had on the cost
        // The particulars of the below math sort of escape me. The video was very helpful and even came 
        // with a helpful graph. I dont think i learned derivatives very well, but i am eage to revist them

        //differential between cost and the prediction
        let dcost_dpred = 2 * (pred - trainerType);

        //differential between the prediction and the sum of paramaters
        let dpred_dz = sigmoid(z) * (1 - sigmoid(z))

        //The video didnt touch on these very strong, just guessing from the naming scheme, they are the derivative
        // between my four paramters and the sum of my parameters. But those look like pointers and not equations, 
        //or sometimes declarations. I dont know how they arrived at these numbers 
        let dz_dw1 = randomTrainer[0]
        let dz_dw2 = randomTrainer[1]
        let dz_db = 1;

        //Research Chain Rule
        // Combined equation for the derivation to cost from each of the parameters.
        let dcost_dw1 = dcost_dpred * dpred_dz * dz_dw1;
        let dcost_dw2 = dcost_dpred * dpred_dz * dz_dw2;
        let dcost_db = dcost_dpred * dpred_dz * dz_db;

        //Update our starting paramters with a portion of the chained derivatives
        w1 -= learning_rate * dcost_dw1;
        w2 -= learning_rate * dcost_dw2;
        b -= learning_rate * dcost_db;
    }
    return { w1: w1, w2: w2, b: b }
}


let canvas = document.createElement("canvas");
canvas.width = 400;
canvas.height = 400;
document.body.appendChild(canvas);
let ctx = canvas.getContext("2d");
ctx.font = "Helvetica";

// map points from graph coordinates to the screen
let graph_size = { width: 7, height: 7 };
function to_screen(x, y) {
    return { x: (x / graph_size.width) * canvas.width, y: -(y / graph_size.height) * canvas.height + canvas.height };
}

// map points from screen coordinates to the graph
function to_graph(x, y) {
    return { x: x / canvas.width * graph_size.width, y: graph_size.height - y / canvas.height * graph_size.height };
}

// draw the graph's grid lines
function draw_grid() {
    ctx.strokeStyle = "#AAAAAA";
    for (let j = 0; j <= graph_size.width; j++) {

        // x lines
        ctx.beginPath();
        let p = to_screen(j, 0);
        ctx.moveTo(p.x, p.y);
        p = to_screen(j, graph_size.height);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        // y lines
        ctx.beginPath();
        p = to_screen(0, j);
        ctx.moveTo(p.x, p.y);
        p = to_screen(graph_size.width, j);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    }
}

// draw points
function draw_points() {
    // this plots the unkown in the data set
    let p = to_screen(unknown[0], unknown[1]);
    ctx.fillStyle = "#555555";
    ctx.fillText("???", p.x - 8, p.y - 5);
    ctx.fillRect(p.x - 2, p.y - 2, 4, 4);

    // plots trainer points
    ctx.fillStyle = "#0000FF";
    for (let j = 0; j < trainingSet.length; j++) {
        let point = trainingSet[j];
        if (point[2] == 0) {
            ctx.fillStyle = "#0000FF";
        } else {
            ctx.fillStyle = "#FF0000";
        }
        p = to_screen(point[0], point[1]);
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
    }
}

// visualize model output on grid of points
function visualize_params(params) {
    ctx.save();
    ctx.globalAlpha = 0.2;
    let step_size = .1;
    let box_size = canvas.width / (graph_size.width / step_size);

    for (let xx = 0; xx < graph_size.width; xx += step_size) {
        for (let yy = 0; yy < graph_size.height; yy += step_size) {
            let model_out = sigmoid(xx * params.w1 + yy * params.w2 + params.b);
            if (model_out < .5) {
                // blue
                ctx.fillStyle = "#0000FF";
            } else {
                // red
                ctx.fillStyle = "#FF0000";
            }
            let p = to_screen(xx, yy);
            ctx.fillRect(p.x, p.y, box_size, box_size);
        }
    }
    ctx.restore();
}

// find parameters
let params = train();

// visualize model output
ctx.clearRect(0, 0, canvas.width, canvas.height);
draw_grid();
draw_points();
visualize_params(params);

// say what the model would say for a given mouse position
window.onmousemove = function (evt) {
    ctx.clearRect(0, 0, 100, 50);

    //the heck is p?
    let p = { x: 10, y: 20 };

    let mouse = { x: evt.offsetX, y: evt.offsetY };
    let mouse_graph = to_graph(mouse.x, mouse.y);

    ctx.fillText("x: " + Math.round(mouse_graph.x * 100) / 100, p.x, p.y);
    ctx.fillText("y: " + Math.round(mouse_graph.y * 100) / 100, p.x, p.y + 10);
    // model output
    let model_out = sigmoid(mouse_graph.x * params.w1 + mouse_graph.y * params.w2 + params.b);
    model_out = Math.round(model_out * 100) / 100;
    ctx.fillText("prediction: " + model_out, p.x, p.y + 20);
}

