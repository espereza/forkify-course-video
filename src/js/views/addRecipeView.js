import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _successMessage = 'Recipe was successfully uploaded 😎';

    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');


    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }

    toogleWindow() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }

    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', this.toogleWindow.bind(this));
    }

    _addHandlerHideWindow() {
        this._btnClose.addEventListener('click', this.toogleWindow.bind(this));
        this._overlay.addEventListener('click', this.toogleWindow.bind(this));
    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function(event) {
            event.preventDefault();
            const dataArr = [...new FormData(this)];
            /* method since JS 2019 to convert entries to an object
            Takes an array of entries and converts it into an object */
            const data = Object.fromEntries(dataArr);
            handler(data);
        });
    }

    _generateMarkup(){
    }
}

export default new AddRecipeView();