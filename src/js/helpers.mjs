let autoResizeTextArea = (el, arr, txt) => {
    if(el.value.length == 1){
       for(let v of arr){
        v.classList.add('display-block-style');
        }
        txt.classList.add('textarea-small-text');
    }
    el.style.height = "auto";
    el.style.height = el.scrollHeight + 'px';
}

let takeNoteEventAction = (arr, txt, t) => {
    if(t === false){
        for(let v of arr){
            v.classList.remove('display-block-style');
        }
        txt.classList.remove('textarea-small-text');
    }
    if(t === true){
        for(let v of arr){
            v.classList.add('display-block-style');
        }
        txt.classList.add('textarea-small-text');
    }
}


let creatNoteFromDOM = (id, t, b, c, cont) => {
    let newNote = {
        id : id,
        title : t,
        body : b,
        color : c
    }
    let noteItem = document.createElement('div');
    noteItem.classList.add('note-item');
    noteItem.dataset.noteId = newNote.id;
    noteItem.style.backgroundColor = newNote.color;
    noteItem.innerHTML = `
    <h3 class="note-item-t">${newNote.title}</h3>
    <article class="note-content">${newNote.body}</article>
    <div class="param">
    <i role="button" class="material-icons delete-note">delete</i>
    <i role="button" class="material-icons edit-note">edit</i>
    </div>`;
    cont.insertAdjacentHTML('afterbegin', noteItem.outerHTML);
    return newNote
}


let toggleClasses = (s, v, c) => {
    s === 'on'? v.classList.add(`${c}`): v.classList.remove(c)
}
let deleteNote = (id, cont) => {
    let removedNote = document.querySelector(`[data-note-id='${id}']`);
    cont.removeChild(removedNote);
}
let getBgColor = el => {
    return el.style.backgroundColor
}
export {takeNoteEventAction, creatNoteFromDOM, getBgColor, deleteNote, toggleClasses, autoResizeTextArea}