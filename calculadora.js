const dolarIngresado = document.getElementById("amountUsdWithoutTax");
const botonEnviar = document.getElementById("submitButton");
const dolarConvertido = document.getElementById("valueWithoutTax");
const impuestoPais = document.getElementById("countryTax");
const impuestoGanancias = document.getElementById("incomeTax");
const resultadoTotal = document.getElementById("totalWithTaxes");
const alerta = document.getElementById("alertaLimite");
let cantidadConsultas = 0;



botonEnviar.addEventListener("click", async ev => {
    ev.preventDefault();
    if (dolarIngresado.value === "") {
        alert("Para calcular debe colocar un numero")
    }
    else{
    try {

        const response = await fetch("https://api.bluelytics.com.ar/v2/latest");
        const data = await response.json();

        let pesos = data.oficial.value_sell;
        console.log("El valor del dolar es " + pesos);

        const valorDolar = parseFloat(dolarIngresado.value);

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


        if (dolarIngresado.value >= 200) {
            alerta.textContent = "El limite de compra habilitado por ciudadano es de U$D200"
        }
        else {
            alerta.textContent = ""
        }

        while (cantidadConsultas === 3) {
            alert("Has superado el limite de consultas, refresque la pagina para volver a intentar")
            break
        }





    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
});

