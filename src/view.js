export default {
    render(template, model, id) {
        document.getElementById(id).innerHTML = template(model);
    },
}