var LatLon = require('./geo/latlon').LatLon
  , geo = require('./geo/geo');


function Geocradle() {
  this.db;  
};

Geocradle.prototype.init = function (theDb) {
  this.db = theDb;
};

/**
 * Store position into db
 * Support method
 *
 */ 
Geocradle.prototype.storePosition = function (id,jsonObj,callback) {
  var fn =  function (err, resCouch) {
    if (err) {
      console.log('+Geocradle --- error', err);
    }
    else 
      console.log('+Geocradle --- couch result', JSON.stringify(resCouch))
    
    callback(err,resCouch);
  };

  if (id)
    // todo - decide between merge and save
    // if get --> true -> merge else save
    this.db.merge(id,jsonObj,fn);
  else
    this.db.save(jsonObj,fn);
  return ;
};

/**
  * query - contains element for querying
  * query.bbox - bbox for query -> ll_lon,ll_lat,ur_lon,ur_lat
  * query.latitude - latitude of a point
  * query.longitude - longitude of a point
  * query.count - if true number of rows will be returned
  */

Geocradle.prototype.loadPositions = function (viewName,query,callback) {
  if (query.latitude)
    query.bbox = this._retrieveBbox(query);
  
  if (!query.bbox)
    throw new Error('Invalid parameters');

  this.db.spatial(viewName, query, function (err, doc) {     
    if (doc) {
      console.dir(doc);
    }
    else {
      console.dir(err);
    }
    callback(err,doc);
  });
  return;

};

/*
 * Create point in a LatLon format from a Point Object 
 * representing its coordinates
 *
 */
Geocradle.prototype._createPoint = function(point){
  return new LatLon(geo.parseDMS(point.latitude), geo.parseDMS(point.longitude));
}

/*
 * retrieve bbox from a given point coordinates
 * upper-left corner
 * lower-right corner
 */
Geocradle.prototype._retrieveBbox = function(point){
  var p1 = this._createPoint(point);

  // in case point distance is defined set distance 
  // as Math.sqrt( 2 * Math.pow(distance,2))
  var dist = point.distance || Math.sqrt(2);
  var brng = geo.parseDMS(-135);

  var lowerLeftCorner = p1.destinationPoint(brng, dist);
  var sx =  lowerLeftCorner.lon()+ ',' + lowerLeftCorner.lat();
  console.log('+Geocradle --- lower left corner: ' + sx);
  
  brng = geo.parseDMS(brng+180);
  var upperRightCorner = p1.destinationPoint(brng, dist);
  var dx = upperRightCorner.lon() + ',' + upperRightCorner.lat();
  console.log('+Geocradle --- upper right corner: ' + dx);

  return sx + ',' + dx;
}

/* 
 * calculate distance in meters between two coordinates 
 */
Geocradle.prototype.calculateDistance = function(sourcePoint, destPoint){
  var source = this._createPoint(sourcePoint);
  var dest = this._createPoint(destPoint);

  return (source.distanceTo(dest)) * 1000;
}

exports = module.exports = new Geocradle();
