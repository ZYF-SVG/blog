// 处理获取表单的值
function serializeToJson(form) {
    let arr = {};
    form.forEach(item => {
        arr[item.name] = item.value;
    })   // {email: "742317550@qq.com", password: "123"}
    return arr;
}