var gray = '#F5F5F5';
function TRHightlight(obj) {
    obj.style.backgroundColor = '#3a99ff';
}
function TRHightlightRemove(obj, index) {
    if (index % 2 == 1)
        obj.style.backgroundColor = gray;
    else
        obj.style.backgroundColor = '#FFFFFF';
}