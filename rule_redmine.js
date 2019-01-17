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

// ���[���t�@�C���̃o�[�W����
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

// �s���Ƃɏ���
var lines = src.split("\n");
for (var i = 0, len = lines.length; i < len; ++i) {
  var result;
  result = lines[i];
  var br = true;

  
  // ���s����菜��
  result = result.replace(/\n$/,"");
  result = result.replace(/\r$/,"");



  // ���`�ς݃e�L�X�g
  if (pre) {
    if (result.match(/^\<\/pre\>/)){
       pre = false;
       result = "</td></tr></table>";
    } else {
      // �����̃G�X�P�[�v����
      result = result.replace(/\>/g, "&gt;");
      result = result.replace(/\</g, "&lt;");
      result = result + "<br>";
    }
  }

  if (!pre && !cite && result.match(/^\<pre\>/)){
      pre = true;
      result = "<table border><tr><td>";
  }

  // ���p
  if (cite) {
    if (result.match(/^$/)){
       cite = false;
       result = "</td></tr></table>";
    } else {
      // �����̃G�X�P�[�v����
      result = result.replace(/\>/g, "&gt;");
      result = result.replace(/\</g, "&lt;");
      result = result + "<br>";
    }
  }

  if (parasta && !cite && !pre && result.match(/^ /)){
      cite = true;
      // �����̃G�X�P�[�v����
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
  

  // Wiki�����N [[ ]]
  result = result.replace(/\[\[([^\[\]]+)\]\]/g, "<a href=?$1.txt>$1</a>");

  // ������ ---
  if (result.match(/^---$/)){
    result = "<hr>";
    br = false;
  }

  // ���o�� h1. h2.,,,
  if (result.match(/^h(\d)\.\s(.*)$/)){
    result = result.replace(/^h(\d)\.\s(.*)$/,  "<h$1>$2</h$1>");
    br = false;
  }

  // �\
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


  // �܂肽����
  if (result.match(/^\{\{collapse\((.*)\)/)){
    result = result.replace(/^\{\{collapse\((.*)\)/, "<a href=\"javascript:void(0)\" id=\"category_" + collapseID.toString() + "\" onclick=\"show('" + collapseID.toString() + "');\">$1</a><div id=\"layer_" + collapseID.toString() + "\" style=\"display:none;position:relative;margine-left:15pt\" class=\"close\">");
    collapseID++;
    br = false;
    collapsed = true;
  }

  // �R�����g�A�E�g
  result = result.replace(/\{\{co\(.*\)}}/g, ""); //�ŒZ��v���]�܂���
  if (result.match(/^\{\{co\((.*)\)/)){
    commentout = true;
  }

  // �����s�u���b�N�̕�����
  if (result.match(/^\}\}/)){
    // �܂肽���݂̏I��
    if (collapsed) {
       result = "</div>";
       collapsed = false;
       br = false;
    }
    // �R�����g�A�E�g�̏I��
    if (commentout) {
      result = "";
      commentout = false;
      br = false;
    }
  }

  // �o�[�W�������
  result = result.replace(/\{\{version_script\}\}/g, version_script);
  result = result.replace(/\{\{version_rule\}\}/g, version_rule_redmine);

  // �}
  result = result.replace(/\!\{(.+)\}([^!{} ]+)\!/g, '<img src="$2" style="$1">');
  result = result.replace(/\!([^! ]+)\!/g, "<img src=$1>");


  // �ӏ����� �E
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

  // �ӏ����� ����
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

  // �����̏㉺�t TBD

  // �����̃G�X�P�[�v����
  result = result.replace(/\\\>/g, "&gt;");
  result = result.replace(/\\\</g, "&lt;");


  // ���s br
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

  // �O���y�[�W��荞��
  if (result.match(/^\{\{include\((.*)\)}}/)){
    var incres = result.match(/^\{\{include\((.*)\)}}/);
    // �ċA�Ăяo�����Ă���̂Œ���
    result = format(load_file(incres[1] + ".txt"));
  }

  // �R�����g�A�E�g����Ă���ꍇ�̓e�L�X�g���N���A����
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