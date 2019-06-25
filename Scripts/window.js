//기사 선택 팝업 열기
function OpenDriverSelect(RunDate) {
    var year=new Date().getFullYear();
    var url='/SelectDriver?RunInfoID=<%=RunInfoID%>&RunDate='+year+'-'+RunDate;
    window.name='Parent';
    if(RunDate.length>=3)
    window.open(url, 'Child',"width=450px, height=600px");
}

function ConfirmReg(){
    var form=document.getElementById('newData');
    if(confirm('정보를 등록하시겠습니까?')){
        form.submit();
    }
}