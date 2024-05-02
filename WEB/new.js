export default {
  template: /*html*/ `
          <ul>
              <li v-for="title in titles" >
              <span id=titles>{{title.text1}}</span>
              </li>
          </ul>
          <p class=aside1>
              <ul>
                  <li v-for="asidetext in asidetexts">
                  <span style="vertical-align:middle"><img v-bind:src="asidetext.img" width="30" height="30">{{asidetext.text1}}</span>
                  </li>
              </ul>
              <ul>
                  <li v-for="timetext in timetexts">
                  <span>{{timetext.time}}</span>
                  </li>
              </ul>
          </p>
          <div class="echart" id="mychart" style="width: 900px; height: 600px"></div>
    `,
  data() {
    /*var arr1 = [];
      var arr2 = [];
      for (let i = 0; i < 50; i++) {
        arr1.push(this.tmpv(i));
        arr2.push(this.orpv(i));
      }*/
    return {
      /*array1: arr1,
        array2: arr2,*/
      titles: [
        { id: 1, text1: "● 溫度正常" },
        { id: 2, text1: "● orp正常" },
      ],
      asidetexts: [
        { id: 1, text1: "風扇1未開啟", img: "./circle-RED.png" },
        { id: 2, text1: "水泵1未開啟", img: "./circle-RED.png" },
      ],
      timetexts: [
        { id: 1, time: "在 XXXX/XX/XX XX:XX:XX 時" },
        { id: 2, time: "在 XXXX/XX/XX XX:XX:XX 時" },
        { id: 3, time: "在 XXXX/XX/XX XX:XX:XX 時" },
        { id: 4, time: "在 XXXX/XX/XX XX:XX:XX 時" },
      ],
      url: "https://iwdvc39axk.execute-api.us-east-1.amazonaws.com/default/getvalue",
    };
  },
  mounted() {
    this.initEcharts();
  },

  methods: {
    updatetitles(num) {
      // 你可以在这里根据需要更新 titles 的值
      if (num == 1) {
        this.titles[0].text1 = "● 警告!!警告!!\n溫度已過高!!!";
      } else if (num == 2) {
        this.titles[1].text1 = "● 警告!!警告!!\norp已過高!!!";
      } else if (num == 3) {
        this.titles[0].text1 = "● 溫度正常";
      } else if (num == 4) {
        this.titles[0].text1 = "● orp正常";
      } else {
        this.titles = [
          { id: 1, text1: "● 溫度正常" },
          { id: 2, text1: "● orp正常" },
        ];
      }
    },
    updateasidetexts(num) {
      if (num == 1) {
        this.asidetexts[0].text1 = "風扇1開啟";
        this.asidetexts[0].img = "./circle-GREEN.png";
      } else if (num == 2) {
        this.asidetexts[1].text1 = "水泵1開啟";
        this.asidetexts[1].img = "./circle-GREEN.png";
      } else if (num == 3) {
        this.asidetexts[0].text1 = "風扇1未開啟";
        this.asidetexts[0].img = "./circle-RED.png";
      } else if (num == 4) {
        this.asidetexts[0].text1 = "水泵1未開啟";
        this.asidetexts[0].img = "./circle-RED.png";
      } else {
        this.asidetexts = [
          { id: 1, text1: "風扇1未開啟", img: "./circle-RED.png" },
          { id: 2, text1: "水泵1未開啟", img: "./circle-RED.png" },
        ];
      }
    },
    updatetimetexts(num) {
      var nowtime = new Date();
      if (num == 1 || 3) {
        this.timetexts[num - 1].time = "在 " + nowtime + "時 開啟";
      } else if (num == 2 || 4) {
        this.timetexts[num - 1].time = "在 " + nowtime + "時 關閉";
      } else {
        this.timetexts = [
          { id: 1, time: "在 XXXX/XX/XX XX:XX:XX 時 開啟" },
          { id: 2, time: "在 XXXX/XX/XX XX:XX:XX 時 關閉" },
          { id: 3, time: "在 XXXX/XX/XX XX:XX:XX 時 開啟" },
          { id: 4, time: "在 XXXX/XX/XX XX:XX:XX 時 關閉" },
        ];
      }
    },
    initEcharts() {
      var arr1 = [];
      var arr2 = [];
      var request = new XMLHttpRequest();
      let url = this.url;
      var valdata = [];
      var data = [];
      var now;
      var tmp;
      var orp;
      var num;
      var tempthreshold = 20;
      var orpthreshold = 1000;
      var tempreturn = 24.5;
      var orpreturn = 480;
      var tmpnum = 0;
      var orpnum = 0;
      var tmpmod = 0;
      var orpmod = 0;
      var warntimes = 10;
      var number;
      var currecttime;
      let self = this;
      request.open("GET", url, false);
      request.onload = function reqOnload() {
        const test = this.responseText;
        data = JSON.parse(test);
        //console.log(data);
      };
      request.send();
      //console.log(data);

      for (var i = 0; i < 50; i++) {
        num = 49 - i;
        //console.log(data[num].Temperature);
        tmp = data[num].Temperature.N;
        orp = data[num].Orpvalue.N;
        now = data[num].Timestamp.S;
        currecttime = new Date(now);
        if (i > 0) {
          //console.log(arr1[0].name);
          number = arr1.length - 1;
          if (arr1[number].name == now) {
            currecttime.setTime(currecttime.getTime() + 10 * 1000);
          }
        }
        if (tmp > tempthreshold) {
          if (tmpnum < warntimes) {
            this.updatetitles(1);
            this.updateasidetexts(1);
            if (tmpmod == 0) {
              this.updatetimetexts(1);
            }
            tmpnum = 0;
            tmpmod = 1;
          } else {
            tmpnum = tmpnum + 1;
          }
        } else if (tmp == tempreturn) {
          this.updatetitles(3);
          this.updateasidetexts(3);
          if (tmpmod == 1) {
            this.updatetimetexts(2);
            orpmod = 0;
          }
        } else {
          this.updatetitles(3);
          this.updateasidetexts(3);
        }
        if (orp > orpthreshold) {
          if (orpnum > warntimes) {
            this.updatetitles(2);
            this.updateasidetexts(2);
            if (orpmod == 0) {
              this.updatetimetexts(3);
            }
            orpnum = 0;
            orpmod = 1;
          } else {
            orpnum = orpnum + 1;
          }
        } else if (orp == orpreturn) {
          this.updatetitles(4);
          this.updateasidetexts(4);
          if (orpmod == 1) {
            this.updatetimetexts(4);
            orpmod = 0;
          }
        } else {
          this.updatetitles(4);
          this.updateasidetexts(4);
        }
        //console.log(currecttime);
        arr1.push({ name: currecttime, value: [currecttime, tmp] });
        arr2.push({ name: currecttime, value: [currecttime, orp] });
      }
      //console.log(arr1.length);
      const option = {
        title: { text: "Temperature & ORP" },
        length: {},
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#283b56", // '#283b56',
              animation: true,
            },
          },
        },
        xAxis: [
          {
            type: "time",
            name: "time",
            nameTextStyle: {
              fontSize: 24, // 设置 x 轴名称的字体大小
              color: "red",
            },
            nameGap: 30,
            axisLabel: {
              fontSize: 12,
              show: true,
            },
            splitLine: {
              show: true,
            },
            //splitNumber: 5, // 设置轴线分割的间隔数为5，即每隔5秒显示一个刻度
            //minInterval: 10000, // 设置轴线刻度间隔为5秒，单位为毫秒
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
            nameTextStyle: {
              fontSize: 24, // 设置 y 轴名称的字体大小
              color: "red",
            },
            //boundaryGap: ['20%', '20%'],
            //splitNumber: 5,
            axisLabel: {
              fontSize: 12,
              show: true,
              interval: "auto",
              formatter: "{value} ℃",
            },
          },
          {
            type: "value",
            min: 0,
            max: 1500,
            interval: 250,
            nameLocation: "end",
            position: "right",
            name: "ORP",
            nameTextStyle: {
              fontSize: 24, // 设置 y 轴名称的字体大小
              color: "red",
            },
            //boundaryGap: ['20%', '40%'],
            //splitNumber: 5,
            axisLabel: {
              fontSize: 12,
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
            data: arr1,
            markLine: {
              nameGap: "50",
              symbol: ["none", "none"],
              silent: true,
              lineStyle: {
                normal: {
                  type: "solid",
                  color: "#FFA500",
                },
              },
              data: [
                {
                  yAxis: tempthreshold,
                },
              ],
              label: {
                normal: {
                  formatter: "\t\t\t\t\t\t\t\ttmp正常值\n",
                  color: "#FFA500",
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
            data: arr2,
            markLine: {
              nameGap: "50",
              symbol: ["none", "none"],
              silent: true,
              lineStyle: {
                normal: {
                  type: "solid",
                  color: "#FFA500",
                },
              },
              data: [
                {
                  yAxis: orpthreshold,
                },
              ],
              label: {
                normal: {
                  formatter: "\n\t\t\t\t\t\t\t\torp標準值",
                  color: "#FFA500",
                },
              },
            },
          },
        ],
      };
      let myChart = echarts.getInstanceByDom(
        document.getElementById("mychart"),
        null,
        { width: "900", heigh: "600" },
        { renderer: "canvas", useDirtyRect: false }
      );
      if (myChart == null) {
        myChart = echarts.init(
          document.getElementById("mychart"),
          null,
          { width: "900", heigh: "600" },
          { renderer: "canvas", useDirtyRect: false }
        );
      } //values.js 286
      setInterval(function () {
        for (var i = 0; i < 1; i++) {
          function tmpv() {
            var request = new XMLHttpRequest();
            var Temperature;
            var inserttime;
            request.open("GET", url, false);
            request.onload = function reqOnload() {
              const test = this.responseText;
              const data = JSON.parse(test);
              Temperature = data[0].Temperature.N;
              inserttime = data[0].Timestamp.S;
            };
            request.send();
            console.log(inserttime, arr1[49].name);
            if (inserttime > arr1[49].name) {
              inserttime = new Date(inserttime);
              console.log(2);
              return {
                name: inserttime,
                value: [inserttime, Temperature],
              };
            } else {
              currecttime = new Date(arr1[49].name);
              currecttime.setTime(currecttime.getTime() + 10 * 1000);
              console.log(1);
              return {
                name: currecttime,
                value: [currecttime, Temperature],
              };
            }
          }
          function orpv() {
            var request = new XMLHttpRequest();
            var Orpvalue;
            var inserttime;
            request.open("GET", url, false);
            request.onload = function reqOnload() {
              const test = this.responseText;
              const data = JSON.parse(test);
              Orpvalue = data[0].Orpvalue.N;
              inserttime = data[0].Timestamp.S;
            };
            request.send();
            if (inserttime > arr2[49].name) {
              inserttime = new Date(inserttime);
              return {
                name: inserttime,
                value: [inserttime, Orpvalue],
              };
            } else {
              currecttime = new Date(arr2[49].name);
              currecttime.setTime(currecttime.getTime() + 10 * 1000);
              return {
                name: currecttime,
                value: [currecttime, Orpvalue],
              };
            }
          }
          console.log(arr1[46]);
          console.log(arr1[47]);
          console.log(arr1[48]);
          console.log(arr1[49]);
          //console.log(arr1.length);
          arr1.push(tmpv());
          arr2.push(orpv());
          //console.log(arr1.length);
          arr1.shift();
          arr2.shift();
          //console.log(arr1.length);
          tmp = arr1[49].value[1];
          orp = arr2[49].value[1];
          //console.log(tmp);
          //console.log(orp);
          if (tmp > tempthreshold) {
            if (tmpnum > warntimes) {
              self.updatetitles(1);
              self.updateasidetexts(1);
              if (tmpmod == 0) {
                self.updatetimetexts(1);
              }
              tmpnum = 0;
              tmpmod = 1;
            } else {
              tmpnum = tmpnum + 1;
              //console.log(tmpnum);
            }
          } else if (tmp == tempreturn) {
            self.updatetitles(3);
            self.updateasidetexts(3);
            if (tmpmod == 1) {
              self.updatetimetexts(2);
              orpmod = 0;
            }
          } else {
            self.updatetitles(3);
            self.updateasidetexts(3);
          }
          if (orp > orpthreshold) {
            if (orpnum > warntimes) {
              self.updatetitles(2);
              self.updateasidetexts(2);
              if (orpmod == 0) {
                self.updatetimetexts(3);
              }
              orpnum = 0;
              orpmod = 1;
            } else {
              orpnum = orpnum + 1;
            }
          } else if (orp == orpreturn) {
            self.updatetitles(4);
            self.updateasidetexts(4);
            if (orpmod == 1) {
              self.updatetimetexts(4);
              orpmod = 0;
            }
          } else {
            self.updatetitles(4);
            self.updateasidetexts(4);
          }
          //335~346
        }
        myChart.setOption({
          series: [{ data: arr1 }, { data: arr2 }],
        });
      }, 10000);
      if (option && typeof option === "object") {
        myChart.setOption(option);
      }
      window.addEventListener("resize", myChart.resize);
    },
  },
};
