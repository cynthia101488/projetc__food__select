const elemCityList = document.querySelector('#City');
const elemTownList = document.querySelector('#Town');
const elemLoad = document.querySelector('#Load');
let placeList = [];
let cityArr = [];

getData();
setEvent();

function getData() {
  const api = 'https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx';
  fetch(api)
    .then(res => res.json())
    .then(data => {
      dataFilter(data);
      cityArr = dataSplit(data);
      setTemplate(data);
    })
    .catch(err => {
      if (err) {
        alert('資料來源有誤！')
      }
    })
    .finally(() => {
      elemLoad.style = 'display: none';
    });
}

function dataFilter(data, e) {
  const allPlace = data.map(item => {
    if (e) {
      return item.Town;
    } else {
      return item.City;
    }
  });
  placeList = allPlace.filter((item, index) => {
    return allPlace.indexOf(item) === index;
  });
  setSelectList(placeList, e);
}

function setSelectList(arr, e) {
  let str = '';
  arr.forEach((item, index) => {
    str += `<option class="nav__item" value="${item}" data-id="${index}">${item}</option>`
  });
  if (e) {
    elemTownList.innerHTML = `<option class="nav__item" selected disabled>請選擇鄉鎮區...</option>` + str;
  } else {
    elemCityList.innerHTML += str;
  }
}

function dataSplit(data) {
  placeList.forEach(item => {
    let arr = [];
    data.forEach(elem => {
      if (elem.City === item) {
        arr.push(elem);
      }
    });
    cityArr.push(arr);
  });
  return cityArr;
}

function setTemplate(data) {
  const elemBox = document.querySelector('#Box');
  let str = ''
  data.forEach(item => {
    str += `<div class="article__sec">
              ${item.Url ? `<a class="article__link" href=${item.Url} target="_blank">` : ''}
                <div class="article__content">
                  <div class="article__head">
                    <h3 class="article__tag">${item.City}</h3>
                  </div>
                  <div class="img__inner">
                    <img class="image" src="${item.PicURL}" alt="${item.Name}">
                  </div>
                  <div class="article__body">
                    <div class="article__info">
                      <h3 class="article__tit">${item.Town}</h3>
                      <h2 class="article__name">${item.Name}</h2>
                    </div>
                    <div class="article__footer">
                      <p class="article__desc">${item.HostWords}</p>
                    </div>
                  </div>
                </div>
              ${item.Url ? `</a>` : ''}
            </div>`
  });
  elemBox.innerHTML = str;
}

function setEvent() {
  elemCityList.addEventListener('change', function (e) {
    setTemplate(cityArr[this.selectedIndex - 1]);
    dataFilter(cityArr[this.selectedIndex - 1], e);
  });
  
  elemTownList.addEventListener('change', function (e) {
    let arr = [];
    cityArr[elemCityList.selectedIndex - 1].forEach(item => {
      if (item.Town === e.target.value) {
        arr.push(item);
      }
    });
    setTemplate(arr);
  });
}