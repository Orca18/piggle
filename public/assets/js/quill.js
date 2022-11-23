let toolbaroptions = [
    ["bold", "italic", "underline", "strike"],
    [{header: [1, 2, 3, 4, 5, 6, false]}],
    [{list: "ordered"}, {list: "bullet"}],
    [{script: "sub"}, {script: "super"}],
    [{align: []}],
    // [{size:["small","large","huge",false]}],
    ["image", "link", "fomula"],
    [{color: []}, {background: []}],
    ["code-block", "blockquote"]
]

let quill = new Quill("#quillEditor", {
    modules: {
        toolbar: toolbaroptions,
    },
    theme: 'snow'
});

quill.getModule('toolbar').addHandler('image', function () {
    selectLocalImage();
});

// 셀렉트 이미지
function selectLocalImage() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();


    input.onchange = function () {
        const fd = new FormData();
        const file = $(this)[0].files[0];

        fd.set('image', file);
        // fd.append('image', file);

        for (var pair of fd.entries()) {
            console.log("하..:\n");
            console.log(pair[0] + ', ' + pair[1]);
        }


        $.ajax({
            type: 'post',
            enctype: 'multipart/form-data',
            url: '/server/upload',
            data: fd,
            processData: false,
            contentType: false,
            // beforeSend: function(xhr) {
            //     xhr.setRequestHeader($("#_csrf_header").val(), $("#_csrf").val());
            //     console.log("1");
            // },
            success: function (data) {
                const range = quill.getSelection();
                quill.insertEmbed(range.index, 'image', data.location);
            },
            error: function (err) {
                console.error("Error ::: " + err);
            }
        });
    };
}

$("#identifier").on("submit",function() {
    $("#hiddenArea").val($("#quillEditor").html());
})