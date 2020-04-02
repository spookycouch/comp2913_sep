var db = require('./db.js');

/*
 *  Function:   Get Facility Activities
 *  Output:     Error Message
*/
exports.getFacilityActivities = function(id){

    return new Promise(function(resolve, reject) {

        db.getFacilityActivities(id).then(function(results){

            resolve(results);

        }).catch(function(err){

            reject(err);
        });
    });
}

/*
 *  Function:   Get All Activities
 *  Output:     Error Message
*/
exports.getAllActivities = function(){

    return new Promise(function(resolve, reject) {

        db.getAllActivities().then(function(results){

            // let arr = [];
            // results.forEach(function(element){

            //     arr.push(element.id);
            // });

            resolve(results);

        }).catch(function(err){
            
            reject(err);
        });
    });
}

/*
 *  Function:   Get All Facilities
 *  Output:     Error Message
*/
exports.getAllFacilities = function(){

    return new Promise(function(resolve, reject) {

        db.getAllFacilities().then(function(results){

            resolve(results);

        }).catch(function(err){
            
            reject(err);
        });
    });
}

/*
 *  Function:   Get All Sports
 *  Output:     Error Message
*/
exports.getAllSports = function(){

    return new Promise(function(resolve, reject) {

        db.getAllSports().then(function(results){

            resolve(results);

        }).catch(function(err){
            
            reject(err);
        });
    });
}

/*
 *  Function:   Get Monthly Pricing
 *  Input:      Type:int
 *  Output:     Error Message
*/
exports.getMonthlyPricing = function(){

    return new Promise(function(resolve, reject) {

        db.getPricingByType(1).then(function(results){

            resolve(results);

        }).catch(function(err){
            
            reject(err);
        });
    });
}

/*
 *  Function:   Get Yearly Pricing
 *  Input:      Type:int
 *  Output:     Error Message
*/
exports.getYearlyPricing = function(){

    return new Promise(function(resolve, reject) {

        db.getPricingByType(2).then(function(results){

            resolve(results);

        }).catch(function(err){
            
            reject(err);
        });
    });
}

/*
 *  Function:   Get Sports Pass
 *  Input:      Type:int
 *  Output:     Error Message
*/
exports.getSportsPassPricing = function(){

    return new Promise(function(resolve, reject) {

        db.getPricingByType(3).then(function(results){

            resolve(results);

        }).catch(function(err){
            
            reject(err);
        });
    });
}

/*
 *  Function:   Get All Pricings
 *  Output:     Error Message
*/
exports.getPricingBySport = function(sportId){

    return new Promise(function(resolve, reject) {

        db.getPricingBySport(sportId).then(function(results){

            resolve(results);

        }).catch(function(err){
            
            reject(err);
        });
    });
}

exports.getPricingByType = function(type) {
    return new Promise(function(resolve, reject) {

        db.getPricingByType(type).then(function(results) {

            resolve(results);

        }).catch(function(err) {

            reject(err);

        });

    });
}   