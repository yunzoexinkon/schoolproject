//import cnt from "./tempautocnt.js";
import firsttempdata, * as ft from "./tempautocnt.js";
import firstorpdata from "../orpautocnt.js";
import newtempdata from "./newtempdata.js";
import neworpdata from "./neworpdata.js";
let dom = document.getElementById("container");
let myChart = echarts.init(
  dom,
  null,
  { width: "900", heigh: "600" },
  { renderer: "canvas", useDirtyRect: false }
);
let option;
let mod1 = 1;
let mod2 = 1;
let warncnt1 = 0;
let warncnt2 = 0;
let warntimes = 20;
let tempthreshold = 20;
let tempreturn = 12;
let tempspeednormal = Math.random() * 1.3 - 0.5;
let tempspeedslow = Math.random() * 1.1 - 0.8;
let orpthreshold = 100;
let orpreturn = 60;
let orpspeednormal = Math.random() * 4.5 - 1.25;
let orpspeedslow = Math.random() * 5 - 2.75;
let tmpdata = [];
let orpdata = [];
let now = new Date();
let oneSec = 1000;
let tempvalue = 10;
let orpvalue = 50;
let a = 0;
let num;
for (num = 0; num < 20; num++) {
  tmpdata.push(firsttempdata(tempthreshold, tempreturn, num));
  orpdata.push(firstorpdata(orpthreshold, orpreturn, num));
  //console.log(tmpdata);
}
option = {
  title: {
    text: "Temperature & ORP",
  },
  legend: {},
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "#283b56", // '#283b56',
        animation: true,
      },
    },
    /*formatter: function (params) {	//屬標顯示
					params = params[0];	
					var date = new Date(params.name);
						return (
							date.getDate() +
							'/' +
							(date.getMonth() + 1) +
							'/' +
							date.getFullYear() +
							' ' +
							date.getHours() +
							':' +
							date.getMinutes() +
							':' +
							date.getSeconds() +
							' : ' +
							params.tempvalue[1] //+ ' / ' + params.orpvalue[2]
						);	*/
  },
  xAxis: [
    {
      type: "time",
      name: "time",
      nameGap: "50",
      axisLabel: {
        show: true,
        index: 2,
      },
      splitLine: {
        show: true,
      },
    },
  ],

  yAxis: [
    {
      type: "value",
      min: 0,
      max: 30,
      interval: 5,
      nameLocation: "end",
      position: "left",
      name: "temp",
      //boundaryGap: ['20%', '20%'],
      //splitNumber: 5,
      axisLabel: {
        show: true,
        interval: "auto",
        formatter: "{value} ℃",
      },
    },
    {
      type: "value",
      min: 0,
      max: 150,
      interval: 25,
      nameLocation: "end",
      position: "right",
      name: "ORP",
      //boundaryGap: ['20%', '40%'],
      //splitNumber: 5,
      axisLabel: {
        show: true,
        interval: "auto",
        formatter: "{value} ",
      },
    },
  ],
  series: [
    {
      name: "temp",
      type: "line",
      //yAxisIndex: 0,
      showSymbol: false,
      data: tmpdata,
      markLine: {
        nameGap: "50",
        symbol: ["none", "none"],
        silent: true,
        lineStyle: {
          normal: {
            type: "solid",
            color: "blue",
          },
        },
        data: [
          {
            yAxis: tempthreshold,
          },
        ],
        label: {
          normal: {
            formatter: "tempthreshold \n\n\n\n\n\n",
            color: "blue",
          },
        },
      },
    },
    {
      name: "orp",
      type: "line",
      xaxisIndex: 0,
      yAxisIndex: 1,
      showSymbol: false,
      data: orpdata,
      markLine: {
        nameGap: "50",
        symbol: ["none", "none"],
        silent: true,
        lineStyle: {
          normal: {
            type: "solid",
            color: "green",
          },
        },
        data: [
          {
            yAxis: orpthreshold,
          },
        ],
        label: {
          normal: {
            formatter: "orpthreshold \n\n\n\n",
            color: "green",
          },
        },
      },
    },
  ],
};
setInterval(function () {
  for (var i = 0; i < 1; i++) {
    tmpdata.shift();
    orpdata.shift();
    /*
    // 如果成功就執行 reqOnload()
    request.onload = function reqOnload() {
      const data = JSON.parse(this.responseText);
      console(data);
      var Temperature = data.results[3].Temperature;
      document.getElementById("results").innerHTML = data;
    };
    // 定義連線方式
    request.open("GET", "http://127.0.0.1:5000/value", true);
    // 送出請求
    request.send();
    */
    tmpdata.push(
      newtempdata(
        //mod1,
        //warncnt1,
        tempthreshold,
        tempreturn,
        //tempspeednormal,
        //tempspeedslow,
        //tempvalue,
        oneSec
      )
    );
    orpdata.push(
      neworpdata(
        //mod2,
        //warncnt2,
        orpthreshold,
        orpreturn,
        //orpspeednormal,
        //orpspeedslow,
        //orpvalue,
        oneSec
      )
    );
    //console.log(mod1);
    //console.log(warncnt1);
    console.log(tmpdata.length);
    console.log(tmpdata);
  }
  myChart.setOption({
    series: [
      {
        data: tmpdata,
      },
      {
        data: orpdata,
      },
    ],
  });
}, 1000);
if (option && typeof option === "object") {
  myChart.setOption(option);
}

window.addEventListener("resize", myChart.resize);
