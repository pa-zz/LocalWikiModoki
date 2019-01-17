// $Id: $

function show(inputData){
  var objID=document.getElementById("layer_" + inputData);
  var buttonID = document.getElementById("category_" + inputData);

  if(objID.className == 'close'){
    objID.style.display='block';
    objID.className='open';
  } else {
    objID.style.display='none';
    objID.className='close';

  }
}

function format(src) {

// ルールファイルのバージョン
var version_rule_redmine = "0.1b0"

var result_all = "";
var table = false;
var ul = 0;
var ol = 0;
var collapseID = 0;
var collapsed = false;
var commentout = false;
var pre = false;
var cite = false;
var parasta = true;

// 行ごとに処理
var lines = src.split("\n");
for (var i = 0, len = lines.length; i < len; ++i) {
  var result;
  result = lines[i];
  var br = true;

  
  // 改行を取り除く
  result = result.replace(/\n$/,"");
  result = result.replace(/\r$/,"");



  // 整形済みテキスト
  if (pre) {
    if (result.match(/^\<\/pre\>/)){
       pre = false;
       result = "</td></tr></table>";
    } else {
      // ＜＞のエスケープ処理
      result = result.replace(/\>/g, "&gt;");
      result = result.replace(/\</g, "&lt;");
      result = result + "<br>";
    }
  }

  if (!pre && !cite && result.match(/^\<pre\>/)){
      pre = true;
      result = "<table border><tr><td>";
  }

  // 引用
  if (cite) {
    if (result.match(/^$/)){
       cite = false;
       result = "</td></tr></table>";
    } else {
      // ＜＞のエスケープ処理
      result = result.replace(/\>/g, "&gt;");
      result = result.replace(/\</g, "&lt;");
      result = result + "<br>";
    }
  }

  if (parasta && !cite && !pre && result.match(/^ /)){
      cite = true;
      // ＜＞のエスケープ処理
      result = result.replace(/\>/g, "&gt;");
      result = result.replace(/\</g, "&lt;");
      result = "<table border><tr><td>" + result + "<br>";
  }
  

  if (result.match(/^$/)) {
    parasta = true;
  } else {
    parasta = false;
  }

  if (!pre && !cite) {
  

  // Wikiリンク [[ ]]
  result = result.replace(/\[\[([^\[\]]+)\]\]/g, "<a href=?$1.txt>$1</a>");

  // 水平線 ---
  if (result.match(/^---$/)){
    result = "<hr>";
    br = false;
  }

  // 見出し h1. h2.,,,
  if (result.match(/^h(\d)\.\s(.*)$/)){
    result = result.replace(/^h(\d)\.\s(.*)$/,  "<h$1>$2</h$1>");
    br = false;
  }

  // 表
  if (result.match(/^\|.*\|$/)){
    result = result.replace(/^\|(.*)\|$/, "<tr><td>$1</td></tr>");
    result = result.replace(/\|/g, "</td><td>");
    if (!table) {
     table = true;
     result = "<table border>" + result;    
    }
    br = false;
  } else {
    if (table){
      table = false;
      result = result + "</table>";
    }
  }


  // 折りたたみ
  if (result.match(/^\{\{collapse\((.*)\)/)){
    result = result.replace(/^\{\{collapse\((.*)\)/, "<a href=\"javascript:void(0)\" id=\"category_" + collapseID.toString() + "\" onclick=\"show('" + collapseID.toString() + "');\">$1</a><div id=\"layer_" + collapseID.toString() + "\" style=\"display:none;position:relative;margine-left:15pt\" class=\"close\">");
    collapseID++;
    br = false;
    collapsed = true;
  }

  // コメントアウト
  result = result.replace(/\{\{co\(.*\)}}/g, ""); //最短一致が望ましい
  if (result.match(/^\{\{co\((.*)\)/)){
    commentout = true;
  }

  // 複数行ブロックの閉じ処理
  if (result.match(/^\}\}/)){
    // 折りたたみの終了
    if (collapsed) {
       result = "</div>";
       collapsed = false;
       br = false;
    }
    // コメントアウトの終了
    if (commentout) {
      result = "";
      commentout = false;
      br = false;
    }
  }

  // バージョン情報
  result = result.replace(/\{\{version_script\}\}/g, version_script);
  result = result.replace(/\{\{version_rule\}\}/g, version_rule_redmine);

  // 図
  result = result.replace(/\!\{(.+)\}([^!{} ]+)\!/g, '<img src="$2" style="$1">');
  result = result.replace(/\!([^! ]+)\!/g, "<img src=$1>");


  // 箇条書き ・
  if (result.match(/^\*+\s/)) {
    ulres = result.match(/^(\*+)\s+/);
    ullen = ulres[1].length;
    result = result.replace(/^(\*+)\s+(.*)/, "<li>$2</li>");
    while(ullen > ul){
      ul ++;
      result = "<ul>" + result;
    }
    while(ullen < ul){
      ul --;
      result = "</ul>" + result ;
    }
    while(ol > ul){
      ol --;
      result = "</ol>" + result;
    }br = false;
  }

  // 箇条書き 数字
  if (result.match(/^\#+\s/)) {
    olres = result.match(/^(\#+)\s+/);
    ollen = olres[1].length;
    result = result.replace(/^(\#+)\s+(.*)/, "<li>$2</li>");
    while(ollen > ol){
      ol ++;
      result = "<ol>" + result;
    }
    while(ollen < ol){
      ol --;
      result = "</ol>" + result ;
    }
    while(ul > ol){
      ul --;
      result = "</ul>" + result;
    }br = false;
  }

  // bold
  result = result.replace(/\*([^*]+)\*/g, "<strong>$1</strong>");

  // italic
  //result = result.replace(/\_([^_]+)\_/g, "<em>$1</em>");

  // underline
  //result = result.replace(/\+([^+]+)\+/g, "<ins>$1</ins>");

  // del
  //result = result.replace(/\-([^- ]+)\-/g, "<del>$1</del>");

  // code
  //result = result.replace(/\@([^@ ]+)\@/g, "<code>$1</code>");

  // code
  //result = result.replace(/\?\?([^? ]+)\?\?/g, "<cite>$1</cite>");

  // 数字の上下付 TBD

  // ＜＞のエスケープ処理
  result = result.replace(/\\\>/g, "&gt;");
  result = result.replace(/\\\</g, "&lt;");


  // 改行 br
  if (br) {
    result = result + "<br>";

    while(ol){
      ol--;
      result = "</ol>" + result ;
    }

    while(ul){
      ul--;
      result = "</ul>" + result;
    }

  }

  // 外部ページ取り込み
  if (result.match(/^\{\{include\((.*)\)}}/)){
    var incres = result.match(/^\{\{include\((.*)\)}}/);
    // 再帰呼び出ししているので注意
    result = format(load_file(incres[1] + ".txt"));
  }

  // コメントアウトされている場合はテキストをクリアする
  if (commentout) {
    result  = "";
    br = false;
  }

  }

  //console.log(result);
  result_all = result_all + result;

}

return result_all;

}