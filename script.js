const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");

const STORAGE_KEY = "quicknotes-notes";

let notes = [];


function saveNotes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}


function loadNotes() {
    const savedNotes = localStorage.getItem(STORAGE_KEY);

    if (savedNotes !== null) {
        try {
            notes = JSON.parse(savedNotes);
        } catch (error) {
            notes = [];
            localStorage.removeItem(STORAGE_KEY);
        }
    }
}


function render(notesToRender = notes, isSearching = false) {
    notesList.replaceChildren();

    if (notesToRender.length === 0 && isSearching) {
        const emptyMessage = document.createElement("li");
        emptyMessage.textContent = "No notes match your search.";
        notesList.appendChild(emptyMessage);
    } else {
        for (const note of notesToRender) {
            const listItem = document.createElement("li");

            listItem.classList.add(`category-${note.category}`);

            const noteText = document.createElement("p");
            noteText.textContent = note.text;

            const noteCategoryText = document.createElement("small");
            noteCategoryText.textContent = `Category: ${note.category}`;

            const noteDate = document.createElement("small");
            const formattedDate = new Date(note.createdAt).toLocaleString();
            noteDate.textContent = `Created: ${formattedDate}`;

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function() {
                deleteNote(note.id);
            });

            listItem.appendChild(noteText);
            listItem.appendChild(noteCategoryText);
            listItem.appendChild(document.createElement("br"));
            listItem.appendChild(noteDate);
            listItem.appendChild(document.createElement("br"));
            listItem.appendChild(deleteButton);

            notesList.appendChild(listItem);
        }
    }

    updateCount(notesToRender);
}


function updateCount(notesToCount) {
    const count = notesToCount.length;

    if (count === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (count === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${count} notes.`;
    }
}


function addNote(text, category) {
    const trimmedText = text.trim();

    if (trimmedText.length === 0) {
        errorMessage.textContent = "Please type a note first.";
        return false;
    }

    if (trimmedText.length > 200) {
        errorMessage.textContent = "Notes must be 200 characters or fewer.";
        return false;
    }

    const newNote = {
        id: Date.now(),
        text: trimmedText,
        category: category,
        createdAt: new Date().toISOString()
    };

    notes.push(newNote);

    saveNotes();

    errorMessage.textContent = "";

    return true;
}


function deleteNote(id) {
    notes = notes.filter(function(note) {
        return note.id !== id;
    });

    saveNotes();

    const filteredNotes = searchNotes(searchInput.value);
    const isSearching = searchInput.value.trim() !== "";

    render(filteredNotes, isSearching);
}


function searchNotes(searchTerm) {
    const term = searchTerm.trim().toLowerCase();

    if (term === "") {
        return notes;
    }

    return notes.filter(function(note) {
        return note.text.toLowerCase().includes(term);
    });
}


noteForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const wasAdded = addNote(
        noteInput.value,
        noteCategory.value
    );

    if (wasAdded) {
        noteInput.value = "";
        noteCategory.value = "personal";

        const filteredNotes = searchNotes(searchInput.value);
        const isSearching = searchInput.value.trim() !== "";

        render(filteredNotes, isSearching);
    }
});


searchInput.addEventListener("input", function() {
    const filteredNotes = searchNotes(searchInput.value);
    const isSearching = searchInput.value.trim() !== "";

    render(filteredNotes, isSearching);
});


loadNotes();
render();