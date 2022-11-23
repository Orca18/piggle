function load_data(query = '') {
    fetch('/data/stocklist?s=' + query + '').then(function (response) {
        return response.json();
    }).then(function (responseData) {
        var html = '<ul class="list-group" style="position: absolute; z-index: 2; background-color: white">';
        if (responseData.length > 0) {
            for (var count = 0; count < responseData.length; count++) {
                var regular_expression = new RegExp('(' + query + ')', 'gi');
                const linkname = responseData[count].name;
                const linknumber = responseData[count].number;
                const linkdenote = responseData[count].denote;
                html += '<a href="#" class="list-group-item list-group-item-action" onclick="get_text(\'' + linkdenote + '\', \'' + linknumber + '\')">' + responseData[count].denote.replace(regular_expression, '<span class="text-primary fw-bold">$1</span>') + '</a>';
                // console.log('흠:' + responseData[count].name);
            }
        } else {
            html += '<a href="#" class="list-group-item list-group-item-action disabled">검색 결과 없음</a>';
        }
        html += '</ul>';
        document.getElementById('search_result').innerHTML = html;
    });
}


var search_element = document.getElementById("autocomplete_search");
search_element.onkeyup = function () {
    var query = search_element.value;
    load_data(query);
};


search_element.onblur = function () {
    // 입력전 결과로 변경하기
};

function get_text(stockname, codenumber) {
    document.getElementById('autocomplete_search').value = stockname;
    document.getElementById('search_result').innerHTML='';
    document.getElementById('stock').value = codenumber;

    console.log('post 시, 보낼 code 번호 : '+codenumber);
    console.log('사용자에게만 이름+코드 뜸 : '+stockname);
}