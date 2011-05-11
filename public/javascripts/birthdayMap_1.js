var mint = pv.min(wishes, function(w) {return Date.parse(w.created_time)});
var maxt = pv.max(wishes, function(w) {return Date.parse(w.created_time)});

console.log(mint);
mint = mint/1000/60/60; // turn to hours
maxt = maxt/1000/60/60; // turn to hours

var startt = 0;
var endt = maxt-mint;
if (!maxt) {
    endt = 27;
}


console.log(endt);
var t = endt;
$('#time').slider({
  min: startt,
  max: endt,
  value: endt,
  slide: function(e, ui) {
    t = ui.value;
    vis.render();
  }

});
$('#play').click(function() {
        console.log('Strart!')
        playClick()
    });
//var year = us_stats.maxYear;

var w =  window.innerWidth - 15,
    h = window.innerWidth/1.68,
    yearsMargin = 10;

var scale = pv.Geo.scale()
    .domain({lng: -130, lat:-50}, {lng: 160, lat: 70})
    .range({x: 0, y: 0}, {x: w, y: h});

var yearsScale = pv.Scale.linear()
    .domain(startt, endt)
    .range(yearsMargin + 2, w - yearsMargin);

//// Colors by ColorBrewer.org, Cynthia A. Brewer, Penn State.
//var col = function(v) {
//  if (v < 17) return "#008038";
//  if (v < 20) return "#A3D396";
//  if (v < 23) return "#FDD2AA";
//  if (v < 26) return "#F7976B";
//  if (v < 29) return "#F26123";
//  if (v < 32) return "#E12816";
//  return "#B7161E";
//};

// Find the centroid for each country
countries.forEach(function(c) {
  c.code = c.code.toUpperCase();
  c.centLatLon = centroid(c.borders[0]);
});

var timer = undefined;
function playClick() {
  if (timer) {
    stop();
  } else {
    if (t >= endt) t = startt;
    $(time).slider('value', t);
    $(play).removeClass('ui-icon-play').addClass('ui-icon-stop');
    vis.render();
    timer = setInterval(function() {
      t++;
      if (t >= endt) stop();
      $(time).slider('value', t);
      vis.render();
      var thedate = new Date((mint+t)*60*60*1000);
       $(timeCont).html(thedate.toLocaleDateString() + ' - ' + thedate.toLocaleTimeString());
    }, 500);
  }
}

// Stop the animation
function stop() {
  clearInterval(timer);
  timer = undefined;
  $(play).removeClass('ui-icon-stop').addClass('ui-icon-play');
}

// Add the main panel
var vis = new pv.Panel()
    .width(w)
    .height(h)
    .top(30)
    .bottom(20);

//// Add the ticks and labels for the year slider
vis.add(pv.Rule)
    .data(pv.range(mint, maxt))
    .left(yearsScale)
    .height(4)
    .top(-20)
  .anchor("bottom").add(pv.Label);

// Add a panel for each country
var country = vis.add(pv.Panel)
    .data(countries);

// Add a panel for each state land mass
country.add(pv.Panel)
    .data(function(c) {return c.borders})
  .add(pv.Line)
    .data(function(l) {return l})
    .left(scale.x)
    .top(scale.y)
    .fillStyle('#ddd')
    .lineWidth(1)
    .strokeStyle("white")
    .antialias(true); // FOR THE WIN

//// Add a label with the state code in the middle of every state
//vis.add(pv.Label)
//    .data(countries)
//    .left(function(c) {return scale(c.centLatLon).x })
//    .top(function(c) {return scale(c.centLatLon).y })
//    .text(function(c) {return c.code})
//    .textAlign("center")
//    .textBaseline("middle");




/// now for the birthdays overlay
 var punto = vis.add(pv.Panel)
                  .events("all")
                  .event("mousemove", pv.Behavior.point())
                  .add(pv.Dot)
                  .data(wishes)
                  .visible(function (d) {
                    var thist = new Date(d.created_time).getTime()/1000/60/60;
                    return ((thist - mint) <= t);
                  })
                  .def("active", -1)
                  .cursor("pointer")
                  .left(function(d) {return scale({lng: d.location.lng, lat: d.location.lat}).x;})
                  .top(function(d) {return scale({lng: d.location.lng, lat: d.location.lat}).y})
                  .strokeStyle("#000")
                  .lineWidth(0)
                  .fillStyle(pv.color("#ff2222").alpha(0.4))
                  .size(15)
                  .event("point", function() {
//                         this.left(this.left() + 1);
//                         this.top(this.top() + 1);
                         this.active(this.index);
                         vis.render();
                     })
                  .event("unpoint", function() {
                      this.active(-1)
//                      this.left(this.left() - 5);
//                      this.top(this.top() - 5);
                       vis.render();
              });
            var cont = punto.anchor('right').add(pv.Bar)
                    .visible(function() {return this.anchorTarget().active() == this.index})
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





// Add the color bars for the color legend
//vis.add(pv.Bar)vi
//    .data(pv.range(14, 32.1, 3))
//    .bottom(function(d) this.index * 12)
//    .height(10)
//    .width(10)
//    .left(5)
//    .fillStyle(function(d) col(14 + 3 * this.index))
//    .lineWidth(null)
//  .anchor("right").add(pv.Label)
//    .textAlign("left")
//    .text(function(d) d + " - " + (d + 3) + "%");

vis.render();