const _ = require('lodash');
const nj = require('numjs');

function generate(){
  let array = []
  for(var i = 1; i < 5; i++) {
   let subArray = nj.arange(9).tolist();
   let arrayTransForm = _.map(subArray,(value) => value + 1);
   array.push(arrayTransForm); 
  }
  console.log(array);
};

generate();

