class Food {
  constructor() {
    this.selectObj = {
      placeList: [],
      cityArr: [],
      currentCity: -1,
      currentTown: '',
      isLoad: true
    }

    this.elemCityList = document.querySelector('#City');
    this.elemTownList = document.querySelector('#Town');
    this.elemBox = document.querySelector('#Box');
    this.elemLoad = document.querySelector('#Load');
    this.init();
  }

  init() {
    this.getData();
    this.setEvent();
  }

  setLoad() {
    if (!this.selectObj.isLoad) {
      this.elemLoad.style = 'display: none';
    }
  }

  getData() {
    const api = 'https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx';
    fetch(api)
      .then(res => res.json())
      .then(data => {
        this.dataFilter(data);
        this.selectObj.cityArr = this.dataSplit(data);
        this.setTemplate(data);
      })
      .catch(err => {
        if (err) {
          alert('資料來源有誤！');
        }
      })
      .finally(() => {
        this.selectObj.isLoad = false;
        this.setLoad();
      });
  }

  dataFilter(data) {
    const allPlace = this.getZone(data);
    this.selectObj.placeList = allPlace.filter((item, index) => allPlace.indexOf(item) === index);
    this.setSelectList(this.selectObj.placeList);
  }

  getZone(data) {
    const arr = data.map(item => {
      if (this.selectObj.currentCity < 0) {
        return item.City;
      } else {
        return item.Town;
      }
    });
    return arr;
  }

  setSelectList(arr) {
    let str = '';
    arr.forEach((item, index) => {
      str += `<option class="nav__item" value="${item}" data-id="${index}">${item}</option>`;
    });
    if (this.selectObj.currentCity < 0) {
      this.elemCityList.innerHTML += str;
    } else {
      this.elemTownList.innerHTML = `<option class="nav__item" value="allTown" selected disabled>請選擇鄉鎮區...</option>` + str;
    }
  }

  dataSplit(data) {
    this.selectObj.placeList.forEach(item => {
      let arr = [];
      data.forEach(elem => {
        if (elem.City === item) {
          arr.push(elem);
        }
      });
      this.selectObj.cityArr.push(arr);
    });
    return this.selectObj.cityArr;
  }

  setTemplate(data) {
    let str = '';
    data.forEach(item => {
      str += `<div class="article__sec">
              ${item.Url ? `<a class="article__link" href=${item.Url} target="_blank">` : ''}
                <div class="article__content">
                  <div class="article__head">
                    <h3 class="article__tag">${item.City}</h3>
                  </div>
                  <div class="img__inner">
                    <img class="image" src="${item.PicURL}" alt="${item.Name}" loading=""lazy>
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
    this.elemBox.innerHTML = str;
  }

  setEvent() {
    this.elemCityList.addEventListener('change', () => {
      this.selectObj.currentCity = this.elemCityList.selectedIndex - 1;
      this.setTemplate(this.selectObj.cityArr[this.selectObj.currentCity]);
      this.dataFilter(this.selectObj.cityArr[this.selectObj.currentCity]);
    });

    this.elemTownList.addEventListener('change', () => {
      this.selectObj.currentTown = this.elemTownList.value;
      let arr = [];
      this.selectObj.cityArr[this.selectObj.currentCity].forEach(item => {
        if (item.Town === this.selectObj.currentTown) {
          arr.push(item);
        }
      });
      this.setTemplate(arr);
    });
  }
}

const food = new Food();