let images = {};
images["f1"] = [
    "img_Tapecasting_00024_sheet2018-08-23_F1.png",
    "img_Tapecasting_00029_sheet2018-08-23_F1.png",
    "img_Tapecasting_00043_sheet2018-08-23_F1.png",
    "img_Tapecasting_00048_sheet2018-08-23_F1.png",
    "img_Tapecasting_00053_sheet2018-08-23_F1.png",
    "img_Tapecasting_00062_sheet2018-10-12_F1.png",
    "img_Tapecasting_00068_sheet2018-10-12_F1.png",
    "img_Tapecasting_00072_sheet2018-10-12_F1.png",
    "img_Tapecasting_00073_sheet2018-10-12_F1.png",
    "img_Tapecasting_00078_sheet2018-10-12_F1.png"
];

images["f2"] = [
    "img_Tapecasting_00015_sheet2018-08-23_F2.png",
    "img_Tapecasting_00018_sheet2018-08-23_F2.png",
    "img_Tapecasting_00025_sheet2018-08-23_F2.png",
    "img_Tapecasting_00034_sheet2018-08-23_F2.png",
    "img_Tapecasting_00038_sheet2018-08-23_F2.png",
    "img_Tapecasting_00049_sheet2018-08-23_F2.png",
    "img_Tapecasting_00054_sheet2018-08-23_F2.png",
    "img_Tapecasting_00058_sheet2018-08-23_F2.png",
    "img_Tapecasting_00064_sheet2018-10-12_F2.png",
    "img_Tapecasting_00065_sheet2018-10-12_F2.png",
    "img_Tapecasting_00069_sheet2018-10-12_F2.png",
    "img_Tapecasting_00070_sheet2018-10-12_F2.png"
];

images["f3"] = [
    "img_Tapecasting_00019_sheet2018-08-23_F3.png",
    "img_Tapecasting_00030_sheet2018-08-23_F3.png",
    "img_Tapecasting_00035_sheet2018-08-23_F3.png",
    "img_Tapecasting_00039_sheet2018-08-23_F3.png",
    "img_Tapecasting_00045_sheet2018-08-23_F3.png",
    "img_Tapecasting_00050_sheet2018-08-23_F3.png",
    "img_Tapecasting_00055_sheet2018-08-23_F3.png",
    "img_Tapecasting_00059_sheet2018-08-23_F3.png",
    "img_Tapecasting_00104_sheet2018-11-09_F3.png",
    "img_Tapecasting_00105_sheet2018-11-09_F3.png"
];

images["f4"] = [
    "img_Tapecasting_00020_sheet2018-08-23_F4.png",
    "img_Tapecasting_00040_sheet2018-08-23_F4.png",
    "img_Tapecasting_00060_sheet2018-08-23_F4.png",
    "img_Tapecasting_00085_sheet2018-11-09_F146.png"
];

images["f5"] = [
    "img_Tapecasting_00005_sheet2018-08-23_F5.png",
    "img_Tapecasting_00044_sheet2018-08-23_F15.png",
    "img_Tapecasting_00150_sheet2018-12-06_F5.png",
    "img_Tapecasting_00151_sheet2018-12-06_F5.png"
];

images["f6"] = [
    "img_Tapecasting_00063_sheet2018-10-12_F156.png",
    "img_Tapecasting_00084_sheet2018-11-09_F6.png",
    "img_Tapecasting_00129_sheet2018-11-22_F6.png"
];

images["t0"] = [
    "img_Tapecasting_00001_sheet2018-08-23_T0.png",
    "img_Tapecasting_00002_sheet2018-08-23_T0.png",
    "img_Tapecasting_00003_sheet2018-08-23_T0.png",
    "img_Tapecasting_00004_sheet2018-08-23_T0.png",
    "img_Tapecasting_00006_sheet2018-08-23_T0.png",
    "img_Tapecasting_00007_sheet2018-08-23_T0.png",
    "img_Tapecasting_00008_sheet2018-08-23_T0.png",
    "img_Tapecasting_00009_sheet2018-08-23_T0.png",
    "img_Tapecasting_00010_sheet2018-08-23_F1.png",
    "img_Tapecasting_00014_sheet2018-08-23_F1.png",
    "img_Tapecasting_00033_sheet2018-08-23_F1.png"
];

$(function () {
    $("#images").empty();
    let folder = "f1";
    images[folder].forEach(function (image_name) {
        $("#images").append(
            $("<img/>")
                .attr("src", `/media/test_result_images/${folder}/${image_name}`)
                .attr("alt", folder)
                .attr("width", "100px")
                .attr("height", "100px")
                .click(function () {
                    var $image = $('#image');
                        var cropper = $image.data('cropper');
                        cropper.replace(`/media/test_result_images/${folder}/${image_name}`);
                })
        );
    });
    $('#mode').on('change', function () {
        let folder = this.value;
        $("#images").empty();
        images[folder].forEach(function (image_name) {
            $("#images").append(
                $("<img/>")
                    .attr("src", `/media/test_result_images/${folder}/${image_name}`)
                    .attr("alt", folder)
                    .attr("width", "100px")
                    .attr("height", "100px")
                    .click(function () {
                        var $image = $('#image');
                        var cropper = $image.data('cropper');
                        cropper.replace(`/media/test_result_images/${folder}/${image_name}`);
                    })
            );
        });
    });
});