import JSZip from 'jszip';
import View from './view.js';
import Images from './images.hbs';
const uploadFile = document.getElementById('uploadFile');
const jsZip = new JSZip();
const oImgs = {
    images: []
};

let unzipImgInObj = async (zip) => {
    let id = 0;

    try {
        const contents = await jsZip.loadAsync(zip);
        const files = contents.files;

        for (let file in files) {
            if (files.hasOwnProperty(file) && file.includes('json')) {
                let text = await files[file].async('text');
                let obj = JSON.parse(text);
                const [actual, expected, diff] = [obj.actual, obj.expected, obj.diff];

                oImgs.images.push({
                    'id': id++,
                    'actual': await files[actual].async('base64'),
                    'expected': await files[expected].async('base64'),
                    'diff': await files[diff].async('base64'),
                    'agreed': false
                })
            }
        }
    } catch (e) {
        console.log('Ошибка!');
    }

    return oImgs;
};

let zipAgreedImgs = (data) => {
    for (let img in data) {
        if (data.hasOwnProperty(img) && img.agreed) {
            // jsZip
        }
    }

    console.log('It\'s work!');

    return true;
};

uploadFile.addEventListener('change', async e => {
    View.render(Images, await unzipImgInObj(e.target.files[0]), 'body');
});

document.addEventListener('click', e => {
    if (e.target.id === 'agreement') {
        oImgs.images.forEach(elem => {
            if (elem.id === +e.target.dataset.id) {
                elem.agreed = true;
            }
        })
    }

    if (e.target.id === 'save') {
        zipAgreedImgs(oImgs);
    }

});