var botones = document.getElementsByClassName("grano_boton");
var info_granos = document.getElementById("info-granos");
var pizarra_granos = document.getElementById("pizarra-granos");

for (var i = 0; i < botones.length; i++) {
  botones[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

const api_key = "";
const secret = "";
var bearer_token

function formatearPrecio(precio){
  return precio.toLocaleString("es-AR", { style: "currency", currency: "ARS" }).replace(/\s/g, '')
}

async function loginRequest(){
    try{
    const login = await fetch('https://api.bcr.com.ar/gix/v1.0/Login', {
    method: 'POST',
    headers: {
      'accept': '*/*',
      'api_key': `${api_key}`,
      'secret': `${secret}`,
      'content-type': 'x-www-form-urlencoded'
    },
    body: ''
  });

  if(login.status === 200){

    const login_data = await login.json();
    bearer_token = login_data.data.token;

  } else {
    console.log('ERROR AL INICIAR SESION EN LA API');
  }
    } catch(error){
        console.log(error);
    }
}

async function obtenerPrecioGranos(id_grano){
    try{
    await loginRequest();

    const fechaActual = new Date();
    const fechaMenosSieteDias = new Date(fechaActual);
    fechaMenosSieteDias.setDate(fechaActual.getDate() - 7);

    function formatearFecha(date) {
      const año = date.getFullYear();
      const mes = String(date.getMonth() + 1).padStart(2, '0');
      const dia = String(date.getDate()).padStart(2, '0');
      return `${año}-${mes}-${dia}`;
    }

    const fechaActualFormateada = await formatearFecha(fechaActual);
    const fechaMenosSieteDiasFormateada = await formatearFecha(fechaMenosSieteDias);

    const request = await fetch(`https://api.bcr.com.ar/gix/v1.0/PreciosCamara?idGrano=${id_grano}&fechaConcertacionDesde=${fechaMenosSieteDiasFormateada}&fechaConcertacionHasta=${fechaActualFormateada}&page=1`, {
        headers: {
            'accept': '*/*',
            'Authorization': `${bearer_token}`
        }
    });

    if(request.status === 200){
        const request_data = await request.json();

        var request_array = request_data.data
        var ultima_cotizacion = request_array.length - 1
        
        var precio_dolar = request_data.data[ultima_cotizacion].precio_Dolar
        var variacion_cotizacion = request_data.data[ultima_cotizacion].variacion_Precio_Cotizacion
        var fecha_cotizacion = request_data.data[ultima_cotizacion].fecha_Operacion_Pizarra

        if(request_data.data[ultima_cotizacion].esEstimado_Cotizacion === true){
          var precio_cotizacion = "S/C"
        } else{
          var precio_cotizacion = request_data.data[ultima_cotizacion].precio_Cotizacion
        }

        const date = new Date(fecha_cotizacion);
        const day = date.getDate();
        const month = date.getMonth() + 1; 
        const fecha_cotizacion_formateada = `${day < 10 ? "0" : ""}${day}/${month < 10 ? "0" : ""}${month}`;

        if(variacion_cotizacion > 0){
          var variacion_icono = 'mayor'
        } else if(variacion_cotizacion == 0){
          var variacion_icono = 'igual'
        } else if(variacion_cotizacion < 0){
          var variacion_icono = 'menor'
        }

        info_granos.innerHTML = `<div class="col-12 col-grey"><p>Camara</p></div>
        <div class="col-4"><p>Rosario</p></div>
        <div class="col-4 d-flex justify-content-center align-items-center"><img src="media/${variacion_icono}.png"><p>${formatearPrecio(precio_cotizacion)}</p></div>
        <div class="col-4 d-flex justify-content-end"><p>${fecha_cotizacion_formateada}</p></div>

        <div class="col-12 col-grey"><p>MATBA - ROFEX</p></div>
        <div class="col-4"><p>${request_data.data[ultima_cotizacion].nombre_Grano} ROS Julio 2023</p></div>
        <div class="col-4 d-flex justify-content-center align-items-center"><img src="media/menor.png"><p>US$${parseFloat(precio_dolar.toFixed(1))}/t</p></div>
        <div class="col-4 d-flex justify-content-end"><p>${fecha_cotizacion_formateada}</p></div>

        <div class="col-12 col-grey"><p>MFGR</p></div>
        <div class="col-4"><p>FCA/TMB</p></div>
        <div class="col-4 d-flex justify-content-center align-items-center"><img src="media/igual.png"><p>${formatearPrecio(precio_cotizacion)}/t</p></div>
        <div class="col-4 d-flex justify-content-end"><p>${fecha_cotizacion_formateada}</p></div`;
    }

    } catch(error){
        console.log(error)
    }
}

async function obtenerDatosPizarra(){
  try{
    const fechaActual = new Date();
    const fechaMenosSieteDias = new Date(fechaActual);
    fechaMenosSieteDias.setDate(fechaActual.getDate() - 7);

    function formatearFecha(date) {
      const año = date.getFullYear();
      const mes = String(date.getMonth() + 1).padStart(2, '0');
      const dia = String(date.getDate()).padStart(2, '0');
      return `${año}-${mes}-${dia}`;
    }

    const fechaActualFormateada = await formatearFecha(fechaActual);
    const fechaMenosSieteDiasFormateada = await formatearFecha(fechaMenosSieteDias);

    await loginRequest();
    const request_trigo = await fetch(`https://api.bcr.com.ar/gix/v1.0/PreciosCamara?idGrano=1&fechaConcertacionDesde=${fechaMenosSieteDiasFormateada}&fechaConcertacionHasta=${fechaActualFormateada}&page=1`, {
        headers: {
            'accept': '*/*',
            'Authorization': `${bearer_token}`
        }
    });

    if(request_trigo.status === 200){
      const request_trigo_data = await request_trigo.json();
      var request_trigo_array = request_trigo_data.data
      var ultima_cotizacion = request_trigo_array.length - 1

      var precio_trigo = request_trigo_data.data[ultima_cotizacion].precio_Cotizacion
      var variacion_trigo = request_trigo_data.data[ultima_cotizacion].variacion_Precio_Cotizacion
      var trigo_es_estimativo = request_trigo_data.data[ultima_cotizacion].esEstimado_Cotizacion
      var precio_estimativo_trigo = ""

      if(variacion_trigo === 0){
        tendencia_trigo = "<i class='icono-variacion'>=</i>"
      } else if(variacion_trigo > 0){
        tendencia_trigo = "<i class='icono-variacion bi bi-arrow-up'></i>"
      } else if(variacion_trigo < 0){
        tendencia_trigo = "<i class='icono-variacion bi bi-arrow-down'></i>"
      }

      if(trigo_es_estimativo === true){
        precio_estimativo_trigo = `(Estimativo) ${formatearPrecio(precio_trigo)}`
        precio_trigo = 'S/C'
      }
    }

    await loginRequest();
    const request_maiz = await fetch(`https://api.bcr.com.ar/gix/v1.0/PreciosCamara?idGrano=2&fechaConcertacionDesde=${fechaMenosSieteDiasFormateada}&fechaConcertacionHasta=${fechaActualFormateada}&page=1`, {
        headers: {
            'accept': '*/*',
            'Authorization': `${bearer_token}`
        }
    });

    if(request_maiz.status === 200){
      const request_maiz_data = await request_maiz.json();
      var request_maiz_array = request_maiz_data.data
      var ultima_cotizacion = request_maiz_array.length - 1

      var precio_maiz = request_maiz_data.data[ultima_cotizacion].precio_Cotizacion
      var variacion_maiz = request_maiz_data.data[ultima_cotizacion].variacion_Precio_Cotizacion
      var maiz_es_estimativo = request_maiz_data.data[ultima_cotizacion].esEstimado_Cotizacion
      var precio_estimativo_maiz = ""

      if(variacion_maiz === 0){
        tendencia_maiz = "<i class='icono-variacion'>=</i>"
      } else if(variacion_maiz > 0){
        tendencia_maiz = "<i class='icono-variacion bi bi-arrow-up'></i>"
      } else if(variacion_maiz < 0){
        tendencia_maiz = "<i class='icono-variacion bi bi-arrow-down'></i>"
      }

      if(maiz_es_estimativo === true){
        precio_estimativo_maiz = `(Estimativo) ${formatearPrecio(precio_maiz)}`
        precio_maiz = 'S/C'
      }
    }

    await loginRequest();
    const request_girasol = await fetch(`https://api.bcr.com.ar/gix/v1.0/PreciosCamara?idGrano=20&fechaConcertacionDesde=${fechaMenosSieteDiasFormateada}&fechaConcertacionHasta=${fechaActualFormateada}&page=1`, {
        headers: {
            'accept': '*/*',
            'Authorization': `${bearer_token}`
        }
    });

    if(request_girasol.status === 200){
      const request_girasol_data = await request_girasol.json();
      var request_girasol_array = request_girasol_data.data
      var ultima_cotizacion = request_girasol_array.length - 1

      var precio_girasol = request_girasol_data.data[ultima_cotizacion].precio_Cotizacion
      var variacion_girasol = request_girasol_data.data[ultima_cotizacion].variacion_Precio_Cotizacion
      var girasol_es_estimativo = request_girasol_data.data[ultima_cotizacion].esEstimado_Cotizacion
      var precio_estimativo_girasol = ""

      if(variacion_girasol === 0){
        tendencia_girasol = "<i class='icono-variacion'>=</i>"
      } else if(variacion_girasol > 0){
        tendencia_girasol = "<i class='icono-variacion bi bi-arrow-up'></i>"
      } else if(variacion_girasol < 0){
        tendencia_girasol = "<i class='icono-variacion bi bi-arrow-down'></i>"
      }

      if(girasol_es_estimativo === true){
        precio_estimativo_girasol = `(Estimativo) ${formatearPrecio(precio_girasol)}`
        precio_girasol = 'S/C'
      }
    }

    await loginRequest();
    const request_soja = await fetch(`https://api.bcr.com.ar/gix/v1.0/PreciosCamara?idGrano=21&fechaConcertacionDesde=${fechaMenosSieteDiasFormateada}&fechaConcertacionHasta=${fechaActualFormateada}&page=1`, {
        headers: {
            'accept': '*/*',
            'Authorization': `${bearer_token}`
        }
    });

    if(request_soja.status === 200){
      const request_soja_data = await request_soja.json();
      var request_soja_array = request_soja_data.data
      var ultima_cotizacion = request_soja_array.length - 1

      var precio_soja = request_soja_data.data[ultima_cotizacion].precio_Cotizacion
      var variacion_soja = request_soja_data.data[ultima_cotizacion].variacion_Precio_Cotizacion
      var soja_es_estimativo = request_soja_data.data[ultima_cotizacion].esEstimado_Cotizacion
      var precio_estimativo_soja = ""

      if(variacion_soja === 0){
        tendencia_soja = "<i class='icono-variacion'>=</i>"
      } else if(variacion_soja > 0){
        tendencia_soja = "<i class='icono-variacion bi bi-arrow-up'></i>"
      } else if(variacion_soja < 0){
        tendencia_soja = "<i class='icono-variacion bi bi-arrow-down'></i>"
      }

      if(soja_es_estimativo === true){
        precio_estimativo_soja = `(Estimativo) ${formatearPrecio(precio_soja)}`
        precio_soja = 'S/C'
      }
    }

    await loginRequest();
    const request_sorgo = await fetch(`https://api.bcr.com.ar/gix/v1.0/PreciosCamara?idGrano=3&fechaConcertacionDesde=${fechaMenosSieteDiasFormateada}&fechaConcertacionHasta=${fechaActualFormateada}&page=1`, {
        headers: {
            'accept': '*/*',
            'Authorization': `${bearer_token}`
        }
    });

    if(request_sorgo.status === 200){
      const request_sorgo_data = await request_sorgo.json();
      var request_sorgo_array = request_sorgo_data.data
      var ultima_cotizacion = request_sorgo_array.length - 1

      var precio_sorgo = request_sorgo_data.data[ultima_cotizacion].precio_Cotizacion
      var variacion_sorgo = request_sorgo_data.data[ultima_cotizacion].variacion_Precio_Cotizacion
      var sorgo_es_estimativo = request_sorgo_data.data[ultima_cotizacion].esEstimado_Cotizacion
      var precio_estimativo_sorgo = ""

      if(variacion_sorgo === 0){
        tendencia_sorgo = "<i class='icono-variacion'>=</i>"
      } else if(variacion_sorgo > 0){
        tendencia_sorgo = "<i class='icono-variacion bi bi-arrow-up'></i>"
      } else if(variacion_sorgo < 0){
        tendencia_sorgo = "<i class='icono-variacion bi bi-arrow-down'></i>"
      }

      if(sorgo_es_estimativo === true){
        precio_estimativo_sorgo = `(Estimativo) ${formatearPrecio(precio_sorgo)}`
        precio_sorgo = 'S/C'
      }
    }

    pizarra_granos.innerHTML = `<div class="row pizarra-granos header">
    <div class="col row-trigo p-2"><img class="m-2" src="https://www.bcr.com.ar/themes/custom/base/images/icons/GEA/color/trigo.svg">TRIGO</div>
    <div class="col row-maiz p-2"><img class="m-2" src="https://www.bcr.com.ar/themes/custom/base/images/icons/GEA/color/maiz.svg">MAIZ</div>
    <div class="col row-girasol p-2"><img class="m-2" src="https://www.bcr.com.ar/themes/custom/base/images/icons/GEA/color/girasol.svg">GIRASOL</div>
    <div class="col row-soja p-2"><img class="m-2" src="https://www.bcr.com.ar/themes/custom/base/images/icons/GEA/color/soja.svg">SOJA</div>
    <div class="col row-sorgo p-2"><img class="m-2" src="https://www.bcr.com.ar/themes/custom/base/images/icons/GEA/color/sorgo.svg">SORGO</div>
</div>
<div class="row pizarra-granos precios">
    <div class="col p-1">${formatearPrecio(precio_trigo)}</div>
    <div class="col p-1">${formatearPrecio(precio_maiz)}</div>
    <div class="col p-1">${formatearPrecio(precio_girasol)}</div>
    <div class="col p-1">${formatearPrecio(precio_soja)}</div>
    <div class="col p-1">${formatearPrecio(precio_sorgo)}</div>
</div>
<div class="row pizarra-granos variaciones">
    <div class="col flex-wrap">
        <div class="col-6 d-flex justify-content-center">DIF. $/tn</div>
        <div class="col-6 d-flex justify-content-center">${variacion_trigo}</div>
        <div class="col-6 d-flex justify-content-center">TEND.</div>
        <div class="col-6 d-flex justify-content-center">${tendencia_trigo}</div>
    </div>
    <div class="col flex-wrap">
        <div class="col-6 d-flex justify-content-center">DIF. $/tn</div>
        <div class="col-6 d-flex justify-content-center">${variacion_maiz}</div>
        <div class="col-6 d-flex justify-content-center">TEND.</div>
        <div class="col-6 d-flex justify-content-center">${tendencia_maiz}</div>
    </div>
    <div class="col flex-wrap">
        <div class="col-6 d-flex justify-content-center">DIF. $/tn</div>
        <div class="col-6 d-flex justify-content-center">${variacion_girasol}</div>
        <div class="col-6 d-flex justify-content-center">TEND.</div>
        <div class="col-6 d-flex justify-content-center">${tendencia_girasol}</div>
    </div>
    <div class="col flex-wrap">
        <div class="col-6 d-flex justify-content-center">DIF. $/tn</div>
        <div class="col-6 d-flex justify-content-center">${variacion_soja}</div>
        <div class="col-6 d-flex justify-content-center">TEND.</div>
        <div class="col-6 d-flex justify-content-center">${tendencia_soja}</div>
    </div>
    <div class="col flex-wrap">
        <div class="col-6 d-flex justify-content-center">DIF. $/tn</div>
        <div class="col-6 d-flex justify-content-center">${variacion_sorgo}</div>
        <div class="col-6 d-flex justify-content-center">TEND.</div>
        <div class="col-6 d-flex justify-content-center">${tendencia_soja}</div>
    </div>
</div>
<div class="row pizarra-granos estimativo">
    <div class="col">${precio_estimativo_trigo}</div>
    <div class="col">${precio_estimativo_maiz}</div>
    <div class="col">${precio_estimativo_girasol}</div>
    <div class="col">${precio_estimativo_soja}</div>
    <div class="col">${precio_estimativo_sorgo}</div>
</div>`

  } catch(error){
    console.log(error)
}
}

obtenerPrecioGranos(21)
obtenerDatosPizarra()




