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

    let cabinsHTML = "<h2>Dina stugor</h2> <br> <table id='table'>";
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



    let servicesHTML = "<h2>Tjänster</h2> <br> <table id='table'';>";
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



    let ordersHTML = "<h2>Beställda tjänster</h2> <br> <table id='table'> ";

    for (const order of orders) {
        var date = new Date(order.date);

        // for (service of services) {
        ordersHTML += `
            <div class="order">
            <tr bgcolor='#eaece5'">
             <td id='date'>   ${date.toLocaleDateString('en-FI')} </td>
             <td id='name'>${order.name}  </td>
             <td> <input class="btn-del" data-id="${order._id}" type="button" value="Delete"> </td>
             <td> <input class="btn-edit" data-id="${order._id}" name="${order.name}" date="${order.date}"type="button" value="Edit"> </td>
            </tr>
                
            </div>
            <div id='date'></div>
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


document.querySelector('#orders').addEventListener('click', async (event) => {
    console.log(event.target)
    if (event.target.classList.contains('btn-del')) {
        console.log(event.target.getAttribute('data-id'))
        await window.electron.delOrder(event.target.getAttribute('data-id'))
        console.log("TEST")

        sessionStorage.reloadAfterPageLoad = true;
        window.location.reload()

    }

    if (event.target.classList.contains('btn-edit')) {
        var date = new Date();
        console.log('date clicked. id = ' + event.target.getAttribute('data-id'))

        dateInput = "<form class='date_picker'>Välj ett nytt datum för tjänsten " + event.target.getAttribute('name') + " <br><input type='date' name='new_date' value=" + date.toISOString().split('T')[0] + "><input type='submit' value='skicka' id='edit_date'></form><br>"
        document.getElementById('date').innerHTML = dateInput
        let form = document.querySelector(".date_picker");

        form.addEventListener("submit", async function (e) {
            e.preventDefault() // This prevents the window from reloading

            let formdata = new FormData(this);
            let input = formdata.get("new_date");

           // alert(input);
            
           var msg = await window.electron.editOrder(event.target.getAttribute('data-id'), {
                date: input
            })
            document.querySelector('#del-msg').innerText = msg
            document.getElementById('date').innerHTML = ""
            setTimeout(function () { document.querySelector('#del-msg').innerText = "" }, 5000)
            

        })


    }
})


if (sessionStorage.reloadAfterPageLoad) {

    document.querySelector('#del-msg').innerText = "ORDER DELETED"
    setTimeout(function () { document.querySelector('#del-msg').innerText = "" }, 5000)

}



/*delCabin = async () => ({


})*/