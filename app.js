'use strict';
/*
2010年から2015年にかけて15〜19歳の人が増えた割合の都道府県ランキング
ファイルからデータを読み取る
2010年と2015年のデータを選ぶ
都道府県ごとの変化率を計算する
変化率ごとに並べる
並べられたものを表示する
*/
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output':{} });
const map = new Map(); // key: 都道府県 value: 集計データのオブジェクト
// rlオブジェクトでlineというイベントが発生したら、無名関数を呼ぶ
rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[2];
    const popu = parseInt(columns[7]);
    if (year === 2010 || year === 2015){
        let value = map.get(prefecture);
        // 都道府県のデータがない場合の初期値
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }

        // 人口が男女で別れているので足す
        if (year === 2010) {
            value.popu10 += popu;
        }
        if (year === 2015) {
            value.popu15 += popu;
        }
        map.set(prefecture, value);
    }
    
});
// ストリームを流し始める
rl.resume();
// readlineのcloseが走ったら実行
rl.on('close', () => {
    // 変化率の計算
    for (let pair of map) {
        const value = pair[1];
        value.change = value.popu15 / value.popu10;
    }

    // 変化率ごとに並び替え
    const rankingArray = Array.from(map).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map((pair) => {
        return pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率:' + pair[1].change;
    });

    console.log(rankingStrings);
});