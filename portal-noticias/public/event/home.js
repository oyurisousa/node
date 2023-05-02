let iconHeart = document.getElementById('icon-heart')

iconHeart.addEventListener('dblclick', heart)

function heart(){
    if(iconHeart.classList.contains("fa-regular")){
        iconHeart.classList.remove("fa-regular")
        iconHeart.classList.add("fa-solid")

        iconHeart.style.transition = "transform 0.2s ease-in-out";
        iconHeart.style.transform = "scale(1.3)";
    }else{
        iconHeart.classList.remove("fa-solid")
        iconHeart.classList.add("fa-regular")
    }
    
    setTimeout(()=>{
        iconHeart.style.transition = "transform 0.2s ease-in-out";
        iconHeart.style.transform = "scale(1";
    
    },200)
    
} 

