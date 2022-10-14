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

    let cabinsHTML = "<h2>Dina stugor</h2>";
    for (const cabin of cabins) {
        cabinsHTML += `
            <div class="cabin">
                ${cabin.address}
                <input class="btn-del" data-id="${cabin._id}" type="button" value="del">
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

    let servicesHTML = "<h2>Tjänster</h2>";
    for (const service of services) {
        servicesHTML += `
            <div class="service">
                ${service.name}
                <input class="btn-del" data-id="${service._id}" type="button" value="del">
            </div>
        `;
    }



    document.querySelector('#services').innerHTML = servicesHTML;



}

getOrders = async () => {
    console.log('getOrders')
    const orders = await window.electron.getOrders()
    console.log(orders)


    //Om apit inte returnerar services
    /*  if (!services) {
          document.querySelector('#login').style.display = 'block'
          return
      }*/

    let ordersHTML = "<h2>Beställda tjänster</h2> <br> <table border='1px'>";
    for (const order of orders) {
        ordersHTML += `
            <div class="order">
            <tr>
             <td>   ${order.date} </td>
             <td>${order.name}  </td>
            </tr>
                
            </div>
        `;
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

document.querySelector('#cabins').addEventListener('click', async (event) => {
    console.log(event.target)
    if (event.target.classList.contains('btn-del')) {
        console.log(event.target.getAttribute('data-id'))
        await window.electron.delCabin(event.target.getAttribute('data-id'))

    }
})

/*delCabin = async () => ({


})*/