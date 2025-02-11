const apiKey = '442b8befaf604d5e8f8561187aa7412a';

let givelocation=(async(place)=>{
  console.log("place is :-",place)
    const ans={};
await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${place}&key=${apiKey}`)
  .then(response => response.json())
  .then(data => {
    console.log(data)
    const lat = data.results[0].geometry.lat;
    const lon = data.results[0].geometry.lng;
    ans.lat = lat;
    ans.lng = lon;
  
  })
  .catch(err=>{
    console.log(err)
  });
  return ans;})
  module.exports=givelocation;