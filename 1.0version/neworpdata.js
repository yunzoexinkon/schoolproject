let now = new Date();
let warntimes = 10;

let mod2 = 1;
let warncnt2 = 0;
let Orp;
let num;

// 宣告一個 XHR 的物件
var request = new XMLHttpRequest();
let url = "http://192.168.0.110:5000/value";
//let url = "http://192.168.204.182:5000/value";
function neworpdata(orpthreshold, orpreturn) {
  now = new Date();
  request.open("GET", url, false);

  // 如果成功就執行 reqOnload()
  request.onload = function reqOnload() {
    const test = this.responseText;
    const data = JSON.parse(test);
    num = data.length;
    Orp = data[num - 1].Orpvalue;
    now = data[num - 1].Nowtime;
    //document.getElementById("results").innerHTML = Orp;
    //console.log(data);
  };
  // 送出請求
  request.send();
  if (Orp > orpthreshold) {
    if (warncnt2 == warntimes) {
      document.getElementById("warntext_orp").innerHTML =
        "● 警告!!警告!!\nORP值已過高!!!";
      document.getElementById("orptext1").innerHTML =
        "<span style='vertical-align:middle'><img src='circle-GREEN.png' alt='綠燈' width='30' height='30'></span>水泵1已開啟";
      document.getElementById("warnhistoric3").textContent = now;
      /*[now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/") +
        " " +
        [now.getHours(), now.getMinutes(), now.getSeconds()].join(":");*/
      document.getElementById("warnhistoric4").innerHTML = "水泵1開啟";
      warncnt2++;
    } else if (warncnt2 > warntimes) {
      mod2 = 2;
    } else {
      mod2 = 1;
      warncnt2++;
    }
  } else if (Orp > orpreturn) {
    if (warncnt2 > warntimes) {
      mod2 = 2;
    } else {
      mod2 = 1;
      warncnt2 = 0;
    }
  } else {
    mod2 = 1;
    document.getElementById("warntext_orp").innerHTML = "● ORP值正常";
    document.getElementById("orptext1").innerHTML =
      "<span style='vertical-align:middle'><img id='img_light1' src='circle-RED.png' alt='紅燈' width='30' height='30'></span>水泵1未開啟";
    if (warncnt2 > 1) {
      document.getElementById("warnhistoric7").textContent = now;
      /*[now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/") +
        " " +
        [now.getHours(), now.getMinutes(), now.getSeconds()].join(":");*/
      document.getElementById("warnhistoric8").innerHTML = "水泵1關閉";
    } else {
    }
    warncnt2 = 0;
  }

  return {
    name: now.toString(),
    value: [
      now,
      /*[now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/") +
        " " +
        [now.getHours(), now.getMinutes(), now.getSeconds()].join(":"),*/
      Orp,
      //Math.round(tempvalue),
      //parseFloat(tempvalue.toFixed(2)),
    ],
  };
}

export default neworpdata;
