console.log("[touchZoom extension] TouchZoom has been activated for this webpage. VERSION: OCTAGONAL Zombie");

var averagePos = {x:0,y:0};
var zooming = false;     // only true if you are pinch zooming
var zInDist = 0;        // the initial distance between your fingers (when you start pinching)
var pFactor = 1;        // the scaling factor at the beginning of the pinch guesture
var factor = 1;         // the current scaling factor
var iScrollTop = 0;     // the initial top and left scrolling positions
var iScrollLeft = 0;

var startWidth = document.body.clientWidth;

document.body.style.transformOrigin = "top left";

function findAveragePos(touchList){
    if(touchList.length > 0){
        averagePos = {x:0,y:0};
        for(var i=0;i<touchList.length; i++){
            averagePos.x += touchList[i].clientX;
            averagePos.y += touchList[i].clientY;
        }
        averagePos = {x:averagePos.x/touchList.length,y:averagePos.y/touchList.length};
    }
}

window.addEventListener("touchstart",function(e){
    if(e.touches.length > 1){
        e.preventDefault();
    }
    if(e.touches.length == 2){
        if(zooming == false){
            startWidth = document.body.clientWidth;
            findAveragePos(e.touches);
            zInDist = Math.sqrt(Math.pow((e.touches[0].clientX-e.touches[1].clientX),2)+Math.pow(e.touches[0].clientY-e.touches[1].clientY,2));
            zooming = true;
            iScrollTop = (window.scrollY+averagePos.y)/pFactor;
            iScrollLeft = (window.scrollX+averagePos.x)/pFactor;
            document.body.style.transition = "transform 0s ease";
        }
    }
});

window.addEventListener("touchmove",function(e){
    if(e.touches.length > 1){
        e.preventDefault();
    }
    if(e.touches.length == 2){
        findAveragePos(e.touches);
        zcDist = Math.sqrt(Math.pow((e.touches[0].clientX-e.touches[1].clientX),2)+Math.pow(e.touches[0].clientY-e.touches[1].clientY,2));
        factor = Math.min(Math.max(pFactor*(zcDist/zInDist),1),5);
        if(factor >= 1){
            document.body.style.transform = "perspective(45px) translateZ("+(45-45/factor).toString()+"px) ";
            document.body.style.overflow = "hidden";
            document.body.style.width = startWidth+"px";
        }
        window.scroll(((iScrollLeft)*factor-averagePos.x),((iScrollTop)*factor-averagePos.y));
    }
});

window.addEventListener("touchend",function(e){
    if(e.touches.length > 1){
        e.preventDefault();
        if(e.touches.length == 2){
            zcDist = Math.sqrt(Math.pow((e.touches[0].clientX-e.touches[1].clientX),2)+Math.pow(e.touches[0].clientY-e.touches[1].clientY,2));
        }
    }
    if(e.touches.length != 2){
        if(zooming == true){
            pFactor = factor;
            zooming = false;
            if(factor > 1){
                document.body.style.transition = "";
                document.body.style.overflow = "scroll";
                document.body.style.transform = "scale("+factor+")";
                document.body.style.width = "initial";
            }
            else
            {
                document.body.style.transform = "initial";
                document.body.style.overflow = "initial";
                document.body.style.width = "initial";
            }
        }
    }
});