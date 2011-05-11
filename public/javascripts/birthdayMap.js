/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


function Canvas(wishes, map) {
    this.wishes = wishes;
    this.map = map;
    this.setMap(map);
}

Canvas.prototype = pv.extend(google.maps.OverlayView);

Canvas.prototype.onAdd = function() {
    this.canvas = document.createElement("div");
    this.canvas.setAttribute("class", "canvas");
    this.getPanes().mapPane.appendChild(this.canvas);
    this.getPanes().overlayMouseTarget.appendChild(this.canvas);
}


Canvas.prototype.draw = function(){
            var m = this.map;
            var c = this.canvas;
            var r = 20;

            var projection = this.getProjection();

            var pixels = this.wishes.map(function(d) {
                
                return projection.fromLatLngToDivPixel(new google.maps.LatLng(d.location.lat, d.location.lng));
            });

            function x(p) {return p.x};
            function y(p) {return p.y};
              var x = {min: pv.min(pixels, x) - r, max: pv.max(pixels, x) + r};
              var y = {min: pv.min(pixels, y) - r, max: pv.max(pixels, y) + r};
              c.style.width = (x.max - x.min) + "px";
              c.style.height = (y.max - y.min) + "px";
              c.style.left = x.min + "px";
              c.style.top = y.min + "px";


            var panel = new pv.Panel()
                          .width(1100)
                          .height(500)
                          .canvas(c)
                          .left(-x.min)
                          .top(-y.min)
                          .events("all")
                          .event("mousemove", pv.Behavior.point())
                        .add(pv.Panel)
                          .data(this.wishes);
            var punto = panel.add(pv.Dot)
                  .def("active", -1)
                  .cursor("pointer")
                  .left(function() {return pixels[this.parent.index].x;})
                  .top(function() {return pixels[this.parent.index].y})
                  .strokeStyle("#000088")
                  .fillStyle(pv.color("#22FFff").alpha(0.5))
                  .size(40)
                  .event("point", function(d) { this.active(this.parent.index);
                         panel.render();

                    })
                  .event("unpoint", function() {
                      this.active(-1)
                       panel.render();
              });
            var cont = punto.anchor('right').add(pv.Bar)
                    .visible(function() {return this.anchorTarget().active() == this.parent.index})
                    .width(250)
                    .height(50)
                    .fillStyle(pv.color("#222222").alpha(0.5));
            var text = cont.anchor('left').add(pv.Label)
                    .text(function(d) {return d.message.slice(0,50)})
                    .textStyle("white")
                    .font("bold 9px sans-serif")
                    .textShadow("0.1em 0.1em 0.1em rgba(0,0,0,.5)");
            cont.add(pv.Label)
                    .top(function() {return text.top() + 10})
                    .text(function(d) {return d.message.slice(50,100)})
                    .textStyle("white")
                    .font("bold 9px sans-serif")
                    .textShadow("0.1em 0.1em 0.1em rgba(0,0,0,.5)")
            cont.add(pv.Label)
                    .top(function() {return text.top() + 20})
                    .text(function(d) {return d.message.slice(100)})
                    .textStyle("white")
                    .font("bold 9px sans-serif")
                    .textShadow("0.1em 0.1em 0.1em rgba(0,0,0,.5)")

                cont.anchor('top').add(pv.Label)
                    .text(function(d) {return d.from.name})
                    .textBaseline('top')
                    .textStyle("white")
                    .font("bold 12px sans-serif")
                    .textShadow("0.1em 0.1em 0.1em rgba(0,0,0,.5)");
            setTimeout( function() {
            panel.render();
            }, 500);
   
        }

        
formatMessage = function(message) {
    return message.slice(0,140)
}