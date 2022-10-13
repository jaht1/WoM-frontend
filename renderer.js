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

    let cabinsHTML = "";
    for (const cabin of cabins) {
        cabinsHTML += `
            <div class="cabin">
                ${cabin.address}
                <input class="btn-del" data-id="${cabin._id}" type="button" value="del">
            </div>
        `;
    }

    document.querySelector('#cabins').innerHTML = cabinsHTML;

}
getCabins()



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