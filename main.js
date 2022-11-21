/* const BigNumber = require('bignumber.js'); */

const button = document.getElementById("button");
let branch = false;

// 片側規格を使用しない
function double(){
  let one = document.getElementById("one");
  one.disabled = true;
  max.disabled = false;
  min.disabled = false;
  return branch = false;
};

// 片側規格選を択時
function katagawa(){
  let max = document.getElementById("max");
  let min = document.getElementById("min");
  one.disabled = false;
  max.disabled = true;
  min.disabled = true;
  return branch = true;
};

button.addEventListener('click',()=>{

  // 少数計算用変数
  const addition = 1000000;

  // -----データの取得-----
  // 係数の取得
  const coefficient = document.getElementById("coefficient").value;
  let A2 = 0;
  let D4 = 0;
  let d2 = 0;

  switch(coefficient){
    case'0':
      alert("係数が選択されていません");
    case'1':
      A2 = 2.659;
      D4 = 3.267;
      d2 = 1.128;
      break;
    case'2':
      A2 = 1.88;
      D4 = 3.267;
      d2 = 1.128;
      break;
    case'3':
      A2 = 1.023;
      D4 = 2.574;
      d2 = 1.693;
      break;
    case'4':
      A2 = 0.729;
      D4 = 2.282;
      d2 = 2.059;
      break;
    case'5':
      A2 = 0.577;
      D4 = 2.114;
      d2 = 2.326;
      break;
  }

  // 日数の取得
  const sDays = document.getElementById("days").value;
  if (sDays == ""){
    document.getElementById("days").classList.add("red_border");
  } else {
    document.getElementById("days").classList.remove("red_border");
  }
  // 規格上限の取得
  const sMax = document.getElementById("max").value;
  if (branch == false && sMax == ""){
    document.getElementById("max").classList.add("red_border");
  } else {
    document.getElementById("max").classList.remove("red_border");
  }
  // 規格下限の取得
  const sMin = document.getElementById("min").value;
  if (branch == false && sMin == ""){
    document.getElementById("min").classList.add("red_border");
  } else {
    document.getElementById("min").classList.remove("red_border");
  }
  // 片側規格の取得
  const sOne = document.getElementById("one").value;
  if (branch == true && aOne == ""){
    document.getElementById("one").classList.add("red_border");
  } else {
    document.getElementById("one").classList.remove("red_border");
  }
  // Σ Xbarの取得
  const sXbar = document.getElementById("xbar").value;
  if (sXbar == ""){
    document.getElementById("xbar").classList.add("red_border");
  } else {
    document.getElementById("xbar").classList.remove("red_border");
  }
  // Σ Rbarの取得
  const sRbar = document.getElementById("rbar").value;
  if (sRbar == ""){
    document.getElementById("rbar").classList.add("red_border");
  } else {
    document.getElementById("rbar").classList.remove("red_border");
  }
  // -----データの取得end-----

  // 片側規格の判定
  const element = document.getElementsByName("accessible-radio");
  let cpkswitchFlag = "";

  for (let i = 0; i < element.length; i++){
    if (element.item(i).checked){
        cpkswitchFlag = element.item(i).value;
    }
  }

  // 数値型への変換
  const days = sDays;
  const max = sMax;
  const min = sMin;
  const one = sOne;
  const xbar = sXbar;
  const rbar = sRbar;

  // -----規格の小数点以下の桁数を取得------
  let maxPoint = max.toString().split('.');
  let minPoint = min.toString().split('.');
  let onePoint = one.toString().split('.');
  let maxP = 0;
  let minP = 0;
  let oneP = 0;
  let array = 0;
  let nod = 0;
  let nod1 = 0;
  let nod2 = 0;

  if (branch == true){
    dvo()
    } else {
     dvw()
    }

  // 小数点以下の桁数の確認
  function dvo(){
    if (onePoint.length == 1){
      onePoint[1] = 0;
      nod_Calculation2();
    } else {
      oneP = onePoint[1].length;
    }
    nod = oneP;
    nod_Calculation();
  }

  function dvw(){
    if (maxPoint.length == 1){
      maxPoint[1] = 0;
      nod_Calculation2();
    } else {
      maxP = maxPoint[1].length;
    }
    if (minPoint.length == 1){
      minPoint[1] = 0;
      nod_Calculation2();
    } else {
      minP = minPoint[1].length;
    }
    // 小数点以下の桁数の取得
    if (maxP >= minP){
       array = maxP;
     } else {
       array = minP;
     }
     nod = array;
     nod_Calculation();
  }

  function nod_Calculation(){
    nod2 = nod + 2;
    nod1 = nod + 1;
  }

  function nod_Calculation2(){
    nod2 = 2;
    nod1 = 1;
  }

  // -----実際の計算-----
  // X平均
  const xwbar_item = BigNumber(xbar).div(days);
  const xwbar = xwbar_item.toFixed(nod2);
  // R平均
  const rAve_item = BigNumber(rbar).div(days);
  const rAve = rAve_item.toFixed(nod1);
  // R
  const R_item = BigNumber(rAve).times(D4);
  const R = R_item.toFixed(nod1);
  // UCL LCLの共通
  const A2Rber = BigNumber(A2).times(rAve);
  // X(UCL)
  // let xUcl = ((xwbar * addition) + (A2Rber * addition)) / addition;
  const xUcl = BigNumber(xwbar).plus(A2Rber);

  // X(LCL)
  // let xLul = ((xwbar * addition) - (A2Rber * addition)) / addition;
  const xLul = BigNumber(xwbar).minus(A2Rber);

  // s
  const s_item = BigNumber(rAve).div(d2);
  const s = s_item.toFixed(nod2);
  // Cpk
  const standerd_item = BigNumber(max).minus(min);
  const standard = BigNumber(standerd_item).div(2);

  let Tl = 0;
  let Tu = 0;
  let molecule = 0;
  let Cpk = 0;

  switch(cpkswitchFlag){
    case"0":
    if (xwbar <= BigNumber(standard).plus(min)){
      lowerLimit()
    }else{
      upperLimit()
    }
    break;
    case"1":
    upperLimit2()
    break;
    case"2":
    lowerLimit2()
    break;
  }

  function lowerLimit(){
    Tl = BigNumber(xwbar).minus(min);
    molecule = BigNumber(3).times(s);
    Cpk = BigNumber(Tl).div(molecule);
    cpkOutput(Cpk);
  };

  function lowerLimit2(){
    Tl = BigNumber(one).minus(xwbar);
    molecule = BigNumber(3).times(s);
    Cpk = BigNumber(Tl).div(molecule);
    cpkOutput(Cpk);
  };

  function upperLimit(){
    Tu = BigNumber(max).minus(xwbar);
    molecule = BigNumber(3).times(s);
    Cpk = BigNumber(Tu).div(molecule);
    cpkOutput(Cpk);
  };

  function upperLimit2(){
    Tu = BigNumber(xwbar).minus(one);
    molecule = BigNumber(3).times(s);
    Cpk = BigNumber(Tu).div(molecule);
    cpkOutput(Cpk);
  };

  // -----計算結果の表示-----
  // Cpkの表示
  function cpkOutput(Cpk){
    document.getElementById("outputCpk").innerHTML = Cpk.toFixed(2);
  };
  // X(UCL)
  document.getElementById("outputxUcl").innerHTML = xUcl.toFixed(nod1);
  // X(LCL)
  document.getElementById("outputxLul").innerHTML = xLul.toFixed(nod1);
  // R
  document.getElementById("outputR").innerHTML = R;
  // s
  document.getElementById("outputS").innerHTML = s;
  // 平均X
  document.getElementById("outputXwber").innerHTML = xwbar;
  // 平均R
  document.getElementById("outputRber").innerHTML = rAve;

});
