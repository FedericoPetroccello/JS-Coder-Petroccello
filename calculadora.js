<<<<<<< HEAD
const monedaIngresada = document.getElementById("amountUsdWithoutTax");
const botonEnviar = document.getElementById("submitButton");
const dolarConvertido = document.getElementById("valueWithoutTax");
const impuestoPais = document.getElementById("countryTax");
const impuestoGanancias = document.getElementById("incomeTax");
const resultadoTotal = document.getElementById("totalWithTaxes");
const alerta = document.getElementById("alertaLimite");
const divisas = document.getElementById("divisas");

let cantidadConsultas = 0;


botonEnviar.addEventListener("click", async ev => {
    ev.preventDefault();
    if (monedaIngresada.value === "") {
    alert("Para calcular debe colocar un numero")
    }
    else{
    try {
        
        const response = await fetch("https://api.bluelytics.com.ar/v2/latest");
        const data = await response.json();

        divisas.value === 'dolar' ? pesos = data.oficial.value_sell : ''
        divisas.value === 'euro' ? pesos = data.oficial_euro.value_sell : ''
        console.log("El valor del " + divisas.value + " es " + pesos);
        const valorDolar = parseFloat(monedaIngresada.value);

        const conversionDivisas = valorDolar * pesos;
        console.log("Conversion oficial: " + conversionDivisas);
        dolarConvertido.textContent = "$" + conversionDivisas.toFixed(2)

        const sumaImpuestoPais = conversionDivisas * 0.3
        console.log("Suma Impuesto Pais + %30: " + sumaImpuestoPais);
        impuestoPais.textContent = "$" + sumaImpuestoPais.toFixed(2)

        const sumaImpuestoGanacias = conversionDivisas * 0.45
        console.log("Suma Impuesto Ganancias + %45: " + sumaImpuestoGanacias);
        impuestoGanancias.textContent = "$" + sumaImpuestoGanacias.toFixed(2)

        const total = conversionDivisas + sumaImpuestoGanacias + sumaImpuestoPais
        resultadoTotal.textContent = "$" + total.toFixed(2)
        
        console.log(total);
        cantidadConsultas++


        if (monedaIngresada.value >= 200) {
            alerta.textContent = "El limite de compra habilitado por ciudadano es de U$D200"
        }
        else {
            alerta.textContent = ""
        }

        while (cantidadConsultas === 3) {
            alert("Has superado el limite de consultas, refresque la pagina para volver a intentar")
            break
        }
        historial.push({
            Divisa: divisas.value,
            Monto: monedaIngresada.value,
            TotalConImpuestos: total,
        })
        localStorage.setItem("consulta", historial.map(val =>{
            return JSON.stringify(val)
        }))

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
});

