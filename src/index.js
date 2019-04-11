import {saveAs} from 'file-saver';
import JSZip from 'jszip';
import View from './view.js';
import Images from './images.hbs';

const jsZip = new JSZip();
const oImgs = {
    images: []
};

let unzipImagesInObject = async (zip) => {
    let id = 0;

    try {
        const contents = await jsZip.loadAsync(zip);
        const files = contents.files;

        for (let file in files) {
            if (files.hasOwnProperty(file) && file.includes('json')) {
                let text = await files[file].async('text');
                let obj = JSON.parse(text);
                let { actual, expected, diff, testName} = obj;

                oImgs.images.push({
                    'id': id++,
                    'testName': testName,
                    'actual': { name: actual, value: await files[actual].async('base64')},
                    'expected': { name: expected, value: await files[expected].async('base64')},
                    'diff': { name: diff, value: await files[diff].async('base64')},
                    'agreed': false
                });
            }
        }
    } catch (e) {
        console.log('Ошибка!');
    }

    return oImgs;
};

let zipUpdateImages = (data) => {
    data.images.forEach(oImg => {
        if (!oImg.agreed) {
            jsZip.remove(oImg.actual.name);
            jsZip.remove(oImg.expected.name);
            jsZip.remove(oImg.diff.name);
            jsZip.remove(`${oImg.testName}.json`);
        }
    });
};

document.addEventListener('change', async e => {
    if (e.target.id === 'uploadFile') {
        View.render(Images, await unzipImagesInObject(e.target.files[0]), 'body');
    }
});

document.addEventListener('click', async e => {
    if (e.target.id === 'agreement') {
        // TODO O(n)!
        oImgs.images.forEach(elem => {
            if (elem.id === +e.target.dataset.id) {
                elem.agreed = true;
            }
        })
    }

    if (e.target.id === 'save') {
        zipUpdateImages(oImgs);
        try {
            const updatedZip = await jsZip.generateAsync({type: 'blob'});

            saveAs(updatedZip, 'agreedImages.tar.gz');
        } catch (e) {
            console.log('Ошибка!');
        }
    }
});