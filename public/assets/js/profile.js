function get_address_from_wallet() {
  console.log(typeof chrome.runtime)
  if (chrome.runtime === undefined){
    alert("유니콘 월렛이 설치되지 않았습니다. 설치후 페이지를 새로고침해주세요.");
  }else{
    checkInstallation().then(result=>{
      if(result){
        var data = { type: "UNICORN_WALLET_ACCOUNT", domain:"피글DAO"};
        window.postMessage(data, "*");
        console.log("sendMsg",data);
      }else{
        alert("유니콘 월렛이 설치되지 않았습니다. 설치후 페이지를 새로고침해주세요.");
      }
    })
  }
}

//유니콘월렛 확장프로그램 설치여부 확인
function checkInstallation(){
  return new Promise((resolve,reject)=>{
    const EXTENSION_ID = "ljfbaahceolbgelmkahacbhdmoahomfj";
    chrome.runtime.sendMessage(EXTENSION_ID, { message: "version" },
    function (reply) {
      if(chrome.runtime.lastError){
        console.log("Error!")
        resolve(false);
      }else{
        resolve(true);
      }
    });
  })
}

//지갑 연결 버튼 클릭시 확장프로그램에 요청
var connect_wallet_button = document.getElementById("connect_wallet");
connect_wallet_button.onclick = function () {
    get_address_from_wallet();
};

//확장프로그램으로부터 받은 메세지 반환
window.addEventListener("message", (event) => {
  if (event.data.type && (event.data.type == "UNICORN_WALLET_ACCOUNT_RETURN")) {
    alert(JSON.stringify(event.data.response));
    var address = "test"
    setCookie('piggle_dao_address', address, 7);
    location.reload(true);
  }
}, false);

//주소로 쿠키 설정
function setCookie(name, value, exp) {
  var date = new Date();
  date.setTime(date.getTime() + exp*24*60*60*1000);
  document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
}
