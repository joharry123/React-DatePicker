class DatePicker {
  monthData = [
    //표시해 줄 달에 대한 정보
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  #calendarDate = {
    //달의 정보를 담는 변수
    data: '',
    date: 0,
    month: 0,
    year: 0,
  };

  selectedDate = {
    //선택된 날짜의 정보를 담는 변수
    data: '',
    date: 0,
    month: 0,
    year: 0,
  };

  datePickerEl;
  dateInputEl;
  calendarMonthEl;
  montnContentEl;
  nextBtnEl;
  prevBtnEl;
  calendarDatesEl;

  constructor() {
    this.initCalendarDate();
    this.initSelectedDate();
    this.assignElement();
    this.setDateInput();
    this.addEvent();
  }

  initSelectedDate() {
    //처음 selected data는 빈값으로 초기화 해준다.
    this.selectedDate = { ...this.#calendarDate };
  }
  setDateInput() {
    //selecteddata를 지정
    this.dateInputEl.textContent = this.formateDate(this.selectedDate.data);
    this.dateInputEl.dataset.value = this.selectedDate.data;
  }

  initCalendarDate() {
    //처음 datepicker 수행 시 , 현재 날짜 가져옴
    const data = new Date();
    const date = data.getDate();
    const month = data.getMonth();
    const year = data.getFullYear();
    this.#calendarDate = {
      data,
      date,
      month,
      year,
    };
  }

  assignElement() {
    this.datePickerEl = document.getElementById('date-picker');
    this.dateInputEl = this.datePickerEl.querySelector('#date-input');
    this.calendarEl = this.datePickerEl.querySelector('#calendar');
    this.calendarMonthEl = this.calendarEl.querySelector('#month');
    this.monthContentEl = this.calendarMonthEl.querySelector('#content');
    this.nextBtnEl = this.calendarMonthEl.querySelector('#next');
    this.prevBtnEl = this.calendarMonthEl.querySelector('#prev');
    this.calendarDatesEl = this.calendarEl.querySelector('#dates');
  }

  addEvent() {
    this.dateInputEl.addEventListener('click', this.toggleCalendar.bind(this));
    this.nextBtnEl.addEventListener('click', this.moveToNextMonth.bind(this));
    this.prevBtnEl.addEventListener('click', this.moveToPrevMonth.bind(this));
    this.calendarDatesEl.addEventListener(
      'click',
      this.onClickSelectDate.bind(this),
    );
  }

  onClickSelectDate(event) {
    //selected되면  이전에 selected된 객체를 초기화 하고
    //selected데이터를 갱신하고 datainput을 세팅해주고, 캘린더를 닫아준다.
    const eventTarget = event.target;
    if (eventTarget.dataset.date) {
      this.calendarDatesEl
        .querySelector('.selected')
        ?.classList.remove('selected');
      eventTarget.classList.add('selected');
      this.selectedDate = {
        data: new Date(
          this.#calendarDate.year,
          this.#calendarDate.month,
          eventTarget.dataset.date,
        ),
        year: this.#calendarDate.year,
        month: this.#calendarDate.month,
        date: eventTarget.dataset.date,
      };
      this.setDateInput();
    }
  }

  formateDate(dateData) {
    let date = dateData.getDate();
    if (date < 10) {
      date = `0${date}`;
    }

    let month = dateData.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }

    let year = dateData.getFullYear();
    return `${year}/${month}/${date}`;
  }

  moveToNextMonth() {
    this.#calendarDate.month++;
    if (this.#calendarDate.month > 11) {
      this.#calendarDate.month = 0;
      this.#calendarDate.year++;
    }
    this.updateMonth();
    this.updateDates();
  }

  moveToPrevMonth() {
    this.#calendarDate.month--;
    if (this.#calendarDate.month < 0) {
      this.#calendarDate.month = 11;
      this.#calendarDate.year--;
    }
    this.updateMonth();
    this.updateDates();
  }

  toggleCalendar() {
    //다시 달력을 열였을 때 선택한 날의 달력을 보여주도록 처리
    if (this.calendarEl.classList.contains('active')) {
      this.#calendarDate = { ...this.selectedDate };
    }
    this.calendarEl.classList.toggle('active');
    this.updateMonth();
    this.updateDates();
  }

  updateMonth() {
    this.monthContentEl.textContent = `${this.#calendarDate.year} ${
      this.monthData[this.#calendarDate.month]
    }`;
    //this.#calenderDate.month는 숫자로 출력되기 떄문에 위에 선언한
    //월 리스트에서 선택하도록 함
  }

  updateDates() {
    //날짜의 갯수를 구한다.
    this.calendarDatesEl.innerHTML = '';
    const numberOfDates = new Date(
      this.#calendarDate.year,
      this.#calendarDate.month + 1,
      0,
    ).getDate();
    //여러개를 담기 위해 fragment 사용
    const fragment = new DocumentFragment();
    //날짜의 갯수만큼 div 생성
    for (let i = 0; i < numberOfDates; i++) {
      const dateEl = document.createElement('div');
      dateEl.classList.add('date');
      //div 에 data 클래스 넣어준다.
      dateEl.textContent = i + 1; //for문 0부터
      dateEl.dataset.date = i + 1; //날짜정보 넣기
      fragment.appendChild(dateEl); //fragment에 더해준다.
    }
    fragment.firstChild.style.gridColumnStart =
      //fragment의 첫번째요소 어디서 부터 시작할 껀지 정해줌
      new Date(this.#calendarDate.year, this.#calendarDate.month, 1).getDay() +
      1; // 몇번째 부터 시작해야하는지
    //getDay는 0부터 시작하기 때문에 인덱스에 맞게 요일을 넣어주기 위해서 +1 해줘야한다.
    //첫번째 달이 어디 colum 부터 시작해야 할 지
    this.calendarDatesEl.appendChild(fragment);
    this.colorSaturday();
    this.colorSunday();
    this.markToday();
    //selected 된 데이터 마커표시
    this.markSelectedDate();
  }

  markSelectedDate() {
    if (
      this.selectedDate.year === this.#calendarDate.year &&
      this.selectedDate.month === this.#calendarDate.month
    ) {
      this.calendarDatesEl
        .querySelector(`[data-date='${this.selectedDate.date}']`)
        .classList.add('selected');
    }
  }

  markToday() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const today = currentDate.getDate();
    if (
      currentYear === this.#calendarDate.year &&
      currentMonth === this.#calendarDate.month
    ) {
      this.calendarDatesEl
        .querySelector(`[data-date='${today}']`)
        .classList.add('today');
    }
  }

  colorSaturday() {
    const saturdayEls = this.calendarDatesEl.querySelectorAll(
      `.date:nth-child(7n+${
        7 -
        new Date(this.#calendarDate.year, this.#calendarDate.month, 1).getDay()
      })`,
    );
    //ex) 금요일이 1일이라면
    //new Date(this.#calendarDate.year, this.#calendarDate.month, 1).getDay() = 5
    // 7 - 5 = 2 , 2를 선택, 14 - 5 = 9 , 9 선택 ,,,, 15,22,29 가 토요일이 된다.
    for (let i = 0; i < saturdayEls.length; i++) {
      saturdayEls[i].style.color = 'blue';
      saturdayEls[i].style.fontStyle = 'italic';
    }
  }

  colorSunday() {
    const sundayEls = this.calendarDatesEl.querySelectorAll(
      `.date:nth-child(7n+${
        (8 -
          new Date(
            this.#calendarDate.year,
            this.#calendarDate.month,
            1,
          ).getDay()) %
        7
        //8 - 0 일경우를 대비하기 위해서 %7을 해준다.
      })`,
    );
    for (let i = 0; i < sundayEls.length; i++) {
      sundayEls[i].style.color = 'red';
      sundayEls[i].style.fontStyle = 'italic';
    }
  }
}

new DatePicker();
