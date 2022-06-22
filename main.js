const API_KEY = "0f00e73d-a405-45a7-b275-3066aa412dda"

const RANDOM_URL = "https://api.thedogapi.com/v1/images/search";
const SAVE_FAVORITES_URL = "https://api.thedogapi.com/v1/favourites?limit=1";
const GET_FAVORITES_URL = "https://api.thedogapi.com/v1/favourites";
const DELETE_FAVORITES_URL = (id) => `https://api.thedogapi.com/v1/favourites/${id}`;
const UPLOAD_URL = "https://api.thedogapi.com/v1/images/upload";

const spanError = document.getElementById('error');

const getRandomDoggie = async () => {
    const res = await fetch(RANDOM_URL);
    const data = await res.json();
    console.log(data);

    if (res.status !== 200) {
        spanError.innerHTML = "There has been an error: " + res.status + data.message;
    } else {
        const img = document.getElementById('randomDoggieImage');
        const btn = document.getElementById('saveFavoriteDoggieButton');

        img.src = data[0].url;
        btn.onclick = () => saveFavoriteDoggie(data[0].id);
    }
}

const saveFavoriteDoggie = async (id) => {
    const res = await fetch(SAVE_FAVORITES_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
        },
        body: JSON.stringify({
            image_id: id,
        })
    });
    const data = await res.json();

    console.log('Save');
    console.log(res);

    if (res.status !== 200) {
        spanError.innerHTML = "There has been an error: " + res.status + data.message;
    }  else {
        console.log('Doggie added to favorites');
        getFavoriteDoggies();
    }
}

const getFavoriteDoggies = async () => {
    const res = await fetch(GET_FAVORITES_URL, {
        headers: {
            'x-api-key': API_KEY,
        },
    });
    const data = await res.json();

    if (res.status !== 200) {
        spanError.innerHTML = "There has been an error: " + res.status + data.message;
    } else {
        const section = document.getElementById('favorites')
        section.innerHTML = "";

        const h2 = document.createElement('h2');
        const h2Text = document.createTextNode('Favorite doggies');
        h2.appendChild(h2Text);
        section.appendChild(h2);

        data.forEach(doggie => {

            const artcl = document.createElement('article');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnTxt = document.createTextNode
                ('Remove it from favorites');
            
            btn.appendChild(btnTxt);
            btn.onclick = () => deleteFavoriteDoggie(doggie.id);
            img.src = doggie.image.url;
            img.width = 250;
            artcl.appendChild(img);
            artcl.appendChild(btn);
            section.appendChild(artcl);
        });
    }
}

const deleteFavoriteDoggie = async (id) => {
    const res = await fetch(DELETE_FAVORITES_URL(id), {
        method: 'DELETE',
        headers: {
            'x-api-key': API_KEY,
        },
    });
    const data = await res.json();

    console.log('Save');
    console.log(res);

    if (res.status !== 200) {
        spanError.innerHTML = "There has been an error: " + res.status + data.message;
    } else {
        console.log('Doggie deleted from favorites');
        getFavoriteDoggies();
    }
}

const uploadDoggiePic = async () => {
    const form = document.getElementById('uploadForm');
    const formData = new FormData(form);

    const res = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: {
            'x-api-key': API_KEY,
        },
        body: formData,
    });
    const data = await res.json();
    if (res.status !== 201) {
        spanError.innerHTML = `Hubo un error al subir michi: ${res.status} ${data.message}`
    }
    else {
        console.log("Foto de michi cargada :)");
        console.log({ data });
        console.log(data.url);
        saveFavoriteDoggie(data.id);
    }
}

const previewDoggie = () => {
    const form = document.getElementById('uploadForm');
    const formData = new FormData(form);
    const reader = new FileReader();

    if (form.children.length > 3) {
        const preview = document.getElementById("preview");
        form.removeChild(preview);
    }

    reader.readAsDataURL(formData.get('file'));

    reader.onload = () => {
        const previewImage = document.createElement('img');
        previewImage.id = "preview";
        previewImage.width = 50;
        previewImage.src = reader.result;
        form.appendChild(previewImage);
    }
    
}

const randomButton = document.getElementById('randomDoggieButton');
randomButton.addEventListener("click", getRandomDoggie);

getRandomDoggie();
getFavoriteDoggies();


