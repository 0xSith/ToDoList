exports.getDate = function(){
let options = {
  day: "numeric",
  weekday: "long",
  month: "short"
};
let today = new Date();
return day = today.toLocaleDateString("en-US", options);
}
