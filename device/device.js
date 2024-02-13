const db = require('./lib/db');
var qs = require('querystring');
const { request } = require('http');
const { response } = require('express');
const { error } = require('console');

module.exports = {
 test: function(request, response) {
    const test_value = request.query.test_value;
    if (test_value == 1){
        return response.json({
            success: false,
        message:'No',
        testValue: test_value
        })
    }
    return response.json({
        success: true,
        message:'Ok',
        testValue: test_value
    })
 },
 makecocktail: function(request, response){
    const cocktail_name = request.query.cocktail_name
    const first = request.query.first
    const second = request.query.second
    const third = request.query.third
    const fourth = request.query.fourth
    return response.json({
        cocktail_name: cocktail_name,
        first: first,
        second: second,
        third: third,
        fourth: fourth
    })
 }
}
