import JSZip from 'jszip';
import View from './view.js';
import Images from './images.hbs';
const uploadFile = document.getElementById('uploadFile');
const zip = new JSZip();

let unzipImgInObj = async (data) => {
    const oImgs = {
        images: []
    };
    let id = 0;

    try {
        const contents = await zip.loadAsync(data);
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
                    'diff': await files[diff].async('base64')
                })
            }
        }
    } catch (e) {
        console.log('Ошибка!');
    }

    return oImgs;
};

uploadFile.addEventListener('change', async e => {
    View.render(Images, await unzipImgInObj(e.target.files[0]), 'body');
});
