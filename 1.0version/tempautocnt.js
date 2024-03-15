var now = new Date();
let warntimes = 10;

let mod1 = 1;
let warncnt1 = 0;
var Temperature;
let number;

// 宣告一個 XHR 的物件
var request = new XMLHttpRequest();
let url = "http://192.168.0.110:5000/value";
function firsttempdata(tempthreshold, tempreturn, num) {
  now = new Date();
  request.open("GET", url, false);

  // 如果成功就執行 reqOnload()
  request.onload = function reqOnload() {
    const test = this.responseText;
    const data = JSON.parse(test);
    //console.log(num);
    Temperature = data[data.length - 20 + num].Temperature;
    //console.log(data.length + num);
    now = data[data.length - 20 + num].Nowtime;
    //console.log(now);
    //document.getElementById("results").innerHTML = Temperature;
    //console.log(data);
    console.log("inside" + now);
  };
  // 送出請求
  request.send();
  if (Temperature > tempthreshold) {
    if (warncnt1 == warntimes) {
      document.getElementById("warntext_tmp").innerHTML =
        "● 警告!!警告!!\n溫度已過高!!!";
      document.getElementById("temptext1").innerHTML =
        "<span style='vertical-align:middle'><img src='circle-GREEN.png' alt='綠燈' width='30' height='30'></span>風扇已開啟";
      document.getElementById("warnhistoric1").textContent = now;
      /*[now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/") +
        " " +
        [now.getHours(), now.getMinutes(), now.getSeconds()].join(":");*/
      document.getElementById("warnhistoric2").innerHTML = "風扇1開啟";
      warncnt1++;
    } else if (warncnt1 > warntimes) {
      mod1 = 2;
    } else {
      mod1 = 1;
      warncnt1++;
    }
  } else if (Temperature > tempreturn) {
    if (warncnt1 > warntimes) {
      mod1 = 2;
    } else {
      mod1 = 1;
      warncnt1 = 0;
    }
  } else {
    mod1 = 1;
    document.getElementById("warntext_tmp").innerHTML = "● 溫度正常";
    document.getElementById("temptext1").innerHTML =
      "<span style='vertical-align:middle'><img id='img_light1' src='circle-RED.png' alt='紅燈' width='30' height='30'></span>風扇1未開啟";
    if (warncnt1 > 1) {
      document.getElementById("warnhistoric5").textContent = now;
      /*[now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/") +
        " " +
        [now.getHours(), now.getMinutes(), now.getSeconds()].join(":");*/
      document.getElementById("warnhistoric6").innerHTML = "風扇1關閉";
    } else {
    }
    warncnt1 = 0;
  }

  return {
    name: now,
    value: [
      now,
      /*[now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/") +
        " " +
        [now.getHours(), now.getMinutes(), now.getSeconds()].join(":"),*/
      Temperature,
      //Math.round(Temperature),
      //parseFloat(Temperature.toFixed(2)),
    ],
  };
}

export default firsttempdata;
