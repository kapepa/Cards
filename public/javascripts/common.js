(() => {
	const tabs = document.getElementById("tabs");
	if(!tabs) return null;
	M.Tabs.init(tabs);
})();

(() => {
	const price = document.getElementsByClassName("price");
	if(!price) return null;
	for(let key of price){
		const cont = key.textContent;
		key.innerHTML = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(cont)
	}
})();

(() => {
	try{
		const tbody = document.getElementById("tbody");
		if(!tbody) return null;
		tbody.addEventListener("click", function(e){
			e.preventDefault();
			if(e.target.classList.contains("btn")){
				const establisForm = e.target.closest("form").courseID.value;
				const csrf = e.target.closest("form")._csrf.value;
				fetch('/card?id='+establisForm,{
					method: "DELETE",
					headers: {'CSRF-Token': csrf},
				}).then(function(response){
					if(!response.ok){
						response.text().then(function(text){
							throw text;
						})
					}
					response.json().then(function(data){
						const { courses, total } = data;
						if(!courses) return tbody.closest("table").outerHTML = "<p> List is empty </p>"
						const list = courses.map((el) => {
							return `
								<tr>
									<td>
										<h6>${el.name}</h6>
									</td>
									<td class="price">${new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(el.price)}</td>
									<td>${el.cnt}</td>
									<td class="price">${new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(el.price * el.cnt)}</td>
									<td>
										<form>
											<input type="hidden" name="courseID" value="${el.id}" />
											<button class="btn"> Decrease </button>
										</form>
								</tr>
							`
						}).join("")
						tbody.innerHTML = list
						tbody.closest("table").querySelector("tfoot .price").innerHTML = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(total)
					})
				})
			}
		})
	}catch(e){
		console.log(e)
	}
})();

(() => {
	const date = document.getElementsByClassName('date');
	if(!date) return null;
	for(let key of date){
		let content = new Date(Number(key.textContent)) ;
		key.innerHTML = new Intl.DateTimeFormat('ru-RU', {year: 'numeric', month: 'long', day: 'numeric'}).format(content)
	}
})();