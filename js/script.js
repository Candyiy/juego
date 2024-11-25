const ctx = pintura.getContext('2d');

let objetos = [
    {nombre:'juanito perez', x:50, y:0, width:10, color:'#aa9900', velocidad:0.1},
    {nombre:'piedra2', x:80, y:0, width:10, color:'#BB1100', velocidad:1},
    {nombre:'piedra3', x:20, y:60, width:10, color:'#aa99CC', velocidad:2},
    {nombre:'piedra4', x:350, y:0, width:10, color:'#025', velocidad:2},
];

const minRad = 10;
const rangeRad = 20;
let p = 0;
let x = 0, y = 0;
let mouseRadioCrece = true;
let finJuego = false;
let score = 0;

let proyectiles = [];

const colision = (objecto1, objecto2) => {
    const distancia = Math.sqrt((objecto2.x - objecto1.x) ** 2 + (objecto2.y - objecto1.y) ** 2);
    return distancia <= (objecto1.width / 2 + objecto2.width / 2);
}

function dispararProyectil() {
    const radio = minRad + rangeRad * p;
    proyectiles.push({
        x: x,
        y: y - radio,
        width: 5,
        velocidad: 2,
        color: '#FF0000'
    });
}

function animate() {
    if (mouseRadioCrece) {
        p = p + 0.01;
        if (p > 1) {
            mouseRadioCrece = false;
        }
    } else {
        p = p - 0.01;
        if (p < 0.1) {
            mouseRadioCrece = true;
        }
    }
    
    const rad = minRad + rangeRad * p;
    ctx.clearRect(0, 0, pintura.width, pintura.height);

    objetos.forEach((objeto, index) => {
        ctx.beginPath();
        ctx.arc(objeto.x, objeto.y, objeto.width, 0, Math.PI * 2);
        ctx.fillStyle = objeto.color;
        ctx.fill();
        ctx.stroke();
        
        ctx.font = "10px Arial";
        const a = ctx.measureText(objeto.nombre);
        ctx.fillText(objeto.nombre, objeto.x - a.width / 2, objeto.y + 20);
        
        proyectiles.forEach((proyectil, pIndex) => {
            if (colision(proyectil, objeto)) {
                objetos.splice(index, 1);
                proyectiles.splice(pIndex, 1);
                score += 10;
            }
        });

        objeto.y += objeto.velocidad;
        if (objeto.y > pintura.height) {
            objeto.y = 0;
            objeto.velocidad *= 1.2;
            objeto.x = Math.random() * pintura.width;
        }
    });

    if (objetos.length === 0) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "#000";
        alert("fin del juego"+" tu puntaje es: "+ score);
        finJuego = true;
        return;
    }

    proyectiles.forEach((proyectil, pIndex) => {
        proyectil.y -= proyectil.velocidad;
        ctx.beginPath();
        ctx.arc(proyectil.x, proyectil.y, proyectil.width, 0, Math.PI * 2);
        ctx.fillStyle = proyectil.color;
        ctx.fill();
        ctx.stroke();

        if (proyectil.y < 0) {
            proyectiles.splice(pIndex, 1);
        }
    });

    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fillStyle = '#1288AA';
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(1, 1, pintura.width - 1, pintura.height - 1);
    ctx.stroke();

    ctx.font = "20px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText("score: " + score, 10, 20);

    if (!finJuego) {
        requestAnimationFrame(animate);
    }
}

animate();

pintura.addEventListener('mousemove', (info) => {
    x = info.x;
    y = info.y;
});

pintura.addEventListener('click', dispararProyectil);