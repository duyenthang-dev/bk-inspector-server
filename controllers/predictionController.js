const multer = require('multer');
const express = require('express');
const TeachableMachine = require('@sashido/teachablemachine-node');

const model = new TeachableMachine({
    modelUrl: 'https://teachablemachine.withgoogle.com/models/p1_Jb2Id1/',
});

const multerConfig = multer.memoryStorage();
const uploadImg = multer({
    storage: multerConfig,
});

exports.uploadImage = uploadImg.single('photo');

exports.predict = (req, res, next) => {
    console.log(req.file);
    const mimetype = req.file.mimetype;
    // const base64Img = Buffer.from(bitmap).toString('base64');
    const base64Img = Buffer.from(req.file.buffer).toString('base64');
    const imagDataUrl = `data:${mimetype};base64,` + base64Img;
    console.log('Got the file');
    return model
        .classify({
            imageUrl: imagDataUrl,
        })
        .then((predictions) => {
            console.log(predictions);
            const positive =
                predictions[0].class === 'positive' ? predictions[0].score.toFixed(6) : predictions[1].score.toFixed(6);
            const negative = (1 - positive).toFixed(6);
            let content = `Kết quả train model cho thấy bức tường có chỉ số positive (bị đứt gãy) là ${positive}và chỉ số negative (không bị đứt gãy) là ${negative}. `;
            if (positive > negative)
                content += ". Có thể khẳng định bức tường bị nứt gãy nhiều";
            else content += ". Như vậy bức tường chưa bị hư hỏng nặng";
            let rate;
            if (positive > 0.9)
                rate = "Nặng"
            else if (positive > 0.7)
                rate = "Trung bình"
            else if (positive > 0.4)
                rate = "Nhẹ"
            else rate = "Không"
            res.status(200).json({
                status: 'success',
                data: {
                    positive,
                    negative,
                    content,
                    rate
                },
            });
        })
        .catch((e) => {
            console.log(e);
            res.status(500).json({
                status: 'error',
                message: 'An error occurred while predicting the photo',
            });
        });
};
