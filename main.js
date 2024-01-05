'use strict';
{

  // 現在の日付情報を定義
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth(); //インデックス番号なので0から始まる点に注意

  // 現在の日付部分
  function getCalendarBody() {
    const dates = []; //日付を格納する配列
    // 今月末日=翌月1日の1日前=翌月の0日目
    const lastDate = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= lastDate; i++) {
      dates.push({ // cssでtodayクラスをつけるためにオブジェクトに
        date: i, //日付
        isToday: false, //todayクラスをつけるか
        isDisabled: false, //disabledクラスをつけるか
      });
    }
    //他の年や月でも太字にならないように処理
    if (year === today.getFullYear() && month === today.getMonth()) {
      // 今日のみtodayクラスをtrueにする
      dates[today.getDate() - 1].isToday = true;
    }
    return dates;
  }

  // 前月の日付部分
  function getCalendarHead() {
    const dates = [];
    const lastDate = new Date(year, month, 0).getDate();
    // 今月の1日目の曜日のインデックス=前月の最終週の日付の個数
    const day = new Date(year, month, 1).getDay();

    for (let i = 0; i < day; i++) { // 前月の最終週の日付の個数回ループ
      dates.unshift({ //pushではなくunshiftで配列の先頭に値を挿入
        date: lastDate - i,
        isToday: false,
        isDisabled: true,
      });
    }
    return dates;
  }

  // 翌月の日付部分
  function getCalendarTail() {
    const dates = [];
    const lastDay = new Date(year, month + 1, 0).getDay(); // 今月末日の曜日のインデックスを求める
    for (let i = 1; i < 7 - lastDay; i++) {
      dates.push({
        date: i,
        isToday: false,
        isDisabled: true,
      })
    }
    return dates;
  }

  function createCalendar() {

    // 読み込み時カレンダーの日付部分をクリアさせて重複を防ぐ
    const tbody = document.querySelector('tbody');
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }

    // タイトル部分を描画
    const title = `${year}/${String(month + 1).padStart(2, '0')}`; //padStartは文字列にしか使えない
    document.getElementById('title').textContent = title;

    const dates = [
      ...getCalendarHead(),
      ...getCalendarBody(),
      ...getCalendarTail(),
    ]; // 全ての日付部分を統合
    const weeks = []; // 週毎に日付を入れる配列
    const weeksCount = dates.length / 7; //1週間がいくつあるか

    for (let i = 1; i <= weeksCount; i++) { //weeksCount回繰り返す
      weeks.push(dates.splice(0, 7)); //日付を7日分切り出してweeks[]に挿入
    }

    // HTMLの処理
    weeks.forEach(week => {
      const tr = document.createElement('tr');
      week.forEach(date => {
        const td = document.createElement('td');
        td.textContent = date.date; // 1つめのdateは仮引数、2つめのdateはweeks[]内のkeyの名前
        if (date.isToday) {
          td.classList.add('today');
        }
        if (date.isDisabled) {
          td.classList.add('disabled');
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }
  createCalendar();

  // prevボタン
  document.getElementById('prev').addEventListener('click', () => {
    month--;
    if (month < 0) { //month=0は1月
      year--;
      month = 11; // 12月
    }
    createCalendar();
  });

  // nextボタン
  document.getElementById('next').addEventListener('click', () => {
    month++;
    if (month > 11) {
      year++;
      month = 0;
    }
    createCalendar();
  });

  // Todayボタン
  document.getElementById('today').addEventListener('click', () => {
    year = today.getFullYear();
    month = today.getMonth();
    createCalendar();
  });

}