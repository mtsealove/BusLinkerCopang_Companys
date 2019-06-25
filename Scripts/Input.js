function CheckLoginInput() {
    var form=document.getElementById('form_login');
    var ID=document.getElementById('userID').value;
    var password=document.getElementById('userPassword').value;

    if(ID.length==0) alert('ID를 입력하세요');
    else if(password.length==0) alert('비밀번호를 입력하세요');
    else { 
        form.submit(); //모두 입력 시 제출
    }
}