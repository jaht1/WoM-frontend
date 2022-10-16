/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because nodeIntegration is turned off and
 * contextIsolation is turned on. Use the contextBridge API in preload.js
 * to expose Node.js functionality from the main process.
 */


//FRONTEND



getCabins = async () => {
    console.log('getCabins')
    const cabins = await window.electron.getCabins()
    console.log(cabins)


    //Om apit inte returnerar cabins
    if (!cabins) {
        document.querySelector('#login').style.display = 'block'
        return
    }

    let cabinsHTML = "<h2>Dina stugor</h2> <br> <table id='table' border='1px'>";
    for (const cabin of cabins) {
        cabinsHTML += `
            <div class="cabin">
            <tr bgcolor='#eaece5'">
                <td> ${cabin.address} </td>
                </tr>
            </div>
        `;
    }



    document.querySelector('#cabins').innerHTML = cabinsHTML;

    getServices()
    getOrders()

}
getCabins()

getServices = async () => {
    console.log('getServices')
    const services = await window.electron.getServices()
    console.log(services)


    //Om apit inte returnerar services
    /*  if (!services) {
          document.querySelector('#login').style.display = 'block'
          return
      }*/

    let servicesHTML = "<h2>Tjänster</h2> <br> <table id='table' border='1px';>";
    for (const service of services) {
        servicesHTML += `
            <div class="service">
            <tr bgcolor='#eaece5'">
               <td> ${service.name} </td>
                
                </tr>
            </div>
        `;
    }




    document.querySelector('#services').innerHTML = servicesHTML;



}

getOrders = async () => {
    console.log('getOrders')
    const orders = await window.electron.getOrders()
    const services = await window.electron.getServices()
    console.log(orders)


    //Om apit inte returnerar services
    /*  if (!services) {
          document.querySelector('#login').style.display = 'block'
          return
      }*/

    let ordersHTML = "<h2>Beställda tjänster</h2> <br> <table id='table' border='1px'>";

    for (const order of orders) {
        var date = new Date(order.date);

        // for (service of services) {
        ordersHTML += `
            <div class="order">
            <tr bgcolor='#eaece5'">
             <td>   ${date.toLocaleDateString('en-FI')} </td>
             <td>${order.name}  </td>
             <td> <input class="btn-del" data-id="${order._id}" type="button" value="Delete"> </td>
            </tr>
                
            </div>
        `;
        //  }

    }



    document.querySelector('#orders').innerHTML = ordersHTML + "</table>";


}
//LOGIN STEP 1 
//Button click -> preload function cabinsLogin
document.querySelector('#btn-login').addEventListener('click', async () => {
    document.querySelector('#msg').innerText = ''

    //cabinsLogin --> preload.js
    const login_failed = await window.electron.cabinsLogin({
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value
    })
    if (login_failed) {

        document.querySelector('#msg').innerText = login_failed.msg
        return
    }

    document.querySelector('#login').style.display = 'none'
    getCabins()
})

//window.localStorage.setItem('show_div', '');
document.querySelector('#orders').addEventListener('click', async (event) => {
    console.log(event.target)
    if (event.target.classList.contains('btn-del')) {
        console.log(event.target.getAttribute('data-id'))
        await window.electron.delOrder(event.target.getAttribute('data-id'))
        console.log("TEST")
        sessionStorage.reloadAfterPageLoad = true;
        window.location.reload();
        // window.localStorage.setItem('show_div', '');
        /*.then(result => {
            window.localStorage.setItem('show_div', 'true');
            window.location.reload();
            // window.localStorage.setItem('show_div', 'true');
          })
          //document.querySelector('#show_div').innerText = "Order deleted"
          
          
          if (window.localStorage.getItem('show_div') == 'true') {
            console.log("funkar")
            document.querySelector('#del-msg').innerText = "Order deleted";
          } else {
            console.log("Läser funktion false")
            document.querySelector('#del-msg').innerText = "";
          
          }*/
          

    }
})


if (sessionStorage.reloadAfterPageLoad) {

    document.querySelector('#del-msg').innerText = "ORDER DELETED"
    setTimeout(function(){document.querySelector('#del-msg').innerText = ""}, 5000);
    
    


}


/*delCabin = async () => ({


})*/