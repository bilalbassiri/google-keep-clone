import {takeNoteEventAction, creatNoteFromDOM, getBgColor, deleteNote, toggleClasses, autoResizeTextArea} from "./helpers.mjs";
import firebaseConfig from './firebaseConfig.mjs';

let textArea = document.getElementById('text__Area'),
    noteTitle = document.getElementById('note__Title__Input'),
    bottomHelpers = document.getElementById('bottom__Helpers'),
    addBtn = document.getElementById('add__Btn'),
    notesContainer = document.getElementById('notes__ParentElementContainer'),
    refreshBtn = document.getElementById('refresh__Btn'),
    paletteColors = document.querySelectorAll('.palette-item'),
    palette = document.getElementById('palette__Colors__Id'),
    notePaper = document.getElementById('note__Paper'),
    edtModeBg = document.getElementById('edit___Mode__Bg');
    
let blockGrp = [noteTitle, bottomHelpers];
let m =0, x = true;

// initialize firebase app

(function(){
        firebase.initializeApp(firebaseConfig);
        firebase.database().ref('/notes').once('value').then(snp => {
            snp.forEach(i => {
                creatNoteFromDOM(i.val().id, i.val().title,i.val().body, i.val().color, notesContainer)
            })
        })
})()

const db = firebase.database();
textArea.focus();

// Create Help Functions
let updateNote =  (obj) => {
    let updates = {};
    updates['/notes/'+ obj.id] = obj
    db.ref().update(updates)
}

let clearPlace = () => {
    textArea.value = noteTitle.value =  null;
}

let clearHeight = () => {
    takeNoteEventAction(blockGrp, textArea, !x)
    textArea.style.height = "20px";
    textArea.style.minHeight = "0px";
}

let globalFnUpdateNote = () => {
    let currentEditedNote = document.querySelector(`[data-note-id = '${addBtn.dataset.editId}']`)
    let ccObj = {
        id : parseInt(addBtn.dataset.editId),
        title : noteTitle.value,
        body: textArea.value,
        color: notePaper.style.backgroundColor
    }
    currentEditedNote.style.backgroundColor = ccObj.color;
    currentEditedNote.children[0].textContent = ccObj.title;
    currentEditedNote.children[1].textContent = ccObj.body;
    addBtn.textContent = 'add';
    toggleClasses('OFF', currentEditedNote, 'edit-mode')
    toggleClasses('OFF', edtModeBg, 'edit-mode-bg-anim')
    updateNote(ccObj)
}

let globalFnAddNote = () => {
    db.ref('notes/'+ m).set(creatNoteFromDOM(m, noteTitle.value, textArea.value, getBgColor(notePaper), notesContainer))
}

let loopOverPalette = (sp = palette.firstElementChild) => {
    paletteColors.forEach(i => {
        i.innerHTML = '';
    })
    sp.innerHTML = "<i class='material-icons checked-color'>check</i>";

}

let noteController = () => {
    (addBtn.textContent === 'done_all')? globalFnUpdateNote() : globalFnAddNote();
    clearHeight()
    clearPlace()
    loopOverPalette()
    notePaper.style.background = 'white';
}


// Event Listeners

db.ref('/notes').on('value', snp => {
    snp.forEach(i => {
        if(i.val().id > 0){
            m = i.val().id;
        }
    })
    m++;
})

textArea.addEventListener('input', () => autoResizeTextArea(textArea, blockGrp, textArea))

notePaper.addEventListener('click', ev => (ev.target.id !== 'add__Btn')? takeNoteEventAction(blockGrp, textArea, true) : null)

paletteColors.forEach(item => {
    item.addEventListener('click', ()=> {
        notePaper.style.backgroundColor = item.style.backgroundColor;
        loopOverPalette(item)
    })
})


document.addEventListener('mouseover', ev => {
    let target = ev.target,
    b = (target.classList.contains('A12fgvsc') || target.classList.contains('palette-item') || target.classList.contains('checked-color'));
    b? palette.classList.add('display-grid-style') : palette.classList.remove('display-grid-style');
}, false)


document.addEventListener('click', ev => {
            let target = ev.target;
            let    currentNote, id;
            if(target.classList.contains('delete-note')){
                if(window.confirm('Do you really want to delete this note?')){
                    currentNote = target.parentElement.parentElement;
                    id = parseInt(currentNote.dataset.noteId);
                    currentNote.classList.add('remove-note-eff-12');
                    currentNote.addEventListener('animationend', ()=> {
                        deleteNote(id, notesContainer)
                         db.ref(`notes/${id}`).remove()
                    })
                }
                else return null;
            }
            if(target.classList.contains('edit-note')){
                paletteColors.forEach(i => {
                    i.innerHTML = '';
                })
                textArea.style.minHeight = "150px";
                window.scrollTo(0,0)
                currentNote = target.parentElement.parentElement;
                id = parseInt(currentNote.dataset.noteId);
                addBtn.textContent = 'done_all';
                takeNoteEventAction(blockGrp, textArea, x)
                toggleClasses('on', currentNote, 'edit-mode')
                toggleClasses('on', edtModeBg, 'edit-mode-bg-anim')
                addBtn.dataset.editId = id;
                db.ref('notes/').once('value').then(snp => {
                    return snp.val()[`${id}`]
                }).then(note => {
                    noteTitle.value = note.title;
                    textArea.value = note.body;
                    notePaper.style.backgroundColor = note.color;
                })
            }
            ((target === addBtn || target === edtModeBg) && (textArea.value))? noteController(): null;
            (target === refreshBtn)? clearPlace(): null; 
            (target === document.body || target === notesContainer)? clearHeight() : null; 
        
})

