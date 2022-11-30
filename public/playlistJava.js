
function serch(stringu){
    var lists = document.body.getElementsByTagName('h5')
    for(let i = 0; i < lists.length; i++){
        var comparator = lists[i].innerText.toUpperCase()
        if(comparator.includes(stringu) == false){
            lists[i].parentElement.parentElement.hidden = true
        }
    }
}

function dohini(){
    var lists = document.body.getElementsByTagName('h5')
    for(let i = 0; i < lists.length; i++){
        lists[i].parentElement.parentElement.hidden = false
    }
}

function doSerch(){
    let lupa = document.getElementById("SearchMan").value
    lupa = lupa.toUpperCase();
    if(lupa != ""){
        serch(lupa)
    }
    else{
        dohini()
    }
    return false
}
