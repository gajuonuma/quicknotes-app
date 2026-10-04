const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");

let notes = [];


function render(notesToRender = notes) {
    notesList.replaceChildren();

    for (const note of notesToRender) {
        const listItem = document.createElement("li");

        listItem.classList.add(`category-${note.category}`);

        const noteText = document.createElement("p");
        noteText.textContent = note.text;

        const noteCategoryText = document.createElement("small");
        noteCategoryText.textContent = `Category: ${note.category}`;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            deleteNote(note.id);
        });

        listItem.appendChild(noteText);
        listItem.appendChild(noteCategoryText);
        listItem.appendChild(deleteButton);

        notesList.appendChild(listItem);
    }

    updateCount(notesToRender);
}


function updateCount(notesToCount) {
    const count = notesToCount.length;

    if (count === 0) {
        noteCount.textContent = "No notes";
    } else if (count === 1) {
        noteCount.textContent = "1 note";
    } else {
        noteCount.textContent = `${count} notes`;
    }
}


function addNote(text, category) {
    const trimmedText = text.trim();

    if (trimmedText.length === 0) {
        errorMessage.textContent = "Please enter a note.";
        return false;
    }

    if (trimmedText.length > 200) {
        errorMessage.textContent = "Note cannot be more than 200 characters.";
        return false;
    }

    const newNote = {
        id: Date.now(),
        text: trimmedText,
        category: category,
        createdAt: new Date().toISOString()
    };

    notes.push(newNote);

    errorMessage.textContent = "";

    return true;
}


function deleteNote(id) {
    notes = notes.filter(function(note) {
        return note.id !== id;
    });

    render();
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
        render();
    }
});


render();