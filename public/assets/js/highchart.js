// 파라메터 정보가 저장될 오브젝트
// common.js 같은 모든 페이지에서 로딩되는 js 파일에 넣어두면 됨.
var getParam = function (key) {
    var _parammap = {};
    document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
        function decode(s) {
            return decodeURIComponent(s.split("+").join(" "));
        }

        _parammap[decode(arguments[1])] = decode(arguments[2]);
    });
    return _parammap[key];
};

// json 정보
var stockname = getParam('n');
if (stockname == null) {
    location.replace('chart?n=삼성전자');
}
document.getElementById('autocomplete_search').value = stockname;
var url = '../json/'+stockname+'.json';


// 하이차트
Highcharts.getJSON(url, function (data) {
    Highcharts.stockChart('container', {
        time: {
            timezoneOffset: -9 * 60 // 딱 해당 날짜로 지정해버림
        },
        // 표시 기간 범위
        rangeSelector: {
            selected: 1
        },
        // 밑에 거래량
        navigator: {
            series: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        // 설정 추가 for
        legend: {
            enabled: true
        },
        plotOptions: {
            series: {
                showInLegend: true,
                marker: {
                    enabled: false
                }
            }
        },
        series: [{
            type: 'hollowcandlestick',
            id: 'aapl',
            name: '가격',
            data: data,
            color: '#0000FF',
            lineColor: '#0000FF',
            upColor: '#FF0000',
            upLineColor: '#FF0000'
        }, { // ema 추가 (이평선)
            type: 'ema', // 타입
            linkedTo: 'aapl', // series 아이디
            params: {
                period: 5  // 기간 (단위: 日)
            },
            lineWidth: 1, // 굵기
            marker: false, // 점 생기는거
            color: 'green'
        }, {
            type: 'ema',
            linkedTo: 'aapl',
            params: {
                period: 20
            },
            lineWidth: 1,
            marker: false,
            color: 'red'
        }, {
            type: 'ema',
            linkedTo: 'aapl',
            params: {
                period: 60
            },
            lineWidth: 1,
            marker: false,
            color: 'orange'
        }, {
            type: 'ema',
            linkedTo: 'aapl',
            params: {
                period: 120
            },
            lineWidth: 1,
            marker: false,
            color: 'purple'
        }
        ]
    });
});

Highcharts.setOptions({
    time: {
        timeZone: 'Asia/Tokyo'
    },
    lang: {
        shortMonths: [
            '1월', '2월', '3월', '4월',
            '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'
        ],
        weekdays: [
            '일', '월', '화', '수', '목', '금', '토'
        ],
        rangeSelectorZoom: '확대 범위 - ',
        ema: '이평선'
    },
    exporting: {
        menuItemDefinitions: {
            printChart: {
                text: "차트 인쇄",
                onclick: function () {
                    this.print();
                }
            },
            downloadPNG: {
                text: "다운로드 PNG",
                onclick: function () {
                    this.exportChart();
                }
            }
            , downloadJPEG: {
                text: "다운로드 JPG",
                onclick: function () {
                    this.exportChart({
                        type: 'image/jpeg'
                    });
                }
            }
            , downloadPDF: {
                text: "다운로드 PDF",
                onclick: function () {
                    this.exportChart({
                        type: 'application/pdf'
                    });
                }
            }
            , downloadSVG: {
                text: "다운로드 SVG",
                onclick: function () {
                    this.exportChart({
                        type: 'image/svg+xml'
                    });
                }
            },
        },
        buttons: {
            contextButton: {
                menuItems: ["printChart", "separator", "downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG"]
            }
        }
    }
});