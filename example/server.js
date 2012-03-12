var http = require('http')
   , latlon = require('../lib/geo/latlon')
   , geo = require('../lib/geo/geo');


http.createServer(function (req, res) { 
  var p1 = new latlon.LatLon(geo.parseDMS(45.0652534), geo.parseDMS(7.6577738));
  var brng = geo.parseDMS(135);
  console.log (brng);

  var dist = Math.sqrt(2);
  var p2 = p1.destinationPoint(brng, dist);

  console.log(p2.lat()+' , '+p2.lon());
 
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(3000, "127.0.0.1");
console.log('Server running at http://127.0.0.1:3000/');
