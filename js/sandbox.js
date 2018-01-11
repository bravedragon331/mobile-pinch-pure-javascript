var dom = document.body,
_width = parseInt($('#envelope').css('width')),
_height = parseInt($('#envelope').css('height')),
minWidth = _width,
minHeight = _height,
scale, screenOffsetX, screenOffsetY, scrollX, scrollY;

document.getElementById('envelope').addEventListener("gesturestart", gestureStart, false)
document.getElementById('envelope').addEventListener("gesturechange", gestureChange, false)
document.getElementById('envelope').addEventListener("gestureend", gestureEnd, false);
dom.addEventListener('gesturechange', domGestureChange, false);
dom.addEventListener('gestureend', domGestureEnd, false);
function domGestureChange(e){
    e.preventDefault();
}
function domGestureEnd(e){
    e.preventDefault();
}

function gestureStart(e){    
    var rect = document.getElementById("envelope").getBoundingClientRect();
    screenOffsetX = e.clientX - rect.left;
    screenOffsetY = e.clientY - rect.top;
    scrollX = document.body.scrollLeft;
    scrollY = document.body.scrollTop;
}

function gestureChange(e) {

    e.preventDefault();

    scale = e.scale;
    var tempWidth = _width * scale;
    var tempHeight = _height * scale;
    
    if (tempWidth < minWidth) tempWidth = minWidth;
    if (tempHeight < minHeight) tempHeight = minHeight;

    //$('#scale').html(document.body.scrollTop);

    $('#envelope').css({
        'width': tempWidth + 'px',
        'height': tempHeight + 'px'
    });

    document.body.scrollTop = scrollY + screenOffsetY*(scale-1);
    document.body.scrollLeft = scrollX + screenOffsetX*(scale-1);
}

function gestureEnd(e) {
    e.preventDefault();
    _width = parseInt($('#envelope').css('width'));
    _height = parseInt($('#envelope').css('height'));
}



// Global vars to cache event state
var evCache = new Array();
var prevDiff = -1;

function pointerdown_handler(ev) {    
    evCache.push(ev);
}
function pointermove_handler(ev) {
    
    for (var i = 0; i < evCache.length; i++) {
        if (ev.pointerId == evCache[i].pointerId) {
            evCache[i] = ev;
            break;
        }
    }
    // If two pointers are down, check for pinch gestures
    if (evCache.length == 2) {
        // Calculate the distance between the two pointers
        var curDiff = Math.sqrt((evCache[0].clientX - evCache[1].clientX)*(evCache[0].clientX - evCache[1].clientX) + (evCache[0].clientY - evCache[1].clientY)*(evCache[0].clientY - evCache[1].clientY));
        
        var midX = (evCache[0].clientX + evCache[1].clientX)/2;
        var midY = (evCache[0].clientY + evCache[1].clientY)/2;        
        var rect = document.getElementById("envelope").getBoundingClientRect();
        var elementOffX = midX - rect.left;
        var elementOffY = midY - rect.top;

        if(prevDiff == -1) prevDiff = curDiff;
        var originalWidth = parseInt($('#envelope').css('width'));
        var originalHeight = parseInt($('#envelope').css('height'));
        var tempWidth = originalWidth * curDiff/prevDiff;
        var tempHeight = originalHeight * curDiff/prevDiff;
        
        if (tempWidth < minWidth) tempWidth = minWidth;
        if (tempHeight < minHeight) tempHeight = minHeight;

        $('#envelope').css({
            'width': tempWidth + 'px',
            'height': tempHeight + 'px'
        });

        //$('#scale').html(document.documentElement.scrollTop);
        document.documentElement.scrollTop += elementOffY*(curDiff/prevDiff - 1);
        document.documentElement.scrollLeft += elementOffX*(curDiff/prevDiff - 1);
        //window.scrollTo(document.documentElement.scrollLeft, document.documentElement.scrollTop);

        originalWidth = tempWidth;
        originalHeight = tempHeight;
        
        prevDiff = curDiff;        
    }
}

function pointerup_handler(ev) {
    
    remove_event(ev);
    
    if (evCache.length < 2) prevDiff = -1;
}
function remove_event(ev) {
    // Remove this event from the target's cache
    for (var i = 0; i < evCache.length; i++) {
        if (evCache[i].pointerId == ev.pointerId) {
            evCache.splice(i, 1);
            break;
        }
    }
}

function init() {
    // Install event handlers for the pointer target
    var el=document.getElementById("envelope");
    el.onpointerdown = pointerdown_handler;
    el.onpointermove = pointermove_handler;

    el.onpointerup = pointerup_handler;
    el.onpointercancel = pointerup_handler;
    el.onpointerout = pointerup_handler;
    el.onpointerleave = pointerup_handler;
}