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
      url: "http://192.168.0.114:5000/value",
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
      var datan = [];
      var now;
      var tmp;
      var orp;
      var num;
      var tempthreshold = 20;
      var orpthreshold = 800;
      var tempreturn = 24.5;
      var orpreturn = 480;
      var tmpnum = 0;
      var orpnum = 0;
      var tmpmod = 0;
      var orpmod = 0;
      var warntimes = 10;
      let self = this;
      request.open("GET", url, false);
      request.onload = function reqOnload() {
        const test = this.responseText;
        datan = JSON.parse(test);
      };
      request.send();
      for (var i = 0; i < 50; i++) {
        //console.log(data[10].Temperature);
        num = datan.length - 50 + i;
        tmp = datan[num].Temperature;
        orp = datan[num].Orpvalue;
        now = datan[num].Nowtime;
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
        arr1.push({ name: now, value: [now, tmp] });
        arr2.push({ name: now, value: [now, orp] });
      }
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
            nameGap: 50,
            axisLabel: {
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
            max: 1200,
            interval: 200,
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
          function tmpv(num) {
            var request = new XMLHttpRequest();
            //let url = self.url;
            //let url = "http://192.168.0.113:5000/value";
            var Temperature;
            var now;
            request.open("GET", url, false);
            request.onload = function reqOnload() {
              const test = this.responseText;
              const data = JSON.parse(test);
              const Num = data.length - 50 + num;
              Temperature = data[Num].Temperature;
              now = data[Num].Nowtime;
            };
            request.send();
            return {
              name: now,
              value: [now, Temperature],
            };
          }
          function orpv(num) {
            var request = new XMLHttpRequest();
            //let url = self.url;
            //let url = "http://192.168.0.113:5000/value";
            var Orpvalue;
            var now;
            request.open("GET", url, false);
            request.onload = function reqOnload() {
              const test = this.responseText;
              const data = JSON.parse(test);
              const Num = data.length - 50 + num;
              Orpvalue = data[Num].Orpvalue;
              now = data[Num].Nowtime;
            };
            request.send();
            return {
              name: now,
              value: [now, Orpvalue],
            };
          }
          arr1.shift();
          arr2.shift();
          arr1.push(tmpv(49));
          arr2.push(orpv(49));
          console.log(arr1);
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
              console.log(tmpnum);
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
      }, 1000);
      if (option && typeof option === "object") {
        myChart.setOption(option);
      }
      window.addEventListener("resize", myChart.resize);
    },
  },
};
