// Obtención de elementos del DOM
const monedaIngresada = document.getElementById("amountUsdWithoutTax");
const botonEnviar = document.getElementById("submitButton");
const dolarConvertido = document.getElementById("valueWithoutTax");
const impuestoPais = document.getElementById("countryTax");
const impuestoGanancias = document.getElementById("incomeTax");
const resultadoTotal = document.getElementById("totalWithTaxes");
const alerta = document.getElementById("alertaLimite");
const divisas = document.getElementById("divisas");

// Variables de estado
let cantidadConsultas = 0;
let historial = [];

//Setear el texto del contexto de los elementos del DOM
const setPriceToTextContext = (element, price) => {
  element.textContent = "$" + price.toFixed(2);
};

const getPriceWithTax = (initialPrice, taxPercentage, logText) => {
  const result = initialPrice * taxPercentage;
  console.log(logText + " " + result);
  return result;
};

// Evento click en el botón "Enviar"
botonEnviar.addEventListener("click", async (ev) => {
  ev.preventDefault(); // Evitar el comportamiento por defecto del formulario

  // Verificar si se ha seleccionado una divisa válida
  if (divisas.value === "Seleccione la Divisa") {
    alert("Por favor, seleccione una divisa válida.");
    return; // Salir de la función si la divisa no es válida
  }

  // Verificar si se ha ingresado un número
  if (monedaIngresada.value === "") {
    alert("Para calcular debe colocar un número");
  } else {
    try {
      // Obtener datos de la API
      const response = await fetch("https://api.bluelytics.com.ar/v2/latest");
      const data = await response.json();

      let pesos;
      // Determinar la tasa de conversión según la divisa seleccionada
      if (divisas.value === "dolar") {
        pesos = data.oficial.value_sell;
        //// Verificar si se superó el límite de compra
        if (monedaIngresada.value >= 200) {
          alerta.textContent =
            "El límite de compra habilitado por ciudadano es de U$D200";
        } else {
          alerta.textContent = "";
        }
      } else if (divisas.value === "euro") {
        pesos = data.oficial_euro.value_sell;
      }
      console.log("El valor del " + divisas.value + " es " + pesos);

      // Calcular la conversión de la moneda ingresada
      const valorDolar = parseFloat(monedaIngresada.value);
      const conversionDivisas = valorDolar * pesos;
      console.log("Conversion oficial: " + conversionDivisas);

      // Mostrar la conversión en el DOM
      setPriceToTextContext(dolarConvertido, conversionDivisas);

      const sumaImpuestoPais = getPriceWithTax(
        conversionDivisas,
        0.3,
        "Suma Impuesto Pais + %30:"
      );
      setPriceToTextContext(impuestoPais, sumaImpuestoPais);

      // Calcular impuesto ganancias y mostrarlo
      const sumaImpuestoGanancias = getPriceWithTax(
        conversionDivisas,
        0.45,
        "Suma Impuesto Ganancias + %45: "
      );
      setPriceToTextContext(impuestoGanancias, sumaImpuestoGanancias);

      // Calcular el total con impuestos y mostrarlo
      const total =
        conversionDivisas + sumaImpuestoGanancias + sumaImpuestoPais;
      setPriceToTextContext(resultadoTotal, total);

      cantidadConsultas++;

      // Verificar si se ha superado el límite de consultas
      if (cantidadConsultas >= 50) {
        alert(
          "Has superado el límite de consultas, refresque la página para volver a intentar"
        );
      }

      // Registrar la consulta en el historial y almacenar en el localStorage
      historial.push({
        Divisa: divisas.value,
        Monto: monedaIngresada.value,
        TotalConImpuestos: total,
      });

      localStorage.setItem("consulta", JSON.stringify(historial));
    } catch (error) {
      console.error("Error al obtener los datos: " + error);
    }
  }
});
