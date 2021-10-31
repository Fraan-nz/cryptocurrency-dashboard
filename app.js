const baseUrl = "https://api.coinranking.com/v2/coins";
const proxyURL = "https://cors-anywhere.herokuapp.com/";
const apiKey = "coinrankingba20991b91054d46fa9c2753bd61750279be2edc9686ffe6";
const tableBody = document.querySelector("#table-body");
const inputSearch = document.querySelector("#input-search");
const coinSearch = document.querySelector("#coin-search");
const inputBtn = document.querySelector("#input-btn");
const logo = document.querySelector(".nav__logo");
let coins = [];
let search = [];

async function getData() {
	fetch(`${proxyURL}${baseUrl}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": `${apiKey}`,
			"Access-Control-Allow-Origin": "*",
		},
	})
		.then((response) => {
			if (response.ok) {
				response.json().then((data) => {
					listCoins(data.data.coins);
					createElement(coins);
				});
			}
		})
		.catch((error) => {
			console.log(error);
		});
}
getData();
setInterval(getData, 300000);

async function listCoins(data) {
	coins = data;
}

//Creo cada fila de la tabla
const createElement = (data) => {
	let fragment = document.createDocumentFragment();
	data.forEach((element) => {
		let row = document.createElement("tr");
		row.classList.add("table__row");
		let color = element.change.includes("-") ? "red" : "green";
		let dataCoin = `
            <td class="table__data col1">${element.rank}</td>
            <td class="table__data center col2"><img class="table__img" src="${
							element.iconUrl
						}" alt="${element.symbol}">${element.name}</td>
            <td class="table__data col5">${element.symbol}</td>
            <td class="table__data col3">${element.btcPrice}</td>
            <td class="table__data col4">${formatNumber(element.price)}</td>
            <td class="table__data col6 ${color}">${element.change}%</td>
        `;
		row.innerHTML += dataCoin;
		fragment.appendChild(row);
	});
	tableBody.append(fragment);
};

//Creo data list
const createList = (data) => {
	let fragment = document.createDocumentFragment("template");
	data.forEach((element) => {
		let option = document.createElement("option");
		option.innerText = element.name;
		fragment.appendChild(option);
	});
	coinSearch.append(fragment);
};

//Agrega un espacio luego del $
const whiteSpace = (num) => {
	let arr = [...num];
	arr[0] = arr[0].concat(" ");
	return arr.join("");
};

//Formatea el numero al tipo de moneda dado
const formatNumber = (num) => {
	const options = { style: "currency", currency: "USD" };
	const number = new Intl.NumberFormat("en-US", options);
	return whiteSpace(number.format(num));
};

//Evento input
inputSearch.addEventListener("input", (e) => {
	coinSearch.innerHTML = " ";
	let value = e.target.value.toLowerCase();
	if (value != "") {
		search = coins.filter((coin) => {
			let name = coin.name.toLowerCase();
			return name.includes(value);
		});
		console.log(search);
		createList(search);
	}
});

//Evento boton
inputBtn.addEventListener("click", (e) => {
	e.preventDefault();
	tableBody.innerHTML = "";
	createElement(search);
	inputSearch.value = "";
});

//Evento logo
logo.addEventListener("click", () => {
	getData();
	inputSearch.value = "";
});
