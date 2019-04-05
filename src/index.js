import JSZip from 'jszip';
const uploadFile = document.getElementById('uploadFile');
const zip = new JSZip();
const fileReader = new FileReader();

let unzipInObject = async (data) => {
    try {
        let contents = await zip.loadAsync(data);
        let files = contents.files;

        for (let file in files) {
            if ( files.hasOwnProperty( file ) ) {
                console.log(file);
            }
        }
    } catch (e) {
        console.log('Ошибка!');
    }
};

uploadFile.addEventListener('change', e => {
    unzipInObject(e.target.files[0]);
});
