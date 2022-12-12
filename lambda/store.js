/*
@Firetail v0.3.0
@author Brian Shannon
*/
"use strict";
const data = require('./animals.json')
const scribbles = require("scribbles");
const parseXmlString = require('xml2json');

//console.log(scribbles)
global.console = scribbles
const firetailSetup = require("/Users/bri/Firetail/firetail-js-lib/dist")//require("@public.firetail.io/firetail-api");

const firetailWrapper = firetailSetup({
  addApi: "./petstore.yaml",
  authCallbacks:{
    jwt:({authorization})=>{
      const token = authorization.split(" ").pop().replace(/['"]+/g, '')
      const [header,payload,signature] = token.split('.')
      const headerObj  = JSON.parse(Buffer.from(header,  'base64').toString())
      const payloadObj = JSON.parse(Buffer.from(payload, 'base64').toString())
      return payloadObj
    }
  },
  customBodyDecoders:{
    'application/xml': body => parseXmlString.toJson(body,{object:true}).Pet
  }
})

module.exports.listpets = firetailWrapper((event,context) => {
  const statusCode = 200
  if(event.queryStringParameters
  && event.queryStringParameters.limit){
    return {
      statusCode,
      body: JSON.stringify(data.slice(0, event.queryStringParameters.limit)),
    };
  }
  return {
    statusCode,
    body: JSON.stringify(data)
  };
}); // END listpets

module.exports.addpets = firetailWrapper((event,context) => {

  const body = JSON.parse(event.body)

  const id = data.reduce((max, curren) => max.id > curren.id ? max : curren).id +1
  const newItem = {...body,id}
  data.push(newItem)

  const dataAsXml = `<?xml version="1.0" encoding="UTF-8"?>
                     <Pet>${
                       Object.keys(newItem)
                               .map(key=>`<${key}>${newItem[key]}</${key}>`)
                               .join("")
                     }</Pet>`
  const result = {
    statusCode:201,
    body: dataAsXml,
    headers: { "Content-Type": "application/xml" }
  };
  return result
}); // END addpets
