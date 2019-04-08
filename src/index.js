import JSZip from 'jszip';
const uploadFile = document.getElementById('uploadFile');
const zip = new JSZip();
// const fileReader = new FileReader();

let unzipInObject = async (data) => {

    const oImgs = {};
    let id = 0;

    try {
        const contents = await zip.loadAsync(data, { base64: true });
        const files = contents.files;

        for (let file in files) {
            if (files.hasOwnProperty(file) && file.includes('json')) {
                console.log(file);

                let text = await files[file].async('text');
                let obj = JSON.parse(text);

                console.log(obj);

                // oImgs[id++] = { 'actual': files[file],
                //     'expected': files[`${nfile}-expected.jpg`],
                //     'diff': files[`${nfile}-diff.jpg`]
                // }

                // let isIncludes = file.includes('expected') || file.includes('diff') || file.includes('json');
                //
                // if (!oImgs.hasOwnProperty(file) && !isIncludes) {
                //
                //     let nfile =file.substr(0, file.length-11);
                //
                //     oImgs[id++] = { 'actual': files[file],
                //         'expected': files[`${nfile}-expected.jpg`],
                //         'diff': files[`${nfile}-diff.jpg`]
                //     }
                // }
            }
        }
    } catch (e) {
        console.log('Ошибка!');
    }

    return oImgs;
};

uploadFile.addEventListener('change', e => {
    console.log(unzipInObject(e.target.files[0]));
});
